import moment from "moment";
import React, { useEffect, useState } from 'react';
import Pagination from '../components/Pagination';
import PaginationContext from "../contexts/PaginationContext";
import InvoicesAPI from '../services/invoicesAPI';
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import TableLoader from "../components/loaders/TableLoader";


const STATUS_CLASSES = {
    PAID: "success",
    SENT: "primary",
    CANCELLED: "danger"
}

const STATUS_LABELS = {
    PAID: "Payée",
    SENT: "Envoyée",
    CANCELLED: "Annulée"
}

const InvoicesPage = (props) => {
    const [invoices, setInvoices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const itemsPerPage = 10;

    // Récupération des données auprès de l'API
    const fetchInvoices = async () => {
        try {
            const data = await InvoicesAPI.findAll();
            setInvoices(data);
            setLoading(false)
        } catch(error) {
            console.log(error.response);
            toast.error("Erreur lors des chargements des factures")
        }

    }

    // Charger les données à l'arrivée sur la page
    useEffect(() => {
        fetchInvoices();
    }, [])

    // Gestion du format de date
    const formatDate = (str) => moment(str).format('DD/MM/YYYY');

    // Changement de page
    const handlePageChange = (page) => setCurrentPage(page);

    const handleSearch = ({currentTarget}) => {
        setSearch(currentTarget.value);
        setCurrentPage(1);
    }

    // Gestion de la recherche
    const filteredInvoices = invoices.filter(
        i => 
        i.customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
        i.customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
        i.amount.toString().includes(search.toLowerCase()) ||
        STATUS_LABELS[i.status].toLowerCase().startsWith(search.toLowerCase())
    );

    // Pagination des données
    const paginatedInvoices = Pagination.getData(filteredInvoices, currentPage, itemsPerPage);

    // Suppression d'une facture
    const handleDelete = async id => {
        const originalInvoices = [...invoices];

        setInvoices(invoices.filter(invoice => invoice.id !== id));

        try {
            await InvoicesAPI.delete(id);
            toast.success("La facture a bien été supprimée !")
        } catch (error) {
            toast.error("Une erreur est survenue")
            setInvoices(originalInvoices);
        }
    }

    return ( 
            <PaginationContext.Provider value={{currentPage, itemsPerPage, invoices, handlePageChange, filteredInvoices }}>
            <div className="d-flex justify-content-between align-items-center">
            <h1>Liste des factures</h1>
            <Link className="btn btn-primary" to="/invoices/new">Créer une facture</Link>
            </div>

            <div className="form-group">
                <input type="text" onChange={handleSearch} value={search} className="form-control" placeholder="Rechercher..."/>
            </div>

            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>Numéro</th>
                        <th>Client</th>
                        <th className="text-center">Date d'envoi</th>
                        <th className="text-center">Statut</th>
                        <th className="text-center">Montant</th>
                        <th></th>
                    </tr>
                </thead>
                {!loading && <tbody>
                    {paginatedInvoices.map(invoice => {
                        return (
                            <tr key={invoice.id}>
                                <td>{invoice.chrono}</td>
                                <td>
                                    <Link to={"/customers/" + invoice.customer.id}>{invoice.customer.firstName} {invoice.customer.lastName}</Link>
                                </td>
                                <td className="text-center">{formatDate(invoice.sentAt)}</td>
                                <td className="text-center">
                                    <span className={"badge badge-" + STATUS_CLASSES[invoice.status]}>{STATUS_LABELS[invoice.status]}</span>
                                </td>
                                <td className="text-center">{invoice.amount.toLocaleString()} €</td>
                                <td>
                                    <Link to={"/invoices/" + invoice.id} className="btn btn-sm btn-primary mr-1">Editer</Link>
                                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(invoice.id)}>Supprimer</button>
                                </td>
                            </tr> 
                        );
                    })}
                </tbody>}
            </table>

            {loading && <TableLoader/>}

            <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} onPageChanged={handlePageChange} length={invoices.length} />
        </PaginationContext.Provider>
     );
}
 
export default InvoicesPage;
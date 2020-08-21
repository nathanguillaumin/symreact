import React, {useState, useEffect} from 'react';
import Pagination from '../components/Pagination';
import axios from 'axios';
import moment from "moment";

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
    const [search, setSearch] = useState('')


    const fetchInvoices = async () => {
        try {
            const data = await axios
                .get("http://localhost:8000/api/invoices")
                .then(response => response.data["hydra:member"]);
            setInvoices(data);
        } catch(error) {
            console.log(error.response);
        }

    }

    useEffect(() => {
        fetchInvoices();
    }, [])

    const formatDate = (str) => moment(str).format('DD/MM/YYYY');

    const handlePageChange = (page) => setCurrentPage(page);

    const handleSearch = ({currentTarget}) => {
        setSearch(currentTarget.value);
        setCurrentPage(1);
    }

    if (!invoices) {
        return <p>loading...</p>
    } else { 
    return ( 
        <>
            <h1>Liste des factures</h1>

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
                <tbody>
                    {invoices.map(invoice => {
                        return (
                            <tr key={invoice.id}>
                                <td>{invoice.chrono}</td>
                                <td>
                                    <a href="#">{invoice.customer.firstName} {invoice.customer.lastName}</a>
                                </td>
                                <td className="text-center">{formatDate(invoice.sentAt)}</td>
                                <td className="text-center">
                                    <span className={"badge badge-" + STATUS_CLASSES[invoice.status]}>{STATUS_LABELS[invoice.status]}</span>
                                </td>
                                <td className="text-center">{invoice.amount.toLocaleString()} €</td>
                                <td>
                                    <button className="btn btn-sm btn-primary mr-1">Editer</button>
                                    <button className="btn btn-sm btn-danger">Supprimer</button>
                                </td>
                            </tr> 
                        );
                    })}
                </tbody>
            </table>

            <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} onPageChanged={handlePageChange} length={invoices.length} />
        </>
     );
    }
}
 
export default InvoicesPage;
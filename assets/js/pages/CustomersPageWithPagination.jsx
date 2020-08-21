import React, {useState, useEffect} from 'react';
import axios from "axios";
import PaginationContext from "../contexts/PaginationContext";
import Pagination from '../components/Pagination';

const CustomersPageWithPagination = (props) => {
    const [customers, setCustomers] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const itemsPerPage = 10;

    useEffect(() => {
        axios.get(`http://localhost:8000/api/customers?pagination=true&count=${itemsPerPage}&page=${currentPage}`)
            .then(res => {
                setCustomers(res.data['hydra:member']);
                setTotalItems(res.data["hydra:totalItems"]);
                setLoading(false);
            })
            .catch(error => console.log(error.response))
    }, [currentPage]);

    const handleDelete = (id) => {
        const originalCustomers = [...customers];
        setCustomers(customers.filter(customer => customer.id !== id))
        
        axios.delete(`http://localhost:8000/api/customers/${id}`)
            .then(res => console.log("ok"))
            .catch(err => {
                setCustomers(originalCustomers);
            })
    }

    const handlePageChange = (page) => {
        setLoading(true);
        setCurrentPage(page);
    }

    const paginatedCustomers = Pagination.getData(customers, currentPage, itemsPerPage);

    if (!customers) {
        return <p>loading...</p>
    } else { 
        return (
        <PaginationContext.Provider value={{currentPage, itemsPerPage, customers, handlePageChange, totalItems}}>
            <h1>Liste des clients (pagination)</h1>
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>Id.</th>
                        <th>Client</th>
                        <th>Email</th>
                        <th>Entreprise</th>
                        <th className='text-center'>Factures</th>
                        <th className='text-center'>Montant total</th>
                        <th></th>
                    </tr>
                </thead>

                    <tbody>
                        {loading && <tr><td>Chargement...</td></tr>}
                        {!loading && customers.map(customer => 
                            <tr key={customer.id}>
                                <td>{customer.id}</td>
                                <td>
                                    <a href="#">{customer.firstName} {customer.lastName}</a>
                                </td>
                                <td>{customer.email}</td>
                                <td>{customer.company}</td>
                                <td className='text-center'>
                                    <span className="badge badge-primary">{customer.invoices.length}</span>
                                </td>
                                <td className='text-center'>{customer.totalAmount.toLocaleString()} €</td>
                                <td>
                                    <button
                                        onClick={() => handleDelete(customer.id)}
                                        disabled={customer.invoices.length} 
                                        className="btn btn-sm btn-danger"
                                    >
                                        Supprimer
                                    </button>
                                </td>
                            </tr>
                        )
                        }
                    </tbody>
            </table>
            <Pagination />
        </PaginationContext.Provider>
    );
    }
}
 
export default CustomersPageWithPagination;
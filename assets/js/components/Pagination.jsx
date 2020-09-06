import React, { useContext } from 'react';
import PaginationContext from '../contexts/PaginationContext';

const Pagination = ({ currentPage, itemsPerPage, length, onPageChanged }) => {
    // Si utilisation du Context
    // const { currentPage, itemsPerPage, customers, handlePageChange, totalItems, filteredCustomers, filteredInvoices } = useContext(PaginationContext);

    const pagesCount = Math.ceil(length / itemsPerPage);
    const pages = [];

    for(let i = 1; i <= pagesCount; i++) {
        pages.push(i);
    }

    return ( 
        <div>
            <ul className="pagination pagination-sm">
                <li className={"page-item" + (currentPage === 1 && " disabled")}>
                <button className="page-link" onClick={() => onPageChanged(currentPage - 1)}>&laquo;</button>
                </li>
                {pages.slice(0, 20).map(page => 
                    <li 
                        key={page} 
                        className={"page-item" + (currentPage === page && " active")}
                    >
                        <button className="page-link" onClick={() => onPageChanged(page)}>{page}</button>
                    </li>
                )}
                <li className={"page-item" + (currentPage === pagesCount && " disabled")}>
                    <button className="page-link" onClick={() => onPageChanged(currentPage + 1)}>&raquo;</button>
                </li>
            </ul>
        </div>

    );
};

Pagination.getData = (items, currentPage, itemsPerPage) => {
    const start = currentPage * itemsPerPage - itemsPerPage;
    return items.slice(start, start + itemsPerPage);
}
 
export default Pagination;
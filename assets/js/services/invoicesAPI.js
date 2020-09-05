import axios from "axios";

function findAll() {
    return axios
        .get("http://localhost:8000/api/invoices")
        .then(res => res.data['hydra:member']);
}

function deleteInvoices(id) {
    return axios
        .delete(`http://localhost:8000/api/invoices/${id}`)
}

export default { 
    findAll,
    delete: deleteInvoices
}
import React, { useState, useEffect } from "react";
import Field from "./../components/forms/Field";
import { Link } from "react-router-dom";
import CustomersAPI from "../services/customersAPI";

const CustomerPage = ({ match, history }) => {
  const { id = "new" } = match.params;

  const [customer, setCustomer] = useState({
    lastName: "",
    firstName: "",
    email: "",
    company: "",
  });

  const [errors, setErrors] = useState({
    lastName: "",
    firstName: "",
    email: "",
    company: "",
  });

  const [editing, setEditing] = useState(false);

  // Récupération du customer en fonction de l'identifiant
  const fetchCustomer = async (id) => {
    try {
      const { lastName, firstName, email, company } = await CustomersAPI.find(
        id
      );
      setCustomer({ firstName, lastName, email, company });
    } catch (error) {
      // TODO: Notif d'une erreur
      history.replace("/customers");
    }
  };

  // Chargement du customer si besoin au chargement du composant ou changement de l'identifiant
  useEffect(() => {
    if (id !== "new") {
      setEditing(true);
      fetchCustomer(id);
    }
  }, [id]);

  // Gestion des changements du formulaire
  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setCustomer({ ...customer, [name]: value });
  };

  // Soumission du formulaire
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editing) {
        const response = await CustomersAPI.update(id, customer);
        console.log(response.data);

        //TO DO: Flash notification de succès
      } else {
        await CustomersAPI.create(customer);
        history.replace("/customers");
        //TO DO: Flash notification de succès
      }
      setErrors({});
    } catch ({ response }) {
      const { violations } = response.data;
      if (violations) {
        const apiErrors = {};
        violations.forEach(({ propertyPath, message }) => {
          apiErrors[propertyPath] = message;
        });
        setErrors(apiErrors);

        //TO DO: Flash notification d'erreurs
      }
    }
  };

  return (
    <>
      {(!editing && <h1>Création d'un client</h1>) || (
        <h1>Modification du client</h1>
      )}
      <form onSubmit={handleSubmit}>
        <Field
          name="lastName"
          label="Nom de famille"
          placeholder="Nom de famille du client"
          value={customer.lastName}
          onChange={handleChange}
          error={errors.lastName}
        />
        <Field
          name="firstName"
          label="Prénom"
          placeholder="Prénom du client"
          value={customer.firstName}
          onChange={handleChange}
          error={errors.firstName}
        />
        <Field
          name="email"
          label="Email"
          placeholder="Adresse email du client"
          type="email"
          value={customer.email}
          onChange={handleChange}
          error={errors.email}
        />
        <Field
          name="company"
          label="Entreprise"
          placeholder="Entreprise du client"
          value={customer.company}
          onChange={handleChange}
        />

        <div className="form-group">
          <button type="submit" className="btn btn-success">
            Enregistrer
          </button>
          <Link to="/customers" className="btn btn-link">
            Retour à la liste
          </Link>
        </div>
      </form>
    </>
  );
};

export default CustomerPage;

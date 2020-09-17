import React, { useState } from "react";
import { Link } from "react-router-dom";
import Field from "../components/forms/Field";
import UsersAPI from "../services/usersAPI"

const RegisterPage = ({ history }) => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  // Gestion des changements du formulaire
  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const apiErrors = {};
    if (user.password !== user.passwordConfirm) {
      apiErrors.passwordConfirm =
        "Votre confirmation de mot de passe n'est pas conforme avec le mot de passe original";
        setErrors(apiErrors)
        return
    }
    try {
      const response = await UsersAPI.register(user)
      // TO DO : Flash succès
      setErrors({});
      history.replace("/login");
    } catch ({ response }) {
      const { violations } = response.data;
      if (violations) {
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
      <h1>Inscription</h1>
      <form onSubmit={handleSubmit}>
        <Field
          name="firstName"
          label="Prénom"
          placeholder="Votre joli prénom"
          error={errors.firstName}
          onChange={handleChange}
          value={user.firstName}
        />
        <Field
          name="lastName"
          label="Nom"
          placeholder="Votre nom de famille"
          error={errors.lastName}
          onChange={handleChange}
          value={user.lastName}
        />
        <Field
          name="email"
          label="Adresse email"
          placeholder="Votre adresse email"
          type="email"
          error={errors.email}
          onChange={handleChange}
          value={user.email}
        />
        <Field
          name="password"
          label="Mot de passe"
          placeholder="Votre mot de passe ultra sécurisé"
          type="password"
          error={errors.password}
          onChange={handleChange}
          value={user.password}
        />
        <Field
          name="passwordConfirm"
          label="Confirmation de mot de passe"
          placeholder="Confirmez votre super mot de passe"
          type="password"
          error={errors.passwordConfirm}
          onChange={handleChange}
          value={user.passwordConfirm}
        />
        <div className="form-group">
          <button type="submit" className="btn btn-success">
            Confirmation
          </button>
          <Link to="/login" className="btn btn-link">
            J'ai déjà un compte
          </Link>
        </div>
      </form>
    </>
  );
};

export default RegisterPage;

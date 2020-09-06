import React, {useState, useContext} from "react";
import AuthAPI from "../services/authAPI";
import AuthContext from "../contexts/AuthContext";

function LoginPage({history}) {

    const {setIsAuthenticated} = useContext(AuthContext);

    const [credentials, setCredentials] = useState({
        username: "",
        password: ""
    })

    const [error, setError] = useState("")

    // Gestion des champs
    const handleChange = (event) => {
        const { value, name } = event.currentTarget;
        setCredentials({...credentials, [name]: value})
    }

    // Gestion du submit
    const handleSubmit = async event => {
        event.preventDefault();

        try {
            await AuthAPI.authenticate(credentials);
            setError(""); 
            setIsAuthenticated(true);
            history.replace("/customers");
        } catch(error) {
            console.log(error.message)
            await setError("Aucun compte ne possède cette adresse ou alors les informations ne correspondent pas.");
        }

        console.log(credentials);
    }

  return (
    <div>
      <h1>Connexion à l'application</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Adresse email</label>
          <input
            value={credentials.username}
            onChange={handleChange}
            type="email"
            className={"form-control" + (error && " is-invalid")}
            placeholder="Adresse email de connexion"
            name="username"
            id="username"
          />
        </div>
        {error && <p className="invalid-feedback">{error}</p>}
        <div className="form-group">
          <label htmlFor="password"></label>
          <input
            value={credentials.password}
            onChange={handleChange}
            type="password"
            className="form-control"
            placeholder="Mot de passe"
            name="password"
            id="password"
          />
        </div>
        <div className="form-group">
          <button type="submit" className="btn btn-success">
            Je me connecte
          </button>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;

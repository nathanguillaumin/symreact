import React from "react";

const HomePage = (props) => {
  return (
    <div className="jumbotron">
      <h1 className="display-3">Welcome to the SymReact app!</h1>
      <p className="lead">
        The technologies used to build this app are React.js and Symfony.
        <br />
        I encourage you to create an account, you will then be able to display a
        list of customers and a list of their belongings invoices.
        <br />
        If you need any help, please let me know.
      </p>
      <hr className="my-4" />
      <p>Nathan Guillaumin</p>
    </div>
  );
};

export default HomePage;

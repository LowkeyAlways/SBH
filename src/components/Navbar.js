/* eslint-disable jsx-a11y/anchor-is-valid */
// src/components/Header.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Nav, Navbar, NavDropdown, Container } from "react-bootstrap";

function Header() {
  const [username, setUsername] = useState("");
  const [id, setId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3002/")
      .then((res) => {
        console.log(res.data); // Log the response data
        if (res.data.valid) {
          setUsername(res.data.username);
          setId(res.data.id);
        } else {
          setUsername(""); // Assurez-vous de vider le nom d'utilisateur si l'utilisateur n'est pas connecté
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleLogout = () => {
    axios
      .post("http://localhost:3002/api/logout")
      .then((res) => {
        // Rediriger vers la page de connexion ou d'accueil après la déconnexion
        window.location.reload(); // Recharger la page pour refléter le changement d'état
      })
      .catch((err) => console.log(err));
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="/">Salon Business Haïtien</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="/">Accueil</Nav.Link>
            <Nav.Link href="/events">Évènements</Nav.Link>
            <Nav.Link href="/contacts">Contacts</Nav.Link>
          </Nav>
          <Nav>
            {username ? (
              <Nav.Link onClick={handleLogout}>Déconnexion</Nav.Link>
            ) : (
              <Nav.Link className="nav_login" href="/login">Se connecter</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;

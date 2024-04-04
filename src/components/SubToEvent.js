import axios from "axios";
import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";

function SubToEvent() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    role: "",
  });
  const [price, setPrice] = useState(0);
  const { id } = useParams();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  axios.defaults.withCredentials = true;
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(`http://localhost:3002/api/events/${id}/register`, formData)
        
      .then((response) => {
        
        console.log("Inscription réussie !");
      })
      .catch((error) => {
        console.error("Erreur lors de l'inscription :", error);
      });
  };

  const calculatePrice = () => {
    let newPrice = 0;
    if (formData.role === "speaker") {
      newPrice = 50;
    } else if (formData.role === "intervener") {
      newPrice = 30;
    } else {
      newPrice = 10;
    }
    setPrice(newPrice);
  };

  return (
    <div className="subEvent">
      <h2>Inscription à l'événement</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Prénom:
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Nom:
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Rôle:
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="visitor">Visiteur</option>
            <option value="speaker">Conférencier</option>
            <option value="intervener">Intervenant</option>
          </select>
        </label>
        <p>Prix: {price} €</p>
        <br />
        <button type="submit">S'inscrire</button>
      </form>
    </div>
  );
}

export default SubToEvent;

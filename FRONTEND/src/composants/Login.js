import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Importer axios pour faire la requête API

function Login({ onLogin }) {
  const [identifiant, setIdentifiant] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/secretaires/login", {
        email: identifiant,
        motDePasse: motDePasse,
      });

      if (response.status === 200) {
      // Si la connexion est réussie, stocker le token et naviguer vers la page secrétaire
      localStorage.setItem("token", response.data.token); // Stocker le token
      onLogin(); // Appeler la fonction onLogin pour activer la connexion
      navigate("/secretaire"); // Redirige vers la page secrétaire
      }
    
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message || "Erreur lors de la connexion");
      } else {
        setMessage("Impossible de se connecter au serveur");
    }
  }

  };

  return (
    <div className="login-container">
      <h2>Connexion</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Identifiant :</label>
          <input type="text" value={identifiant} onChange={(e) => setIdentifiant(e.target.value)} required />
        </div>
        <div>
          <label>Mot de passe :</label>
          <input type="password" value={motDePasse} onChange={(e) => setMotDePasse(e.target.value)} required />
        </div>
        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
}

export default Login;


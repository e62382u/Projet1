import React, { useState } from "react";
import getUserId from "./getUserId";
import axios from "axios";

const Parametres = () => {
  const [ancienMotDePasse, setAncienMotDePasse] = useState("");
  const [nouveauMotDePasse, setNouveauMotDePasse] = useState("");
  const [confirmerMotDePasse, setConfirmerMotDePasse] = useState("");
  const [message, setMessage] = useState("");

  const secretaireId = getUserId();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (nouveauMotDePasse !== confirmerMotDePasse) {
      setMessage("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }
  
    try {
      const response = await axios.put(
        "/api/secretaires/change-password",
        { 
          secretaireId, // ✅ Ajout de l'ID ici
          ancienMotDePasse, 
          nouveauMotDePasse 
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
  
      setMessage(response.data.message);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Erreur lors du changement de mot de passe."
      );
    }
  };
  
  return (
    <div className="parametres-container">
      <h1>Paramètres</h1>
      <div className="change-password">
        <h2>Changer le mot de passe</h2>
        {message && <p>{message}</p>}

        <form onSubmit={handleSubmit}>
          <div>
            <label>Ancien mot de passe :</label>
            <input type="password" value={ancienMotDePasse} onChange={(e) => setAncienMotDePasse(e.target.value)} required />
          </div>
          <div>
            <label>Nouveau mot de passe :</label>
            <input type="password" value={nouveauMotDePasse} onChange={(e) => setNouveauMotDePasse(e.target.value)} required />
          </div>
          <div>
            <label>Confirmer le nouveau mot de passe :</label>
            <input type="password" value={confirmerMotDePasse} onChange={(e) => setConfirmerMotDePasse(e.target.value)} required />
          </div>
          <button type="submit">Valider</button>
        </form>
      </div>
    </div>
  );
};

export default Parametres;

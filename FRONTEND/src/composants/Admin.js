import React, { useState, useEffect } from "react";
import axios from "axios";

function Admin() {
  const [secretaires, setSecretaires] = useState([]);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    motDePasse: "",
    id: "", // Utilisé pour la modification
  });
  const [action, setAction] = useState(""); // Action courante : "add", "update", ou "delete"

  // Récupérer la liste des secrétaires depuis l'API
  useEffect(() => {
    const token = localStorage.getItem("token"); // Récupère le token stocké
    console.log("Token récupéré:", token);  // Ajoute ceci pour déboguer
    axios.get("http://localhost:5000/api/secretaires", {
      headers: {
        Authorization: `Bearer ${token}` // Ajoute le token JWT dans l'en-tête
      }
    })
    .then(response => {
      setSecretaires(response.data);
    })
    .catch(error => console.error("Erreur lors de la récupération des secrétaires:", error));
  }, []);
  
  
  

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleAddSecretaire = () => {
    const token = localStorage.getItem("token");
  
    axios.post("http://localhost:5000/api/secretaires", formData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      setFormData({ nom: "", prenom: "", email: "", motDePasse: "", id: "" }); // Réinitialiser les champs
      alert("Secrétaire ajouté avec succès !");
      
      // Recharger la liste des secrétaires après ajout
      axios.get("http://localhost:5000/api/secretaires", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => setSecretaires(response.data))
      .catch(error => console.error("Erreur lors de la mise à jour de la liste:", error));
    })
    .catch(error => console.error("Erreur lors de l'ajout :", error));
  };
  

  const handleDeleteSecretaire = (id) => {
    const token = localStorage.getItem("token"); // Récupère le token
  
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce secrétaire ?")) {
      axios.delete(`http://localhost:5000/api/secretaires/${id}`, {
        headers: {
          Authorization: `Bearer ${token}` // Envoie le token JWT
        }
      })
      .then(() => {
        setSecretaires(secretaires.filter(sec => sec._id !== id));
        alert("Secrétaire supprimé avec succès !");
      })
      .catch(error => console.error("Erreur lors de la suppression :", error));
    }
  };
  
  

  return (
    <div>
      <h1>Gestion des secrétaires</h1>

      {/* Formulaire de gestion */}
      {action === "add" && (
        <div>
          <h2>Ajouter un secrétaire</h2>
          <input
            type="text"
            name="nom"
            placeholder="Nom"
            value={formData.nom}
            onChange={handleChange}
          />
          <input
            type="text"
            name="prenom"
            placeholder="Prénom"
            value={formData.prenom}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="motDePasse"
            placeholder="Mot de passe"
            value={formData.motDePasse}
            onChange={handleChange}
          />
          <button onClick={handleAddSecretaire}>Ajouter</button>
        </div>
      )}

  

      {action === "delete" && (
        <div>
          <h2>Supprimer un secrétaire</h2>
          <select
            name="id"
            value={formData.id}
            onChange={handleChange}
          >
            <option value="">Sélectionnez un secrétaire</option>
            {secretaires.map(secretaire => (
              <option key={secretaire._id} value={secretaire._id}>
                {secretaire.nom} {secretaire.prenom} - {secretaire.email}
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              if (formData.id) {
                handleDeleteSecretaire(formData.id);
              } else {
                alert("Veuillez sélectionner un secrétaire à supprimer");
              }
            }}
          >
            Supprimer
          </button>
        </div>
      )}

      {/* Liste des secrétaires */}
      <div>
        <h2>Liste des secrétaires</h2>
        <ul>
          {secretaires.map((secretaire) => (
            <li key={secretaire._id}>
              {secretaire.nom} {secretaire.prenom} - {secretaire.email}
            </li>
          ))}
        </ul>
      </div>

      {/* Choix de l'action */}
      <div>
        <button onClick={() => { setAction("add"); setFormData({ nom: "", prenom: "", email: "", motDePasse: "", id: "" }); }}>
          Ajouter un secrétaire
        </button>
        <button onClick={() => { setAction("delete"); setFormData({ nom: "", prenom: "", email: "", motDePasse: "", id: "" }); }}>
          Supprimer un secrétaire
        </button>
      </div>
    </div>
  );
}

export default Admin;

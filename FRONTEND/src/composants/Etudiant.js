import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import logo from "./logo.png";
import "./Etudiant.css";

const NGROK_ADDRESS = ""  // mettre address ngrok ici 

// Initialisation unique du socket
const socket = io(NGROK_ADDRESS ?? "http://localhost:5000");

function Etudiant() {
  const [message, setMessage] = useState("Attendez"); // Message par défaut
  const [heure, setHeure] = useState(new Date());
  const [isDemandeEnvoyee, setIsDemandeEnvoyee] = useState(false); // Etat pour savoir si la demande d'entrée a été envoyée

  useEffect(() => {
    // Met à jour l'heure chaque seconde
    const timer = setInterval(() => {
      setHeure(new Date());
    }, 1000);

    // Écoute les messages venant de la secrétaire
    socket.on("update-etudiant", (msg) => {
      console.log("Message reçu :", msg);
      setMessage(msg);
    });

    return () => {
      clearInterval(timer);
      socket.off("update-etudiant");
    };
  }, []);

  // Fonction pour gérer l'envoi de la demande d'entrée
  const envoyerDemandeEntree = () => {
    // Envoi de la demande au serveur via socket
    socket.emit("demande-entrée", "Un étudiant demande à entrer.");
    setIsDemandeEnvoyee(true); // Marque la demande comme envoyée
    console.log("Demande d'entrée envoyée !");
  };

  const getButtonColor = () => {
    switch (message) {
      case "Entrez": return "green";
      case "Attendez": return "yellow";
      case "Fermé": return "red";
      default: return "gray";
    }
  };

  return (
    <div className="etudiant-container">
      <img src={logo} alt="Université de Lorraine" className="logo" />
      <h1>Bienvenue</h1>
      <p className="date">{heure.toLocaleDateString()} - {heure.toLocaleTimeString()}</p>
      
      {/* Affichage du bouton de réponse */}
      <button className="response-button" style={{ backgroundColor: getButtonColor() }}>
        {message}
      </button>

      {/* Bouton pour envoyer la demande d'entrée */}
      {!isDemandeEnvoyee ? (
        <button 
          className="demande-button" 
          onClick={envoyerDemandeEntree} 
          style={{ backgroundColor: "blue", color: "white" }}
        >
          Demande d'entrée
        </button>
      ) : (
        <p>Votre demande a été envoyée. Veuillez attendre la réponse.</p>
      )}
    </div>
  );
}

export default Etudiant;

import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { Link, useNavigate } from "react-router-dom";
import "./Secretaire.css";


// Initialisation du socket
const socket = io("http://localhost:5000", { autoConnect: false });

function Secretaire({ onLogout }) {
  const [inputMessage, setInputMessage] = useState("");
  const [notifications, setNotifications] = useState(0); // Compteur de notifications
  const [isRequestOpen, setIsRequestOpen] = useState(false); // État pour afficher les boutons "Entrez" et "Attendez"
  const [flash, setFlash] = useState(false); // État pour afficher un flash visuel
  const navigate = useNavigate();
  const [isHorairesOpen, setIsHorairesOpen] = useState(false); // Nouvel état pour gérer les horaires
  
  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // Rediriger vers login si pas de token
    }
  }, [navigate]);

  // Gestion de la connexion WebSocket
  useEffect(() => {
    if (!socket.connected) socket.connect();

    // Écoute les demandes d'entrée des étudiants
    socket.on("demande-entre", (data) => {
      console.log("Nouvelle demande d'entrée reçue:", data);
      setNotifications(prev => prev + 1); // Incrémente le compteur de notifications

      // Flash de notification
      setFlash(true);
      setTimeout(() => setFlash(false), 1000); // Flash dure 1 seconde
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const envoyerMessage = (msg) => {
    if (!msg.trim()) return; // Empêche l'envoi de messages vides
    socket.emit("secretaire-action", msg, (ack) => {
      if (ack?.error) console.error("Erreur d'envoi :", ack.error);
      else console.log("Message envoyé avec succès !");
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Supprime le token JWT lors de la déconnexion
    onLogout(); // Déconnecte la secrétaire
    navigate("/login"); // Redirige vers la page de connexion
  };

  // Afficher ou masquer les boutons de réponse
  const openRequestResponse = () => {
    setIsRequestOpen(true);
    setNotifications(0); // Réinitialiser les notifications après avoir répondu
  };

   // Afficher ou masquer la section des horaires
  const openHorairesResponse = () => {
    setIsHorairesOpen(true);
    setNotifications(0); // Réinitialiser les notifications après avoir répondu
  };

  // Répondre à la demande avec un message spécifique
  const handleResponse = (responseMessage) => {
    envoyerMessage(responseMessage); // Envoyer le message à l'étudiant
    setIsRequestOpen(false); // Fermer la fenêtre de réponse après envoi
  };

  return (
    <div className="secretaire-container">
      <h1>Interface Secrétaire</h1>

      {/* Affichage des notifications avec flash */}
      <div className="notifications">
        <button className={`notification-button ${flash ? "flash" : ""}`} onClick={openRequestResponse}>
          {notifications > 0 ? `Nouvelle demande (${notifications})` : "Pas de nouvelles demandes"}
        </button>
      </div>

      {isRequestOpen && (
        <div className="request-response">
          <h3>Répondre à la demande d'entrée :</h3>
          <button onClick={() => handleResponse("Entrez")} style={{ backgroundColor: "green" }}>
            Entrez
          </button>
          <button onClick={() => handleResponse("Attendez")} style={{ backgroundColor: "yellow" }}>
            Attendez
          </button>
        </div>
      )}


       {/* Affichage des horaires avec flash */}
       <div className="Horaires">
        <button className={`horaires-button ${flash ? "flash" : ""}`} onClick={openHorairesResponse}>
        {notifications === 0 ? "Etat actuel" : `Horaires (${notifications})`}

        </button>
      </div>

      {isHorairesOpen && (
        <div className="request-response">
          <h3>Répondre à l'état des horaires :</h3>
          <button onClick={() => handleResponse("OUVERT")} style={{ backgroundColor: "green" }}>
            OUVERT
          </button>
          <button onClick={() => handleResponse("FERMER")} style={{ backgroundColor: "yellow" }}>
            FERMER
          </button>
        </div>
      )}

      <div>
        <input
          type="text"
          placeholder="Message personnalisé"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
        />
        <button onClick={() => envoyerMessage(inputMessage)}>Envoyer</button>
      </div>

      <Link to="/parametres">
        <button>Accéder aux Paramètres</button>
      </Link>
      {/* Ajout d'un lien vers la page Admin */}
      <Link to="/admin">
        <button>Accéder à l'Administration</button>
      </Link>
      <button onClick={handleLogout}>Déconnexion</button>
    </div>
  );
}

export default Secretaire;

import React, { useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000", { autoConnect: false });

function Horaire() {
  const [horaire, setHoraire] = useState(null);

  const changerHoraire = (etat) => {
    setHoraire(etat);
    socket.emit("changer-horaire", etat); // Envoi au serveur
  };

  return (
    <div className="horaire-container">
      <button onClick={() => changerHoraire("Ouvert")}>Ouvert</button>
      <button onClick={() => changerHoraire("Fermé")}>Fermé</button>
      <p>État actuel : {horaire ? horaire : "Non défini"}</p>
    </div>
  );
}

export default Horaire;

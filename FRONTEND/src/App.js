import React, { useState } from "react"; // Ajout de useState

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Parametres from "./composants/Parametres";
import Login from "./composants/Login";
import Secretaire from "./composants/Secretaire";
import Etudiant from "./composants/Etudiant";
import Admin from "./composants/Admin";
import Horaire from "./composants/Horaire";


function App() {
  // Vérifie si la secrétaire est connectée dans localStorage
  const [secretaireConnecte, setSecretaireConnecte] = useState(
    localStorage.getItem("secretaireConnecte") === "true"
  );

  // Fonction de connexion (stocke l'état dans localStorage)
  const handleLogin = () => {
    setSecretaireConnecte(true);
    localStorage.setItem("secretaireConnecte", "true");
  };

  // Fonction de déconnexion (supprime l'état du localStorage)
  const handleLogout = () => {
    setSecretaireConnecte(false);
    localStorage.removeItem("secretaireConnecte");
  };

  return (
    <Router>
      <Routes>
        {/* Page étudiant accessible sans restriction */}
        <Route path="/etudiant" element={<Etudiant />} />

        {/* Page de connexion */}
        <Route path="/login" element={<Login onLogin={handleLogin} />} />

        {/* Interface secrétaire protégée par l'authentification */}
        <Route
          path="/secretaire"
          element={
            secretaireConnecte ? <Secretaire onLogout={handleLogout} /> : <Navigate to="/login" />
          }
        />

        {/* Page des paramètres accessible uniquement si connecté */}
        <Route
          path="/parametres"
          element={secretaireConnecte ? <Parametres /> : <Navigate to="/login" />}
        />
        {/* Ajoute cette route */}
        <Route path="/admin" element={<Admin />} />

        {/* Redirection par défaut vers la page étudiant */}
        <Route path="*" element={<Navigate to="/etudiant" />} />
        <Route path="/horaire" element={<Horaire />} />
      </Routes>
    </Router>
  );
}

export default App;


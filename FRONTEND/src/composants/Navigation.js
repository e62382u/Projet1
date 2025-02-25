import React from 'react';
import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <nav>
      <Link to="/secretaire">Secrétaire</Link>
      <Link to="/etudiant">Étudiant</Link>
    </nav>
  );
}

export default Navigation;

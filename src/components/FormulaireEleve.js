import React, { useState } from 'react';
import { createEleve } from '../services/api';

function FormulaireEleve({ onEleveAjoute }) {
    const [eleve, setEleve] = useState({
        matricule: '',
        nom: '',
        prenom: '',
        dateNaissance: '',
        lieuNaissance: '',
        numeroParent: '',
        classe: '',
    });

    const handleChange = (e) => {
        setEleve({ ...eleve, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createEleve(eleve);
            onEleveAjoute();
            setEleve({
                matricule: '',
                nom: '',
                prenom: '',
                dateNaissance: '',
                lieuNaissance: '',
                numeroParent: '',
                classe: '',
            });
        } catch (error) {
            console.error('Erreur lors de la création', error);
        }
    };

    return (
        <div>
            <h3>Ajouter un élève</h3>
            <form onSubmit={handleSubmit}>
                <input name="matricule" placeholder="Matricule" value={eleve.matricule} onChange={handleChange} required /><br />
                <input name="nom" placeholder="Nom" value={eleve.nom} onChange={handleChange} required /><br />
                <input name="prenom" placeholder="Prénom" value={eleve.prenom} onChange={handleChange} required /><br />
                <input name="dateNaissance" type="date" value={eleve.dateNaissance} onChange={handleChange} required /><br />
                <input name="lieuNaissance" placeholder="Lieu de naissance" value={eleve.lieuNaissance} onChange={handleChange} required /><br />
                <input name="numeroParent" placeholder="Numéro parent" value={eleve.numeroParent} onChange={handleChange} required /><br />
                <input name="classe" placeholder="Classe" value={eleve.classe} onChange={handleChange} required /><br />
                <button type="submit">Ajouter</button>
            </form>
        </div>
    );
}

export default FormulaireEleve;
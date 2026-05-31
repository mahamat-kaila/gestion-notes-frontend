import React, { useState, useEffect } from 'react';
import { createEleve, getClasses } from '../services/api';

function FormulaireEleve({ onEleveAjoute }) {
    const [eleve, setEleve] = useState({
        nom: '',
        prenom: '',
        dateNaissance: '',
        lieuNaissance: '',
        numeroParent: '',
        classe: null,
    });
    const [classes, setClasses] = useState([]);
    const [erreur, setErreur] = useState('');

    useEffect(() => {
        chargerClasses();
    }, []);

    const chargerClasses = async () => {
        try {
            const response = await getClasses();
            setClasses(response.data);
        } catch (error) {
            console.error('Erreur chargement classes', error);
        }
    };

    const handleChange = (e) => {
        setEleve({ ...eleve, [e.target.name]: e.target.value });
    };

    const handleClasseChange = (e) => {
        const classeId = e.target.value;
        setEleve({ ...eleve, classe: classeId ? { id: classeId } : null });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createEleve(eleve);
            setErreur('');
            onEleveAjoute();
            setEleve({
                nom: '',
                prenom: '',
                dateNaissance: '',
                lieuNaissance: '',
                numeroParent: '',
                classe: null,
            });
        } catch (error) {
            setErreur('Erreur lors de la création de l\'élève.');
        }
    };

    return (
        <div>
            <h3>Ajouter un élève</h3>
            <form onSubmit={handleSubmit}>
                <input name="nom" placeholder="Nom" value={eleve.nom} onChange={handleChange} required /><br />
                <input name="prenom" placeholder="Prénom" value={eleve.prenom} onChange={handleChange} required /><br />
                <input name="dateNaissance" type="date" value={eleve.dateNaissance} onChange={handleChange} required /><br />
                <input name="lieuNaissance" placeholder="Lieu de naissance" value={eleve.lieuNaissance} onChange={handleChange} required /><br />
                <input name="numeroParent" placeholder="Numéro parent" value={eleve.numeroParent} onChange={handleChange} required /><br />
                <select onChange={handleClasseChange} required>
                    <option value="">-- Choisir une classe --</option>
                    {classes.map((c) => (
                        <option key={c.id} value={c.id}>{c.nom}</option>
                    ))}
                </select><br />
                <button type="submit">Ajouter</button>
                {erreur && <p style={{ color: 'red' }}>{erreur}</p>}
            </form>
        </div>
    );
}

export default FormulaireEleve;
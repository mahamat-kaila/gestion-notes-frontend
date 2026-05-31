import React, { useState, useEffect } from 'react';
import { getEleves, deleteEleve, updateEleve, getClasses } from '../services/api';
import FormulaireEleve from '../components/FormulaireEleve';

function Eleves() {
    const [eleves, setEleves] = useState([]);
    const [eleveEdite, setEleveEdite] = useState(null);
    const [classes, setClasses] = useState([]);

    useEffect(() => {
        chargerEleves();
        chargerClasses();
    }, []);

    const chargerEleves = async () => {
        try {
            const response = await getEleves();
            setEleves(response.data);
        } catch (error) {
            console.error('Erreur lors du chargement des élèves', error);
        }
    };

    const chargerClasses = async () => {
        const response = await getClasses();
        setClasses(response.data);
    };

    const supprimerEleve = async (id) => {
        if (window.confirm('Voulez-vous vraiment supprimer cet élève ?')) {
            await deleteEleve(id);
            chargerEleves();
        }
    };

    const handleEdit = (eleve) => {
        setEleveEdite({ ...eleve, classe: eleve.classe ? eleve.classe : null });
    };

    const handleEditChange = (e) => {
        setEleveEdite({ ...eleveEdite, [e.target.name]: e.target.value });
    };

    const handleEditClasseChange = (e) => {
        setEleveEdite({ ...eleveEdite, classe: { id: e.target.value } });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateEleve(eleveEdite.id, eleveEdite);
            setEleveEdite(null);
            chargerEleves();
        } catch (error) {
            console.error('Erreur modification élève', error);
        }
    };

    return (
        <div>
            <h2>Liste des Élèves</h2>
            <FormulaireEleve onEleveAjoute={chargerEleves} />
            <br />

            {/* Formulaire de modification */}
            {eleveEdite && (
                <div style={{ border: '1px solid orange', padding: '10px', marginBottom: '10px' }}>
                    <h3>Modifier l'élève : {eleveEdite.matricule}</h3>
                    <form onSubmit={handleEditSubmit}>
                        <input name="nom" placeholder="Nom" value={eleveEdite.nom} onChange={handleEditChange} required /><br />
                        <input name="prenom" placeholder="Prénom" value={eleveEdite.prenom} onChange={handleEditChange} required /><br />
                        <input name="dateNaissance" type="date" value={eleveEdite.dateNaissance} onChange={handleEditChange} required /><br />
                        <input name="lieuNaissance" placeholder="Lieu de naissance" value={eleveEdite.lieuNaissance} onChange={handleEditChange} required /><br />
                        <input name="numeroParent" placeholder="Numéro parent" value={eleveEdite.numeroParent} onChange={handleEditChange} required /><br />
                        <select onChange={handleEditClasseChange} value={eleveEdite.classe ? eleveEdite.classe.id : ''} required>
                            <option value="">-- Choisir une classe --</option>
                            {classes.map((c) => (
                                <option key={c.id} value={c.id}>{c.nom}</option>
                            ))}
                        </select><br />
                        <button type="submit">Enregistrer</button>
                        <button type="button" onClick={() => setEleveEdite(null)} style={{ marginLeft: '10px' }}>Annuler</button>
                    </form>
                </div>
            )}

            <table border="1">
                <thead>
                <tr>
                    <th>Matricule</th>
                    <th>Nom</th>
                    <th>Prénom</th>
                    <th>Classe</th>
                    <th>Âge</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {eleves.map((eleve) => (
                    <tr key={eleve.id}>
                        <td>{eleve.matricule}</td>
                        <td>{eleve.nom}</td>
                        <td>{eleve.prenom}</td>
                        <td>{eleve.classe ? eleve.classe.nom : '-'}</td>
                        <td>{eleve.age} ans</td>
                        <td>
                            <button onClick={() => handleEdit(eleve)}>Modifier</button>
                            <button onClick={() => supprimerEleve(eleve.id)} style={{ marginLeft: '5px' }}>Supprimer</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default Eleves;
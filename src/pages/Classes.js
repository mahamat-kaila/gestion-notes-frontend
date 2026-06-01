import React, { useState, useEffect } from 'react';
import { getClasses, createClasse, deleteClasse, updateClasse } from '../services/api';

function Classes({ onClassesChange }) {
    const [classes, setClasses] = useState([]);
    const [classe, setClasse] = useState({ nom: '' });
    const [classeEditee, setClasseEditee] = useState(null);
    const [erreur, setErreur] = useState('');

    useEffect(() => {
        chargerClasses();
    }, []);

    const chargerClasses = async () => {
        try {
            const response = await getClasses();
            setClasses(response.data);
            if (onClassesChange) onClassesChange(response.data);
        } catch (error) {
            console.error('Erreur chargement classes', error);
        }
    };

    const handleChange = (e) => {
        setClasse({ ...classe, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createClasse({ nom: classe.nom, effectif: 0 });
            setErreur('');
            chargerClasses();
            setClasse({ nom: '' });
        } catch (error) {
            setErreur('Une classe avec ce nom existe déjà !');
        }
    };

    const supprimerClasse = async (id) => {
        if (window.confirm('Voulez-vous vraiment supprimer cette classe ?')) {
            await deleteClasse(id);
            chargerClasses();
        }
    };

    const handleEdit = (classe) => {
        setClasseEditee({ ...classe });
    };

    const handleEditChange = (e) => {
        setClasseEditee({ ...classeEditee, [e.target.name]: e.target.value });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateClasse(classeEditee.id, classeEditee);
            setClasseEditee(null);
            chargerClasses();
        } catch (error) {
            setErreur('Une classe avec ce nom existe déjà !');
        }
    };

    return (
        <div>
            <h2>Liste des Classes</h2>

            <h3>Ajouter une classe</h3>
            <form onSubmit={handleSubmit}>
                <input name="nom" placeholder="Nom de la classe" value={classe.nom} onChange={handleChange} required /><br />
                <button type="submit">Ajouter</button>
                {erreur && <p style={{ color: 'red' }}>{erreur}</p>}
            </form>

            {classeEditee && (
                <div style={{ border: '1px solid orange', padding: '10px', marginBottom: '10px' }}>
                    <h3>Modifier la classe : {classeEditee.nom}</h3>
                    <form onSubmit={handleEditSubmit}>
                        <input name="nom" placeholder="Nom" value={classeEditee.nom} onChange={handleEditChange} required /><br />
                        <button type="submit">Enregistrer</button>
                        <button type="button" onClick={() => setClasseEditee(null)} style={{ marginLeft: '10px' }}>Annuler</button>
                    </form>
                </div>
            )}

            <br />
            <table border="1">
                <thead>
                <tr>
                    <th>Nom</th>
                    <th>Effectif</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {classes.map((c) => (
                    <tr key={c.id}>
                        <td>{c.nom}</td>
                        <td>{c.effectif}</td>
                        <td>
                            <button className="btn-modifier" onClick={() => handleEdit(c)}>✏️ Modifier</button>
                            <button className="btn-supprimer" onClick={() => supprimerClasse(c.id)}>🗑️ Supprimer</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default Classes;
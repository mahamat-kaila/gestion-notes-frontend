import React, { useState, useEffect } from 'react';
import { getClasses, createClasse, deleteClasse } from '../services/api';

function Classes({ onClassesChange }) {
    const [classes, setClasses] = useState([]);
    const [classe, setClasse] = useState({ nom: '' });

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

    const [erreur, setErreur] = useState('');

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

    return (
        <div>
            <h2>Liste des Classes</h2>

            <h3>Ajouter une classe</h3>
            <form onSubmit={handleSubmit}>
                <input name="nom" placeholder="Nom de la classe" value={classe.nom} onChange={handleChange} required /><br />
                <button type="submit">Ajouter</button>
                {erreur && <p style={{ color: 'red' }}>{erreur}</p>}
            </form>

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
                            <button onClick={() => supprimerClasse(c.id)}>
                                Supprimer
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default Classes;
import React, { useState, useEffect } from 'react';
import { getMatieres, createMatiere, deleteMatiere } from '../services/api';

function Matieres() {
    const [matieres, setMatieres] = useState([]);
    const [matiere, setMatiere] = useState({ nom: '', coefficient: '' });
    const [erreur, setErreur] = useState('')

    useEffect(() => {
        chargerMatieres();
    }, []);

    const chargerMatieres = async () => {
        try {
            const response = await getMatieres();
            setMatieres(response.data);
        } catch (error) {
            console.error('Erreur lors du chargement des matières', error);
        }
    };

    const handleChange = (e) => {
        setMatiere({ ...matiere, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createMatiere(matiere);
            setErreur('');
            chargerMatieres();
            setMatiere({ nom: '', coefficient: '' });
        } catch (error) {
            setErreur('Une matière avec ce nom existe déjà !');
        }
    };

    const supprimerMatiere = async (id) => {
        if (window.confirm('Voulez-vous vraiment supprimer cette matière ?')) {
            await deleteMatiere(id);
            chargerMatieres();
        }
    };

    return (
        <div>
            <h2>Liste des Matières</h2>

            <h3>Ajouter une matière</h3>
            <form onSubmit={handleSubmit}>
                <input name="nom" placeholder="Nom de la matière" value={matiere.nom} onChange={handleChange} required /><br />
                <input name="coefficient" type="number" step="0.5" placeholder="Coefficient" value={matiere.coefficient} onChange={handleChange} required /><br />
                <button type="submit">Ajouter</button>
                {erreur && <p style={{ color: 'red' }}>{erreur}</p>}
            </form>

            <br />
            <table border="1">
                <thead>
                <tr>
                    <th>Nom</th>
                    <th>Coefficient</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {matieres.map((m) => (
                    <tr key={m.id}>
                        <td>{m.nom}</td>
                        <td>{m.coefficient}</td>
                        <td>
                            <button onClick={() => supprimerMatiere(m.id)}>
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

export default Matieres;
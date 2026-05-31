import React, { useState, useEffect } from 'react';
import { getMatieres, createMatiere, deleteMatiere, updateMatiere } from '../services/api';

function Matieres() {
    const [matieres, setMatieres] = useState([]);
    const [matiere, setMatiere] = useState({ nom: '', coefficient: '' });
    const [matiereEditee, setMatiereEditee] = useState(null);
    const [erreur, setErreur] = useState('');

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

    const handleEdit = (matiere) => {
        setMatiereEditee({ ...matiere });
    };

    const handleEditChange = (e) => {
        setMatiereEditee({ ...matiereEditee, [e.target.name]: e.target.value });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateMatiere(matiereEditee.id, matiereEditee);
            setMatiereEditee(null);
            chargerMatieres();
        } catch (error) {
            setErreur('Une matière avec ce nom existe déjà !');
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

            {matiereEditee && (
                <div style={{ border: '1px solid orange', padding: '10px', marginBottom: '10px' }}>
                    <h3>Modifier la matière : {matiereEditee.nom}</h3>
                    <form onSubmit={handleEditSubmit}>
                        <input name="nom" placeholder="Nom" value={matiereEditee.nom} onChange={handleEditChange} required /><br />
                        <input name="coefficient" type="number" step="0.5" placeholder="Coefficient" value={matiereEditee.coefficient} onChange={handleEditChange} required /><br />
                        <button type="submit">Enregistrer</button>
                        <button type="button" onClick={() => setMatiereEditee(null)} style={{ marginLeft: '10px' }}>Annuler</button>
                    </form>
                </div>
            )}

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
                            <button onClick={() => handleEdit(m)}>Modifier</button>
                            <button onClick={() => supprimerMatiere(m.id)} style={{ marginLeft: '5px' }}>Supprimer</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default Matieres;
import React, { useState, useEffect } from 'react';
import { getAnnees, createAnnee, activerAnnee, deleteAnnee } from '../services/api';

function AnneeScolaire() {
    const [annees, setAnnees] = useState([]);
    const [annee, setAnnee] = useState({ libelle: '', dateDebut: '', dateFin: '', active: false });
    const [erreur, setErreur] = useState('');

    useEffect(() => {
        chargerAnnees();
    }, []);

    const chargerAnnees = async () => {
        const response = await getAnnees();
        setAnnees(response.data);
    };

    const handleChange = (e) => {
        setAnnee({ ...annee, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createAnnee(annee);
            setErreur('');
            chargerAnnees();
            setAnnee({ libelle: '', dateDebut: '', dateFin: '', active: false });
        } catch (error) {
            setErreur('Erreur lors de la création de l\'année scolaire !');
        }
    };

    const handleActiver = async (id) => {
        await activerAnnee(id);
        chargerAnnees();
    };

    const handleSupprimer = async (id) => {
        if (window.confirm('Voulez-vous vraiment supprimer cette année scolaire ?')) {
            try {
                await deleteAnnee(id);
                chargerAnnees();
            } catch (error) {
                alert(error.response?.data || 'Impossible de supprimer cette année scolaire !');
            }
        }
    };
    return (
        <div>
            <h2>Gestion des Années Scolaires</h2>

            <h3>Ajouter une année scolaire</h3>
            <form onSubmit={handleSubmit}>
                <input name="libelle" placeholder="Ex: 2025/2026" value={annee.libelle} onChange={handleChange} required /><br />
                <input name="dateDebut" type="date" value={annee.dateDebut} onChange={handleChange} required /><br />
                <input name="dateFin" type="date" value={annee.dateFin} onChange={handleChange} required /><br />
                <button type="submit">Ajouter</button>
                {erreur && <p style={{ color: 'red' }}>{erreur}</p>}
            </form>

            <br />
            <table border="1">
                <thead>
                <tr>
                    <th>Libellé</th>
                    <th>Date Début</th>
                    <th>Date Fin</th>
                    <th>Statut</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {annees.map((a) => (
                    <tr key={a.id} style={{ background: a.active ? '#e6ffe6' : 'white' }}>
                        <td><strong>{a.libelle}</strong></td>
                        <td>{a.dateDebut}</td>
                        <td>{a.dateFin}</td>
                        <td>
                            {a.active ?
                                <span style={{ color: 'green', fontWeight: 'bold' }}>✅ Active</span> :
                                <span style={{ color: 'gray' }}>Archivée</span>
                            }
                        </td>
                        <td>
                            {!a.active && (
                                <button onClick={() => handleActiver(a.id)} style={{ marginRight: '5px', background: 'green', color: 'white' }}>
                                    Activer
                                </button>
                            )}
                            <button onClick={() => handleSupprimer(a.id)}>Supprimer</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default AnneeScolaire;
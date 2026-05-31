import React, { useState, useEffect } from 'react';
import { getProfesseurs, createProfesseur, deleteProfesseur, getMatieres, getClasses, createAffectation, getAffectations, updateProfesseur } from '../services/api';
function Professeurs() {
    const [professeurs, setProfesseurs] = useState([]);
    const [matieres, setMatieres] = useState([]);
    const [classes, setClasses] = useState([]);
    const [affectations, setAffectations] = useState([]);
    const [professeurEdite, setProfesseurEdite] = useState(null);
    const [professeur, setProfesseur] = useState({
        nom: '', prenom: '', telephone: '', email: '', adresse: ''
    });
    const [affectation, setAffectation] = useState({
        professeur: null, matiere: null, classe: null
    });
    const [erreur, setErreur] = useState('');

    useEffect(() => {
        chargerProfesseurs();
        chargerMatieres();
        chargerClasses();
        chargerAffectations();
    }, []);

    const chargerProfesseurs = async () => {
        const response = await getProfesseurs();
        setProfesseurs(response.data);
    };

    const chargerMatieres = async () => {
        const response = await getMatieres();
        setMatieres(response.data);
    };

    const handleEdit = (professeur) => {
        setProfesseurEdite({ ...professeur });
    };

    const handleEditChange = (e) => {
        setProfesseurEdite({ ...professeurEdite, [e.target.name]: e.target.value });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateProfesseur(professeurEdite.id, professeurEdite);
            setProfesseurEdite(null);
            chargerProfesseurs();
        } catch (error) {
            setErreur('Un professeur avec cet email existe déjà !');
        }
    };

    const chargerClasses = async () => {
        const response = await getClasses();
        setClasses(response.data);
    };

    const handleChange = (e) => {
        setProfesseur({ ...professeur, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createProfesseur(professeur);
            setErreur('');
            chargerProfesseurs();
            setProfesseur({ nom: '', prenom: '', telephone: '', email: '', adresse: '' });
        } catch (error) {
            setErreur('Un professeur avec cet email existe déjà !');
        }
    };

    const supprimerProfesseur = async (id) => {
        if (window.confirm('Voulez-vous vraiment supprimer ce professeur ?')) {
            await deleteProfesseur(id);
            chargerProfesseurs();
        }
    };

    const handleAffectationChange = (e) => {
        setAffectation({ ...affectation, [e.target.name]: { id: e.target.value } });
    };

    const handleAffectationSubmit = async (e) => {
        e.preventDefault();
        try {
            await createAffectation(affectation);
            setErreur('');
            setAffectation({ professeur: null, matiere: null, classe: null });
            chargerProfesseurs();
            chargerAffectations();
            e.target.reset();
        } catch (error) {
            setErreur('Cette matière est déjà attribuée dans cette classe !');
        }
    };

    const chargerAffectations = async () => {
        const response = await getAffectations();
        setAffectations(response.data);
    };

    return (
        <div>
            <h2>Gestion des Professeurs</h2>

            <h3>Ajouter un professeur</h3>
            <form onSubmit={handleSubmit}>
                <input name="nom" placeholder="Nom" value={professeur.nom} onChange={handleChange} required /><br />
                <input name="prenom" placeholder="Prénom" value={professeur.prenom} onChange={handleChange} required /><br />
                <input name="telephone" placeholder="Téléphone" value={professeur.telephone} onChange={handleChange} required /><br />
                <input name="email" type="email" placeholder="Email" value={professeur.email} onChange={handleChange} required /><br />
                <input name="adresse" placeholder="Adresse" value={professeur.adresse} onChange={handleChange} required /><br />
                <button type="submit">Ajouter</button>
                {erreur && <p style={{ color: 'red' }}>{erreur}</p>}
            </form>

            <br />
            {professeurEdite && (
                <div style={{ border: '1px solid orange', padding: '10px', marginBottom: '10px' }}>
                    <h3>Modifier le professeur : {professeurEdite.nom} {professeurEdite.prenom}</h3>
                    <form onSubmit={handleEditSubmit}>
                        <input name="nom" placeholder="Nom" value={professeurEdite.nom} onChange={handleEditChange} required /><br />
                        <input name="prenom" placeholder="Prénom" value={professeurEdite.prenom} onChange={handleEditChange} required /><br />
                        <input name="telephone" placeholder="Téléphone" value={professeurEdite.telephone} onChange={handleEditChange} required /><br />
                        <input name="email" type="email" placeholder="Email" value={professeurEdite.email} onChange={handleEditChange} required /><br />
                        <input name="adresse" placeholder="Adresse" value={professeurEdite.adresse} onChange={handleEditChange} required /><br />
                        <button type="submit">Enregistrer</button>
                        <button type="button" onClick={() => setProfesseurEdite(null)} style={{ marginLeft: '10px' }}>Annuler</button>
                    </form>
                </div>
            )}
            <table border="1">
                <thead>
                <tr>
                    <th>Nom</th>
                    <th>Prénom</th>
                    <th>Téléphone</th>
                    <th>Email</th>
                    <th>Adresse</th>
                    <th>Affectations</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {professeurs.map((p) => (
                    <tr key={p.id}>
                        <td>{p.nom}</td>
                        <td>{p.prenom}</td>
                        <td>{p.telephone}</td>
                        <td>{p.email}</td>
                        <td>{p.adresse}</td>
                        <td>
                            {Object.entries(
                                affectations
                                    .filter((a) => a.professeur.id === p.id)
                                    .reduce((acc, a) => {
                                        const matiere = a.matiere.nom;
                                        if (!acc[matiere]) acc[matiere] = [];
                                        acc[matiere].push(a.classe.nom);
                                        return acc;
                                    }, {})
                            ).map(([matiere, classes]) => (
                                <span key={matiere} style={{ display: 'block' }}>
      {matiere} → {classes.join(', ')}
    </span>
                            ))}
                        </td>
                        <td>
                            <button onClick={() => handleEdit(p)}>Modifier</button>
                            <button onClick={() => supprimerProfesseur(p.id)} style={{ marginLeft: '5px' }}>Supprimer</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <h3>Affecter un professeur</h3>
            <form onSubmit={handleAffectationSubmit}>
                <select name="professeur" onChange={handleAffectationChange} required>
                    <option value="">-- Choisir un professeur --</option>
                    {professeurs.map((p) => (
                        <option key={p.id} value={p.id}>{p.nom} {p.prenom}</option>
                    ))}
                </select><br />
                <select name="matiere" onChange={handleAffectationChange} required>
                    <option value="">-- Choisir une matière --</option>
                    {matieres.map((m) => (
                        <option key={m.id} value={m.id}>{m.nom}</option>
                    ))}
                </select><br />
                <select name="classe" onChange={handleAffectationChange} required>
                    <option value="">-- Choisir une classe --</option>
                    {classes.map((c) => (
                        <option key={c.id} value={c.id}>{c.nom}</option>
                    ))}
                </select><br />
                <button type="submit">Affecter</button>
            </form>
        </div>
    );
}

export default Professeurs;
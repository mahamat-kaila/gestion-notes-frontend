import React, { useState, useEffect } from 'react';
import { getUtilisateurs, createUtilisateur, toggleSaisirNotes, toggleActif, deleteUtilisateur } from '../services/api';

function Utilisateurs() {
    const [utilisateurs, setUtilisateurs] = useState([]);
    const [utilisateur, setUtilisateur] = useState({
        nom: '', prenom: '', email: '', motDePasse: '', role: 'DIRECTEUR'
    });
    const [erreur, setErreur] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        chargerUtilisateurs();
    }, []);

    const chargerUtilisateurs = async () => {
        const response = await getUtilisateurs();
        setUtilisateurs(response.data);
    };

    const handleChange = (e) => {
        setUtilisateur({ ...utilisateur, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createUtilisateur(utilisateur);
            setErreur('');
            setMessage('✅ Utilisateur créé avec succès !');
            chargerUtilisateurs();
            setUtilisateur({ nom: '', prenom: '', email: '', motDePasse: '', role: 'DIRECTEUR' });
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setErreur('Erreur lors de la création !');
        }
    };

    const handleToggleNotes = async (id) => {
        await toggleSaisirNotes(id);
        chargerUtilisateurs();
    };

    const handleToggleActif = async (id) => {
        await toggleActif(id);
        chargerUtilisateurs();
    };

    const handleSupprimer = async (id) => {
        if (window.confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) {
            await deleteUtilisateur(id);
            chargerUtilisateurs();
        }
    };

    return (
        <div>
            <h2>Gestion des Utilisateurs</h2>

            <div style={{ background: 'white', borderRadius: '10px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '20px', maxWidth: '500px' }}>
                <h3>Ajouter un utilisateur</h3>
                <form onSubmit={handleSubmit} autoComplete="off">
                    <input name="nom" placeholder="Nom" value={utilisateur.nom} onChange={handleChange} required />
                    <input name="prenom" placeholder="Prénom" value={utilisateur.prenom} onChange={handleChange} required />
                    <input name="email" type="email" placeholder="Email" value={utilisateur.email} onChange={handleChange} required />
                    <input name="motDePasse" type="password" placeholder="Mot de passe" value={utilisateur.motDePasse} onChange={handleChange} required />
                    <select name="role" value={utilisateur.role} onChange={handleChange}>
                        <option value="DIRECTEUR">Directeur</option>
                        <option value="ADMIN">Administrateur</option>
                    </select>
                    <button type="submit">Ajouter</button>
                    {erreur && <p style={{ color: 'red', marginTop: '8px' }}>{erreur}</p>}
                    {message && <p style={{ color: 'green', marginTop: '8px' }}>{message}</p>}
                </form>
            </div>

            <table>
                <thead>
                <tr>
                    <th>Nom</th>
                    <th>Prénom</th>
                    <th>Email</th>
                    <th>Rôle</th>
                    <th>Statut</th>
                    <th>Saisir Notes</th>
                    <th>Actions</th>
                    <th>Dernière connexion</th>
                </tr>
                </thead>
                <tbody>
                {utilisateurs.map((u) => (
                    <tr key={u.id}>
                        <td>{u.nom}</td>
                        <td>{u.prenom}</td>
                        <td>{u.email}</td>
                        <td>
                                <span style={{
                                    background: u.role === 'ADMIN' ? '#ff6f00' : '#1a237e',
                                    color: 'white',
                                    padding: '3px 10px',
                                    borderRadius: '10px',
                                    fontSize: '12px'
                                }}>
                                    {u.role}
                                </span>
                        </td>
                        <td>
                            <button
                                onClick={() => handleToggleActif(u.id)}
                                style={{
                                    background: u.actif ? '#2e7d32' : '#e53935',
                                    color: 'white',
                                    padding: '3px 10px',
                                    fontSize: '12px',
                                    borderRadius: '5px'
                                }}>
                                {u.actif ? '✅ Actif' : '❌ Inactif'}
                            </button>
                        </td>
                        <td>
                            {u.role === 'DIRECTEUR' && (
                                <button
                                    onClick={() => handleToggleNotes(u.id)}
                                    style={{
                                        background: u.peutSaisirNotes ? '#2e7d32' : '#757575',
                                        color: 'white',
                                        padding: '3px 10px',
                                        fontSize: '12px',
                                        borderRadius: '5px'
                                    }}>
                                    {u.peutSaisirNotes ? '✅ Autorisé' : '❌ Non autorisé'}
                                </button>
                            )}
                        </td>
                        <td>
                            <button className="btn-supprimer" onClick={() => handleSupprimer(u.id)}>
                                🗑️ Supprimer
                            </button>
                        </td>
                        <td>
                            {u.derniereConnexion ? (
                                <span style={{
                                    color: new Date() - new Date(u.derniereConnexion) < 300000 ? 'green' : 'gray',
                                    fontWeight: 'bold',
                                    fontSize: '12px'
                                }}>
            {new Date() - new Date(u.derniereConnexion) < 300000 ? '🟢 En ligne' : '⚫ ' + new Date(u.derniereConnexion).toLocaleString('fr-FR')}
        </span>
                            ) : '—'}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default Utilisateurs;
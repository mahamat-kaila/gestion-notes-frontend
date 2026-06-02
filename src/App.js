import React, { useState, useEffect } from 'react';
import Classes from './pages/Classes';
import Eleves from './pages/Eleves';
import Matieres from './pages/Matieres';
import Notes from './pages/Notes';
import Professeurs from './pages/Professeurs';
import Moyenne from './pages/Moyenne';
import AnneeScolaire from './pages/AnneeScolaire';
import Accueil from './pages/Accueil';
import Login from './pages/Login';
import Utilisateurs from './pages/Utilisateurs';
import Logs from './pages/Logs';
import { MdPrint } from 'react-icons/md';
import { getAnnees, activerAnnee } from './services/api';

import {
    MdHome, MdCalendarToday, MdClass, MdPeople, MdBook,
    MdAssignment, MdPerson, MdBarChart, MdGroup, MdMenu,
    MdLogout, MdWbSunny
} from 'react-icons/md';

function App() {
    const [page, setPage] = useState('accueil');
    const [annees, setAnnees] = useState([]);
    const [anneeSelectionnee, setAnneeSelectionnee] = useState(null);
    const [utilisateur, setUtilisateur] = useState(null);
    const [sidebarOuverte, setSidebarOuverte] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        const nom = localStorage.getItem('nom');
        const prenom = localStorage.getItem('prenom');
        const peutSaisirNotes = localStorage.getItem('peutSaisirNotes');
        if (token) {
            setUtilisateur({ token, role, nom, prenom, peutSaisirNotes });
            chargerAnnees();
        }
    }, []);

    const chargerAnnees = async () => {
        const response = await getAnnees();
        setAnnees(response.data);
        const anneeActive = response.data.find((a) => a.active);
        if (anneeActive) setAnneeSelectionnee(anneeActive.id);
    };

    const handleAnneeChange = async (e) => {
        const id = e.target.value;
        setAnneeSelectionnee(id);
        await activerAnnee(id);
        chargerAnnees();
    };

    const handleLogin = (data) => {
        setUtilisateur(data);
        chargerAnnees();
    };

    const handleLogout = () => {
        localStorage.clear();
        setUtilisateur(null);
        setPage('accueil');
    };

    if (!utilisateur) {
        return <Login onLogin={handleLogin} />;
    }

    const isAdmin = utilisateur.role === 'ADMIN';
    const peutSaisirNotes = utilisateur.peutSaisirNotes === 'true' || utilisateur.peutSaisirNotes === true;

    const navItems = [
        { key: 'accueil', label: 'Accueil', icon: <MdHome size={20} />, visible: true },
        { key: 'annee', label: 'Année Scolaire', icon: <MdCalendarToday size={20} />, visible: isAdmin },
        { key: 'classes', label: 'Classes', icon: <MdClass size={20} />, visible: isAdmin },
        { key: 'eleves', label: 'Élèves', icon: <MdPeople size={20} />, visible: isAdmin },
        { key: 'matieres', label: 'Matières', icon: <MdBook size={20} />, visible: isAdmin },
        { key: 'notes', label: 'Notes', icon: <MdAssignment size={20} />, visible: isAdmin || peutSaisirNotes },
        { key: 'professeurs', label: 'Professeurs', icon: <MdPerson size={20} />, visible: isAdmin },
        { key: 'moyenne', label: 'Bulletin', icon: <MdBarChart size={20} />, visible: true },
        { key: 'utilisateurs', label: 'Utilisateurs', icon: <MdGroup size={20} />, visible: isAdmin },
        { key: 'logs', label: 'Impressions', icon: <MdPrint size={20} />, visible: isAdmin },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>

            {/* Sidebar */}
            <div style={{
                width: sidebarOuverte ? '250px' : '60px',
                background: 'linear-gradient(180deg, #1a237e, #283593)',
                color: 'white',
                transition: 'width 0.3s',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                height: '100vh',
                zIndex: 100,
                overflowX: 'hidden'
            }}>
                {/* Logo */}
                <div style={{ padding: '20px 15px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <MdWbSunny size={28} style={{ flexShrink: 0, color: '#ffcc02' }} />
                    {sidebarOuverte && (
                        <div>
                            <div style={{ fontWeight: 'bold', fontSize: '13px' }}>Soleil Brillant</div>
                            <div style={{ fontSize: '11px', opacity: 0.7 }}>Gestion des Notes</div>
                        </div>
                    )}
                </div>
                {/* Année scolaire */}
                {sidebarOuverte && (
                    <div style={{ padding: '10px 15px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        <div style={{ fontSize: '11px', opacity: 0.7, marginBottom: '5px' }}>Année Scolaire</div>
                        <select value={anneeSelectionnee || ''} onChange={handleAnneeChange}
                                style={{ width: '100%', padding: '5px', borderRadius: '5px', border: 'none', fontSize: '12px', fontWeight: 'bold' }}>
                            <option value="">-- Choisir --</option>
                            {annees.map((a) => (
                                <option key={a.id} value={a.id}>
                                    {a.libelle} {a.active ? '✅' : ''}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Navigation */}
                <nav style={{ flex: 1, padding: '10px 0', overflowY: 'auto' }}>
                    {navItems.filter(item => item.visible).map((item) => (
                        <div key={item.key}
                             onClick={() => setPage(item.key)}
                             style={{
                                 display: 'flex',
                                 alignItems: 'center',
                                 gap: '12px',
                                 padding: '12px 15px',
                                 cursor: 'pointer',
                                 background: page === item.key ? 'rgba(255,255,255,0.2)' : 'transparent',
                                 borderLeft: page === item.key ? '3px solid #ffcc02' : '3px solid transparent',
                                 transition: 'all 0.2s',
                                 whiteSpace: 'nowrap'
                             }}
                             onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                             onMouseOut={(e) => e.currentTarget.style.background = page === item.key ? 'rgba(255,255,255,0.2)' : 'transparent'}
                        >
                            <span style={{ fontSize: '18px', flexShrink: 0 }}>{item.icon}</span>
                            {sidebarOuverte && <span style={{ fontSize: '13px' }}>{item.label}</span>}
                        </div>
                    ))}
                </nav>

                {/* Utilisateur + Déconnexion */}
                <div style={{ padding: '15px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    {sidebarOuverte && (
                        <div style={{ marginBottom: '10px', fontSize: '12px' }}>
                            <div style={{ fontWeight: 'bold' }}>👤 {utilisateur.nom} {utilisateur.prenom}</div>
                            <span style={{
                                background: isAdmin ? '#ff6f00' : '#2e7d32',
                                padding: '2px 8px',
                                borderRadius: '10px',
                                fontSize: '11px'
                            }}>
                                {utilisateur.role}
                            </span>
                        </div>
                    )}
                    <button onClick={handleLogout} style={{ width: '100%', background: '#e53935', color: 'white', border: 'none', padding: '8px', borderRadius: '5px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                        <MdLogout size={16} />
                        {sidebarOuverte && 'Déconnexion'}
                    </button>
                </div>
            </div>

            {/* Contenu principal */}
            <div style={{
                marginLeft: sidebarOuverte ? '250px' : '60px',
                flex: 1,
                transition: 'margin-left 0.3s',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {/* Header */}
                <div style={{
                    background: 'white',
                    padding: '12px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    position: 'sticky',
                    top: 0,
                    zIndex: 99
                }}>
                    <button
                        onClick={() => setSidebarOuverte(!sidebarOuverte)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0', display: 'flex' }}>
                        <MdMenu size={24} color="#1a237e" />
                    </button>

                    <h5 style={{ margin: 0, color: '#1a237e' }}>
                        {navItems.find(i => i.key === page)?.icon} {navItems.find(i => i.key === page)?.label}
                    </h5>
                </div>

                {/* Page */}
                <div style={{ padding: '20px', flex: 1, background: '#f5f7fa' }}>
                    {page === 'accueil' && <Accueil />}
                    {page === 'annee' && isAdmin && <AnneeScolaire onAnneeChange={chargerAnnees} />}
                    {page === 'classes' && isAdmin && <Classes />}
                    {page === 'eleves' && isAdmin && <Eleves />}
                    {page === 'matieres' && isAdmin && <Matieres />}
                    {page === 'notes' && (isAdmin || peutSaisirNotes) && <Notes />}
                    {page === 'professeurs' && isAdmin && <Professeurs />}
                    {page === 'moyenne' && <Moyenne />}
                    {page === 'utilisateurs' && isAdmin && <Utilisateurs />}
                    {page === 'logs' && isAdmin && <Logs />}
                </div>
            </div>
        </div>
    );
}

export default App;
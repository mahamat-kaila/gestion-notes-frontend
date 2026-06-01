import React, { useState, useEffect } from 'react';
import Classes from './pages/Classes';
import Eleves from './pages/Eleves';
import Matieres from './pages/Matieres';
import Notes from './pages/Notes';
import Professeurs from './pages/Professeurs';
import Moyenne from './pages/Moyenne';
import AnneeScolaire from './pages/AnneeScolaire';
import Accueil from './pages/Accueil';
import { getAnnees, activerAnnee } from './services/api';

function App() {
    const [page, setPage] = useState('accueil');
    const [annees, setAnnees] = useState([]);
    const [anneeSelectionnee, setAnneeSelectionnee] = useState(null);

    useEffect(() => {
        chargerAnnees();
    }, []);
    useEffect(() => {
        document.querySelectorAll('input').forEach(input => {
            input.setAttribute('autocomplete', 'off');
        });
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

    const navItems = [
        { key: 'accueil', label: '🏠 Accueil' },
        { key: 'annee', label: '📅 Année Scolaire' },
        { key: 'classes', label: '🏫 Classes' },
        { key: 'eleves', label: '🎓 Élèves' },
        { key: 'matieres', label: '📚 Matières' },
        { key: 'notes', label: '📝 Notes' },
        { key: 'professeurs', label: '👨‍🏫 Professeurs' },
        { key: 'moyenne', label: '📊 Bulletin' },
    ];

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', minHeight: '100vh', background: '#f5f5f5' }}>

            {/* Header */}
            <div style={{ background: '#1a237e', color: 'white', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '24px' }}>☀️</span>
                    <div>
                        <div style={{ fontWeight: 'bold', fontSize: '16px' }}>Complexe Scolaire Soleil Brillant</div>
                        <div style={{ fontSize: '12px', opacity: 0.8 }}>Système de Gestion des Notes</div>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <label style={{ fontSize: '13px' }}>Année Scolaire :</label>
                    <select value={anneeSelectionnee || ''} onChange={handleAnneeChange}
                            style={{ padding: '5px 10px', borderRadius: '5px', border: 'none', fontWeight: 'bold' }}>
                        <option value="">-- Choisir --</option>
                        {annees.map((a) => (
                            <option key={a.id} value={a.id}>
                                {a.libelle} {a.active ? '✅' : ''}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Navigation */}
            <div style={{ background: '#283593', display: 'flex', flexWrap: 'wrap', padding: '0 10px' }}>
                {navItems.map((item) => (
                    <button key={item.key} onClick={() => setPage(item.key)}
                            style={{
                                background: page === item.key ? '#ff6f00' : 'transparent',
                                color: 'white',
                                border: 'none',
                                padding: '12px 16px',
                                cursor: 'pointer',
                                fontSize: '13px',
                                fontWeight: page === item.key ? 'bold' : 'normal',
                                borderBottom: page === item.key ? '3px solid #ffcc02' : '3px solid transparent',
                            }}>
                        {item.label}
                    </button>
                ))}
            </div>

            {/* Contenu */}
            <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
                {page === 'accueil' && <Accueil />}
                {page === 'annee' && <AnneeScolaire onAnneeChange={chargerAnnees} />}
                {page === 'classes' && <Classes />}
                {page === 'eleves' && <Eleves />}
                {page === 'matieres' && <Matieres />}
                {page === 'notes' && <Notes />}
                {page === 'professeurs' && <Professeurs />}
                {page === 'moyenne' && <Moyenne />}
            </div>
        </div>
    );
}

export default App;
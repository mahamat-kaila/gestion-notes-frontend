import React, { useState, useEffect } from 'react';
import Classes from './pages/Classes';
import Eleves from './pages/Eleves';
import Matieres from './pages/Matieres';
import Notes from './pages/Notes';
import Professeurs from './pages/Professeurs';
import Moyenne from './pages/Moyenne';
import AnneeScolaire from './pages/AnneeScolaire';
import { getAnnees, activerAnnee } from './services/api';
import Accueil from './pages/Accueil';

function App() {
    const [page, setPage] = useState('accueil');
    const [annees, setAnnees] = useState([]);
    const [anneeSelectionnee, setAnneeSelectionnee] = useState(null);

    useEffect(() => {
        chargerAnnees();
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

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Gestion des Notes</h1>
                <div>
                    <label><strong>Année Scolaire : </strong></label>
                    <select value={anneeSelectionnee || ''} onChange={handleAnneeChange} style={{ padding: '5px', fontSize: '14px', fontWeight: 'bold' }}>
                        <option value="">-- Choisir --</option>
                        {annees.map((a) => (
                            <option key={a.id} value={a.id}>
                                {a.libelle} {a.active ? '✅' : ''}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <nav style={{ marginBottom: '20px' }}>
                <button onClick={() => setPage('accueil')} style={{ marginRight: '10px' }}>
                    🏠 Accueil
                </button>
                <button onClick={() => setPage('annee')} style={{ marginRight: '10px' }}>
                    Année Scolaire
                </button>
                <button onClick={() => setPage('classes')} style={{ marginRight: '10px' }}>
                    Classes
                </button>
                <button onClick={() => setPage('eleves')} style={{ marginRight: '10px' }}>
                    Élèves
                </button>
                <button onClick={() => setPage('matieres')} style={{ marginRight: '10px' }}>
                    Matières
                </button>
                <button onClick={() => setPage('notes')} style={{ marginRight: '10px' }}>
                    Notes
                </button>
                <button onClick={() => setPage('professeurs')} style={{ marginRight: '10px' }}>
                    Professeurs
                </button>
                <button onClick={() => setPage('moyenne')} style={{ marginRight: '10px' }}>
                    Bulletin
                </button>
            </nav>

            {page === 'annee' && <AnneeScolaire onAnneeChange={chargerAnnees} />}
            {page === 'classes' && <Classes />}
            {page === 'eleves' && <Eleves />}
            {page === 'matieres' && <Matieres />}
            {page === 'notes' && <Notes />}
            {page === 'professeurs' && <Professeurs />}
            {page === 'moyenne' && <Moyenne />}
            {page === 'accueil' && <Accueil />}
        </div>
    );
}

export default App;
import React, { useState } from 'react';
import Classes from './pages/Classes';
import Eleves from './pages/Eleves';
import Matieres from './pages/Matieres';
import Notes from './pages/Notes';
import Professeurs from './pages/Professeurs';
import Moyenne from './pages/Moyenne';

function App() {
    const [page, setPage] = useState('classes');

    return (
        <div style={{ padding: '20px' }}>
            <h1>Gestion des Notes</h1>

            <nav style={{ marginBottom: '20px' }}>
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

            {page === 'classes' && <Classes />}
            {page === 'eleves' && <Eleves />}
            {page === 'matieres' && <Matieres />}
            {page === 'notes' && <Notes />}
            {page === 'professeurs' && <Professeurs />}
            {page === 'moyenne' && <Moyenne />}
        </div>
    );
}

export default App;
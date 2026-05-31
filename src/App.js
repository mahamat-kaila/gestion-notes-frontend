import React, { useState } from 'react';
import Eleves from './pages/Eleves';
import Matieres from './pages/Matieres';
import Classes from './pages/Classes';

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
            </nav>

            {page === 'classes' && <Classes />}
            {page === 'eleves' && <Eleves />}
            {page === 'matieres' && <Matieres />}
        </div>
    );
}

export default App;
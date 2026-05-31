import React, { useState, useEffect } from 'react';
import { getEleves, getMatieres, createNote, getNotesByEleve, deleteNote, updateNote, getAffectationsByClasse, getClasses } from '../services/api';

function Notes() {
    const [classes, setClasses] = useState([]);
    const [matieres, setMatieres] = useState([]);
    const [eleves, setEleves] = useState([]);
    const [affectations, setAffectations] = useState([]);
    const [classeSelectionnee, setClasseSelectionnee] = useState('');
    const [trimestreSelectionne, setTrimestreSelectionne] = useState('');
    const [matiereSelectionnee, setMatiereSelectionnee] = useState(null);
    const [notesEleves, setNotesEleves] = useState({});
    const [message, setMessage] = useState('');

    useEffect(() => {
        chargerClasses();
        chargerMatieres();
    }, []);

    const chargerClasses = async () => {
        const response = await getClasses();
        setClasses(response.data);
    };

    const chargerMatieres = async () => {
        const response = await getMatieres();
        setMatieres(response.data);
    };

    const handleClasseChange = async (e) => {
        const classeId = e.target.value;
        setClasseSelectionnee(classeId);
        setMatiereSelectionnee(null);
        setEleves([]);
        setNotesEleves({});

        if (classeId) {
            const affResponse = await getAffectationsByClasse(classeId);
            setAffectations(affResponse.data);
        }
    };

    const handleMatiereChange = async (e) => {
        const matiereId = e.target.value;
        const matiere = matieres.find((m) => m.id === parseInt(matiereId));
        setMatiereSelectionnee(matiere);
        setNotesEleves({});

        if (classeSelectionnee && matiereId)  {
            // Charger les élèves de la classe
            const elevesResponse = await getEleves();
            const elevesClasse = elevesResponse.data.filter(
                (e) => e.classe && e.classe.id === parseInt(classeSelectionnee)
            );
            setEleves(elevesClasse);

            // Charger les notes existantes pour chaque élève
            const notesTemp = {};
            for (const eleve of elevesClasse) {
                const notesResponse = await getNotesByEleve(eleve.id);
                const noteExistante = notesResponse.data.find(
                    (n) => n.trimestre === trimestreSelectionne && n.matiere && n.matiere.id === parseInt(matiereId)
                );
                notesTemp[eleve.id] = noteExistante || {
                    devoir1: '',
                    devoir2: '',
                    composition: '',
                    noteUnique: '',
                    eleve: { id: eleve.id },
                    matiere: { id: parseInt(matiereId) },
                    trimestre: trimestreSelectionne,
                    dateNote: new Date().toISOString().split('T')[0],
                };
            }
            setNotesEleves(notesTemp);
        }
    };

    const handleNoteChange = (eleveId, champ, valeur) => {
        setNotesEleves((prev) => ({
            ...prev,
            [eleveId]: { ...prev[eleveId], [champ]: valeur },
        }));
    };

    const handleSaveAll = async () => {
        try {
            for (const eleveId of Object.keys(notesEleves)) {
                const note = notesEleves[eleveId];
                if (note.id) {
                    await updateNote(note.id, note);
                } else {
                    await createNote(note);
                }
            }
            setMessage('✅ Notes enregistrées avec succès !');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('❌ Erreur lors de l\'enregistrement !');
        }
    };

    const isConduite = matiereSelectionnee && matiereSelectionnee.nom === 'Conduite';

    return (
        <div>
            <h2>Saisie des Notes</h2>

            {/* Étape 1 */}
            <div style={{ marginBottom: '15px' }}>
                <label><strong>Trimestre : </strong></label>
                <select onChange={(e) => { setTrimestreSelectionne(e.target.value); setEleves([]); setNotesEleves({}); }} value={trimestreSelectionne}>
                    <option value="">-- Choisir un trimestre --</option>
                    <option value="TRIMESTRE_1">Trimestre 1</option>
                    <option value="TRIMESTRE_2">Trimestre 2</option>
                    <option value="TRIMESTRE_3">Trimestre 3</option>
                </select>
            </div>

            {/* Étape 2 */}
            {trimestreSelectionne && (
                <div style={{ marginBottom: '15px' }}>
                    <label><strong>Classe : </strong></label>
                    <select onChange={handleClasseChange} value={classeSelectionnee}>
                        <option value="">-- Choisir une classe --</option>
                        {classes.map((c) => (
                            <option key={c.id} value={c.id}>{c.nom}</option>
                        ))}
                    </select>
                </div>
            )}

            {/* Étape 3 */}
            {trimestreSelectionne && classeSelectionnee && (
                <div style={{ marginBottom: '15px' }}>
                    <label><strong>Matière : </strong></label>
                    <select onChange={handleMatiereChange} value={matiereSelectionnee ? matiereSelectionnee.id : ''}>
                        <option value="">-- Choisir une matière --</option>
                        {affectations.map((a) => (
                            <option key={a.matiere.id} value={a.matiere.id}>
                                {a.matiere.nom} (coeff {a.matiere.coefficient})
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Liste des élèves */}
            {eleves.length > 0 && matiereSelectionnee && (
                <div>
                    <h3>Notes — {matiereSelectionnee.nom} — {trimestreSelectionne.replace('_', ' ')}</h3>
                    {message && <p style={{ color: message.includes('✅') ? 'green' : 'red' }}>{message}</p>}
                    <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                        <tr style={{ background: '#f0f0f0' }}>
                            <th>Matricule</th>
                            <th>Nom</th>
                            <th>Prénom</th>
                            {isConduite ? (
                                <th>Note Conduite /20</th>
                            ) : (
                                <>
                                    <th>Devoir 1 /20</th>
                                    <th>Devoir 2 /20</th>
                                    <th>Composition /20</th>
                                </>
                            )}
                        </tr>
                        </thead>
                        <tbody>
                        {eleves.map((eleve) => (
                            <tr key={eleve.id}>
                                <td>{eleve.matricule}</td>
                                <td>{eleve.nom}</td>
                                <td>{eleve.prenom}</td>
                                {isConduite ? (
                                    <td>
                                        <input
                                            type="number" step="0.25" min="0" max="20"
                                            value={notesEleves[eleve.id]?.noteUnique || ''}
                                            onChange={(e) => handleNoteChange(eleve.id, 'noteUnique', e.target.value)}
                                            style={{ width: '60px' }}
                                        />
                                    </td>
                                ) : (
                                    <>
                                        <td>
                                            <input
                                                type="number" step="0.25" min="0" max="20"
                                                value={notesEleves[eleve.id]?.devoir1 || ''}
                                                onChange={(e) => handleNoteChange(eleve.id, 'devoir1', e.target.value)}
                                                style={{ width: '60px' }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number" step="0.25" min="0" max="20"
                                                value={notesEleves[eleve.id]?.devoir2 || ''}
                                                onChange={(e) => handleNoteChange(eleve.id, 'devoir2', e.target.value)}
                                                style={{ width: '60px' }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number" step="0.25" min="0" max="20"
                                                value={notesEleves[eleve.id]?.composition || ''}
                                                onChange={(e) => handleNoteChange(eleve.id, 'composition', e.target.value)}
                                                style={{ width: '60px' }}
                                            />
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <br />
                    <button onClick={handleSaveAll} style={{ background: 'green', color: 'white', padding: '10px 20px' }}>
                        Enregistrer toutes les notes
                    </button>
                </div>
            )}
        </div>
    );
}

export default Notes;
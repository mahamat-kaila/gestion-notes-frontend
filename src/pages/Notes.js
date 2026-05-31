import React, { useState, useEffect } from 'react';
import { getEleves, getMatieres, createNote, getNotesByEleve, deleteNote, updateNote, getAffectationsByClasse } from '../services/api';

function Notes() {
    const [eleves, setEleves] = useState([]);
    const [matieres, setMatieres] = useState([]);
    const [notes, setNotes] = useState([]);
    const [matiereSelectionnee, setMatiereSelectionnee] = useState(null);
    const [eleveSelectionne, setEleveSelectionne] = useState('');
    const [affectations, setAffectations] = useState([]);
    const [trimestreSelectionne, setTrimestreSelectionne] = useState('');
    const [noteEditee, setNoteEditee] = useState(null);
    const [note, setNote] = useState({
        devoir1: '',
        devoir2: '',
        composition: '',
        dateNote: new Date().toISOString().split('T')[0],
        trimestre: '',
        eleve: null,
        matiere: null,
    });

    useEffect(() => {
        chargerEleves();
        chargerMatieres();
    }, []);

    const chargerEleves = async () => {
        const response = await getEleves();
        setEleves(response.data);
    };

    const chargerMatieres = async () => {
        const response = await getMatieres();
        setMatieres(response.data);
    };

    const chargerNotes = async (eleveId) => {
        const response = await getNotesByEleve(eleveId);
        setNotes(response.data);
    };

    const handleEleveChange = async (e) => {
        const eleveId = e.target.value;
        setEleveSelectionne(eleveId);
        if (eleveId) {
            chargerNotes(eleveId);
            const eleve = eleves.find((el) => el.id === parseInt(eleveId));
            if (eleve && eleve.classe) {
                const affResponse = await getAffectationsByClasse(eleve.classe.id);
                setAffectations(affResponse.data);
            }
        }
        setNote({ ...note, eleve: { id: eleveId } });
    };

    const handleTrimestreChange = (e) => {
        setTrimestreSelectionne(e.target.value);
        setNote({ ...note, trimestre: e.target.value });
    };

    const handleChange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value });
    };

    const handleMatiereChange = (e) => {
        const matiereId = e.target.value;
        const matiere = affectations.find((a) => a.matiere.id === parseInt(matiereId));
        setMatiereSelectionnee(matiere ? matiere.matiere : null);
        setNote({ ...note, matiere: { id: matiereId } });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createNote(note);
        chargerNotes(eleveSelectionne);
        setNote({
            ...note,
            devoir1: '',
            devoir2: '',
            composition: '',
            dateNote: new Date().toISOString().split('T')[0],
            matiere: null,
        });
    };

    const supprimerNote = async (id) => {
        if (window.confirm('Voulez-vous vraiment supprimer cette note ?')) {
            await deleteNote(id);
            chargerNotes(eleveSelectionne);
        }
    };

    const handleEdit = (note) => {
        setNoteEditee({ ...note, matiere: note.matiere, eleve: note.eleve });
    };

    const handleEditChange = (e) => {
        setNoteEditee({ ...noteEditee, [e.target.name]: e.target.value });
    };

    const handleEditMatiereChange = (e) => {
        setNoteEditee({ ...noteEditee, matiere: { id: e.target.value } });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateNote(noteEditee.id, noteEditee);
            setNoteEditee(null);
            chargerNotes(eleveSelectionne);
        } catch (error) {
            console.error('Erreur modification note', error);
        }
    };

    return (
        <div>
            <h2>Gestion des Notes</h2>

            <h3>Étape 1 — Choisir l'élève et le trimestre</h3>
            <select onChange={handleEleveChange} value={eleveSelectionne}>
                <option value="">-- Choisir un élève --</option>
                {eleves.map((e) => (
                    <option key={e.id} value={e.id}>
                        {e.nom} {e.prenom} - {e.classe ? e.classe.nom : '-'}
                    </option>
                ))}
            </select>
            <br /><br />
            <select onChange={handleTrimestreChange} value={trimestreSelectionne}>
                <option value="">-- Choisir un trimestre --</option>
                <option value="TRIMESTRE_1">Trimestre 1</option>
                <option value="TRIMESTRE_2">Trimestre 2</option>
                <option value="TRIMESTRE_3">Trimestre 3</option>
            </select>

            {eleveSelectionne && trimestreSelectionne && (
                <>
                    <h3>Étape 2 — Ajouter une note</h3>
                    <form onSubmit={handleSubmit}>
                        <select name="matiere" onChange={handleMatiereChange} required>
                            <option value="">-- Choisir une matière --</option>
                            {affectations
                                .filter((a) => !notes
                                    .filter((n) => n.trimestre === trimestreSelectionne)
                                    .some((n) => n.matiere && n.matiere.id === a.matiere.id)
                                )
                                .map((a) => (
                                    <option key={a.matiere.id} value={a.matiere.id}>
                                        {a.matiere.nom} (coeff {a.matiere.coefficient})
                                    </option>
                                ))
                            }
                        </select><br />

                        {matiereSelectionnee && matiereSelectionnee.nom === 'Conduite' ? (
                            <>
                                <input name="noteUnique" type="number" step="0.25" min="0" max="20" placeholder="Note de conduite /20" value={note.noteUnique || ''} onChange={handleChange} required /><br />
                            </>
                        ) : (
                            <>
                                <input name="devoir1" type="number" step="0.25" min="0" max="20" placeholder="Devoir 1 /20" value={note.devoir1 || ''} onChange={handleChange} required /><br />
                                <input name="devoir2" type="number" step="0.25" min="0" max="20" placeholder="Devoir 2 /20" value={note.devoir2 || ''} onChange={handleChange} required /><br />
                                <input name="composition" type="number" step="0.25" min="0" max="20" placeholder="Composition /20" value={note.composition || ''} onChange={handleChange} required /><br />
                            </>
                        )}
                        <input name="dateNote" type="date" value={note.dateNote} onChange={handleChange} required /><br />
                        <button type="submit">Ajouter la note</button>
                    </form>

                    {noteEditee && (
                        <div style={{ border: '1px solid orange', padding: '10px', marginBottom: '10px' }}>
                            <h3>Modifier la note</h3>
                            <form onSubmit={handleEditSubmit}>
                                <select onChange={handleEditMatiereChange} defaultValue={noteEditee.matiere ? noteEditee.matiere.id : ''} required>
                                    <option value="">-- Choisir une matière --</option>
                                    {matieres.map((m) => (
                                        <option key={m.id} value={m.id}>{m.nom}</option>
                                    ))}
                                </select><br />
                                <input name="devoir1" type="number" step="0.25" min="0" max="20" placeholder="Devoir 1 /20" value={noteEditee.devoir1 || ''} onChange={handleEditChange} required /><br />
                                <input name="devoir2" type="number" step="0.25" min="0" max="20" placeholder="Devoir 2 /20" value={noteEditee.devoir2 || ''} onChange={handleEditChange} required /><br />
                                <input name="composition" type="number" step="0.25" min="0" max="20" placeholder="Composition /20" value={noteEditee.composition || ''} onChange={handleEditChange} required /><br />
                                <input name="dateNote" type="date" value={noteEditee.dateNote} onChange={handleEditChange} required /><br />
                                <button type="submit">Enregistrer</button>
                                <button type="button" onClick={() => setNoteEditee(null)} style={{ marginLeft: '10px' }}>Annuler</button>
                            </form>
                        </div>
                    )}

                    <h3>Notes du trimestre</h3>
                    <table border="1">
                        <thead>
                        <tr>
                            <th>Matière</th>
                            <th>Devoir 1</th>
                            <th>Devoir 2</th>
                            <th>Moy. Devoirs</th>
                            <th>Composition</th>
                            <th>Moy. Générale</th>
                            <th>Appréciation</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {notes
                            .filter((n) => n.trimestre === trimestreSelectionne)
                            .map((n) => (
                                <tr key={n.id}>
                                    <td>{n.matiere ? n.matiere.nom : '-'}</td>
                                    <td>{n.devoir1}</td>
                                    <td>{n.devoir2}</td>
                                    <td>{n.moyenneDevoirs}</td>
                                    <td>{n.composition}</td>
                                    <td>{n.moyenneGenerale}</td>
                                    <td>{n.appreciation}</td>
                                    <td>
                                        <button onClick={() => handleEdit(n)}>Modifier</button>
                                        <button onClick={() => supprimerNote(n.id)} style={{ marginLeft: '5px' }}>Supprimer</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
}

export default Notes;
import React, { useState, useEffect } from 'react';
import { getEleves, getMoyenne, getNotesByEleve, getAffectationsByClasse, getRang } from '../services/api';

function Moyenne() {
    const [eleves, setEleves] = useState([]);
    const [eleveSelectionne, setEleveSelectionne] = useState('');
    const [trimestreSelectionne, setTrimestreSelectionne] = useState('');
    const [moyenne, setMoyenne] = useState(null);
    const [rang, setRang] = useState(null);
    const [notes, setNotes] = useState([]);
    const [affectations, setAffectations] = useState([]);

    useEffect(() => {
        chargerEleves();
    }, []);

    const chargerEleves = async () => {
        const response = await getEleves();
        setEleves(response.data);
    };

    const handleEleveChange = async (e) => {
        const eleveId = e.target.value;
        setEleveSelectionne(eleveId);
        setMoyenne(null);
        setNotes([]);
        if (eleveId) {
            const eleve = eleves.find((el) => el.id === parseInt(eleveId));
            if (eleve && eleve.classe) {
                const affResponse = await getAffectationsByClasse(eleve.classe.id);
                setAffectations(affResponse.data);
            }
        }
    };

    const handleTrimestreChange = (e) => {
        setTrimestreSelectionne(e.target.value);
        setMoyenne(null);
    };

    const calculerMoyenne = async () => {
        if (!eleveSelectionne || !trimestreSelectionne) return;
        try {
            const moyenneResponse = await getMoyenne(eleveSelectionne, trimestreSelectionne);
            setMoyenne(moyenneResponse.data);
            const notesResponse = await getNotesByEleve(eleveSelectionne);
            setNotes(notesResponse.data.filter((n) => n.trimestre === trimestreSelectionne));
            const eleve = eleves.find((e) => e.id === parseInt(eleveSelectionne));
            if (eleve && eleve.classe) {
                const rangResponse = await getRang(eleveSelectionne, trimestreSelectionne, eleve.classe.id);
                setRang(rangResponse.data);
            }
        } catch (error) {
            console.error('Erreur calcul moyenne', error);
        }
    };

    const getMention = (moy) => {
        if (moy >= 16) return { texte: 'Très Bien', couleur: 'green' };
        if (moy >= 14) return { texte: 'Bien', couleur: 'blue' };
        if (moy >= 12) return { texte: 'Assez Bien', couleur: 'orange' };
        if (moy >= 10) return { texte: 'Passable', couleur: 'gray' };
        return { texte: 'Insuffisant', couleur: 'red' };
    };

    const eleveInfo = eleves.find((e) => e.id === parseInt(eleveSelectionne));

    const sommeCoeffMoyenne = notes.reduce((acc, n) => {
        if (n.moyenneGenerale && n.matiere) return acc + n.moyenneGenerale * n.matiere.coefficient;
        return acc;
    }, 0);

    const sommeCoeff = notes.reduce((acc, n) => {
        if (n.moyenneGenerale && n.matiere) return acc + n.matiere.coefficient;
        return acc;
    }, 0);

    return (
        <div>
            <h2>Bulletin de Notes</h2>

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
            <br /><br />

            <button onClick={calculerMoyenne} disabled={!eleveSelectionne || !trimestreSelectionne}>
                Générer le bulletin
            </button>

            {moyenne !== null && eleveInfo && (
                <div style={{ marginTop: '20px', border: '1px solid black', padding: '15px' }}>
                    <h3>Bulletin — {trimestreSelectionne.replace('_', ' ')}</h3>
                    <p><strong>Élève :</strong> {eleveInfo.nom} {eleveInfo.prenom}</p>
                    <p><strong>Matricule :</strong> {eleveInfo.matricule}</p>
                    <p><strong>Classe :</strong> {eleveInfo.classe ? eleveInfo.classe.nom : '-'}</p>
                    <p><strong>Rang :</strong> {rang !== null ? `${rang}e` : '-'}</p>

                    <table border="1" style={{ width: '100%', marginTop: '10px', borderCollapse: 'collapse' }}>
                        <thead>
                        <tr style={{ background: '#f0f0f0' }}>
                            <th>Matière</th>
                            <th>Moy. Devoirs</th>
                            <th>Moy. Composition</th>
                            <th>Moy. Générale</th>
                            <th>Coeff</th>
                            <th>Coeff × Moy</th>
                            <th>Appréciation</th>
                        </tr>
                        </thead>
                        <tbody>
                        {['Littéraire', 'Scientifique', 'Complémentaire'].map((groupe) => {
                            const affectationsGroupe = affectations.filter(
                                (a) => a.matiere.groupe === groupe
                            );
                            if (affectationsGroupe.length === 0) return null;

                            const sommeCoeffGroupe = affectationsGroupe.reduce((acc, a) => {
                                const note = notes.find((n) => n.matiere && n.matiere.id === a.matiere.id);
                                if (note && note.moyenneGenerale) return acc + a.matiere.coefficient;
                                return acc;
                            }, 0);

                            const sommeMoyGroupe = affectationsGroupe.reduce((acc, a) => {
                                const note = notes.find((n) => n.matiere && n.matiere.id === a.matiere.id);
                                if (note && note.moyenneGenerale) return acc + note.moyenneGenerale * a.matiere.coefficient;
                                return acc;
                            }, 0);

                            const moyenneGroupe = sommeCoeffGroupe > 0 ? (sommeMoyGroupe / sommeCoeffGroupe).toFixed(2) : '------';

                            return (
                                <React.Fragment key={groupe}>
                                    {affectationsGroupe.map((a) => {
                                        const note = notes.find((n) => n.matiere && n.matiere.id === a.matiere.id);
                                        return (
                                            <tr key={a.id}>
                                                <td>{a.matiere.nom}</td>
                                                <td>{note ? note.moyenneDevoirs : '------'}</td>
                                                <td>{note ? (note.noteUnique != null ? note.noteUnique : note.composition) : '------'}</td>
                                                <td>{note ? note.moyenneGenerale : '------'}</td>
                                                <td>{a.matiere.coefficient}</td>
                                                <td>{note && note.moyenneGenerale ? (note.moyenneGenerale * a.matiere.coefficient).toFixed(2) : '------'}</td>
                                                <td style={{ color: note && note.moyenneGenerale >= 10 ? 'green' : 'red' }}>
                                                    {note ? note.appreciation : '------'}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    <tr style={{ fontWeight: 'bold', background: '#e0e0e0' }}>
                                        <td colSpan="3">Moyenne des Matières {groupe}s</td>
                                        <td>{moyenneGroupe}</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                </React.Fragment>
                            );
                        })}
                        <tr style={{ fontWeight: 'bold', background: '#f0f0f0' }}>
                            <td colSpan="4" style={{ textAlign: 'right' }}>Total</td>
                            <td>{sommeCoeff}</td>
                            <td>{sommeCoeffMoyenne.toFixed(2)}</td>
                            <td></td>
                        </tr>
                        </tbody>
                    </table>

                    <p style={{ marginTop: '10px', fontSize: '18px' }}>
                        <strong>Moyenne générale : </strong>
                        <span style={{ color: getMention(moyenne).couleur, fontWeight: 'bold' }}>
                            {moyenne}/20
                        </span>
                    </p>
                    <p>
                        <strong>Mention : </strong>
                        <span style={{ color: getMention(moyenne).couleur, fontWeight: 'bold' }}>
                            {getMention(moyenne).texte}
                        </span>
                    </p>
                </div>
            )}
        </div>
    );
}

export default Moyenne;
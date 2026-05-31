import React, { useState, useEffect } from 'react';
import { getEleves, getMoyenne, getNotesByEleve, getAffectationsByClasse } from '../services/api';

function Moyenne() {
    const [eleves, setEleves] = useState([]);
    const [eleveSelectionne, setEleveSelectionne] = useState('');
    const [trimestreSelectionne, setTrimestreSelectionne] = useState('');
    const [moyenne, setMoyenne] = useState(null);
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
        } catch (error) {
            console.error('Erreur calcul moyenne', error);
        }
    };

    const getMention = (moyenne) => {
        if (moyenne >= 16) return { texte: 'Très Bien', couleur: 'green' };
        if (moyenne >= 14) return { texte: 'Bien', couleur: 'blue' };
        if (moyenne >= 12) return { texte: 'Assez Bien', couleur: 'orange' };
        if (moyenne >= 10) return { texte: 'Passable', couleur: 'gray' };
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
                    <p><strong>Âge :</strong> {eleveInfo.age} ans</p>

                    <table border="1" style={{ width: '100%', marginTop: '10px' }}>
                        <thead>
                        <tr>
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
                        {affectations.map((a) => {
                            const note = notes.find((n) => n.matiere && n.matiere.id === a.matiere.id);
                            return (
                                <tr key={a.id}>
                                    <td>{a.matiere.nom}</td>
                                    <td>{note ? note.moyenneDevoirs : '-'}</td>
                                    <td>{note ? (note.noteUnique !== null && note.noteUnique !== undefined ? note.noteUnique : note.composition) : '-'}</td>
                                    <td>{note ? note.moyenneGenerale : '-'}</td>
                                    <td>{a.matiere.coefficient}</td>
                                    <td>{note && note.moyenneGenerale ? (note.moyenneGenerale * a.matiere.coefficient).toFixed(2) : '-'}</td>
                                    <td style={{ color: note && note.moyenneGenerale >= 10 ? 'green' : 'red' }}>
                                        {note ? note.appreciation : '-'}
                                    </td>
                                </tr>
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
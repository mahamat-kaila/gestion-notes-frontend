import React, { useState, useEffect } from 'react';
import { getEleves, getMoyenne, getNotesByEleve, getAffectationsByClasse, getRang } from '../services/api';
import logo from '../assets/logo.jpg';

function Moyenne() {
    const [moyenneTrim1, setMoyenneTrim1] = useState(null);
    const [moyenneTrim2, setMoyenneTrim2] = useState(null);
    const [moyenneTrim3, setMoyenneTrim3] = useState(null);
    const [eleves, setEleves] = useState([]);
    const [eleveSelectionne, setEleveSelectionne] = useState('');
    const [trimestreSelectionne, setTrimestreSelectionne] = useState('');
    const [moyenne, setMoyenne] = useState(null);
    const [rang, setRang] = useState(null);
    const [notes, setNotes] = useState([]);
    const [affectations, setAffectations] = useState([]);
    const [absences, setAbsences] = useState(0);
    const [retards, setRetards] = useState(0);
    const [decision, setDecision] = useState('');

    useEffect(() => { chargerEleves(); }, []);

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
            const moy1Response = await getMoyenne(eleveSelectionne, 'TRIMESTRE_1');
            setMoyenneTrim1(moy1Response.data);
            const moy2Response = await getMoyenne(eleveSelectionne, 'TRIMESTRE_2');
            setMoyenneTrim2(moy2Response.data);
            const moy3Response = await getMoyenne(eleveSelectionne, 'TRIMESTRE_3');
            setMoyenneTrim3(moy3Response.data);
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

    const chiffreRomain = trimestreSelectionne === 'TRIMESTRE_1' ? 'I' : trimestreSelectionne === 'TRIMESTRE_2' ? 'II' : 'III';

    return (
        <div>
            <style>{`
    @media print {
        body * { visibility: hidden; }
        .bulletin, .bulletin * { visibility: visible; }
        .bulletin {
            position: absolute;
            left: 50%;
            top: 0;
            transform: translateX(-50%);
            width: 200mm;
            min-height: 287mm;
            padding: 8mm;
            font-size: 12px;
            box-sizing: border-box;
        }
        .bulletin table {
            font-size: 11px;
            width: 100%;
        }
        .bulletin td, .bulletin th {
            padding: 6px 5px;
        }
        .bulletin img {
            width: 90px !important;
            height: 90px !important;
        }
        .bulletin h3 {
            font-size: 15px;
        }
        .bulletin p {
            font-size: 12px;
            margin: 3px 0 !important;
        }
        @page {
            size: A4 portrait;
            margin: 5mm;
        }
    }
`}</style>

            <div className="no-print">
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

                <div style={{ marginTop: '10px' }}>
                    <label><strong>Absences :</strong></label>
                    <input type="number" min="0" value={absences} onChange={(e) => setAbsences(e.target.value)} style={{ width: '60px', marginLeft: '10px', marginRight: '20px' }} />
                    <label><strong>Retards :</strong></label>
                    <input type="number" min="0" value={retards} onChange={(e) => setRetards(e.target.value)} style={{ width: '60px', marginLeft: '10px' }} />
                </div>

                <div style={{ marginTop: '10px' }}>
                    <label><strong>Décision du conseil :</strong></label><br />
                    <select value={decision} onChange={(e) => setDecision(e.target.value)} style={{ marginTop: '5px', width: '300px' }}>
                        <option value="">-- Choisir une décision --</option>
                        <optgroup label="Admission">
                            <option value="Admis(e)">Admis(e)</option>
                            <option value="Admis(e) en Travaux Dirigés">Admis(e) en Travaux Dirigés</option>
                            <option value="Passage en classe supérieure">Passage en classe supérieure</option>
                            <option value="Passage en classe supérieure avec félicitations">Passage en classe supérieure avec félicitations</option>
                            <option value="Passage en classe supérieure avec encouragements">Passage en classe supérieure avec encouragements</option>
                        </optgroup>
                        <optgroup label="Progression">
                            <option value="Bon travail, continuez vos efforts">Bon travail, continuez vos efforts</option>
                            <option value="Très bonne progression, félicitations">Très bonne progression, félicitations</option>
                            <option value="Bonne progression, encouragements">Bonne progression, encouragements</option>
                            <option value="Des efforts remarquables, continuez">Des efforts remarquables, continuez</option>
                        </optgroup>
                        <optgroup label="Régression">
                            <option value="Baisse de niveau, plus d'efforts nécessaires">Baisse de niveau, plus d'efforts nécessaires</option>
                            <option value="Régression inquiétante, travaillez davantage">Régression inquiétante, travaillez davantage</option>
                            <option value="Résultats insuffisants, des efforts s'imposent">Résultats insuffisants, des efforts s'imposent</option>
                        </optgroup>
                        <optgroup label="Conduite">
                            <option value="Bonne conduite, continuez">Bonne conduite, continuez</option>
                            <option value="Conduite satisfaisante">Conduite satisfaisante</option>
                            <option value="Conduite à améliorer">Conduite à améliorer</option>
                            <option value="Conduite insuffisante, avertissement">Conduite insuffisante, avertissement</option>
                        </optgroup>
                        <optgroup label="Redoublement et Exclusion">
                            <option value="Redoublant(e)">Redoublant(e)</option>
                            <option value="Redoublant(e) avec avertissement">Redoublant(e) avec avertissement</option>
                            <option value="Exclu(e)">Exclu(e)</option>
                            <option value="Exclu(e) pour indiscipline">Exclu(e) pour indiscipline</option>
                        </optgroup>
                    </select>
                </div>
                <br />

                <button onClick={calculerMoyenne} disabled={!eleveSelectionne || !trimestreSelectionne}>
                    Générer le bulletin
                </button>

                {moyenne !== null && eleveInfo && (
                    <button onClick={() => window.print()} style={{ marginLeft: '10px', background: 'blue', color: 'white', padding: '8px 16px' }}>
                        🖨️ Imprimer le bulletin
                    </button>
                )}
            </div>

            {moyenne !== null && eleveInfo && (
                <div className="bulletin" style={{ marginTop: '20px', border: '1px solid black', padding: '15px' }}>
                    {/* En-tête */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '2px solid black', paddingBottom: '10px' }}>
                        <div style={{ fontSize: '12px', width: '30%' }}>
                            <p style={{ margin: '2px' }}>République du Tchad</p>
                            <p style={{ margin: '2px' }}>Unité - Travail - Progrès</p>
                            <br />
                            <p style={{ margin: '2px' }}>Complexe Scolaire Soleil Brillant</p>
                            <p style={{ margin: '2px' }}>B.P. 1425, N'Djamena</p>
                            <p style={{ margin: '2px' }}>Tél : +235 66 78 35 01</p>
                        </div>
                        <div style={{ textAlign: 'center', width: '30%' }}>
                            <img src={logo} alt="Logo" style={{ width: '120px', height: '120px', borderRadius: '50%' }} />
                            <p style={{ fontWeight: 'bold', fontSize: '14px', margin: '5px 0' }}>Complexe Scolaire</p>
                            <p style={{ fontWeight: 'bold', fontSize: '14px', margin: '0' }}>Soleil Brillant</p>
                        </div>
                        <div style={{ fontSize: '12px', width: '30%', textAlign: 'right', direction: 'rtl' }}>
                            <p style={{ margin: '2px' }}>جمهورية تشاد</p>
                            <p style={{ margin: '2px' }}>وحدة - عمل - تقدم</p>
                            <br />
                            <p style={{ margin: '2px' }}>مجمع مدرسي الشمس المشرقة</p>
                            <p style={{ margin: '2px' }}>ص.ب ١٤٢٥، انجمينا</p>
                            <p style={{ margin: '2px' }}>هاتف: 01 35 78 66 235+</p>
                        </div>
                    </div>

                    {/* Titre */}
                    <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                        <h3 style={{ margin: '0' }}>BULLETIN DE NOTES - كشف الدرجات</h3>
                        <p style={{ margin: '5px 0' }}>
                            <strong>Trimestre :</strong> {chiffreRomain}
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <strong style={{ direction: 'rtl' }}>الفترة :</strong> {chiffreRomain}
                        </p>
                    </div>

                    {/* Infos élève */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <p style={{ margin: '2px' }}>
                            Nom et Prénoms : <span style={{ fontWeight: 'bold', fontSize: '18px', textTransform: 'uppercase', marginLeft: '80px' }}>{eleveInfo.nom} {eleveInfo.prenom}</span>
                        </p>
                        <p style={{ margin: '2px', direction: 'rtl', fontWeight: 'bold' }}>الاسم :</p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <p style={{ margin: '2px' }}>Classe : <strong>{eleveInfo.classe ? eleveInfo.classe.nom : '-'}</strong></p>
                        <p style={{ margin: '2px', direction: 'rtl', fontWeight: 'bold' }}>الفصل :</p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <p style={{ margin: '2px' }}>Matricule : <strong>{eleveInfo.matricule}</strong></p>
                        <p style={{ margin: '2px' }}>Année Scolaire : <strong>2025/2026</strong> &nbsp;&nbsp; السنة الدراسية :</p>
                    </div>

                    {/* Tableau */}
                    <table border="1" style={{ width: '100%', marginTop: '10px', borderCollapse: 'collapse' }}>
                        <thead>
                        <tr style={{ background: '#f0f0f0' }}>
                            <th>Matière</th>
                            <th>Moy. Dev.</th>
                            <th>Moy. Comp.</th>
                            <th>Moy. Gén.</th>
                            <th>Coeff</th>
                            <th>Coeff × Moy</th>
                            <th>Appréciations</th>
                        </tr>
                        </thead>
                        <tbody>
                        {['Littéraire', 'Scientifique', 'Complémentaire'].map((groupe) => {
                            const affectationsGroupe = affectations.filter((a) => a.matiere.groupe === groupe);
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
                            <td colSpan="4" style={{ textAlign: 'center' }}>Total</td>
                            <td>{sommeCoeff}</td>
                            <td>{sommeCoeffMoyenne.toFixed(2)}</td>
                            <td></td>
                        </tr>
                        </tbody>
                    </table>

                    {/* Bas du bulletin */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', borderTop: '1px solid black', paddingTop: '10px' }}>
                        <div style={{ width: '35%', fontSize: '13px' }}>
                            <p style={{ margin: '4px 0' }}>
                                Moy. 1er Trimestre : <strong>{moyenneTrim1 > 0 ? `${moyenneTrim1}/20` : '_____ /20'}</strong>
                            </p>
                            <p style={{ margin: '4px 0' }}>
                                Moy. 2ème Trimestre : <strong>{trimestreSelectionne === 'TRIMESTRE_1' ? '_____ /20' : moyenneTrim2 > 0 ? `${moyenneTrim2}/20` : '_____ /20'}</strong>
                            </p>
                            <p style={{ margin: '4px 0' }}>
                                Moy. 3ème Trimestre : <strong>{trimestreSelectionne === 'TRIMESTRE_3' && moyenneTrim3 > 0 ? `${moyenneTrim3}/20` : '_____ /20'}</strong>
                            </p>
                            <p style={{ margin: '4px 0' }}>Rang {chiffreRomain}ème Trimestre : <strong>{rang}e / {eleveInfo.classe ? eleveInfo.classe.effectif : '-'} élèves</strong></p>
                            <br />
                            <p style={{ margin: '4px 0' }}>Moy. Annuelle : <strong>_____ /20</strong></p>
                            <p style={{ margin: '4px 0' }}>Rang : <strong>_____ / {eleveInfo.classe ? eleveInfo.classe.effectif : '-'} élèves</strong></p>
                        </div>

                        <div style={{ width: '30%', fontSize: '15px', textAlign: 'right', direction: 'rtl', marginRight: '50px' }}>
                            <p style={{ margin: '4px 0' }}>متوسط الفترة الأولى</p>
                            <p style={{ margin: '4px 0' }}>متوسط الفترة الثانية</p>
                            <p style={{ margin: '4px 0' }}>متوسط الفترة الثالثة</p>
                            <p style={{ margin: '4px 0' }}>ترتيب الفترة {chiffreRomain}</p>
                            <br />
                            <p style={{ margin: '4px 0' }}>المتوسط السنوي</p>
                            <p style={{ margin: '4px 0' }}>الترتيب السنوي</p>
                        </div>

                        <div style={{ width: '25%', fontSize: '13px', textAlign: 'right' }}>
                            <p style={{ margin: '4px 0' }}>Absences : {absences}</p>
                            <p style={{ margin: '4px 0' }}>Retards : {retards}</p>
                            <br />
                            <p style={{ margin: '4px 0' }}>Le Directeur</p>
                            <br /><br /><br />
                            <p style={{ margin: '4px 0' }}>_________________</p>
                        </div>
                    </div>

                    {decision && (
                        <div style={{ marginTop: '8px', borderTop: '1px solid black', paddingTop: '5px' }}>
                            <p style={{ margin: '2px 0' }}><strong>DÉCISION DU CONSEIL DES PROFESSEURS</strong></p>
                            <p style={{ fontStyle: 'italic', margin: '2px 0' }}>{decision}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Moyenne;
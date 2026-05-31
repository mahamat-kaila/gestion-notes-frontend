import React, { useState, useEffect } from 'react';
import { getEleves, deleteEleve } from '../services/api';
import FormulaireEleve from '../components/FormulaireEleve';

function Eleves() {
    const [eleves, setEleves] = useState([]);

    useEffect(() => {
        chargerEleves();
    }, []);

    const chargerEleves = async () => {
        try {
            const response = await getEleves();
            setEleves(response.data);
        } catch (error) {
            console.error('Erreur lors du chargement des élèves', error);
        }
    };

    const supprimerEleve = async (id) => {
        if (window.confirm('Voulez-vous vraiment supprimer cet élève ?')) {
            await deleteEleve(id);
            chargerEleves();
        }
    };

    return (
        <div>
            <h2>Liste des Élèves</h2>
            <FormulaireEleve onEleveAjoute={chargerEleves} />
            <br />
            <table border="1">
                <thead>
                <tr>
                    <th>Matricule</th>
                    <th>Nom</th>
                    <th>Prénom</th>
                    <th>Âge</th>
                    <th>Classe</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {eleves.map((eleve) => (
                    <tr key={eleve.id}>
                        <td>{eleve.matricule}</td>
                        <td>{eleve.nom}</td>
                        <td>{eleve.prenom}</td>
                        <td>{eleve.age} ans</td>
                        <td>{eleve.classe ? eleve.classe.nom : '-'}</td>
                        <td>
                            <button onClick={() => supprimerEleve(eleve.id)}>
                                Supprimer
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default Eleves;
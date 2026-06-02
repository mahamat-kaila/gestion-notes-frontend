import React, { useState, useEffect } from 'react';
import { getLogs } from '../services/api';

function Logs() {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        chargerLogs();
    }, []);

    const chargerLogs = async () => {
        const response = await getLogs();
        setLogs(response.data);
    };

    return (
        <div>
            <h2>Historique des Impressions</h2>
            <p style={{ color: '#666', marginBottom: '15px' }}>
                Liste de tous les bulletins imprimés par les directeurs.
            </p>

            {logs.length === 0 ? (
                <p style={{ color: '#999', textAlign: 'center', padding: '30px' }}>
                    Aucune impression enregistrée.
                </p>
            ) : (
                <table>
                    <thead>
                    <tr>
                        <th>Date & Heure</th>
                        <th>Utilisateur</th>
                        <th>Élève</th>
                        <th>Matricule</th>
                        <th>Trimestre</th>
                    </tr>
                    </thead>
                    <tbody>
                    {logs.map((log) => (
                        <tr key={log.id}>
                            <td>{new Date(log.dateImpression).toLocaleString('fr-FR')}</td>
                            <td>{log.nomUtilisateur}</td>
                            <td>{log.nomEleve}</td>
                            <td>{log.matriculeEleve}</td>
                            <td>{log.trimestre.replace('TRIMESTRE_', 'Trimestre ')}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default Logs;
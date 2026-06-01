import React, { useState, useEffect } from 'react';
import { getClasses, getEleves, getMatieres, getProfesseurs } from '../services/api';

function Accueil() {
    const [stats, setStats] = useState({
        classes: 0,
        eleves: 0,
        matieres: 0,
        professeurs: 0,
    });

    useEffect(() => {
        chargerStats();
    }, []);

    const chargerStats = async () => {
        try {
            const [classesRes, elevesRes, matieresRes, professeursRes] = await Promise.all([
                getClasses(),
                getEleves(),
                getMatieres(),
                getProfesseurs(),
            ]);
            setStats({
                classes: classesRes.data.length,
                eleves: elevesRes.data.length,
                matieres: matieresRes.data.length,
                professeurs: professeursRes.data.length,
            });
        } catch (error) {
            console.error('Erreur chargement stats', error);
        }
    };

    const cards = [
        { label: 'Classes', valeur: stats.classes, couleur: '#4CAF50', emoji: '🏫' },
        { label: 'Élèves', valeur: stats.eleves, couleur: '#2196F3', emoji: '🎓' },
        { label: 'Matières', valeur: stats.matieres, couleur: '#FF9800', emoji: '📚' },
        { label: 'Professeurs', valeur: stats.professeurs, couleur: '#9C27B0', emoji: '👨‍🏫' },
    ];

    return (
        <div>
            <h2>Tableau de Bord</h2>
            <p>Bienvenue sur le système de gestion des notes du <strong>Complexe Scolaire Soleil Brillant</strong></p>

            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '20px' }}>
                {cards.map((card) => (
                    <div key={card.label} style={{
                        background: card.couleur,
                        color: 'white',
                        borderRadius: '10px',
                        padding: '20px 30px',
                        minWidth: '150px',
                        textAlign: 'center',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                    }}>
                        <div style={{ fontSize: '40px' }}>{card.emoji}</div>
                        <div style={{ fontSize: '36px', fontWeight: 'bold' }}>{card.valeur}</div>
                        <div style={{ fontSize: '16px', marginTop: '5px' }}>{card.label}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Accueil;
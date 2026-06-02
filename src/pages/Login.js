import React, { useState } from 'react';

function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [motDePasse, setMotDePasse] = useState('');
    const [erreur, setErreur] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErreur('');
        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, motDePasse }),
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('role', data.role);
                localStorage.setItem('nom', data.nom);
                localStorage.setItem('prenom', data.prenom);
                localStorage.setItem('peutSaisirNotes', data.peutSaisirNotes);
                onLogin(data);
            } else {
                setErreur(data);
            }
        } catch (error) {
            setErreur('Erreur de connexion au serveur !');
        }
        setLoading(false);
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #1a237e, #283593)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <div style={{
                background: 'white',
                borderRadius: '15px',
                padding: '40px',
                width: '380px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
            }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <div style={{ fontSize: '50px' }}>☀️</div>
                    <h2 style={{ color: '#1a237e', margin: '10px 0 5px', border: 'none' }}>
                        Complexe Scolaire
                    </h2>
                    <p style={{ color: '#666', fontSize: '14px' }}>Soleil Brillant</p>
                    <p style={{ color: '#999', fontSize: '12px' }}>Système de Gestion des Notes</p>
                </div>

                <form onSubmit={handleSubmit} autoComplete="off">
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', color: '#444', fontWeight: '600' }}>
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="votre@email.com"
                            required
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1.5px solid #ddd' }}
                        />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', color: '#444', fontWeight: '600' }}>
                            Mot de passe
                        </label>
                        <input
                            type="password"
                            value={motDePasse}
                            onChange={(e) => setMotDePasse(e.target.value)}
                            placeholder="••••••••"
                            required
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1.5px solid #ddd' }}
                        />
                    </div>

                    {erreur && (
                        <div style={{
                            background: '#ffebee',
                            color: '#e53935',
                            padding: '10px',
                            borderRadius: '6px',
                            marginBottom: '15px',
                            fontSize: '13px',
                            borderLeft: '3px solid #e53935'
                        }}>
                            {erreur}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '12px',
                            background: '#1a237e',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '15px',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}>
                        {loading ? 'Connexion...' : 'Se connecter'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;
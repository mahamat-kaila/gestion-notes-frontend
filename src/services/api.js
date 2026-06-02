import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Ajouter le token JWT automatiquement à chaque requête
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Rediriger vers login si token expiré
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.clear();
            window.location.reload();
        }
        return Promise.reject(error);
    }
);

// Eleves
export const getEleves = () => api.get('/eleves');
export const getEleveById = (id) => api.get(`/eleves/${id}`);
export const createEleve = (eleve) => api.post('/eleves', eleve);
export const updateEleve = (id, eleve) => api.put(`/eleves/${id}`, eleve);
export const deleteEleve = (id) => api.delete(`/eleves/${id}`);

// Matieres
export const getMatieres = () => api.get('/matieres');
export const createMatiere = (matiere) => api.post('/matieres', matiere);
export const updateMatiere = (id, matiere) => api.put(`/matieres/${id}`, matiere);
export const deleteMatiere = (id) => api.delete(`/matieres/${id}`);

// Classes
export const getClasses = () => api.get('/classes');
export const createClasse = (classe) => api.post('/classes', classe);
export const updateClasse = (id, classe) => api.put(`/classes/${id}`, classe);
export const deleteClasse = (id) => api.delete(`/classes/${id}`);

// Notes
export const getNotes = () => api.get('/notes');
export const getNotesByEleve = (eleveId) => api.get(`/notes/eleve/${eleveId}`);
export const createNote = (note) => api.post('/notes', note);
export const updateNote = (id, note) => api.put(`/notes/${id}`, note);
export const deleteNote = (id) => api.delete(`/notes/${id}`);
export const getMoyenne = (eleveId, trimestre) => api.get(`/notes/moyenne/eleve/${eleveId}/trimestre/${trimestre}`);
export const getRang = (eleveId, trimestre, classeId) => api.get(`/notes/rang/eleve/${eleveId}/trimestre/${trimestre}/classe/${classeId}`);

// Professeurs
export const getProfesseurs = () => api.get('/professeurs');
export const createProfesseur = (professeur) => api.post('/professeurs', professeur);
export const updateProfesseur = (id, professeur) => api.put(`/professeurs/${id}`, professeur);
export const deleteProfesseur = (id) => api.delete(`/professeurs/${id}`);

// Affectations
export const getAffectations = () => api.get('/affectations');
export const getAffectationsByClasse = (classeId) => api.get(`/affectations/classe/${classeId}`);
export const createAffectation = (affectation) => api.post('/affectations', affectation);
export const deleteAffectation = (id) => api.delete(`/affectations/${id}`);

// Années scolaires
export const getAnnees = () => api.get('/annees');
export const getAnneeActive = () => api.get('/annees/active');
export const createAnnee = (annee) => api.post('/annees', annee);
export const activerAnnee = (id) => api.put(`/annees/${id}/activer`);
export const deleteAnnee = (id) => api.delete(`/annees/${id}`);

// Utilisateurs
export const getUtilisateurs = () => api.get('/utilisateurs');
export const createUtilisateur = (utilisateur) => api.post('/utilisateurs', utilisateur);
export const toggleSaisirNotes = (id) => api.put(`/utilisateurs/${id}/toggle-notes`);
export const toggleActif = (id) => api.put(`/utilisateurs/${id}/toggle-actif`);
export const deleteUtilisateur = (id) => api.delete(`/utilisateurs/${id}`);

export const createLog = (log) => api.post('/logs', log);
export const getLogs = () => api.get('/logs');

export default api;
import axios from 'axios';
export const getRang = (eleveId, trimestre, classeId) => api.get(`/notes/rang/eleve/${eleveId}/trimestre/${trimestre}/classe/${classeId}`);

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Eleves
export const getEleves = () => api.get('/eleves');
export const getEleveById = (id) => api.get(`/eleves/${id}`);
export const createEleve = (eleve) => api.post('/eleves', eleve);
export const updateEleve = (id, eleve) => api.put(`/eleves/${id}`, eleve);
export const deleteEleve = (id) => api.delete(`/eleves/${id}`);

// Matieres
export const getMatieres = () => api.get('/matieres');
export const createMatiere = (matiere) => api.post('/matieres', matiere);
export const deleteMatiere = (id) => api.delete(`/matieres/${id}`);
export const updateMatiere = (id, matiere) => api.put(`/matieres/${id}`, matiere);

// Notes
export const getNotes = () => api.get('/notes');
export const getNotesByEleve = (eleveId) => api.get(`/notes/eleve/${eleveId}`);
export const createNote = (note) => api.post('/notes', note);
export const deleteNote = (id) => api.delete(`/notes/${id}`);
export const getMoyenne = (eleveId, trimestre) => api.get(`/notes/moyenne/eleve/${eleveId}/trimestre/${trimestre}`);
export const updateNote = (id, note) => api.put(`/notes/${id}`, note);

// Professeur
export const getProfesseurs = () => api.get('/professeurs');
export const createProfesseur = (professeur) => api.post('/professeurs', professeur);
export const deleteProfesseur = (id) => api.delete(`/professeurs/${id}`);
export const updateProfesseur = (id, professeur) => api.put(`/professeurs/${id}`, professeur);

// Affectation
export const getAffectations = () => api.get('/affectations');
export const createAffectation = (affectation) => api.post('/affectations', affectation);
export const deleteAffectation = (id) => api.delete(`/affectations/${id}`);
export const getAffectationsByClasse = (classeId) => api.get(`/affectations/classe/${classeId}`);
// Classes
export const getClasses = () => api.get('/classes');
export const createClasse = (classe) => api.post('/classes', classe);
export const deleteClasse = (id) => api.delete(`/classes/${id}`);
export const updateClasse = (id, classe) => api.put(`/classes/${id}`, classe);
export default api;

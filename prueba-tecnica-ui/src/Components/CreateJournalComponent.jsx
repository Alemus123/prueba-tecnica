import { useState } from 'react';
import { journalsService } from '../Services';
import { useNavigate } from 'react-router-dom';

const CreateJournalComponent = () => {
  const [journalName, setJournalName] = useState('');
  const [researcherName, setResearcherName] = useState('');
  const [publicationFile, setPublicationFile] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setPublicationFile(e.target.files[0]);
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage('');
    setLoading(true); // Inicia el loading
  
    if (!publicationFile) {
      setError('Por favor, introduce el archivo de publicación.');
      setLoading(false);
      return;
    }
  
    try {
      // Crea un objeto FormData para enviar los datos
      const formData = new FormData();
      formData.append('title', journalName.trim());
      formData.append('author', researcherName.trim());
      formData.append('publicationFile', publicationFile);
      formData.append('FilePath','ale')
      formData.append('PublicationDate', new Date().toISOString())
      await journalsService.createJournal(formData); // Envia el FormData
  
      setSuccessMessage('Diario creado con éxito!');
      setJournalName('');
      setResearcherName('');
      setPublicationFile(null);
      navigate('/home');
    } catch (err) {
      setError('Error al crear el Diario: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Crear Diario</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nombre del Diario</label>
          <input
            type="text"
            className="form-control"
            value={journalName}
            onChange={(e) => setJournalName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Nombre del Investigador</label>
          <input
            type="text"
            className="form-control"
            value={researcherName}
            onChange={(e) => setResearcherName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Archivo de Publicación</label>
          <input
            type="file"
            className="form-control"
            onChange={handleFileChange}
            accept=".pdf"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Creando...' : 'Crear Journal'}
        </button>
      </form>
      {error && <div className="alert alert-danger mt-3">{error}</div>}
      {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
    </div>
  );
};

export default CreateJournalComponent;
``
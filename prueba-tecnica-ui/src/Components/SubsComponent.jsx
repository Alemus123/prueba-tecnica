import { useState, useEffect } from 'react';
import { journalsService, subscriptionService } from '../Services';
import { useNavigate } from 'react-router-dom';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { useUserContext } from '../helpers/UseContext'; 

const SubsComponent = () => {
  const { userId } = useUserContext(); // Accede al username desde el contexto
  const [subscribedResearchers, setSubscribedResearchers] = useState([]);
  const [researchersData, setResearchersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pdfContent, setPdfContent] = useState({});
  const navigate = useNavigate();

  const pdfjsVersion = '3.6.172';

  const handleSubscribe = async (researcher) => {
    if (!subscribedResearchers.includes(researcher.authorId)) {
      setSubscribedResearchers([...subscribedResearchers, researcher.authorId]);

      try {
        // Llama al servicio de suscripción utilizando el authorId como subscriberID
        await subscriptionService.setSubscription(researcher.authorId, userId);

        // Fetch todos los PDFs para investigadores con el mismo authorId
        const relatedResearchers = researchersData.filter(r => r.authorId === researcher.authorId);
        const newPdfContent = {};

        for (const relResearcher of relatedResearchers) {
          const fileData = await journalsService.getFile(relResearcher.filePath);
          
          // Verifica que fileData sea un Blob antes de crear el URL
          if (fileData instanceof Blob) {
            const pdfUrl = URL.createObjectURL(fileData);
            newPdfContent[relResearcher.id] = pdfUrl; // Usa relResearcher.id como clave única
          } else {
            console.error('fileData no es un Blob', fileData);
          }
        }

        // Actualiza el estado con todos los nuevos PDF URLs
        setPdfContent((prevContent) => ({
          ...prevContent,
          ...newPdfContent, // Combina con el contenido existente
        }));

      } catch (err) {
        setError('Error al obtener el archivo o al suscribirse: ' + err.message);
      }
    }
  };

  const handleCreate = () => {
    navigate('/create');
  };

  useEffect(() => {
    const fetchResearchers = async () => {
      try {
        const data = await journalsService.getJournals();
        setResearchersData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResearchers();
  }, []);

  useEffect(() => {
    return () => {
      // Revoca todos los URLs creados para evitar pérdidas de memoria
      Object.values(pdfContent).forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [pdfContent]);

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Sistema de Suscripción a Investigadores</h2>
      <button className="btn btn-primary" onClick={handleCreate}>
        Crea una entrada
      </button>
      <div className="list-group">
        {researchersData.length ? (
          researchersData.map((researcher) => (
            <div key={researcher.id} className="list-group-item">
              <h5>{researcher.author}</h5>
              <p>{researcher.AleDiario}</p>
              <button
                className="btn btn-primary"
                onClick={() => handleSubscribe(researcher)}
                disabled={userId === researcher.authorId} // Deshabilita el botón si el subscriberId es igual al authorId
              >
                {subscribedResearchers.includes(researcher.authorId) ? 'Suscrito' : 'Suscribirse'}
              </button>
              <h6 className="mt-2">Nombre del diario:</h6>
              <ul>
                <li>{researcher.title}</li>
              </ul>

              {pdfContent[researcher.id] && ( 
                <div className="mt-4">
                  <h4>Vista previa del archivo PDF:</h4>
                  <Worker workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjsVersion}/build/pdf.worker.min.js`}>
                    <div className="viewer-container">
                      <Viewer fileUrl={pdfContent[researcher.id]} />
                    </div>
                  </Worker>
                </div>
              )}
            </div>
          ))
        ) : (
          <span>No hay Entradas</span>
        )}
      </div>
    </div>
  );
};

export default SubsComponent;

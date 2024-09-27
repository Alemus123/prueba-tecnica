import axios from 'axios';

class JournalsService {
  constructor() {
    this.apiUrl = 'https://localhost:44316'; 
  }

  async getJournals() {
    try {
      const response = await axios.get(`${this.apiUrl}/api/Journals`);
      return response.data; 
    } catch (error) {
      throw new Error(error.response.data.message || 'Error en el registro');
    }
  }


  async getFile(fileName) {
    try {
      const response = await axios.get(`${fileName}`, {
        responseType: 'blob' 
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener el archivo');
    }
  }
  


  
  async createJournal(formData) {
    try {
      const response = await axios.post(`${this.apiUrl}/api/Journals`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // El encabezado necesario para subir archivos
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al crear el diario');
    }
  }
  

  async logout() {
    localStorage.removeItem('token');
  }
}

const journalsService = new JournalsService();
export default journalsService;

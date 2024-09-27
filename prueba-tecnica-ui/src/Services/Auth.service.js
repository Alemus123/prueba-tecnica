import axios from 'axios';

class AuthService {
  constructor() {
    this.apiUrl = 'https://localhost:44316/api'; 
  }

  async register(username, password) {
    try {
      const response = await axios.post(`${this.apiUrl}/Users/register`, {
        username,
        password,
        role: 'suscriptor'
      });
      return response.data; 
    } catch (error) {
      throw new Error(error.response.data.message || 'Error en el registro');
    }
  }

  async login(username, password) {
    try {
      const response = await axios.post(`${this.apiUrl}/Users/authenticate`, {
        username,
        password,
        role: 'admin'
      });
      localStorage.setItem('token', response.data.token); 
      return response.data; 
    } catch (error) {
      throw new Error(error.response.data.message || 'Error en la autenticación');
    }
  }

  async logout() {
    localStorage.removeItem('token');
  }

}

const authService = new AuthService();
export default authService;


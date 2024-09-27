import axios from 'axios';

class SubscriptionService {
  constructor() {
    this.apiUrl = 'https://localhost:44316'; 
  }

  // Método para crear una nueva suscripción
  async setSubscription(researcherId, subscriberId) {
    try {
      const response = await axios.post(`${this.apiUrl}/api/Subscriptions`, {
        researcherId,
        subscriberId,
      });
      return response.data; 
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al crear la suscripción');
    }
  }

  // Método para obtener las suscripciones de un investigador
  async getSubscriptions(researcherId) {
    try {
      const response = await axios.get(`${this.apiUrl}/api/Subscriptions/${researcherId}`);
      return response.data; 
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error en traer suscripciones');
    }
  }
}

const subscriptionService = new SubscriptionService();
export default subscriptionService;

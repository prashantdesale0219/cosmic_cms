import api from './api';

class ServicesService {
  // Get service hero
  async getServiceHero() {
    try {
      const response = await api.get('/services/hero');
      return response.data;
    } catch (error) {
      console.error('Error fetching service hero:', error);
      throw error;
    }
  }

  // Get main services
  async getMainServices() {
    try {
      const response = await api.get('/services/main-services');
      return response.data;
    } catch (error) {
      console.error('Error fetching main services:', error);
      throw error;
    }
  }

  // Get additional services
  async getAdditionalServices() {
    try {
      const response = await api.get('/services/additional-services');
      return response.data;
    } catch (error) {
      console.error('Error fetching additional services:', error);
      throw error;
    }
  }

  // Get process steps
  async getProcessSteps() {
    try {
      const response = await api.get('/services/process-steps');
      return response.data;
    } catch (error) {
      console.error('Error fetching process steps:', error);
      throw error;
    }
  }

  // Get service CTA
  async getServiceCta() {
    try {
      const response = await api.get('/services/cta');
      return response.data;
    } catch (error) {
      console.error('Error fetching service CTA:', error);
      throw error;
    }
  }

  // Get savings calculator
  async getSavingsCalculator() {
    try {
      const response = await api.get('/services/savings-calculator');
      return response.data;
    } catch (error) {
      console.error('Error fetching savings calculator:', error);
      throw error;
    }
  }
}

export default new ServicesService();
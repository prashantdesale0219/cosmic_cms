const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const footerService = {
  async getFooterData() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/frontend/footer`);
      if (!response.ok) {
        throw new Error('Failed to fetch footer data');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching footer data:', error);
      return null;
    }
  }
};

export default footerService;
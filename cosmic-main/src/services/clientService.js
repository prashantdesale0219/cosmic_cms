import api from './api';

export const clientService = {
  getClientsForFrontend: () => api.get('/clients'),
};

export default clientService;
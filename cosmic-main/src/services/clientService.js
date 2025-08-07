import api from './api';

export const clientService = {
  getClientsForFrontend: () => api.get('/clients/frontend'),
};

export default clientService;
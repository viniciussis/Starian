import axios from 'axios';

// Instância base conectando o microfrontend ao BFF NestJS
export const api = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptador para desempacotar o { data, statusCode, message } do TransformInterceptor do Nest
api.interceptors.response.use(
  (response) => {
    // Retorna direto o payload útil (data.data) que o Nest envelopou
    if (response.data && response.data.data) {
      return response.data.data;
    }
    return response.data;
  },
  (error) => {
    // O HttpExceptionFilter do Nest padronizou as mensagens de erro, propagaremos isso
    const customMessage = error.response?.data?.message || 'Erro inesperado na API.';
    return Promise.reject(new Error(customMessage));
  }
);

import { DefaultApi } from './openapi-client/apis/DefaultApi.ts';
import { Configuration } from './openapi-client/runtime.ts';

const config = new Configuration({
  basePath: import.meta.env.VITE_API_BASE_URL, // Load from .env
  credentials: 'include', // Include credentials for CORS requests
});

export const defaultApi = new DefaultApi(config);

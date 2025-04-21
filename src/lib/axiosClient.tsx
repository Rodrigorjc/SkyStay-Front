import axios, { AxiosError, InternalAxiosRequestConfig, AxiosRequestHeaders } from "axios";
import Cookies from "js-cookie";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor de peticiones
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = Cookies.get("token");
    if (token) {
      if (!config.headers) {
        config.headers = {} as AxiosRequestHeaders;
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Interceptor de respuestas
axiosClient.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        dispatchEvent(
          new CustomEvent("tokenExpirado", {
            detail: {
              titulo: "Sesión expirada",
              mensaje: "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.",
              code: 401,
              tipo: "error",
            },
          })
        );
        if (typeof window !== "undefined") {
          const currentLang = window.location.pathname.split("/")[1];
          window.location.href = `/${currentLang}/login`;
        }
      } else if (status === 403) {
        dispatchEvent(
          new CustomEvent("accesoDenegado", {
            detail: {
              titulo: "Acceso Denegado",
              mensaje: "No tienes permiso para acceder a este recurso.",
              code: 403,
              tipo: "error",
            },
          })
        );
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;

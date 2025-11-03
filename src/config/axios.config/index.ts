import axios, { AxiosError, type AxiosInstance } from "axios";
import { PATH_PREFIX, PATH_PREFIX_V2 } from "../../utils/AppVariables";
import { ResponseError } from "./error";

// Create separate instances for each baseURL
const instance = axios.create({
  baseURL: PATH_PREFIX,
  headers: {
    Accept: "application/json",
  },
});

const authInstance = axios.create({
  baseURL: PATH_PREFIX_V2,
  headers: {
    Accept: "application/json",
  },
});

// Function to add access token to request header
const addAuthToken = (instance: AxiosInstance) => {
  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
};

// Add token for each instance
[instance, authInstance].forEach(addAuthToken);

// Handle when an error occurs
const handleResponseError = (error: AxiosError) => {
  new ResponseError(error);
  return Promise.reject(error);
};

// Set response and error interceptors
instance.interceptors.response.use((response) => response, handleResponseError);
authInstance.interceptors.response.use(
  (response) => response,
  handleResponseError
);

export { authInstance };
export default instance;

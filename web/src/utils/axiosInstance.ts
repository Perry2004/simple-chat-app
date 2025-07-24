import axios from "axios";
import axiosRetry from "axios-retry";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  timeout: 10000, // 10 second timeout
});

axiosRetry(axiosInstance, {
  retries: 3,

  retryCondition: (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      return false;
    }
    return axiosRetry.isNetworkOrIdempotentRequestError(error);
  },

  retryDelay: (retryCount, error) => {
    if (error.response?.status === 429) {
      const retryAfter = error.response.headers["retry-after"];
      if (retryAfter) {
        return parseInt(retryAfter) * 1000;
      }
    }
    return axiosRetry.exponentialDelay(retryCount);
  },
});

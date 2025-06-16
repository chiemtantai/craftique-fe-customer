  import axios, { AxiosError, AxiosResponse } from "axios";
  const API_BASE_URL = "http://localhost:7218/api";
  if (!API_BASE_URL) {
    throw new Error("API_BASE_URL is not defined. Check your environment variables.");
  }
  const request = axios.create({
    baseURL: API_BASE_URL,
  });
  
  export const get = async (path: string, options = {}) => {
    try {
      const response: AxiosResponse = await request.get(path, options);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error retrieving data:", error.message);
      } else {
        console.error("Unexpected error:", error);
      }
      return [];
      // throw new Error("Error retrieving notifications");
    }
  };

  export const deleteData = async (path: string, options = {}) => {
    try {
      const response: AxiosResponse = await request.delete(path, options);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error deleting data:", error.message);
      } else {
        console.error("Unexpected error:", error);
      }
      return null;
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const put = async (path: string, data: any, options = {}) => {
    try {
      const response: AxiosResponse = await request.put(path, data, options);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error updating data:", error.message);
      } else {
        console.error("Unexpected error:", error);
      }
      return null;
    }
  };

  export const post = async (path: string, options = {}) => {
    try {
      const response: AxiosResponse = await request.post(path, options);
      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error posting data:", error.message);
      } else {
        console.error("Unexpected error:", error);
      }
      throw error;
    }
  };

  export default request;

import axios from "axios";

// const API_BASE_URL = 'https://localhost:7218/api';
const API_BASE_URL = 'https://api-craftique.innosphere.io.vn/api';

const customProductFileAPI = axios.create({
  baseURL: `${API_BASE_URL}/CustomProductFile`,
});

customProductFileAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const customProductFileService = {
  upload: (data) => {
    // Nếu có ImageUrl thì gửi JSON, không dùng FormData
    if (data.ImageUrl) {
      return customProductFileAPI.post("/upload", {
        customProductID: data.CustomProductID,
        imageUrl: data.ImageUrl,
        customText: data.CustomText,
        quantity: data.Quantity,
      });
    }
    // Nếu upload file thì dùng FormData như cũ
    const formData = new FormData();
    formData.append("CustomProductID", data.CustomProductID);
    formData.append("File", data.File);
    formData.append("CustomText", data.CustomText);
    formData.append("Quantity", data.Quantity);

    return customProductFileAPI.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  getDetailById: (id) => customProductFileAPI.get(`/detail/${id}`)
};

export default customProductFileService;

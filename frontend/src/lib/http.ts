import axios from "axios";

// Tạo một instance riêng thay vì dùng axios mặc định
const http = axios.create({
  baseURL: "http://localhost:8080/api/v1", // URL Backend của bạn
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor: Tự động gắn Token vào mỗi request
http.interceptors.request.use(
  (config) => {
    // Lấy token từ localStorage (chúng ta sẽ lưu token ở đây sau khi login)
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default http;
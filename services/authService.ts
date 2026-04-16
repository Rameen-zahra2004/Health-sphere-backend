
import api from "../utils/api";

export const authService = {
  register: async (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => {
    const res = await api.post("/auth/register", data);

    if (res.data?.token) {
      localStorage.setItem("token", res.data.token);
    }

    return res.data;
  },

  login: async (data: { email: string; password: string }) => {
    const res = await api.post("/auth/login", data);

    if (res.data?.token) {
      localStorage.setItem("token", res.data.token);
    }

    return res.data;
  },

  logout: () => {
    localStorage.removeItem("token");
  },
};
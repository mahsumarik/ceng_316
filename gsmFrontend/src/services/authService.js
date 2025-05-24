import api from "./api";

const AuthService = {
  // Kullanıcı kaydını yapma
  registerUser: async (payload) => {
    try {
      const response = await api.post("/auth/register", {
        email: payload.email,
        password: payload.password,
        confirmPassword: payload.confirmPassword,
      });
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  // Kullanıcı girişi yapma
  loginUser: async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Şifre sıfırlama talebi gönderme
  forgotPassword: async (email) => {
    try {
      const response = await api.post("/auth/forgot-password", { email });
      return response.data;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  },

  // Şifre sıfırlama işlemi gerçekleştirme
  resetPassword: async (email, newPassword) => {
    try {
      const response = await api.post("/auth/reset-password", { email, newPassword });
      return response.data;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }
};

export default AuthService;

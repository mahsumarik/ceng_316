import api from "./api";

// Kullanıcı kaydını yapma
export const registerUser= (payload) =>
  api.post("/auth/register", {
    email: payload.email,
    password: payload.password,
    confirmPassword: payload.confirmPassword,
  });

// Kullanıcı girişi yapma
export const loginUser = (email, password) =>
  api.post("/auth/login", { email, password });  // AuthResponse {token, role}

// Şifre sıfırlama talebi gönderme
export const forgotPassword = (email) =>
  api.post("/auth/forgot-password", { email });  // email ile şifre sıfırlama linki gönderilecek

// Şifre sıfırlama işlemi gerçekleştirme
export const resetPassword = (email, newPassword) =>
  api.post("/auth/reset-password", { email, newPassword });  // email ve yeni şifre ile güncelleme yapılacak

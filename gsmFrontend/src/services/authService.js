import api from "./api";

// Kullanıcı kaydını yapma
export const registerStudent = (payload) =>
  api.post("/auth/register", {
    firstName: payload.name,      // backend property adları
    lastName: payload.surname,
    email: payload.email,
    password: payload.password,
    confirmPassword: payload.confirmPassword,
    role: payload.role            // şimdilik "STUDENT"; backend yine de override ediyor
  });

// Kullanıcı girişi yapma
export const loginStudent = (email, password) =>
  api.post("/auth/login", { email, password });  // AuthResponse {token, role}

// Şifre sıfırlama talebi gönderme
export const forgotPassword = (email) =>
  api.post("/auth/forgot-password", { email });  // email ile şifre sıfırlama linki gönderilecek

// Şifre sıfırlama işlemi gerçekleştirme
export const resetPassword = (email, newPassword) =>
  api.post("/auth/reset-password", { email, newPassword });  // email ve yeni şifre ile güncelleme yapılacak

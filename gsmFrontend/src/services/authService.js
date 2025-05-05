import api from "./api";

export const registerStudent = (payload) =>
  api.post("/auth/register", {
    firstName: payload.name,      // backend property adları
    lastName:  payload.surname,
    email:     payload.email,
    password:  payload.password,
    confirmPassword: payload.confirmPassword,
    role: payload.role            // şimdilik "STUDENT"; backend yine de override ediyor
  });

export const loginStudent = (email, password) =>
  api.post("/auth/login", { email, password });        // AuthResponse {token, role}

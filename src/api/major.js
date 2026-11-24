import api from "./client";

export const getMajors = () => api.get("/majors/").then((r) => r.data);
export const createMajor = (data) =>
  api.post("/majors/", data).then((r) => r.data);
export const updateMajor = (id, data) =>
  api.put(`/majors/${id}`, data).then((r) => r.data);
export const deleteMajor = (id) => api.delete(`/majors/${id}`);

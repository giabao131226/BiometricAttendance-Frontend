import api from "./client";

export const getFaculties = () => api.get("/faculties/").then((r) => r.data);

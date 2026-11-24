import { Outlet } from "react-router-dom";
import Home from "../../../components/Home/home";

export default function UniversityHome() {
  return (
    <>
      <Home />
      <Outlet />
    </>
  );
}

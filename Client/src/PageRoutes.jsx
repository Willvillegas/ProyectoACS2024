import { Routes, Route } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import ForgotPasswordPage from "./Pages/ForgotPasswordPage";
import ResetPasswordPage from "./Pages/ResetPasswordPage";
import AssistantMenu from "./Pages/AssistantMenu";
import EquipoGuiaAssistentPage from "./Pages/EquipoGuiaAssistentPage";
import InfoProfesor from "./Pages/InfoProfesor";
import MostrarProfesorSede from "./Pages/MostrarProfesorSede";
//import NotFoundPage from "./Pages/NotFoundPage"; // Add a NotFoundPage component

const RoutesPages = () => (
  <Routes>  
    <Route path="/" element={<LoginPage />} />
    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
    <Route path="/reset-password" element={<ResetPasswordPage />} />
    <Route path="/assistant-menu" element={<AssistantMenu />} />
    <Route path="/equipo-guia" element={<EquipoGuiaAssistentPage />} />
    <Route path="/info-profesor" element={<InfoProfesor />} />
    <Route path="/mostrar-profesor-sede" element={<MostrarProfesorSede />} />
  </Routes>
);


export default RoutesPages;
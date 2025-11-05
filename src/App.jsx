import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import CalendarioRiego from './pages/CalendarioRiego';
import MonitoreoTiempoReal from './pages/MonitoreoTiempoReal';
import HistorialAmbiental from './pages/HistorialAmbiental';
import Notificaciones from './pages/Notificaciones';
import Sensores from './pages/Sensores';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/calendario" element={<CalendarioRiego />} /> {/* ✅ CAMBIADO */}
          <Route path="/monitoreo" element={<MonitoreoTiempoReal />} />
          <Route path="/historial" element={<HistorialAmbiental />} />
          <Route path="/notificaciones" element={<Notificaciones />} />
          <Route path="/sensores" element={<Sensores />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
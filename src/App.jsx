import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword'; // ✨ NUEVO
import Dashboard from './pages/Dashboard';
import CalendarioRiego from './pages/CalendarioRiego';
import MonitoreoTiempoReal from './pages/MonitoreoTiempoReal';
import HistorialDatos from './pages/HistorialDatos';
import Notificaciones from './pages/Notificaciones';
import GestionSensores from './pages/GestionSensores';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? children : <Navigate to="/calendario" />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} /> {/* ✨ NUEVO */}
          
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/calendario" element={<PrivateRoute><CalendarioRiego /></PrivateRoute>} />
          <Route path="/monitoreo" element={<PrivateRoute><MonitoreoTiempoReal /></PrivateRoute>} />
          <Route path="/historial" element={<PrivateRoute><HistorialDatos /></PrivateRoute>} />
          <Route path="/notificaciones" element={<PrivateRoute><Notificaciones /></PrivateRoute>} />
          <Route path="/sensores" element={<PrivateRoute><GestionSensores /></PrivateRoute>} />
          
          <Route path="/" element={<Navigate to="/calendario" />} />
          <Route path="*" element={<Navigate to="/calendario" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
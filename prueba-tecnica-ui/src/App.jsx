import './App.css';
import { LoginComponent, RegisterComponent, SubsComponent, NotificationProvider, CreateJournalComponent, HeaderComponent } from './Components';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PrivateRoute from './Components/PrivateRouteComponent';
import { UserProvider, useUserContext } from './helpers/UseContext';

const App = () => {
  return (
    <UserProvider>
      <Router>
        <NotificationProvider>
          {(notify) => (
            <AppContent notify={notify} />
          )}
        </NotificationProvider>
      </Router>
    </UserProvider>
  );
};

const AppContent = ({ notify }) => {
  const { username, setUsername, handleLogout } = useUserContext(); // Utiliza el contexto

  return (
    <>
      {/* Renderiza el Header solo si hay un username */}
      {username && <HeaderComponent username={username} onLogout={handleLogout} />}
      <Routes>
        <Route path="/" element={<LoginComponent notify={notify} setUsername={setUsername} />} />
        <Route path="/register" element={<RegisterComponent notify={notify} />} />
        {/* Usando PrivateRoute para proteger rutas */}
        <Route 
          path="/home" 
          element={
            <PrivateRoute isAuthenticated={!!username}>
              <SubsComponent notify={notify} />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/create" 
          element={
            <PrivateRoute isAuthenticated={!!username}>
              <CreateJournalComponent notify={notify} />
            </PrivateRoute>
          } 
        />
      </Routes>
    </>
  );
};

export default App;

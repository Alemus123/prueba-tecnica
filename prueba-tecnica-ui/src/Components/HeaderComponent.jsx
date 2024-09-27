import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useUserContext } from '../helpers/UseContext';

const HeaderComponent = ({ onLogout }) => {
  const navigate = useNavigate();
  const { username } = useUserContext(); 
  const handleLogout = () => {
    onLogout(); // Llama a la función de cierre de sesión
    navigate('/'); // Redirige a la página de inicio de sesión
  };

  return (
    <header className="header">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <span className="navbar-brand">Sistema de Suscripción</span>
          <div className="collapse navbar-collapse">
            <div className="d-flex">
              {username ? (
                <div className="navbar-text">
                  {username} 
                  <button className="btn btn-link" onClick={handleLogout}>
                    Cerrar Sesión
                  </button>
                </div>
              ) : (
                <button className="btn btn-link" onClick={() => navigate('/')}>
                  Iniciar Sesión
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

HeaderComponent.propTypes = {
  username: PropTypes.string.isRequired, // nombre de usuario
  onLogout: PropTypes.func.isRequired, // función de cierre de sesión
};

export default HeaderComponent;

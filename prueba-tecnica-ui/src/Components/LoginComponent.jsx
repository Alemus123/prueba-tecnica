import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../Services';
import PropTypes from 'prop-types';
import { useUserContext } from '../helpers/UseContext';

const LoginComponent = ({ notify }) => {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setUsername } = useUserContext();
  const { setUserId } = useUserContext();


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const loggedInUser = await authService.login(user, password);
      notify(`Bienvenido ${user}`, 'success'); 
      setUsername(user); // Almacenar el nombre del usuario logueado
      setUserId(loggedInUser.id)
      navigate('/home');
    } catch (error) {
      notify(error.message, 'danger');
    }
  };

  const handleRegister = () => {
    navigate('/register'); 
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-12 col-lg-12 col-sm-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Inicia Sesión</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="user"
                    placeholder="Usuario"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                    required
                  />
                  <label htmlFor="user">Usuario</label>
                </div>

                <div className="form-floating mb-3">
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <label htmlFor="password">Contraseña</label>
                </div>

                <button type="submit" className="btn btn-dark w-100">
                  Iniciar Sesión
                </button>
                <button className="mt-2 btn btn-outline-dark w-100" onClick={handleRegister}>
                  No tienes Cuenta ?
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

LoginComponent.propTypes = {
  notify: PropTypes.func.isRequired, 
  setUsername: PropTypes.func.isRequired, 
};

export default LoginComponent;

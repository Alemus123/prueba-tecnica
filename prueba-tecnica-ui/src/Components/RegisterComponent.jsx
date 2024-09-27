import { useState } from 'react';
import { authService  } from '../Services';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const RegisterComponent = ({ notify }) => {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const newUser = await authService.register(user, password);
      notify(`Bienvenido ${user}`, 'success');
      navigate('/');
   
    } catch (error) {
      notify(error.message, 'danger');
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Regístrate</h2>
              <form onSubmit={handleRegister}>
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
                  Registrarse
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

RegisterComponent.propTypes = {
  notify: PropTypes.func.isRequired, 
}; 

export default RegisterComponent;
import React, { useState, useEffect } from "react";
import { useAuth } from "../../Store/authContext/AuthContext";
import { useNavigate } from "react-router-dom";

export const LoginPage = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: "admin@magiadelpoas.com",
    password: "password"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        setSuccess(result.message);
        // Redirigir automáticamente después del login exitoso
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error("Error en login:", error);
      setError("Error de conexión. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="auth-main v1">
        <div className="auth-wrapper">
          <div className="auth-form">
            <div className="card my-5">
              <div className="card-body">
                <div className="text-center">
                  <img
                    src="../assets/logo.jpg"
                    alt="images"
                    width={200}
                    height={100}
                    className="img-fluid mb-3"
                  />
                  <h4 className="f-w-500 mb-1">Iniciar sesión</h4>
                  <p className="mb-3">Iniciar sesión con tu correo electrónico</p>
                </div>
                
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="alert alert-success" role="alert">
                    {success}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <input
                      type="email"
                      className="form-control"
                      id="floatingInput"
                      name="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3 position-relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      id="floatingInput1"
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-link position-absolute end-0 top-0 h-100"
                      style={{ zIndex: 10, border: 'none', background: 'transparent' }}
                      onClick={togglePasswordVisibility}
                    >
                      <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                  </div>
                  <div className="d-flex mt-1 justify-content-between align-items-center"></div>
                  <div className="d-grid mt-4">
                    <button 
                      type="submit" 
                      className="btn btn-dark"
                      disabled={loading}
                    >
                      {loading ? "Iniciando sesión..." : "Iniciar sesión"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

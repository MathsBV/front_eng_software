import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";
import AOS from "aos";
import "aos/dist/aos.css";

function LoginPage() {
  const location = useLocation();
  const user = location.state?.user || "none";

  const { login } = useAuth();

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    mail: "",
    pwd: "",
    occupation: "",
    currentCompany: "",
    areasOfInterest: "",
  });

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Função async para garantir que login aguarde o fetch do mentorado
  const handleLogin = async (role, email) => {
    try {
      const success = await login(role, email);
      return success;
    } catch (error) {
      console.error("Erro no login:", error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await handleLogin(user, formData.mail);

    if (success) {
      navigate("/home");
    } else {
      alert("Erro ao fazer login. Tente novamente.");
    }
  };

  return (
    <>
      <style>{`
        html, body, #root {
          height: 100%;
          margin: 0;
        }

        .page-background {
          background-color: #121212;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .form-control.custom-input {
          background-color: #2b2d42;
          border: 1px solid #444;
          color: #fff;
          border-radius: 0.6rem;
          transition: border-color 0.3s, box-shadow 0.3s;
        }

        .form-control.custom-input:focus {
          border-color: #7f5af0;
          box-shadow: 0 0 0 0.2rem rgba(127, 90, 240, 0.25);
          background-color: #3b3f58;
        }

        .form-control.custom-input::placeholder {
          color: #ffffff;
          opacity: 0.7;
        }

        .custom-card {
          background-color: #1a1a2e;
          border: none;
          border-radius: 1rem;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
          width: 100%;
          max-width: 600px;
        }

        .btn-gradient {
          background: linear-gradient(135deg, #7f5af0, #00cfe8);
          border: none;
          color: white;
          font-weight: bold;
        }

        .btn-gradient:hover {
          opacity: 0.9;
        }

        .form-label {
          color: #cfd2dc;
          font-weight: 500;
        }
      `}</style>

      <div className="page-background">
        <div className="card shadow-lg custom-card p-4" data-aos="zoom-in">
          <h2
            className="text-center mb-4 fw-bold text-light"
            data-aos="fade-down"
          >
            Login de {user}
          </h2>
          <button
            type="button"
            className="btn btn-outline-light mb-4"
            onClick={() => navigate("/login")}
            data-aos="fade-left"
          >
            ← Voltar
          </button>
          <form onSubmit={handleSubmit}>
            <div className="mb-3" data-aos="fade-up" data-aos-delay="200">
              <label htmlFor="mail" className="form-label">
                E-mail
              </label>
              <input
                type="email"
                className="form-control custom-input"
                id="mail"
                name="mail"
                placeholder="Ex: joao@email.com"
                value={formData.mail}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3" data-aos="fade-up" data-aos-delay="300">
              <label htmlFor="pwd" className="form-label">
                Senha
              </label>
              <input
                type="password"
                className="form-control custom-input"
                id="pwd"
                name="pwd"
                placeholder="Crie uma senha segura"
                value={formData.pwd}
                onChange={handleChange}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-gradient w-100 py-2 mt-3"
              data-aos="zoom-in"
              data-aos-delay="700"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default LoginPage;

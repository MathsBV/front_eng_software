import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";

export default function MentoringManagement() {
  const { mentorado } = useAuth();
  const [sessions, setSessions] = useState([]);
  const navigate = useNavigate();

  // Inicia AOS para animações
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  // Busca as sessões agendadas do mentorado
  useEffect(() => {
    if (!mentorado) return;
    const id = Array.isArray(mentorado) ? mentorado[0].id : mentorado.id;
    axios.get(`http://44.212.29.224:8000/mentoring-management/${id}`)
      .then(({ data }) => setSessions(Array.isArray(data) ? data : []))
      .catch(() => setSessions([]));
  }, [mentorado]);

  // Cancela uma sessão
  const cancelarMentoria = async (id) => {
    try {
      await axios.post("http://44.212.29.224:8000/mentoring-delete", { mentoring_id: id });
      setSessions(prev => prev.filter(s => s.id !== id));
    } catch {
      alert("Erro ao cancelar mentoria. Tente novamente.");
    }
  };

  if (!mentorado) {
    return <p className="text-center text-light">Carregando dados...</p>;
  }

  return (
    <>
      <style>{`
        html, body, #root {
          height: 100%; margin: 0;
        }
        .page-background {
          background-color: #121212;
          min-height: 100vh;
          padding: 2rem 0;
          color: #fff;
        }
        .custom-card {
          background-color: #1a1a2e;
          border: none;
          border-radius: 1rem;
          box-shadow: 0 4px 10px rgba(0,0,0,0.5);
          color: #fff;
        }
      `}</style>

      <div className="page-background">
        <div className="container" data-aos="fade-up">
          <h2 className="text-center mb-5">Minhas Mentorias Agendadas</h2>
          <div className="row justify-content-center">
            {sessions.length > 0 ? (
              sessions.map((s, idx) => (
                <div
                  key={s.id}
                  className="col-lg-4 col-md-6 d-flex justify-content-center mb-4"
                  data-aos="fade-up"
                  data-aos-delay={idx * 100}
                >
                  <div className="card custom-card w-100" style={{ maxWidth: "350px" }}>
                    <div className="card-body text-center">
                      <p><strong>Mentoria:</strong> {s.name}</p>
                      <p><strong>Mentor:</strong> {s.mentor_name}</p>
                      <p><strong>Data:</strong> {new Date(s.scheduled_date).toLocaleDateString()}</p>
                      <p><strong>Hora:</strong> {new Date(s.scheduled_date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                      <button
                        className="btn btn-outline-light w-100 mt-3"
                        onClick={() => cancelarMentoria(s.id)}
                      >
                        Cancelar Mentoria
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center">Nenhuma mentoria agendada no momento.</p>
            )}
          </div>

          <div className="text-center mt-4">
            <button
              className="btn btn-outline-light btn-lg px-5 py-2"
              onClick={() => navigate("/home")}
            >
              Voltar à Home
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

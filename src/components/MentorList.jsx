import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../AuthContext";
import axios from "axios";

function MentorList() {
  const { mentorado, setMentorCompleto } = useAuth();
  const [mentors, setMentors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!mentorado) return;

    const fetchMentors = async () => {
      try {
        const response = await axios.get(
          `http://44.212.29.224:8000/sugestion/${mentorado[0].id}`
        );
        setMentors(response.data);
        console.log("Mentores alinhados:", response.data);
      } catch (error) {
        console.error("Erro ao buscar mentores alinhados:", error);
      }
    };

    fetchMentors();
  }, [mentorado]);

async function scheduleMentoring(mentor) {
  console.log("Mentor selecionado:", mentor);

  try {
    const mentorResponse = await axios.get(
      `http://44.212.29.224:8000/get-user/${encodeURIComponent(mentor.mail)}`
    );
    const mentorCompleto = mentorResponse.data;
    console.log("Mentor completo obtido:", mentorCompleto);

    const mentorId = mentorCompleto[0].id;
    const mentoredId = mentorado[0].id;

    const disponibilidadeResponse = await axios.get(
      `http://44.212.29.224:8000/disponibilidade?mentor_id=${mentorId}&mentored_id=${mentoredId}`
    );
    const horariosDisponiveis = disponibilidadeResponse.data;
    console.log("Horários disponíveis:", horariosDisponiveis);

    navigate("/schedule-mentoring", {
      state: {
        mentor,
        mentorCompleto,
        horariosDisponiveis,
      },
    });
  } catch (error) {
    console.error("Erro ao agendar mentoria:", error);
    alert("Erro ao buscar informações para agendamento. Tente novamente.");
  }
}


  if (!mentorado) {
    return <p>Carregando mentorado...</p>;
  }

  return (
    <section className="w-100 py-5 bg-dark text-light min-vh-100">
      <div className="container">
        <h2 className="text-center mb-5" data-aos="fade-up">
          Mentores Alinhados com seus interesses
        </h2>
        <div className="row justify-content-center">
          {mentors.length > 0 ? (
            mentors.map((mentor) => (
              <div
                key={mentor.id}
                className="col-lg-4 col-md-6 d-flex justify-content-center mb-4"
                data-aos="fade-up"
                data-aos-delay={mentor.id * 100}
              >
                <div
                  className="card bg-secondary text-light border-0 shadow rounded-4 w-100"
                  style={{ maxWidth: "350px" }}
                >
                  <div className="card-body">
                    <h5 className="card-title">{mentor.name}</h5>
                    <h6 className="card-subtitle mb-2 text-muted">
                      {mentor.areas_of_activity} – {mentor.company_name}
                    </h6>
                    <p className="card-text">{mentor.mail}</p>
                    <button
                      className="btn btn-outline-light w-100 mt-3"
                      onClick={() => scheduleMentoring(mentor)}
                    >
                      Solicitar Mentoria
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>Nenhum mentor alinhado encontrado.</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default MentorList;

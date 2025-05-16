import React, { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from "../AuthContext";
import axios from "axios"

function ScheduleMentoring() {
  const location = useLocation();
  const navigate = useNavigate();

  const { mentorado } = useAuth();

  // Dados recebidos da página anterior
  const mentor = location.state?.mentor;
  const mentorCompleto = location.state?.mentorCompleto;
  const horariosDisponiveis = location.state?.horariosDisponiveis || [];

  // Se não tiver mentor, volta pra home
  if (!mentor || !mentorCompleto) {
    navigate("/");
    return null;
  }

  // Agrupar horários por data para facilitar
  const horariosPorData = useMemo(() => {
    const mapa = {};
    horariosDisponiveis.forEach(({ data, hora }) => {
      if (!mapa[data]) mapa[data] = [];
      mapa[data].push(hora);
    });
    return mapa;
  }, [horariosDisponiveis]);

  const [dataSelecionada, setDataSelecionada] = useState(null);
  const [horarioSelecionado, setHorarioSelecionado] = useState("");

  // Atualiza os horários disponíveis para o dia selecionado
  const horariosDoDia = dataSelecionada
    ? horariosPorData[dataSelecionada.toISOString().split("T")[0]] || []
    : [];

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!dataSelecionada || !horarioSelecionado) {
    alert("Por favor, selecione data e horário.");
    return;
  }

  try {
    const dataISO = dataSelecionada.toISOString().split("T")[0]; // "2025-05-16"
    const scheduledDateTime = `${dataISO} ${horarioSelecionado}:00`; // "2025-05-16 14:00:00"


    const payload = {
      mentor_id: mentorCompleto[0].id,
      mentored_id: mentorado[0].id,
      name: "Agendamento de mentoria", // pode ajustar aqui se quiser
      topic_id: 0, // ajusta aqui se tiver tópico específico
      scheduled_date: scheduledDateTime,
    };

    await axios.post("http://44.212.29.224:8000/schedule", payload);

    alert(
      `Mentoria agendada com sucesso para ${dataSelecionada.toISOString().split("T")[0]} às ${horarioSelecionado}!`
    );
    navigate("/home");
  } catch (error) {
    console.error("Erro ao criar agendamento:", error);
    alert("Erro ao agendar mentoria. Tente novamente.");
  }
};

  return (
    <div className="container min-vw-100 min-vh-100 d-flex align-items-center justify-content-center bg-dark text-light py-5">
      <div
        className="card bg-secondary text-light rounded-4 shadow-lg p-5 w-100"
        style={{ maxWidth: "600px" }}
      >
        <h2 className="mb-4">Agendar Mentoria com {mentor.name}</h2>
        <p>
          <strong>Especialidade:</strong> {mentor.areas_of_activity}
        </p>
        <p>
          <strong>Empresa:</strong> {mentor.company_name}
        </p>
        <p>{mentor.bio}</p>

        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-3">
            <label htmlFor="date" className="form-label">
              Data
            </label>
            <DatePicker
              id="date"
              selected={dataSelecionada}
              onChange={(date) => {
                setDataSelecionada(date);
                setHorarioSelecionado(""); // limpa horário ao mudar data
              }}
              placeholderText="Selecione uma data"
              dateFormat="yyyy-MM-dd"
              className="form-control"
              // Calendário aberto mostrando todos os dias (sem bloqueio)
            />
          </div>

          <div className="mb-3">
            <label htmlFor="time" className="form-label">
              Horário
            </label>
            <select
              id="time"
              className="form-select"
              value={horarioSelecionado}
              onChange={(e) => setHorarioSelecionado(e.target.value)}
              disabled={horariosDoDia.length === 0}
              required
            >
              <option value="" disabled>
                {horariosDoDia.length === 0
                  ? "Selecione um dia com horários disponíveis"
                  : "Selecione um horário"}
              </option>
              {horariosDoDia.map((hora) => (
                <option key={hora} value={hora}>
                  {hora}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-light w-100">
            Agendar
          </button>
        </form>
      </div>
    </div>
  );
}

export default ScheduleMentoring;

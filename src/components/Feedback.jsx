import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import axios from "axios";
import FeedbackMentorTable from "./FeedbackMentorTable";

function Feedback() {
  const { mentorado } = useAuth();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const dadosMentorado = mentorado?.[0] || {};
  const {
    name,
    id
  } = dadosMentorado;

  // Busca feedbacks pelo id do mentorado
  const fetchFeedbacks = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await axios.get(`http://44.212.29.224:8000/feedback/${id}`);
      setFeedbacks(res.data);
    } catch (err) {
      console.error("Erro ao buscar feedbacks:", err);
    } finally {
      setLoading(false);
    }
  };

  // Atualiza o rating de uma mentoria já carregada
  const atualizarMentoriaAvaliada = (mentoringId, rating) => {
    setFeedbacks(prev =>
      prev.map(m =>
        m.id === mentoringId ? { ...m, mentoring_rating: rating } : m
      )
    );
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [id]);

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center bg-dark text-white"
      style={{ height: "100vh" }}
    >
      <h1 className="mb-4" data-aos="fade-down">Olá {name}</h1>

      <FeedbackMentorTable  
        feedbacks={feedbacks}
        loading={loading}
        onFeedbackEnviado={atualizarMentoriaAvaliada}
      />

      <Link
        to="/"
        className="btn btn-outline-light btn-lg px-5 py-3"
        data-aos="zoom-in"
      >
        Voltar para a tela inicial
      </Link>
    </div>
  );
}

export default Feedback;

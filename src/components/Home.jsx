import React, { useEffect, useState } from "react";
import HeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import TestimonialsSection from "./TestimonialsSection";
import SignupSection from "./SignupSection";
import Contact from "./Contact";
import { useAuth } from "../AuthContext";
import axios from "axios";
import '../App.css'; 

const Home = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const sections = [HeroSection, FeaturesSection, TestimonialsSection, SignupSection, Contact];

  const { email, setMentorado } = useAuth();

  useEffect(() => {
    if (email) {
      axios
        .get(`http://44.212.29.224:8000/get-user/${encodeURIComponent(email)}`)
        .then((response) => {
          console.log("Resposta completa do axios:", response);
          console.log("Mentorado recebido:", response.data);
          setMentorado(response.data);
        })
        .catch((error) => {
          console.error("Erro ao buscar mentorado:", error);
        });
    }
  }, [email, setMentorado]);

  useEffect(() => {
    const handleWheel = (event) => {
      if (event.deltaY > 0) {
        if (currentSection < sections.length - 1) {
          setCurrentSection((prev) => prev + 1);
        }
      } else {
        if (currentSection > 0) {
          setCurrentSection((prev) => prev - 1);
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [currentSection]);

  useEffect(() => {
    const sectionElement = document.getElementById(sections[currentSection].name);
    if (sectionElement) {
      sectionElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [currentSection]);

  return (
    <div>
      <div id="HeroSection"><HeroSection /></div>
      <div id="FeaturesSection"><FeaturesSection /></div>
      <div id="TestimonialsSection"><TestimonialsSection /></div>
      <div id="SignupSection"><SignupSection /></div>
      <div id="Contact"><Contact /></div>
    </div>
  );
};

export default Home;

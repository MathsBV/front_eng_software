import React, { createContext, useContext, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [mentorado, setMentorado] = useState(null);
  const [mentorCompleto, setMentorCompleto] = useState(null); 

  const login = async (role, userEmail) => {
    try {
      const response = await axios.get(`http://44.212.29.224:8000/get-user/${encodeURIComponent(userEmail)}`);

      const mentoradoData = response.data;

      setUser({ isAuthenticated: true, role, email: userEmail });
      setMentorado(mentoradoData);

      console.log("Login bem-sucedido. Mentorado:", mentoradoData);
      return true;
    } catch (error) {
      console.error("Erro ao buscar mentorado no login:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setMentorado(null);
    setMentorCompleto(null); // limpa também o mentor completo
  };

  return (
    <AuthContext.Provider value={{ user, mentorado, mentorCompleto, setMentorCompleto, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

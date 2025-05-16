import Home from './components/Home';
import React from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from './components/Register';
import RegisterMentor from './components/RegisterMentor';
import RegisterMentored from './components/RegisterMentored';
import Main from './components/Main';
import Login from './components/Login';
import LoginPage from './components/LoginPage';
import ScheduleMentoring from './components/ScheduleMentoring';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './AuthContext';
import Unauthorized from './components/Unauthorized';
import MentoringManagement from './components/MentoringManagement';
import Feedback from "./components/Feedback";

AOS.init();

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/register' element={<Register />} />
          <Route path='/register-mentor' element={<RegisterMentor />} />
          <Route path='/register-mentored' element={<RegisterMentored />} />
          <Route path='/login' element={<Login />} />
          <Route path='/login-page' element={<LoginPage />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route 
            path='/schedule-mentoring' 
            element={
              <ProtectedRoute allowedRoles={["Mentorado"]}>
                <ScheduleMentoring />
              </ProtectedRoute>
            } 
          />
          <Route 
            path='/home' 
            element={
              <ProtectedRoute allowedRoles={["Mentorado"]}>
                <Main />
              </ProtectedRoute>
            }
            />
                    <Route
            path="/mentoring-management"
            element={
              <ProtectedRoute allowedRoles={["Mentorado"]}>
                <MentoringManagement />
              </ProtectedRoute>
            }
           />

          {/** Rota do Suporte **/}
          <Route
            path="/feedback"
            element={
              <ProtectedRoute allowedRoles={["Mentorado"]}>
                <Feedback />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

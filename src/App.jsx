import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css"; // Importing CSS

const App = () => {
  const [user, setUser] = useState(localStorage.getItem("user") || "");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [exams, setExams] = useState(() => {
    const savedExams = localStorage.getItem("exams");
    return savedExams ? JSON.parse(savedExams) : [];
  });

  const [subject, setSubject] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    localStorage.setItem("exams", JSON.stringify(exams));
  }, [exams]);

  useEffect(() => {
    exams.forEach((exam) => {
      const examDateTime = new Date(`${exam.date}T${exam.time}`);
      const timeDifference = examDateTime - new Date();
      if (timeDifference > 0 && timeDifference < 86400000) {
        toast.info(`📢 Reminder: ${exam.subject} exam in 24 hours!`);
      }
    });
  }, [exams]);

  const handleSignup = () => {
    if (!email || !password || !confirmPassword) {
      toast.error("⚠️ Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("❌ Passwords do not match!");
      return;
    }
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userPassword", password);
    setIsSignup(false);
    toast.success("✅ Sign Up Successful! Please log in.");
  };

  const handleLogin = () => {
    const savedEmail = localStorage.getItem("userEmail");
    const savedPassword = localStorage.getItem("userPassword");
    if (email === savedEmail && password === savedPassword) {
      localStorage.setItem("user", email);
      setUser(email);
      toast.success("✅ Login Successful!");
    } else {
      toast.error("❌ Invalid email or password!");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser("");
    toast.info("👋 Logged out successfully!");
  };

  const addExam = () => {
    if (!subject || !date || !time) {
      toast.error("⚠️ Please fill in all fields.");
      return;
    }
    setExams([...exams, { subject, date, time }]);
    setSubject("");
    setDate("");
    setTime("");
    toast.success("✅ Exam added successfully!");
  };

  const deleteExam = (index) => {
    setExams(exams.filter((_, i) => i !== index));
    toast.warn("🗑️ Exam deleted!");
  };

  return (
    <div className="container">
      <ToastContainer position="top-right" autoClose={3000} />
      {user ? (
        <div className="card">
          <h1 className="title">📅 Exam Scheduler</h1>
          <button onClick={handleLogout} className="logout-btn">Logout</button>

          {/* Exam Form */}
          <div className="form">
            <input type="text" placeholder="Enter Subject" value={subject} onChange={(e) => setSubject(e.target.value)} className="input-field" />
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input-field" />
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="input-field" />
            <button onClick={addExam} className="add-button">Add Exam</button>
          </div>

          {/* Exam List */}
          <div className="exam-list">
            <h2 className="sub-title">📖 Upcoming Exams</h2>
            {exams.length === 0 ? (
              <p className="no-exams">No exams scheduled</p>
            ) : (
              <ul>
                {exams.map((exam, index) => (
                  <li key={index} className="exam-item">
                    <div>
                      <p className="exam-subject">{exam.subject}</p>
                      <p className="exam-details">{exam.date} at {exam.time}</p>
                    </div>
                    <button onClick={() => deleteExam(index)} className="delete-button">Delete</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : (
        <div className="login-card">
          <h1 className="title">{isSignup ? "🔐 Sign Up" : "🔑 Login"}</h1>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" />
          {isSignup && <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="input-field" />}
          <button onClick={isSignup ? handleSignup : handleLogin} className="add-button">{isSignup ? "Sign Up" : "Login"}</button>
          <p className="toggle-text" onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? "Already have an account? Login" : "New user? Sign Up"}
          </p>
        </div>
      )}
    </div>
  );
};

export default App;

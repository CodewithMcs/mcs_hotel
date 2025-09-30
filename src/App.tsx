import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("loggedIn");
    if (stored === "true") setLoggedIn(true);
  }, []);

  const handleSetLoggedIn = (value: boolean) => {
    setLoggedIn(value);
    localStorage.setItem("loggedIn", value.toString());
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={!loggedIn ? <LoginPage setLoggedIn={handleSetLoggedIn} /> : <Navigate to="/" />}
        />
        <Route
          path="/*"
          element={loggedIn ? <DashboardPage setLoggedIn={handleSetLoggedIn} /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;

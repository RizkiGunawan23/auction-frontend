import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { ProgressSpinner } from "primereact/progressspinner";
import Login from "./views/auth/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Auction from "./views/auction/Auction";
import Owner from "./views/owner/Owner";
import Register from "./views/auth/Register";
import NotFound from "./views/NotFound";

function App() {
  const navigate = useNavigate();
  const initialState = {
    name: "",
    username: "",
    email: "",
    role: "",
  };

  const [user, setUser] = useState(initialState);
  const [loading, setLoading] = useState(true);
  const [isUserAvailable, setIsUserAvailable] = useState(false);

  const getCurrentUser = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(
        "http://localhost:3000/api/v1/auth/get-user",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.data) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Get Current User error:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkUserAvailable = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/v1/auth/check-user",
        { withCredentials: true }
      );

      setIsUserAvailable(response.data.hasUser);
    } catch (error) {
      console.error("Check user error:", error);
    }
  };

  useEffect(() => {
    getCurrentUser();
    checkUserAvailable();
  }, []);

  useEffect(() => {
    if (user && user.role === "user") {
      navigate("/auction");
    } else if (user && user.role === "owner") {
      navigate("/owner");
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:3000/api/v1/auth/logout",
        {},
        { withCredentials: true }
      );
      localStorage.removeItem("token");
      setUser(initialState);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    return (
      <div style={styles.spinnerContainer}>
        <ProgressSpinner />
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route index element={<Login setUser={setUser} />} />
        <Route path="login" element={<Login setUser={setUser} />} />
        <Route
          path="register"
          element={
            !isUserAvailable ? (
              <Register setUser={setUser} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="auction"
          element={
            <ProtectedRoute
              redirectPath="/login"
              isAllowed={user && user.role === "user"}
            >
              <Auction handleLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="owner"
          element={
            <ProtectedRoute
              redirectPath="/login"
              isAllowed={user && user.role === "owner"}
            >
              <Owner handleLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound user={user} />} />
      </Routes>
    </>
  );
}

const styles = {
  spinnerContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f0f0f0",
  },
};

export default App;

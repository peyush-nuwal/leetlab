// src/page/AuthCallback.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { setAuthUserFromToken } = useAuthStore();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      // Optional: store in localStorage
      localStorage.setItem("token", token);

      // Optional: decode and store user from token
      setAuthUserFromToken(token);

      navigate("/"); // to homepage
    } else {
      navigate("/login");
    }
  }, []);

  return <p>Redirecting...</p>;
};

export default AuthCallback;


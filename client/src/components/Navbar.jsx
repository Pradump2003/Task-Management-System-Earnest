import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    checkAuth();


    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav style={navbarStyle}>
      <div style={navContainerStyle}>
        <h1 style={logoStyle}>
          <Link to="/" style={linkStyle}>
            Task Manager
          </Link>
        </h1>
        <div style={navLinksStyle}>
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" style={linkStyle}>
                Dashboard
              </Link>
              <button onClick={handleLogout} style={buttonStyle}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={linkStyle}>
                Login
              </Link>
              <Link to="/register" style={linkStyle}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const navbarStyle = {
  backgroundColor: "#333",
  padding: "1rem",
  color: "white",
  position: "sticky",
  top: 0,
};

const navContainerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  maxWidth: "1200px",
  margin: "0 auto",
};

const logoStyle = {
  margin: 0,
  fontSize: "1.5rem",
};

const navLinksStyle = {
  display: "flex",
  gap: "1rem",
  alignItems: "center",
};

const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontSize: "1rem",
};

const buttonStyle = {
  backgroundColor: "#ff6b6b",
  color: "white",
  border: "none",
  padding: "0.5rem 1rem",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "1rem",
};

export default Navbar;
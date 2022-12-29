import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import "./Auth.css";
import icon from "../../assets/icon.png";
import AboutAuth from "./AboutAuth";
import { signup, login } from "../../actions/auth";
const Auth = () => {
  const { isSignup } = useParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Enter email and password");
      return;
    }
    if (isSignup==="Signup") {
      if (!name) {
        alert("Enter a name to continue");
      }
      dispatch(signup({ name, email, password }, navigate));
    } else {
      dispatch(login({ email, password }, navigate, setErrorMessage));
    }
  };

  const [errorMessage, setErrorMessage] = useState(null);

  return (
    <section className="auth-section">
      {isSignup==="Signup" && <AboutAuth />}
      <div className="auth-container-2">
        {isSignup==="Login" && (
          <img src={icon} alt="stack overflow" className="login-logo" />
        )}
        <form onSubmit={handleSubmit}>
          {isSignup==="Signup" && (
            <label htmlFor="name">
              <h4>Display Name</h4>
              <input
                type="text"
                id="name"
                name="name"
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </label>
          )}
          <label htmlFor="email">
            <h4>Email</h4>
            <input
              type="email"
              name="email"
              id="email"
              onChange={(e) => {
                setEmail(e.target.value);
                setErrorMessage(null);
              }}
            />
          </label>
          <label htmlFor="password">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h4>Password</h4>
              {!isSignup==="Login" && (
                <p style={{ color: "#007ac6", fontSize: "13px" }}>
                  forgot password?
                </p>
              )}
            </div>
            <input
              type="password"
              name="password"
              id="password"
              onChange={(e) => {
                setPassword(e.target.value);
                setErrorMessage(null);
              }}
            />
            {isSignup==="Signup" && (
              <p style={{ color: "#666767", fontSize: "13px" }}>
                Passwords must contain at least eight characters, including at
                least 1 letter and 1 number.
              </p>
            )}
          </label>
          {isSignup==="Signup" && (
            <label htmlFor="check">
              <input type="checkbox" id="check" />
              <p style={{ fontSize: "13px", margin: "10px" }}>
                Opt-in to receive occasional product updates, user research
                invitations, company announcements and digests.
              </p>
            </label>
          )}
          <button type="submit" className="auth-btn">
            {isSignup==="Signup" ? "Sign up" : "Login"}
          </button>
          {isSignup==="Signup" && (
            <p style={{ color: "#666767", fontSize: "13px" }}>
              By clicking "Sign up", you agree to our
              <span className="terms"> terms of service</span>,
              <span className="terms"> privacy policy</span> and
              <span className="terms"> cookie policy</span>.
            </p>
          )}
          {isSignup==="Login" && <p className="error-message">{errorMessage}</p>}
        </form>
        <p>
          {isSignup==="Signup" ? "already have an account?" : "Don't have an account?"}
          
          <Link to={isSignup==="Login"? "/Auth/Signup":"/Auth/Login"} className="nav-item nav-links">
            <button
              type="button"
              className="handle-switch-btn"
            >
              {isSignup==="Signup" ? "Log In" : "Sign Up"}
            </button>
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Auth;

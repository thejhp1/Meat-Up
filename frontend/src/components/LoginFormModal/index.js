import React, { useEffect, useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import SignupFormModal from "../SignupFormModal";
import { useHistory } from "react-router-dom";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [validateError, setValidateError] = useState({});
  const [keepSignedIn1, setKeepSignedIn1] = useState("");
  const [keepSignedIn2, setKeepSignedIn2] = useState("hidden");
  const [passState1, setPassState1] = useState("");
  const [passState2, setPassState2] = useState("hidden");
  const [showPass, setShowPass] = useState("password");
  const { closeModal } = useModal();
  const history = useHistory();

  useEffect(() => {
    const validateError = {};
    if (credential.length < 4) {
      validateError.credential = "Email must be atleast 4 characters";
    } else if (password.length < 6) {
      validateError.password = "Password must be atleast 6 characters";
    }
    setValidateError(validateError);
  }, [credential, password]);

  // NEED TO IMPLEMENT A PAGE TO "ISSUE WITH LOGIN PAGE" TO IN FUTURE
  const loginIssue = () => {
    alert('Feature coming soon!')
    // closeModal();
    // history.push("/groups");
  };

  //NEED TO IMPLEMENT A "FORGOT PASSWORD" PAGE
  const forgotPassword = () => {
    alert('Feature coming soon!')
    // closeModal();
    // history.push("/groups");
  };

  //NEED TO IMPLEMENT KEEPING SIGNED IN FUTURE IF BOX IS CHECKED
  const keepSignedInSwitch = () => {
    alert('Feature coming soon!')
    if (keepSignedIn1 === "hidden") {
      setKeepSignedIn1("");
      setKeepSignedIn2("hidden");
    } else if (keepSignedIn2 === "hidden") {
      setKeepSignedIn2("");
      setKeepSignedIn1("hidden");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  const revealPass = () => {
    if (passState1 === "hidden") {
      setShowPass("password");
      setPassState1("");
      setPassState2("hidden");
    } else if (passState2 === "hidden") {
      setShowPass("text");
      setPassState2("");
      setPassState1("hidden");
    }
  };

  const sendToFB = () => {
    alert('Feature coming soon!')
    // window.location.href = "https://facebook.com";
  };
  const sendToG = () => {
    alert('Feature coming soon!')
    // window.location.href = "https://google.com";
  };
  const sendToA = () => {
    alert('Feature coming soon!')
    // window.location.href = "https://apple.com";
  };

  return (
    <>
      <i className="fa-sharp fa-solid fa-xmark fa-xl" onClick={closeModal}></i>
      <section className="login-modal-header-container">
        <div className="login-modal-icon">
          <i class="fa-brands fa-meetup"></i>
        </div>
        <h1
          className="login-modal-title"
          style={{ display: "flex", justifyContent: "center" }}
        >
          Log in
        </h1>
        <div className="login-modal-signup">
          <span>Not a member yet?</span>
          <span className="signup-modal">
            <OpenModalMenuItem
              itemText="Sign up"
              modalComponent={<SignupFormModal />}
            />
          </span>
        </div>
      </section>
      <form className="login-modal" onSubmit={handleSubmit}>
        <label className="login-modal-label-login">Email</label>
        <input
          className="login-modal-input"
          type="text"
          value={credential}
          onChange={(e) => setCredential(e.target.value)}
          required
        />
        <div className="login-modal-label-container">
          <label className="login-modal-label-password">Password</label>
          <span
            onClick={forgotPassword}
            className="login-modal-label-forgot-password"
          >
            Forgot password
          </span>
        </div>
        <div className="login-modal-reveal-pass-container">
          <input
            type="checkbox"
            className="login-modal-reveal-pass"
            onClick={revealPass}
          ></input>
        </div>
        <i
          className={`fa-sharp fa-solid fa-eye-slash reveal-pass fa-sm ${passState1}`}
        ></i>
        <i
          className={`fa-sharp fa-solid fa-eye reveal-pass fa-sm ${passState2}`}
        ></i>
        <input
          className="login-modal-input input-password"
          type={showPass}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {errors.credential && <p>{errors.credential}</p>}
        <div className="login-modal-keep-signed-in">
          <input
            type="checkbox"
            className="login-modal-keep-signed-in-checkout"
            onClick={keepSignedInSwitch}
          ></input>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            className={`login-modal-keep-signed-in-icon ${keepSignedIn1}`}
          >
            <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"></path>
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            className={`login-modal-keep-signed-in-icon ${keepSignedIn2}`}
          >
            <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path>
          </svg>
          <span>Keep me signed in</span>
        </div>
        <button
          disabled={Object.values(validateError).length}
          className="login-modal-button"
          type="submit"
        >
          Log in
        </button>
      </form>
      <div className="login-modal-separator">
        <p className="login-modal-separator-border"> </p>
        <p className="login-modal-separator-center">or</p>
        <p className="login-modal-separator-border"> </p>
      </div>
      <section className="login-modal-link-container">
        <i className="fas fa-brands fa-facebook-f fa-xl"></i>
        <button onClick={sendToFB} className="login-modal-link fb">
          Log in with Facebook
        </button>
        <img
          alt=""
          className="fa-g"
          width="24"
          height="24"
          src="https://secure.meetupstatic.com/next/images/login/google.svg?w=48"
        ></img>
        <button onClick={sendToG} className="login-modal-link g">
          Log in with Google
        </button>
        <i class="fas fa-brands fa-apple fa-xl"></i>
        <button onClick={sendToA} className="login-modal-link a">
          Log in with Apple
        </button>
      </section>
      <span
        style={{
          color: "rgb(0, 121, 138)",
          display: "flex",
          justifyContent: "center",
          marginTop: "2rem",
          fontSize: "14px",
          cursor: "pointer",
        }}
        onClick={loginIssue}
      >
        Issues with log in?
      </span>
    </>
  );
}

export default LoginFormModal;

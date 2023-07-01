import React, { useEffect, useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import SignupFormModal from "../SignupFormModal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [keepSignedIn1, setKeepSignedIn1] = useState('')
  const [keepSignedIn2, setKeepSignedIn2] = useState('hidden')
  const { closeModal } = useModal();

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


  const keepSignedInSwitch = () => {
    if (keepSignedIn1 === "hidden") {
      setKeepSignedIn1("")
      setKeepSignedIn2("hidden")
    } else if (keepSignedIn2 === "hidden") {
      setKeepSignedIn2("")
      setKeepSignedIn1("hidden")
    }
  }


  return (
    <>
      <section className="login-modal-header-container">
        <div className="login-modal-icon">
          <i class="fa-brands fa-meetup"></i>
        </div>
        <h1 className="login-modal-title" style={{display: "flex", justifyContent: "center"}}>Log in</h1>
        <div className="login-modal-signup">
          <span>Not a member yet?</span>
          <span className="signup-modal">
            <OpenModalMenuItem itemText="Sign up" modalComponent={<SignupFormModal />}/>
          </span>
        </div>
      </section>
      <form className="login-modal" onSubmit={handleSubmit}>
        <label className="login-modal-label-login">
          Email
        </label>
          <input
            className="login-modal-input"
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        <label className="login-modal-label-password">
          Password
        </label>
          <input
            className="login-modal-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        {errors.credential && <p>{errors.credential}</p>}
        <div className="login-modal-keep-signed-in">
          <input type="checkbox" className="login-modal-keep-signed-in-checkout" onClick={keepSignedInSwitch}></input>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"  className={`login-modal-keep-signed-in-icon ${keepSignedIn1}`}><path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"></path></svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" className={`login-modal-keep-signed-in-icon ${keepSignedIn2}`}><path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg>
          <span>Keep me signed in</span>
        </div>
        <button className="login-modal-button" type="submit">Log in</button>
      </form>
      <div className="login-modal-separator">
        <p className="login-modal-separator-border"> </p>
        <p className="login-modal-separator-center">or</p>
        <p className="login-modal-separator-border"> </p>
      </div>
      <section className="login-modal-link-container">
        <button className="login-modal-link fb">Log in with Facebook</button>
        <button className="login-modal-link g">Log in with Google</button>
        <button className="login-modal-link a">Log in with Apple</button>
      </section>
      <span style={{color: "rgb(4, 82, 86)", display: "flex", justifyContent: "center", marginTop: "2rem", fontSize: "14px", fontWeight: "500"}}>Issues with log in?</span>
    </>
  );
}

export default LoginFormModal;

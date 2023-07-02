import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import LoginFormModal from "../LoginFormModal";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [validateError, setValidateError] = useState({});
  const { closeModal } = useModal();

  useEffect(() => {
    const validateError = {};
    if (!firstName.length) {
      validateError.firstName = "First name cannot be empty";
    } else if (!lastName.length) {
      validateError.lastName = "Last name cannot be empty";
    } else if (username.length < 4) {
      validateError.username = "Username cannot be less than 4 characters";
    } else if (password.length < 6) {
      validateError.password = "Password cannot be less than 6 characters";
    } else if (password !== confirmPassword) {
      validateError.password = "Passwords do not match";
    } else if (!email.length) {
      validateError.email = "Email cannot be empty";
    }

    setValidateError(validateError);
  }, [email, username, firstName, lastName, password, confirmPassword]);
  console.log(validateError);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) {
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword:
        "Confirm Password field must be the same as the Password field",
    });
  };

  return (
    <>
      <section className="signup-modal-container">
        <div className="login-modal-icon">
          <i class="fa-brands fa-meetup"></i>
        </div>
        <h1>Sign Up</h1>
        <div className="signup-modal-login">
          <span>Already a Member?</span>
          <span className="signup-modal">
            <OpenModalMenuItem
              itemText="Log in"
              modalComponent={<LoginFormModal />}
            />
          </span>
        </div>
        <form className="signup-modal-input-form" onSubmit={handleSubmit}>
          <label>
            {" "}
            First Name
            <input
              type="text"
              className="signup-modal-inputs"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </label>
          {errors.firstName && <p>{errors.firstName}</p>}
          <label>
            {" "}
            Last Name
            <input
              type="text"
              className="signup-modal-inputs"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </label>
          {errors.lastName && <p>{errors.lastName}</p>}
          <label>
            {" "}
            Email
            <input
              type="text"
              className="signup-modal-inputs"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          {errors.email && <p>{errors.email}</p>}
          <label>
            {" "}
            Username
            <input
              type="text"
              className="signup-modal-inputs"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
          {errors.username && <p>{errors.username}</p>}

          <label>
            {" "}
            Password
            <input
              type="password"
              className="signup-modal-inputs"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {errors.password && <p>{errors.password}</p>}
          <label>
            {" "}
            Confirm Password
            <input
              type="password"
              className="signup-modal-inputs"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </label>
          {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
          <button
            className="signup-modal-button"
            type="submit"
            disabled={Object.values(validateError).length}
          >
            Sign Up
          </button>
        </form>
      </section>
    </>
  );
}

export default SignupFormModal;

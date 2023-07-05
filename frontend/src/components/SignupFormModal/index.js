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
    }
    if (!lastName.length) {
      validateError.lastName = "Last name cannot be empty";
    }
    if (username.length < 4) {
      validateError.username = "Username cannot be less than 4 characters";
    }

    if (!password) {
      validateError.password = "Password cannot be empty";
    } else if (password.length < 6) {
      validateError.password = "Password cannot be less than 6 characters";
    } else if (password.length !== confirmPassword.length) {
      validateError.password = "Passwords do not match";
    }

    if (!email.length) {
      validateError.email = "Email cannot be empty";
    }
    setValidateError(validateError);
  }, [email, username, firstName, lastName, password, confirmPassword]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (firstName.length > 30) {
      errors.firstName = "First name cannot exceed 30 characters"
    }

    if (lastName.length > 30) {
      errors.lastName = "Last name cannot exceed 30 characters"
    }

    if (email.length > 256) {
      errors.email = "Email cannot exceed 256 characters"
    }

    if(username.length > 30) {
      errors.username = "Username cannot exceed 30 characters"
    }

    if(password.length > 60) {
      errors.password = "Password cannot exceed 60 characters"
    }

    if (!email.includes("@")) {
      errors.email = "Invalid email";
    } else if (
      !email.endsWith(".org") &&
      !email.endsWith(".com") &&
      !email.endsWith(".gov") &&
      !email.endsWith(".edu") &&
      !email.endsWith(".net")
    ) {
      errors.email = "Invalid email, must end with org/com/gov/net/edu";
    } else if (email.includes("@")) {
      let count = 0
      for (let ele of email.split("")) {
        if (ele === "@") {
          count++
        }
      }
      if (count > 1) {
        errors.email = "Invalid email"
      }
    }
    if (password !== confirmPassword) {
      errors.password = "Passwords do not match";
    }


    if (Object.values(errors).length === 0) {
      dispatch(
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

    setErrors(errors);
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
              placeholder="First name must be at least 1 character..."
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </label>
          {errors.firstName && (
            <p className="signup-modal-errors-firstname">{errors.firstName}</p>
          )}
          <label>
            {" "}
            Last Name
            <input
              type="text"
              className="signup-modal-inputs"
              placeholder="Last name must be at least 1 character..."
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </label>
          {errors.lastName && (
            <p className="signup-modal-errors-lastname">{errors.lastName}</p>
          )}
          <label>
            {" "}
            Email
            <input
              type="text"
              className="signup-modal-inputs"
              placeholder="Enter a valid email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          {errors.email && (
            <p className="signup-modal-errors-email">{errors.email}</p>
          )}
          <label>
            {" "}
            Username
            <input
              type="text"
              className="signup-modal-inputs"
              placeholder="Username must be at least 4 characters..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
          {errors.username && (
            <p className="signup-modal-errors-username">{errors.username}</p>
          )}
          <label>
            {" "}
            Password
            <input
              type="password"
              placeholder="Password must be at least 4 characters"
              className="signup-modal-inputs"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {errors.password && (
            <p className="signup-modal-errors-password-1">{errors.password}</p>
          )}
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
          {errors.password && (
            <p className="signup-modal-errors-password-2">{errors.password}</p>
          )}
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

import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import Logo from "../../images/logo.png"
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);
  return (
    <div className="navi-bar">
        <div className="navi-home">
          <NavLink style={{ textDecoration: "none" }} exact to="/">
            <img src={Logo} alt="" className="navi-logo"></img>
          </NavLink>
        </div>
        {isLoaded && (
            <>
            {sessionUser ? (
              <ProfileButton user={sessionUser} />
            ) : (
              <div className="navi-login-container">
                <div className="navi-login-login">
                <OpenModalMenuItem
                  itemText="Log in"
                  modalComponent={<LoginFormModal />}
                />
                </div>
                <div className="navi-login-signup">
                <OpenModalMenuItem
                  itemText="Sign up"
                  modalComponent={<SignupFormModal />}
                />
                </div>
              </div >
            )}
            </>
        )}
    </div>
  );
}

export default Navigation;

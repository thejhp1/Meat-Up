import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import * as sessionActions from "../../store/session";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
    history.push("/");
  };

  const toGroups = (e) => {
    e.preventDefault();
    closeMenu();
    history.push("/groups");
  };

  const toEvents = (e) => {
    e.preventDefault();
    closeMenu();
    history.push("/events");
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");
  const ulClassNames =
    "fas fa-regular fa-angle-" + (showMenu ? "up fa-xl" : "down fa-xl");
  return (
    <>
      <div className="navi-icons">
        <span
          onClick={() => history.push("/groups/new")}
          className="navi-icon-new-group"
        >
          Start a new group
        </span>
        <button onClick={openMenu} className="navi-button">
          <i className="fas fa-user-circle fa-xl" />
        </button>
        <i className={ulClassNames} onClick={openMenu}></i>
        <ul className={ulClassName} ref={ulRef}>
          {user ? (
            <div className="profile-dropdown-container">
              <li>Hello, {user.firstName}</li>
              <li>{user.email}</li>
              <li className="profile-dropdown-group-container">
                <span onClick={toGroups}>View groups</span>
              </li>
              <li className="profile-dropdown-event-container">
                <span onClick={toEvents}>View events</span>
              </li>
              <li className="profile-dropdown-logout-container">
                <span onClick={logout}>Log out</span>
              </li>
            </div>
          ) : (
            <>
              <OpenModalMenuItem
                itemText="Log In"
                onItemClick={closeMenu}
                modalComponent={<LoginFormModal />}
              />
              <OpenModalMenuItem
                itemText="Sign Up"
                onItemClick={closeMenu}
                modalComponent={<SignupFormModal />}
              />
            </>
          )}
        </ul>
      </div>
    </>
  );
}

export default ProfileButton;

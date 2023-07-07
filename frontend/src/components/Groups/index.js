import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { thunkGetAllGroups } from "../../store/groups";
import { GroupsListIndex } from "./GroupsListIndex";
import ScaleLoader from "react-spinners/PulseLoader";
import "./Groups.css";

export const Groups = () => {
  const dispatch = useDispatch();
  const groupStore = useSelector((state) => state.groups);
  const groups = Object.values(groupStore);

  useEffect(() => {
    dispatch(thunkGetAllGroups());
  }, [dispatch]);

  let flag = false;
  if (
    Object.values(groupStore).length <= 0 ||
    Object.values(groupStore).length === 1
  ) {
    flag = true;
  }

  return (
    <>
      {flag === true ? (
        <>
          <h1 className="loading-icon-header">LOADING...</h1>
          <ScaleLoader
            className="loading-icon"
            color="#00798A"
            size={80}
            margin="80"
            speedMultiplier="1"
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "1rem",
            }}
          />
        </>
      ) : (
        <div className="group-list">
          <div className="group-list-header-container">
            <Link className="group-list-header-events" to="/events">
              Events
            </Link>
            <Link className="group-list-header-groups" to="/groups">
              Groups
            </Link>
            <p>Groups in Meetup</p>
          </div>
          <p className="group-list-border"></p>
          {groups.map((group) => (
            <>
              <GroupsListIndex group={group} key={group.id} />
              <p className="group-list-border"></p>
            </>
          ))}
        </div>
      )}
    </>
  );
};

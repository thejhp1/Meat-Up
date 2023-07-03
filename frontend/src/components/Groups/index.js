import React, { useEffect } from "react";
import "./Groups.css";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { thunkGetAllGroups } from "../../store/groups"
import { GroupsListIndex } from "./GroupsListIndex";

export const Groups = () => {
  const dispatch = useDispatch()
  const groupStore = useSelector(state => state.groups)
  const groups = Object.values(groupStore)

  useEffect(() => {
    dispatch(thunkGetAllGroups())
  }, [dispatch])

  return (
    <div className="group-list">
      <div className="group-list-header-container">
        <Link className="group-list-header-events" to="/events">Events</Link>
        <Link className="group-list-header-groups" to="/groups">Groups</Link>
        <p>Groups in Meetup</p>
      </div>
      <p className="group-list-border"></p>
      {groups.map((group) => (
          <>
            <GroupsListIndex group={group} key={group.id}/>
            <p className="group-list-border"></p>
          </>
      ))}
    </div>
  );
};

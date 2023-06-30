import React, { useEffect } from "react";
import "./Groups.css";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllGroups } from "../../store/groups"
import { GroupsListIndex } from "./GroupsListIndex";

export const Groups = () => {
  const dispatch = useDispatch()
  const groupStore = useSelector(state => state.groups)
  const groups = Object.values(groupStore)
  console.log(groups)
  useEffect(() => {
    dispatch(getAllGroups())
  }, [dispatch])

  return (
    <div>
      <Link to="/api/events">Events</Link>
      <ul>
        {groups.map((group) => (
            <GroupsListIndex group={group} key={group.id}/>
        ))}
      </ul>
    </div>
  );
};

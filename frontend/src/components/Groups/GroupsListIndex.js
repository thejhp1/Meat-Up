import React from "react";
import { Link } from "react-router-dom";

export const GroupsListIndex = ({ group }) => {
  console.log("groups:", group);
  return (
    <>
      <Link to={`/groups/${group.id}`}>{group.name}</Link>
    </>
  );
};

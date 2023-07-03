import React from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

export const GroupsListIndex = ({ group }) => {
  const history = useHistory()
  if (group.previewImage === "no preview image"){
    group.previewImage = "https://vishwaentertainers.com/wp-content/uploads/2020/04/No-Preview-Available.jpg"
  }

  const eventPrivateCheck = () => {
    if (group.private === true) {
      return "events: Private"
    } else {
      return "events: Public"
    }
  }

  const sentToGroup = () => {
    history.push(`/groups/${group.id}`)
  }

  return (
    <div className="group-list-container">
      <img onClick={sentToGroup} className="group-list-image" width="240" height="160" src={`${group.previewImage}`}></img>
      <Link className="group-list-name" to={{pathname:`/groups/${group.id}`, state: {}}}>{group.name}</Link>
      <p onClick={sentToGroup} className="group-list-location">{group.city}, {group.state}</p>
      <p onClick={sentToGroup} className="group-list-descrip">{group.about}</p>
      <p onClick={sentToGroup} className="group-list-event">{group.Events.length} · {eventPrivateCheck()}</p>
    </div>
  );
};

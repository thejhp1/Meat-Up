import React from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

export const EventsListIndex = ({ event }) => {
  const history = useHistory();
  console.log(event)
  if (event.previewImage === "no preview image" || event.previewImage === undefined){
    event.previewImage = "https://vishwaentertainers.com/wp-content/uploads/2020/04/No-Preview-Available.jpg"
  }
  const sentToEvent = () => {
    history.push(`/events/${event.id}`);
  };
  return (
    <>
      <div className="event-list-container">
        <img
          onClick={sentToEvent}
          className="event-list-image"
          width="240"
          height="160"
          src={`${event.previewImage}`}
        ></img>
        <div className="event-list-info-container">
        <p className="event-list-info-time" onClick={sentToEvent}>
          {event.startDate.split("T")[0]} · {"<"}
          {event.startDate.split("T")[1].split(".")[0]}
          {">"}
        </p>
        <Link
          className="event-list-name"
          to={{ pathname: `/events/${event.id}`, state: {} }}
        >
          {event.name}
        </Link>
        <p className="event-list-info-location" onClick={sentToEvent}>
                  {event.Group.city}, {event.Group.state}
        </p>
        </div>
      </div>
    </>
  );
};

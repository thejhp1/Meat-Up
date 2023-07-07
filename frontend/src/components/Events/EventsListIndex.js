import React from "react";
import { useHistory } from "react-router-dom";

export const EventsListIndex = ({ event }) => {
  const history = useHistory();
  if (
    event.previewImage === "no preview image" ||
    event.previewImage === undefined
  ) {
    event.previewImage =
      "https://vishwaentertainers.com/wp-content/uploads/2020/04/No-Preview-Available.jpg";
  }

  const sentToEvent = () => {
    history.push(`/events/${event.id}`);
  };

  return (
    <>
      <div
        onClick={sentToEvent}
        style={{ cursor: "pointer" }}
        className="event-list-container"
      >
        <img
          className="event-list-image"
          width="240"
          height="160"
          src={`${event.previewImage}`}
          alt=""
        ></img>
        <div className="event-list-info-container">
          <p className="event-list-info-time">
            {event.startDate.split("T")[0]} · {"<"}
            {event.startDate.split("T")[1].split(".")[0]}
            {">"}
          </p>
          <span
            className="event-list-name"
            to={{ pathname: `/events/${event.id}`, state: {} }}
          >
            {event.name}
          </span>
          <p className="event-list-info-location">
            {event.Group.city}, {event.Group.state}
          </p>
        </div>
      </div>
    </>
  );
};

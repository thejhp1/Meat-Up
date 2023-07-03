import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { thunkGetAllEvents } from "../../store/events";
import { EventsListIndex } from "../Events/EventsListIndex";
import "./Events.css";

export const Events = () => {
    const dispatch = useDispatch();
  const eventStore = useSelector((state) => state.events);
  const events = Object.values(eventStore);

  useEffect(() => {
    dispatch(thunkGetAllEvents());
  }, [dispatch]);

  return (
    <>
      <div className="event-list">
        <div className="event-list-header-container">
          <Link className="event-list-header-events" to="/events">
            Events
          </Link>
          <Link className="event-list-header-groups" to="/groups">
            Groups
          </Link>
          <p>Events in Meetup</p>
        </div>
        <p className="event-list-border"></p>
        {events.map((event) => (
          <>
            <EventsListIndex event={event} />
            <p className="event-list-border"></p>
          </>
        ))}
      </div>
    </>
  );
};

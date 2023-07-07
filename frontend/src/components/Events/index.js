import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { thunkGetAllEvents } from "../../store/events";
import { EventsListIndex } from "../Events/EventsListIndex";
import "./Events.css";

export const Events = () => {
  const dispatch = useDispatch();
  const eventStore = useSelector((state) => state.events);
  const eventsArr = Object.values(eventStore);
  const time = new Date();
  const upcomingEvent = [];
  const pastEvent = [];

  useEffect(() => {
    dispatch(thunkGetAllEvents());
  }, [dispatch]);

  for (let event of eventsArr) {
    if (new Date(event.startDate) > time) {
      upcomingEvent.push(event);
    } else {
      pastEvent.push(event);
    }
  }

  upcomingEvent.sort((a, b) => {
    return new Date(a.startDate) - new Date(b.startDate);
  });

  pastEvent.sort((a, b) => {
    return new Date(b.startDate) - new Date(a.startDate);
  });

  const events = upcomingEvent.concat(pastEvent);

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

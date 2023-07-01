import React from "react";
import { Link } from "react-router-dom";
import GroupImage from "../../images/handsUp.svg";
import EventImage from "../../images/ticket.svg";
import NewGroupImage from "../../images/joinGroup.svg";
import { useSelector } from "react-redux";

export const GroupEventLinks = () => {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <div className="group-event-links">
      <h2>How Meatup works</h2>
      <p>
        Meet new people who share your interests through online and in-person
        events. It's free to create an account.
      </p>
      <div className="link-container">
        <div className="group-image">
          <img alt="" src={GroupImage}></img>
          <Link className="link" to={"/groups"}>
            See all groups
          </Link>
          <p>
            Do what you love, meet others who love it, find your community. The
            rest is history!
          </p>
        </div>
        <div className="event-image">
          <img alt="" src={EventImage}></img>
          <Link className="link" to={"/events"}>
            Find an event
          </Link>
          <p>
            Events are happening on just about any topic you can think of, from
            online gaming and photography to yoga and hiking.
          </p>
        </div>
        <div className="join-image">
          <img alt="" src={NewGroupImage}></img>
          {sessionUser ? (
            <Link
              className="link"
              to={"/groups"}
            >
              Start a group
            </Link>
          ) : (
            <span className="join-group">Start a group</span>
          )}
          <p>
            You don't have to be an expert to gather people together and explore
            shared interests.
          </p>
        </div>
      </div>
    </div>
  );
};

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useHistory } from "react-router-dom";
import { thunkGetEventDetail } from "../../store/events";
import { EventDetailButton } from "./EventDetailButton.js";
import ScaleLoader from "react-spinners/PulseLoader";

export const EventDetail = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { eventId } = useParams();
  const eventStore = useSelector((state) => state.events);
  const event = eventStore[eventId];
  let flag = false;

  useEffect(() => {
    dispatch(thunkGetEventDetail(eventId));
  }, [dispatch, eventId]);

  if (event === undefined) {
    flag = true;
  }

  for (let event of Object.values(eventStore)) {
    if (!Object.keys(event).includes("EventImages")) {
      flag = true;
    }
  }

  if (Object.values(eventStore).length <= 0) {
    flag = true;
  }

  const eventPrivateCheck = () => {
    if (event.Group.private === true) {
      return "Private";
    } else {
      return "Public";
    }
  };

  const sendToGroup = () => {
    history.push(`/groups/${event.Group.id}`);
  };

  const imageCheck = () => {
    if (event.EventImages.length <= 0) {
      return "https://vishwaentertainers.com/wp-content/uploads/2020/04/No-Preview-Available.jpg";
    } else {
      return `${event.EventImages[0].url}`;
    }
  };

  const eventPriceCheck = () => {
    if (event.price <= 0) {
      return "FREE";
    } else {
      return `Price: $${event.price}`;
    }
  };

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
        <>
          <div className="event-detail-container">
            <div className="event-detail-breadcrumb">
              <p>{"<"}</p>
              <Link
                style={{
                  fontSize: "12px",
                  fontWeight: "500",
                  color: "#00798A",
                }}
                to="/events"
              >
                Events
              </Link>
            </div>
            <div className="event-detail-header-container">
              <h2>{event.name}</h2>
              <p>
                Hosted by {event.Group.Organizer.firstName}{" "}
                {event.Group.Organizer.lastName}
              </p>
            </div>
          </div>
          <div className="event-detail-body-container">
            <div className="event-detail-body-info">
              <img
                className="event-detail-body-image"
                width="450"
                height="250"
                alt=""
                src={imageCheck()}
              ></img>
              <div className="event-detail-body-info-group">
                <img
                  onClick={sendToGroup}
                  className="event-detail-body-info-group-image"
                  width="100"
                  alt=""
                  height="75"
                  src={`${event.Group.GroupImages[0].url}`}
                ></img>
                <div className="event-detail-body-info-group-body">
                  <h4 onClick={sendToGroup}>{event.Group.name}</h4>
                  <p onClick={sendToGroup}>{eventPrivateCheck()}</p>
                </div>
              </div>
              <div className="event-detail-body-info-event">
                <div className="event-detail-body-info-event-time-details">
                  <i
                    class="far fa-clock fa-lg"
                    style={{ color: "#CCCCCC" }}
                  ></i>
                  <div className="event-detail-body-info-event-details-time-container">
                    <div className="event-detail-body-info-event-details-start-time">
                      <span>START </span>
                      <div>
                        {event.startDate.split("T")[0]} · {"<"}
                        {event.startDate.split("T")[1].split(".")[0]}
                        {">"}
                      </div>
                    </div>
                    <div className="event-detail-body-info-event-details-end-time">
                      <span>END </span>
                      <div>
                        {event.endDate.split("T")[0]} · {"<"}
                        {event.endDate.split("T")[1].split(".")[0]}
                        {">"}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="event-detail-body-info-event-price-details">
                  <i
                    class="fa-solid fa-sack-dollar fa-xl"
                    style={{ color: "#CCCCCC" }}
                  ></i>
                  <p>{eventPriceCheck()}</p>
                </div>
                <div className="event-detail-body-info-event-type-details">
                  <i
                    class="fa-solid fa-map-pin fa-xl"
                    style={{ color: "#CCCCCC" }}
                  ></i>
                  <p>{event.type}</p>
                </div>
                <div className="event-detail-body-info-event-button">
                  <EventDetailButton event={event} />
                </div>
              </div>
            </div>
            <div className="event-detail-body-description">
              <h2 style={{ marginBottom: ".25rem" }}>Details</h2>
              <p>{event.description}</p>
            </div>
          </div>
        </>
      )}
    </>
  );
};

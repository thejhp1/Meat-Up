import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ScaleLoader from "react-spinners/PulseLoader";
import { Link } from "react-router-dom";
import { thunkGetEventDetail } from "../../store/events";
import { useHistory } from "react-router-dom";

export const EventDetail = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { eventId } = useParams();
  const eventStore = useSelector((state) => state.events);
  const event = eventStore[eventId];
  let flag = false;

  console.log(event);

  useEffect(() => {
    dispatch(thunkGetEventDetail(eventId));
  }, [dispatch]);

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
    console.log("asdasdasd");
    if (event.EventImages.length <= 0) {
      return "https://vishwaentertainers.com/wp-content/uploads/2020/04/No-Preview-Available.jpg";
    } else {
      return `${event.EventImages[0].url}`;
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
              <p>Hosted by asd asd</p>
            </div>
          </div>
          <div className="event-detail-body-container">
            <div className="event-detail-body-info">
              <img
                className="event-detail-body-image"
                width="450"
                height="250"
                src={imageCheck()}
              ></img>
              <div className="event-detail-body-info-group">
                <img
                  onClick={sendToGroup}
                  className="event-detail-body-info-group-image"
                  width="100"
                  height="75"
                  src={`${event.Group.GroupImages[0].url}`}
                ></img>
                <div className="event-detail-body-info-group-body">
                  <h4 onClick={sendToGroup}>{event.Group.name}</h4>
                  <p onClick={sendToGroup}>{eventPrivateCheck()}</p>
                </div>
              </div>
              <div className="event-detail-body-info-event">
                <h1>asd</h1>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
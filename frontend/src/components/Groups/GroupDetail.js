import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkGetGroupDetail } from "../../store/groups";
import { useParams } from "react-router-dom";
import ScaleLoader from "react-spinners/PulseLoader";
import { Link } from "react-router-dom";
import { GroupDetailPageEvents } from "./GroupDetailPageEvents";
import { GroupDetailButton } from "./GroupDetailButton";

export const GroupDetail = () => {
  const dispatch = useDispatch();
  const { groupId } = useParams();
  let flag = false;
  const groupStore = useSelector((state) => state.groups);

  useEffect(() => {
    dispatch(thunkGetGroupDetail(groupId));
  }, [dispatch]);

  const group = groupStore[groupId];

  for (let group of Object.values(groupStore)) {
    if (!Object.keys(group).includes("GroupImages")) {
      flag = true;
    }
  }

  if (Object.values(groupStore).length <= 0) {
    flag = true;
  }

  const eventPrivateCheck = () => {
    if (group.private === true) {
      return "events: Private";
    } else {
      return "events: Public";
    }
  };

  const imageCheck = () => {
    if (group.GroupImages.length <= 0) {
      return "https://vishwaentertainers.com/wp-content/uploads/2020/04/No-Preview-Available.jpg";
    } else {
      return `${group.GroupImages[0].url}`;
    }
  };

  const eventsCheck = () => {
    if (group.Events === undefined) {
      return <h2 style={{marginTop:".2rem"}}>No Coming Events</h2>
    } else {
      return <GroupDetailPageEvents events={group.Events}/>
    }
  }

  const eventsLengthCheck = () => {
    if (group.Events === undefined) {
      return "0"
    } else {
      return group.Events.length
    }
  }

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
          <div className="group-detail-container">
            <div className="group-detail-breadcrumb">
              <p>{"<"}</p>
              <Link
                style={{ fontSize: "12px", fontWeight: "500", color:"#00798A" }}
                to="/groups"
              >
                Groups
              </Link>
            </div>
            <div className="group-detail-header-container">
              <img
                className="group-detail-header-image"
                width="475"
                height="250"
                src={imageCheck()}
              ></img>
              <div className="group-detail-header-info">
                <h2>{group.name}</h2>
                <p>
                  {group.city}, {group.state}
                </p>
                <p>
                {eventsLengthCheck()} · {eventPrivateCheck()}
                </p>
                <p>
                  Organized by {group.Organizer.firstName}{" "}
                  {group.Organizer.lastName}
                </p>
              </div>
              <div className="group-detail-header-button-container">
                <GroupDetailButton group={group}/>
              </div>
            </div>
          </div>
          <div className="group-detail-body-container">
            <div className="group-detail-organizer-container">
              <h2>Organizer</h2>
              <p>
                {group.Organizer.firstName} {group.Organizer.lastName}
              </p>
            </div>
            <div className="group-detail-about-container">
              <h2>What we're about</h2>
              <p>{group.about}</p>
            </div>
            <div className="group-detail-event-container">
                {eventsCheck()}
            </div>
          </div>
        </>
      )}
    </>
  );
};

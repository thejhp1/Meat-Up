import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkGetGroupDetail } from "../../store/groups";
import { useParams } from "react-router-dom";
import ScaleLoader from "react-spinners/PulseLoader";
import { Link } from "react-router-dom";
import { GroupDetailPageEvents } from "./GroupDetailPageEvents";

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
  console.log(flag)
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
                style={{ fontSize: "12px", fontWeight: "500" }}
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
                src={`${group.GroupImages[0].url}`}
              ></img>
              <div className="group-detail-header-info">
                <h2>{group.name}</h2>
                <p>
                  {group.city}, {group.state}
                </p>
                <p>
                  {group.Events.length} · {eventPrivateCheck()}
                </p>
                <p>
                  Organized by {group.Organizer.firstName}{" "}
                  {group.Organizer.lastName}
                </p>
              </div>
              <div className="group-detail-header-button-container">
                <button className="group-detail-header-button">
                  Join this group
                </button>
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
                <GroupDetailPageEvents events={group.Events} group={group}/>
            </div>
          </div>
        </>
      )}
    </>
  );
};

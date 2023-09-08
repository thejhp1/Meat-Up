import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { thunkGetGroupDetail } from "../../store/groups";
import { GroupDetailPageEvents } from "./GroupDetailPageEvents";
import { GroupDetailButton } from "./GroupDetailButton";
import ScaleLoader from "react-spinners/PulseLoader";
import VenueButtons from "./VenueButtons";
import { thunkApproveMember, thunkDeleteMember, thunkGetAllMembers } from "../../store/members";

export const GroupDetail = () => {
  const dispatch = useDispatch();
  const { groupId } = useParams();
  let flag = false;
  const groupStore = useSelector((state) => state.groups);
  const sessionUser = useSelector((state) => state.session?.user);
  const membersStore = useSelector((state) => state.members);

  useEffect(() => {
    dispatch(thunkGetGroupDetail(groupId));
  }, [dispatch, groupId]);

  useEffect(() => {
    dispatch(thunkGetAllMembers(groupId));
  }, [dispatch, groupId])

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
      return "Private";
    } else {
      return "Public";
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
      return <h2 style={{ marginTop: ".2rem" }}>No Upcoming Events</h2>;
    } else {
      return <GroupDetailPageEvents events={group.Events} />;
    }
  };

  const eventsLengthCheck = () => {
    if (group.Events === undefined) {
      return "0";
    } else {
      return group.Events.length;
    }
  };

  const approveMember = (member) => {
    const safeMember = {
      groupId: group.id,
      member: {
        memberId: member.id,
        status: "member"
      }
    }
    dispatch(thunkApproveMember(safeMember))
  }

  const rejectMember = (member) => {
    const safeMember = {
      groupId: group.id,
      member: {
       memberId: member.id,
      }
    };
    dispatch(thunkDeleteMember(safeMember))
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
                style={{
                  fontSize: "12px",
                  fontWeight: "500",
                  color: "#00798A",
                }}
                to="/groups"
              >
                Groups
              </Link>
            </div>
            <div className="group-detail-header-container">
              <img
                alt=""
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
                  {eventsLengthCheck() + " events"} · {eventPrivateCheck()}
                </p>
                <p>
                  Organized by: {group.Organizer.firstName}{" "}
                  {group.Organizer.lastName}
                </p>
              </div>
              <div className="group-detail-header-button-container">
                <GroupDetailButton group={group} members={Object.values(membersStore)} />
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
            <div className="group-detail-header-venue-container">
              <h2>Venue Info</h2>
              <p>{`${group.Venues[0]?.address || "No" } ${group.Venues[0]?.city || "venue"} ${group.Venues[0]?.state || "found"}`}</p>
              {(sessionUser.id === group.organizerId) ?
              <div className="group-detail-header-venue-menu-options">
                <VenueButtons group={group}/>
              </div>
              : <div className="group-detail-header-venue-menu-options" />}
            </div>
            <div className="group-detail-membership-container">
              <h2>Members</h2>
              <h4>Name and Membership Status</h4>
              {Object.values(membersStore).map((member) => (
                <div key={member.id} className="group-detail-membership-info">
                  {member.id === sessionUser.id ? <i className="fa-solid fa-star"></i>:<i className="fa-solid fa-user"></i> }
                  <p>{member.firstName} {member.lastName} | {member.Membership.status}</p>
                  {member.Membership.status === "pending" ? <div className="group-detail-membership-buttons"><button onClick={() => approveMember(member)}>Approve</button> <button onClick={() => rejectMember(member)}>Reject</button></div> : ""}
                </div>
              ))}
            </div>
            <div className="group-detail-event-container">{eventsCheck()}</div>
          </div>
        </>
      )}
    </>
  );
};

import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import DeleteModal from "../DeleteModal";
import { thunkDeleteMember, thunkRequestMember } from "../../store/members";

export const GroupDetailButton = ({ group, members }) => {
  const sessionUser = useSelector((state) => state.session.user);
  const dispatch = useDispatch();
  const history = useHistory();
  let customStyle;
  let flag = true;

  if (!sessionUser) {
    return;
  } else if (sessionUser.id === group.organizerId) {
    flag = false;
  }

  for (let member of members) {
    if (member.id === sessionUser.id) {
      flag = false;
    }
  }

  //FEATURE COMING SOON
  const joinGroup = () => {
    dispatch(thunkRequestMember(group.id));
  };

  const createGroup = () => {
    history.push(`/groups/${group.id}/events/new`);
  };

  function updateGroup() {
    history.push(`/groups/${group.id}/edit`);
  }

  const leaveGroup = () => {
    const safeMember = {
      groupId: group.id,
      member: {
       memberId: sessionUser.id,
      }
    };
    dispatch(thunkDeleteMember(safeMember));
  }
  return (
    <>
      {flag === true ? (
        <button
          style={customStyle}
          onClick={joinGroup}
          className="group-detail-header-button"
        >
          Join this group
        </button>
      ) : sessionUser.id === group.organizerId ? (
        <div className="group-detail-header-organizer-buttons">
          <button
            className="group-detail-header-organizer-button-create-event"
            onClick={() => createGroup()}
          >
            Create Event
          </button>
          <button
            className="group-detail-header-organizer-button-update"
            onClick={() => updateGroup()}
          >
            Update
          </button>
          <button className="group-detail-header-organizer-button-delete">
            <OpenModalMenuItem
              itemText="Delete"
              modalComponent={<DeleteModal type={"group"} />}
            />
          </button>
        </div>
      ) : (
        <div className="group-detail-header-member-button">
          <button onClick={leaveGroup}>Leave Group</button>
        </div>
      )}
    </>
  );
};

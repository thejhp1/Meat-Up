import { useSelector } from "react-redux";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import DeleteGroupModal from "../DeleteGroupModal";
import { useHistory } from "react-router-dom";
import { EventDetail } from "../Events/EventDetail";

export const GroupDetailButton = ({ group }) => {
  const sessionUser = useSelector((state) => state.session.user);
  const history = useHistory()
  let customStyle;
  let flag = true;
  if (!sessionUser) {
    return;
  } else if (sessionUser.id === group.organizerId) {
    flag = false;
  }

  //FEATURE COMING SOON
  const joinGroup = () => {
    alert("Feature coming soon");
  };

  const createGroup = () => {
    history.push(`/groups/${group.id}/events/new`)
  }

  function updateGroup () {
    history.push(`/groups/${group.id}/edit`)
  };
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
      ) : (
        <div className="group-detail-header-organizer-buttons">
          <button className="group-detail-header-organizer-button-create-event" onClick={() => createGroup()}>
            Create Group
          </button>
          <button className="group-detail-header-organizer-button-update" onClick={() => updateGroup()}>
            Update
          </button>
          <button className="group-detail-header-organizer-button-delete">
            <OpenModalMenuItem
              itemText="Delete"
              modalComponent={<DeleteGroupModal />}
            />
          </button>
        </div>
      )}
    </>
  );
};

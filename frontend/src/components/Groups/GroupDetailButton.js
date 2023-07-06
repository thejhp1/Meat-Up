import { useSelector } from "react-redux";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import DeleteGroupModal from "../DeleteGroupModal";

export const GroupDetailButton = ({ group }) => {
  const sessionUser = useSelector((state) => state.session.user);
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

  const deleteModal = () => {
    return (
      <span className="delete-modal">
        <OpenModalMenuItem
          itemText="Delete Group"
          modalComponent={<DeleteGroupModal />}
        />
      </span>
    );
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
          <button className="group-detail-header-organizer-button-create-event">
            Create event
          </button>
          <button className="group-detail-header-organizer-button-update">
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

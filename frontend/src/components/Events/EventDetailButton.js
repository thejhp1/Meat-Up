import { useSelector } from "react-redux";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import DeleteModal from "../DeleteModal";
import { useHistory } from "react-router-dom";

export const EventDetailButton = ({ event }) => {
  const sessionUser = useSelector((state) => state.session.user);
  const history = useHistory();
  let flag = false;

  if (!sessionUser) {
    return;
  } else if (event.Group.Organizer.id === sessionUser.id) {
    flag = true;
  }

  return (
    <>
      {flag ? (
        <>
          <button onClick={() => history.push(`/events/${event.id}/edit`)}>Update</button>
          <button className="delete-modal-button-event">
            <OpenModalMenuItem
              itemText="Delete"
              modalComponent={<DeleteModal type="event" event={event} />}
            />
          </button>
        </>
      ) : (
        ""
      )}
    </>
  );
};

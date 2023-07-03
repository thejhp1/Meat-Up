import { useSelector } from "react-redux";

export const EventDetailButton = ({ event }) => {
  const sessionUser = useSelector((state) => state.session.user);
  let flag = false;

  if (!sessionUser) {
    return;
  } else if (event.Group.id === sessionUser.id) {
    flag = true;
  }

  return (
    <>
      {flag ? (
        <>
          <button onClick={() => alert("Feature coming soon!")}>Update</button>
          <div></div>
          <button>Delete</button>
        </>
      ) : (
        ""
      )}
    </>
  );
};

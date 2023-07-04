import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import ScaleLoader from "react-spinners/PulseLoader";

export const CreateGroup = () => {
  const session = useSelector((state) => state.session);
  const history = useHistory();

  const userCheck = () => {
    setTimeout(() => {
      return history.push("/not-found");
    }, [3000]);
  };

  const submissionCheck = () => {
    console.log("asdddd");
  };

  return (
    <>
      {session.user ? (
        <div className="create-group-container">
          <p style={{ color: "#00798A", marginTop: "1rem", fontSize: "14px" }}>
            BECOME AN ORGANIZER
          </p>
          <p>
            We'll walk you through a few steps to build your local community
          </p>
          <p className="create-group-border"></p>
          <p style={{ marginTop: ".5rem" }}>
            First, set your group's location.
          </p>
          <p
            style={{ fontSize: "12px", maxWidth: "22rem", marginTop: ".1rem" }}
          >
            Meatup groups meet locally, in person and online. We'll connect you
            with people in your area, and more can join you online.
          </p>
          <input placeholder="City, STATE" style={{ fontSize: "11px" }}></input>
          <p className="create-group-borders"></p>
          <p style={{ marginTop: ".55rem" }}>
            What will your groups's name be?
          </p>
          <p
            style={{ fontSize: "12px", maxWidth: "22rem", marginTop: ".1rem" }}
          >
            Choose a name that will give people a clear idea of what the group
            is about. Feel free to get creative! You can edit this later if you
            change your mind.
          </p>
          <input
            placeholder="What is your group name?"
            style={{ fontSize: "11px" }}
          ></input>
          <p className="create-group-borders"></p>
          <p style={{ marginTop: ".55rem" }}>
            Now describe what your group will be about
          </p>
          <p
            style={{ fontSize: "12px", maxWidth: "22rem", marginTop: ".1rem" }}
          >
            People will see this when we promote your group, but you'll be able
            to add to it later, too.
          </p>
          <p
            style={{ fontSize: "12px", maxWidth: "22rem", marginTop: ".75rem" }}
          >
            1. What's the purpose of the group?
          </p>
          <p
            style={{ fontSize: "12px", maxWidth: "22rem", marginTop: ".1rem" }}
          >
            2. Who should join?
          </p>
          <p
            style={{
              fontSize: "12px",
              maxWidth: "22rem",
              marginTop: ".1rem",
              marginBottom: ".75rem",
            }}
          >
            3. What willyou do at your events?
          </p>
          <textarea
            placeholder="Please write at least 30 characters"
            style={{
              resize: "none",
              fontSize: "11px",
              height: "8rem",
              width: "16rem",
              backgroundColor: "rgb(232, 240, 254)",
              border: "2.5px solid black",
            }}
          ></textarea>
          <p
            className="create-group-borders"
            style={{ marginTop: ".8rem" }}
          ></p>
          <p style={{ marginTop: ".55rem" }}>Final steps...</p>
          <p
            style={{ fontSize: "12px", maxWidth: "22rem", marginTop: ".1rem" }}
          >
            Is this an in person or online group?
          </p>
          <select className="create-group-select-location">
            <option calue="select">{"(select one)"}</option>
            <option value="In person">In person</option>
            <option value="Online">Online</option>
          </select>
          <p
            style={{ fontSize: "12px", maxWidth: "22rem", marginTop: ".1rem" }}
          >
            Is this group private or public?
          </p>
          <select className="create-group-select-private">
            <option calue="select">{"(select one)"}</option>
            <option value="Private">Private</option>
            <option value="Public">Public</option>
          </select>
          <p
            style={{ fontSize: "12px", maxWidth: "22rem", marginTop: ".1rem" }}
          >
            Please add an image url for your group below:
          </p>
          <input
            placeholder="What is your group name?"
            style={{ fontSize: "11px", marginTop: ".4rem" }}
          ></input>
          <p className="create-group-borders" style={{}}></p>
          <button onClick={submissionCheck()}>Create group</button>
        </div>
      ) : (
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
            onAnimationStart={userCheck()}
          />
        </>
      )}
    </>
  );
};

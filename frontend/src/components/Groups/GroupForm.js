import { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { thunkCreateGroup, thunkUpdateGroup } from "../../store/groups";
import PulseLoader from "react-spinners/PulseLoader";

export const GroupForm = ({ formType, group }) => {
  const session = useSelector((state) => state.session);
  const dispatch = useDispatch();
  const history = useHistory();
  const [location, setLocation] = useState(
    group ? `${group.city}, ${group.state}` : ""
  );
  const [name, setName] = useState(group ? group.name : "");
  const [description, setDescription] = useState(group ? group.about : "");
  const [groupType, setGroupType] = useState(group ? group.type : "");
  const [visibilityType, setVisibilityType] = useState(
    group ? (group.private === true ? "private" : "public") : ""
  );
  const [imageURL, setImageURL] = useState(
    group ? (group.GroupImages ? group.GroupImages[0].url : "") : ""
  );
  const [errors, setErrors] = useState("");
  const states = [
    "AL",
    "AZ",
    "AR",
    "CA",
    "CO",
    "CT",
    "DE",
    "FL",
    "GA",
    "ID",
    "IL",
    "IN",
    "IA",
    "KS",
    "KY",
    "LA",
    "ME",
    "MD",
    "MA",
    "MI",
    "MN",
    "MS",
    "MO",
    "MT",
    "NE",
    "NV",
    "NH",
    "NJ",
    "NM",
    "NY",
    "NC",
    "ND",
    "OH",
    "OK",
    "OR",
    "PA",
    "RI",
    "SC",
    "SD",
    "TN",
    "TX",
    "UT",
    "VT",
    "VA",
    "WA",
    "WV",
    "WI",
    "WY",
  ];

  const userCheck = () => {
    const userCheckTimeout = setTimeout(() => {
      if (!session.user) {
        return history.push("/not-found");
      }
    }, 1000);
    if (session.user) {
      clearTimeout(userCheckTimeout);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formType === "Create") {
      const errors = {};

      if (!location) {
        errors.location = "Location is required";
      } else if (!location.includes(",")) {
        errors.location =
          'Location must be in "City, STATE" format. Ex. "New York, NY"';
      } else if (location.split(",")[0].length < 0) {
        errors.location = "Must provide a city";
      } else if (location.split(",")[1].trim().length !== 2) {
        errors.location =
          'Location must be in "City, STATE" format. Ex. "New York, NY"';
      } else if (
        !states.includes(location.split(",")[1].trim().toUpperCase())
      ) {
        errors.location = "Must be within the 48 contigous states";
      }

      if (!name) {
        errors.name = "Name is required";
      } else if (name.length > 60) {
        errors.name = "Name cannot be more than 60 characters";
      }

      if (!description) {
        errors.description = "Description is required";
      } else if (description.length < 50) {
        errors.description = "Description must be at least 50 characters long";
      }

      if (!groupType) {
        errors.groupType = "Group Type is required";
      }

      if (!visibilityType) {
        errors.visibilityType = "Visibility Type is required";
      }

      if (!imageURL) {
        errors.imageURL = "Image URL is required";
      } else if (
        !imageURL.endsWith(".jpeg") &&
        !imageURL.endsWith(".jpg") &&
        !imageURL.endsWith(".png")
      ) {
        errors.imageURL = "Image URL must end with .png, .jpg, or .jpeg";
      }

      if (Object.values(errors).length === 0) {
        let cityArr = location.split(",")[0].trim().split(" ");
        let cityResult = [];
        for (let city of cityArr) {
          cityResult.push(
            city.replace(city.split("")[0], city.split("")[0].toUpperCase())
          );
        }

        const nameArr = name.split(",")[0].trim().split(" ");
        let nameResult = [];
        for (let name of nameArr) {
          nameResult.push(
            name.replace(name.split("")[0], name.split("")[0].toUpperCase())
          );
        }

        const form = {
          name: nameResult.join(" "),
          about: description,
          type: groupType,
          private: visibilityType,
          city: cityResult.join(" "),
          state: location.split(",")[1].trim().toUpperCase(),
          url: imageURL,
        };
        dispatch(thunkCreateGroup(form));
      }
      setErrors(errors);
    } else if (formType === "Update") {
      const errors = {};

      if (!location) {
        errors.location = "Location is required";
      } else if (!location.includes(",")) {
        errors.location =
          'Location must be in "City, STATE" format. Ex. "New York, NY"';
      } else if (location.split(",")[0].length <= 0) {
        errors.location = "Must provide a city";
      } else if (location.split(",")[1].trim().length !== 2) {
        errors.location =
          'Location must be in "City, STATE" format. Ex. "New York, NY"';
      } else if (
        !states.includes(location.split(",")[1].trim().toUpperCase())
      ) {
        errors.location = "Must be within the 48 contigous states";
      }

      if (!name) {
        errors.name = "Name is required";
      } else if (name.length > 60) {
        errors.name = "Name cannot be more than 60 characters";
      }

      if (!description) {
        errors.description = "Description is required";
      } else if (description.length < 50) {
        errors.description = "Description must be at least 50 characters long";
      }

      if (!groupType) {
        errors.groupType = "Group Type is required";
      }

      if (visibilityType === "nothing") {
        errors.visibilityType = "Visibility Type is required";
      }

      if (!imageURL) {
        errors.imageURL = "Image URL is required";
      } else if (
        !imageURL.endsWith(".jpeg") &&
        !imageURL.endsWith(".jpg") &&
        !imageURL.endsWith(".png")
      ) {
        errors.imageURL = "Image URL must end with .png, .jpg, or .jpeg";
      }

      if (Object.values(errors).length === 0) {
        let cityArr = location.split(",")[0].trim().split(" ");
        let cityResult = [];
        for (let city of cityArr) {
          cityResult.push(
            city.replace(city.split("")[0], city.split("")[0].toUpperCase())
          );
        }

        const nameArr = name.split(",")[0].trim().split(" ");
        let nameResult = [];
        for (let name of nameArr) {
          nameResult.push(
            name.replace(name.split("")[0], name.split("")[0].toUpperCase())
          );
        }

        if (visibilityType === "private") {
          setVisibilityType(true);
        } else if (visibilityType === "public") {
          setVisibilityType(false);
        }

        const form = {
          id: group.id,
          name: nameResult.join(" "),
          about: description,
          type: groupType,
          private: visibilityType === "private" ? "true" : "false",
          city: cityResult.join(" "),
          state: location.split(",")[1].trim().toUpperCase(),
          url: imageURL,
        };
        dispatch(thunkUpdateGroup(form));
      }
      setErrors(errors);
    }
  };

  return (
    <>
      {formType === "Update" ? (
        session.user ? (
          <form onSubmit={handleSubmit}>
            <div className="create-group-container">
              <p
                style={{
                  color: "#00798A",
                  marginTop: "1rem",
                  fontSize: "14px",
                }}
              >
                UPDATE YOUR GROUP
              </p>
              <p>
                We'll walk you through a few steps to update your local
                community
              </p>
              <p className="create-group-border"></p>
              <p style={{ marginTop: ".5rem" }}>Set your group's location.</p>
              <p
                style={{
                  fontSize: "12px",
                  maxWidth: "22rem",
                  marginTop: ".1rem",
                }}
              >
                Meetup groups meet locally, in person, and online. We'll connect
                you with people in your area.
              </p>
              <input
                style={{ fontSize: "11px" }}
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                }}
              ></input>
              <span className="create-group-errors-section-1">
                {errors && errors.location}
              </span>
              <p className="create-group-borders"></p>
              <p style={{ marginTop: ".65rem" }}>
                What will your groups's name be?
              </p>
              <p
                style={{
                  fontSize: "12px",
                  maxWidth: "22rem",
                  marginTop: ".1rem",
                }}
              >
                Choose a name that will give people a clear idea of what the
                group is about. Feel free to get creative! You can edit this
                later if you change your mind.
              </p>
              <input
                placeholder="What is your group name?"
                style={{ fontSize: "11px" }}
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></input>
              <span className="create-group-errors-section-1">
                {errors && errors.name}
              </span>
              <p className="create-group-borders"></p>
              <p style={{ marginTop: ".65rem" }}>
                Describe the purpose of your group.
              </p>
              <p
                style={{
                  fontSize: "12px",
                  maxWidth: "22rem",
                  marginTop: ".1rem",
                }}
              >
                People will see this when we promote your group, but you'll be
                able to add to it later, too.
              </p>
              <p
                style={{
                  fontSize: "12px",
                  maxWidth: "22rem",
                  marginTop: ".75rem",
                }}
              >
                1. What's the purpose of the group?
              </p>
              <p
                style={{
                  fontSize: "12px",
                  maxWidth: "22rem",
                  marginTop: ".1rem",
                }}
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
                3. What will you do at your events?
              </p>
              <textarea
                placeholder="Please write at least 50 characters"
                style={{
                  resize: "none",
                  fontSize: "11px",
                  height: "8rem",
                  width: "16rem",
                  backgroundColor: "rgb(232, 240, 254)",
                  border: "2.5px solid black",
                }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
              <span className="create-group-errors-section-2">
                {errors && errors.description}
              </span>
              <p
                className="create-group-borders"
                style={{ marginTop: "1rem" }}
              ></p>
              <p style={{ marginTop: ".65rem" }}>Final steps...</p>
              <p
                style={{
                  fontSize: "12px",
                  maxWidth: "22rem",
                  marginTop: ".1rem",
                }}
              >
                Is this an in-person or online group?
              </p>
              <select
                style={{ height: "1.6rem" }}
                className="create-group-select-location"
                value={groupType}
                onChange={(e) => setGroupType(e.target.value)}
              >
                <option value="nothing">{"(select one)"}</option>
                <option value="In person">In person</option>
                <option value="Online">Online</option>
              </select>
              <span className="create-group-errors-section-3">
                {errors && errors.groupType}
              </span>
              <p
                style={{
                  fontSize: "12px",
                  maxWidth: "22rem",
                  marginTop: ".1rem",
                }}
              >
                Is this group private or public?
              </p>
              <select
                style={{ height: "1.6rem" }}
                className="create-group-select-private"
                value={visibilityType}
                onChange={(e) => setVisibilityType(e.target.value)}
              >
                <option value="select">{"(select one)"}</option>
                <option value="private">Private</option>
                <option value="public">Public</option>
              </select>
              <span className="create-group-errors-section-3">
                {errors && errors.visibilityType}
              </span>
              <p
                style={{
                  fontSize: "12px",
                  maxWidth: "22rem",
                  marginTop: ".1rem",
                }}
              >
                Please add an image url for your group below:
              </p>
              <input
                placeholder="Image URL"
                style={{ fontSize: "11px", marginTop: ".4rem" }}
                value={imageURL}
                onChange={(e) => setImageURL(e.target.value)}
              ></input>
              <span className="create-group-errors-section-4">
                {errors && errors.imageURL}
              </span>
              <p className="create-group-borders" style={{}}></p>
              <button type="submit">Update group</button>
            </div>
          </form>
        ) : (
          <>
            <h1 className="loading-icon-header">LOADING...</h1>
            <PulseLoader
              className="loading-icon"
              color="#00798A"
              size={80}
              margin="80"
              speedMultiplier="1"
              animation-duration="3s"
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "1rem",
              }}
              onAnimationIteration={userCheck}
            />
          </>
        )
      ) : (
        ""
      )}
      {formType === "Create" ? (
        session.user ? (
          <form onSubmit={handleSubmit}>
            <div className="create-group-container">
              <p
                style={{
                  color: "#00798A",
                  marginTop: "1rem",
                  fontSize: "14px",
                }}
              >
                START A NEW GROUP
              </p>
              <p>
                We'll walk you through a few steps to build your local community
              </p>
              <p className="create-group-border"></p>
              <p style={{ marginTop: ".5rem" }}>Set your group's location.</p>
              <p
                style={{
                  fontSize: "12px",
                  maxWidth: "22rem",
                  marginTop: ".1rem",
                }}
              >
                Meetup groups meet locally, in person, and online. We'll connect
                you with people in your area.
              </p>
              <input
                placeholder="City, STATE"
                style={{ fontSize: "11px" }}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              ></input>
              <span className="create-group-errors-section-1">
                {errors && errors.location}
              </span>
              <p className="create-group-borders"></p>
              <p style={{ marginTop: ".65rem" }}>
                What will your groups's name be?
              </p>
              <p
                style={{
                  fontSize: "12px",
                  maxWidth: "22rem",
                  marginTop: ".1rem",
                }}
              >
                Choose a name that will give people a clear idea of what the
                group is about. Feel free to get creative! You can edit this
                later if you change your mind.
              </p>
              <input
                placeholder="What is your group name?"
                style={{ fontSize: "11px" }}
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></input>
              <span className="create-group-errors-section-1">
                {errors && errors.name}
              </span>
              <p className="create-group-borders"></p>
              <p style={{ marginTop: ".65rem" }}>
                Describe the purpose of your group.
              </p>
              <p
                style={{
                  fontSize: "12px",
                  maxWidth: "22rem",
                  marginTop: ".1rem",
                }}
              >
                People will see this when we promote your group, but you'll be
                able to add to it later, too.
              </p>
              <p
                style={{
                  fontSize: "12px",
                  maxWidth: "22rem",
                  marginTop: ".75rem",
                }}
              >
                1. What's the purpose of the group?
              </p>
              <p
                style={{
                  fontSize: "12px",
                  maxWidth: "22rem",
                  marginTop: ".1rem",
                }}
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
                3. What will you do at your events?
              </p>
              <textarea
                placeholder="Please write at least 50 characters"
                style={{
                  resize: "none",
                  fontSize: "11px",
                  height: "8rem",
                  width: "16rem",
                  backgroundColor: "rgb(232, 240, 254)",
                  border: "2.5px solid black",
                }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
              <span className="create-group-errors-section-2">
                {errors && errors.description}
              </span>
              <p
                className="create-group-borders"
                style={{ marginTop: "1rem" }}
              ></p>
              <p style={{ marginTop: ".65rem" }}>Final steps...</p>
              <p
                style={{
                  fontSize: "12px",
                  maxWidth: "22rem",
                  marginTop: ".1rem",
                }}
              >
                Is this an in-person or online group?
              </p>
              <select
                style={{ height: "1.6rem" }}
                className="create-group-select-location"
                value={groupType}
                onChange={(e) => setGroupType(e.target.value)}
              >
                <option value="">{"(select one)"}</option>
                <option value="In person">In person</option>
                <option value="Online">Online</option>
              </select>
              <span className="create-group-errors-section-3">
                {errors && errors.groupType}
              </span>
              <p
                style={{
                  fontSize: "12px",
                  maxWidth: "22rem",
                  marginTop: ".1rem",
                }}
              >
                Is this group private or public?
              </p>
              <select
                style={{ height: "1.6rem" }}
                className="create-group-select-private"
                value={visibilityType}
                onChange={(e) => setVisibilityType(e.target.value)}
              >
                <option value="select">{"(select one)"}</option>
                <option value={true}>Private</option>
                <option value={false}>Public</option>
              </select>
              <span className="create-group-errors-section-3">
                {errors && errors.visibilityType}
              </span>
              <p
                style={{
                  fontSize: "12px",
                  maxWidth: "22rem",
                  marginTop: ".1rem",
                }}
              >
                Please add an image url for your group below:
              </p>
              <input
                placeholder="Image URL"
                style={{ fontSize: "11px", marginTop: ".4rem" }}
                value={imageURL}
                onChange={(e) => setImageURL(e.target.value)}
              ></input>
              <span className="create-group-errors-section-4">
                {errors && errors.imageURL}
              </span>
              <p className="create-group-borders" style={{}}></p>
              <button type="submit">Create group</button>
            </div>
          </form>
        ) : (
          <>
            <h1 className="loading-icon-header">LOADING...</h1>
            <PulseLoader
              className="loading-icon"
              color="#00798A"
              size={80}
              margin="80"
              speedMultiplier="1"
              animation-duration="3s"
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "1rem",
              }}
              onAnimationIteration={userCheck}
            />
          </>
        )
      ) : (
        ""
      )}
    </>
  );
};

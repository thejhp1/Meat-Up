import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { thunkGetGroupDetail } from "../../store/groups";
import PulseLoader from "react-spinners/PulseLoader";

export const EventForm = ({ formType }) => {
  const { groupId } = useParams();
  const dispatch = useDispatch();
  const groupStore = useSelector((state) => state.groups);
  const group = groupStore[groupId] ? groupStore[groupId] : "";
  const [name, setName] = useState("");
  const [eventType, setEventType] = useState("");
  const [visibilityType, setVisibilityType] = useState("");
  const [price, setPrice] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(thunkGetGroupDetail(groupId));
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formType === "Create") {
      const errors = {};
      if (!name) {
        errors.name = "Name is required";
      }
      if (!eventType) {
        errors.eventType = "Group Type is required";
      }

      if (!visibilityType && group.private) {
        errors.visibilityType = "Visibility Type is required";
      }

      if (!price) {
        errors.price = "Price is required";
      }
      console.log('start', startDate)
      console.log('end', endDate)
      if (!startDate) {
        errors.startDate = "Start date is required"
      }

      if (!endDate) {
        errors.endDate = "End date is required"
      }

      if (startDate > endDate) {
        errors.startDate = "Start date cannot be after end date"
        errors.endDate = "End date cannot be before start date"
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

      if (!description) {
        errors.description = "Description is required";
      } else if (description.length < 30) {
        errors.description = "Description must be at least 30 characters long";
      }
      if (Object.values(errors).length === 0) {
        const form = {
            venueId: 1,
            name,
            type: eventType,
            capacity: capacity ? capacity : 0
        }
      }

      setErrors(errors);
    }
  };

  return (
    <>
      {formType === "Create" ? (
        <form onSubmit={handleSubmit}>
          <div className="create-event-container">
            <p style={{ marginTop: ".5rem", fontSize: "28px" }}>
              Create a new event for {group.name}
            </p>
            <p style={{ fontSize: "12px", marginBottom: ".15rem" }}>
              What is the name of your event?
            </p>
            <input
              placeholder="Event Name"
              style={{ fontSize: "11px" }}
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></input>
            {errors && (
              <span className="create-event-errors-section-1">
                {errors.name}
              </span>
            )}
            <p className="create-event-borders"></p>
            <p
              style={{
                fontSize: "12px",
                marginBottom: ".15rem",
                marginTop: ".75rem",
              }}
            >
              Is this an in-person or online event?
            </p>
            <select
              style={{ height: "1.6rem" }}
              className="create-event-select-location"
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
            >
              <option value="nothing">{"(select one)"}</option>
              <option value="In person">In person</option>
              <option value="Online">Online</option>
            </select>
            {errors && (
              <span className="create-event-errors-section-2">
                {errors.eventType}
              </span>
            )}
            <p
              style={{
                fontSize: "12px",
                marginBottom: ".15rem",
              }}
            >
              Is this event private or public?
            </p>
            <select
              style={{ height: "1.6rem" }}
              className="create-event-select-private"
              value={visibilityType}
              onChange={(e) => setVisibilityType(e.target.value)}
            >
              <option value="select">{"(select one)"}</option>
              <option value="private">Private</option>
              <option value="public">Public</option>
            </select>
            {errors && (
              <span className="create-event-errors-section-2">
                {errors.visibilityType}
              </span>
            )}
            <p
              style={{
                fontSize: "12px",
                marginBottom: ".15rem",
              }}
            >
              What is the price for you event?
            </p>
            <div className="create-event-price-label">
              <span className="create-event-price-symbol">$</span>
              <input
                style={{ width: "4rem" }}
                placeholder="0"
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              ></input>
            </div>
            {errors && (
              <span className="create-event-errors-section-3">
                {errors.price}
              </span>
            )}
            <p className="create-event-borders"></p>
            <p
              style={{
                fontSize: "12px",
                marginBottom: ".15rem",
                marginTop: ".75rem",
              }}
            >
              When does your event start?
            </p>
            <input
              style={{ width: "11rem", marginBottom: "1.25rem" }}
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            ></input>
            {errors && (
              <span className="create-event-errors-section-4">
                {errors.startDate}
              </span>
            )}
            <p
              style={{
                fontSize: "12px",
                marginBottom: ".15rem",
              }}
            >
              When does your event end?
            </p>
            <input
              style={{ width: "11rem", marginBottom: ".1rem" }}
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            ></input>
            {errors && (
              <span className="create-event-errors-section-4">
                {errors.endDate}
              </span>
            )}
            <p className="create-event-borders"></p>
            <p
              style={{
                fontSize: "12px",
                marginBottom: ".15rem",
                marginTop: ".75rem",
              }}
            >
              Please add an image url for your event below:
            </p>
            <input
              value={imageURL}
              onChange={(e) => setImageURL(e.target.value)}
              placeholder="Image URL"
            ></input>
            {errors && (
              <span className="create-event-errors-section-5">
                {errors.imageURL}
              </span>
            )}
            <p className="create-event-borders"></p>
            <p
              style={{
                fontSize: "12px",
                marginBottom: ".15rem",
                marginTop: ".75rem",
              }}
            >
              Please describe your event
            </p>
            <textarea
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
              placeholder="Please include at least 30 characters"
            ></textarea>
            {errors && <span className="create-event-errors-section-6">{errors.description}</span>}
            <div></div>
            <button type="submit">Create event</button>
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
          />
        </>
      )}
    </>
  );
};

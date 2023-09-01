import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { thunkCreateVenue, thunkDeleteVenue, thunkUpdateVenue } from "../../store/venues";
import { useModal } from "../../context/Modal";
import "./VenueModal.css";

export default function VenueModal({ type, group }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const [address, setAddress] = useState(group.Venues[0]?.address || "");
    const [city, setCity] = useState(group.Venues[0]?.city || "");
    const [state, setState] = useState(group.Venues[0]?.state || "");
    const [errors, setErrors] = useState({})
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

    const handleSubmit = async (e) => {
        const errors = {};

        if (!address) {
            errors.address = "Input an address"
        } else if (isNaN(address.split("")[0])) {
            errors.address = "Input a valid address"
        }
        if (!city) {
            errors.city = "Input a city"
        } else if (city.length < 2) {
            errors.city = "Input a valid city"
        }

        if (!state) {
            errors.state = "Input a state"
        } else if (state.length !== 2) {
            errors.state = "Input a valid state. Ex: CA"
        } else if (!states.includes(state.toUpperCase())) {
            errors.state = "Input a valid state. Ex: CA"
        }

        if (Object.values(errors).length === 0) {
            if (type === "Create") {
                const safeAddress = {
                    address,
                    city,
                    state,
                    groupId: group.id,
                    lat: 1,
                    lng: 1
                }
                dispatch(thunkCreateVenue(safeAddress))
                closeModal()
            } else if (type === "Update") {
                const safeAddress = {
                    id: group.Venues[0].id,
                    address,
                    city,
                    state,
                    lat: 1,
                    lng: 1
                }
                dispatch(thunkUpdateVenue(safeAddress))
                closeModal()
            } else if (type === "Delete") {
                dispatch(thunkDeleteVenue(group.Venues[0]))
                closeModal()
            }
        }
        setErrors(errors)
    }
  return (
    <div className="venue-modal-container">
        <div className="venue-modal-title">
            <h1>{type === "Create" ? "Create" : type === "Update" ? "Update" : type === "Delete" ? "Verify Delete" : ""} Venue</h1>
        </div>
        {errors.address && <div className="venue-modal-errors-address">{errors.address}</div>}
        <div className="venue-modal-info">
            <h3>Address</h3>
            <input value={address} onChange={(e) => setAddress(e.target.value)}></input>
        </div>
        {errors.city && <div className="venue-modal-errors-city">{errors.city}</div>}
        <div className="venue-modal-info">
            <h3>City</h3>
            <input value={city} onChange={(e) => setCity(e.target.value)}></input>
        </div>
        {errors.state && <div className="venue-modal-errors-state">{errors.state}</div>}
        <div className="venue-modal-info">
            <h3>State</h3>
            <input value={state} onChange={(e) => setState(e.target.value)}></input>
        </div>
        <button onClick={handleSubmit}>{type === "Create" ? "Create" : type === "Update" ? "Update" : type === "Delete" ? "Delete" : ""}</button>
        <button onClick={() => closeModal()}>Cancel</button>
    </div>
  );
}

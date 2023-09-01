import { csrfFetch } from "./csrf";

// constant to avoid debugging typos
const CREATE_VENUE = "venues/CREATE_VENUE";
const UPDATE_VENUE = "venues/UPDATE_VENUE";
const DELETE_VENUE = "venues/DELETE_VENUE";

// regular action creator
const createVenue = (venue) => {
  return {
    type: CREATE_VENUE,
    venue,
  };
};

const updateVenue = (venue) => {
  return {
    type: UPDATE_VENUE,
    venue,
  };
};

const deleteVenue = (venue) => {
  return {
    type: DELETE_VENUE,
    venue,
  };
};

// thunk action creator
export const thunkCreateVenue = (venue) => async (dispatch) => {
  const res = await csrfFetch(`/api/groups/${venue.groupId}/venues`, {
    method: "POST",
    body: JSON.stringify(venue),
  });
  if (res.ok) {
    const data = await res.json();
    dispatch(createVenue(data));
    return data;
  }
};

export const thunkUpdateVenue = (venue) => async (dispatch) => {
  const res = await csrfFetch(`/api/venues/${venue.id}`, {
    method: "PUT",
    body: JSON.stringify(venue),
  });
  if (res.ok) {
    const data = await res.json();
    dispatch(updateVenue(data));
    return data;
  }
};

export const thunkDeleteVenue = (venue) => async (dispatch) => {
  const res = await csrfFetch(`/api/venues/${venue.id}`, {
    method: "DELETE",
    body: JSON.stringify(venue),
  });
  if (res.ok) {
    const data = await res.json();
    dispatch(deleteVenue(data));
    return data;
  }
};

// state object
const initialState = {};

// reducer
const venuesReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_VENUE: {
      const newState = { ...state, [action.venue.id]: action.venue };
      return newState;
    }
    case UPDATE_VENUE: {
      const newState = { ...state, [action.venue.id]: action.venue };
      return newState;
    }
    case DELETE_VENUE: {
      const newState = { ...state };
      delete newState[action.venue.id];
      return newState;
    }
    default:
      return state;
  }
};

export default venuesReducer;

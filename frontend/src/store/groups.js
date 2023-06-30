import { csrfFetch } from "./csrf";

// constant to avoid debugging typos
const GET_GROUPS = "groups/GET GROUPS";

// regular action creator
const getGroups = (groups) => {
  return {
    type: GET_GROUPS,
    groups,
  };
};

// thunk action creator
export const getAllGroups = () => async (dispatch) => {
  const res = await csrfFetch("/api/groups");
  if (res.ok) {
    const data = await res.json();
    dispatch(getGroups(data));
    return data;
  }
};

// state object
const initialState = {};

// reducer
const groupsReudcer = (state = initialState, action) => {
  switch (action.type) {
    case GET_GROUPS: {
      const newState = {}
      action.groups.Groups.forEach((group) => {
        newState[group.id] = group;
      });
      return newState;
    }
    default:
      return state;
  }
};

export default groupsReudcer;

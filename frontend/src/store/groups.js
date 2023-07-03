import { csrfFetch } from "./csrf";

// constant to avoid debugging typos
const GET_GROUPS = "groups/GET GROUPS";
const GET_GROUP_DETAIL = "groups/GET_GROUP_DETAIL"
const GET_EVENT_DETAIL = "groups/GET_EVENT_DETAIL"

// regular action creator
const getGroups = (groups) => {
  return {
    type: GET_GROUPS,
    groups,
  };
};

const getGroupDetail = (group) => {
  return {
    type: GET_GROUP_DETAIL,
    group
  }
}

const getEventDetail = (event) => {
  return {
    type: GET_EVENT_DETAIL,
    event
  }
}

// thunk action creator
export const thunkGetAllGroups = () => async (dispatch) => {
  const res = await csrfFetch("/api/groups");
  const res2 = await csrfFetch("/api/events")
  if (res.ok && res2.ok) {
    const data = await res.json();
    const data2 = await res2.json()
    data.Groups.forEach(group => {
      let result = []
      data2.Events.forEach(event => {
        if(event.groupId === group.id) {
          result.push(event)
        }
      })
      group['Events'] = result
    })
    dispatch(getGroups(data));
    return data;
  } else {
    return dispatch(groupsReudcer({}, {type: "not-found"}))
  }
};

export const thunkGetGroupDetail = (groupId) => async (dispatch) => {
  const res = await csrfFetch(`/api/groups/${groupId}`)
  if (res.ok) {
    const res2 = await csrfFetch(`/api/groups/${groupId}/events`)
    const data = await res.json()
    if (res2.ok) {
      const data2 = await res2.json()
      data['numOfEvents'] = data2.Events.length
      data['Events'] = data2.Events
      dispatch(getGroupDetail(data))
      return data
    } else {
      return dispatch(getGroupDetail(data))
    }
  } else {
    return window.location.href = "/not-found"
  }
}

export const thunkGetEventDetail = (eventId) => async (dispatch) => {
  const res = await csrfFetch(`/api/events/${eventId}`)
  if (res.ok) {
    const data = await res.json()
    dispatch(getEventDetail(data))
    return data
  } else {
    return window.location.href = "/not-found"
  }
}

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
    case GET_GROUP_DETAIL: {
      const newState =  { [action.group.id]: action.group }
      return newState;
    }
    case GET_EVENT_DETAIL: {
      const newState = { [action.event.id]: action.event}
      return newState
    }
    default:
      return state;
  }
};

export default groupsReudcer;

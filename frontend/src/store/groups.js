import { csrfFetch } from "./csrf";

// constant to avoid debugging typos
const GET_GROUPS = "groups/GET GROUPS";
const GET_GROUP_DETAIL = "groups/GET_GROUP_DETAIL"
const GET_EVENT_DETAIL = "groups/GET_EVENT_DETAIL"
const CREATE_GROUP = "groups/CREATE_GROUP"
const DELETE_GROUP = "groups/DELETE_GROUP"
const UPDATE_GROUP = "groups/UPDATE_GROUP"

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

const createGroup = (group) => {
  return {
    type: CREATE_GROUP,
    group
  }
}

const deleteGroup = (groupId) => {
  return {
    type: DELETE_GROUP,
    groupId
  }
}

const updateGroup = (group) => {
  return {
    type: UPDATE_GROUP,
    group
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
  console.log(res)
  if (res.ok) {
    const data = await res.json()
    const res2 = await csrfFetch(`/api/groups/${groupId}/events`)
    if (res2.ok === true) {
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

export const thunkCreateGroup = (group) => async (dispatch) => {
  const res = await csrfFetch("/api/groups", {
    method: "POST",
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(group)
  })
  if (res.ok) {
    const data = await res.json()
    const res2 = await csrfFetch(`/api/groups/${data.id}/images`, {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({url:group.url,preview:JSON.parse(group.private)})
    })
    if (res2.ok) {
      const data2 = await res2.json()
      dispatch(createGroup(data2))
      return window.location.href = `/groups/${data.id}`
    } else {
      dispatch(createGroup(data))
    }
  } else {
    return window.location.href = "/not-found"
  }
}

export const thunkDeleteGroup = (groupId) => async (dispatch) => {
  const res = await csrfFetch(`/api/groups/${groupId}`, {
    method: "DELETE"
  })
  if (res.ok) {
    const data = await res.json()
    dispatch(deleteGroup(groupId))
    return data
  }
}

export const thunkUpdateGroup = (group) => async (dispatch) => {
  console.log('group: ', JSON.stringify(group))
  const res = await csrfFetch(`/api/groups/${group.id}`, {
    method: "PUT",
    body: JSON.stringify(group)
  })

  if (res.ok) {
    const data = await res.json()
    dispatch(updateGroup(data))
    console.log("dataaa", data)
    return window.location.href = `/groups/${data.id}`
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
    case CREATE_GROUP: {
      const newState= { ...state, [action.group.id]: action.group}
      return newState
    }
    case DELETE_GROUP: {
      const newState = {...state}
      delete newState[action.groupId];
      return newState
    }
    case UPDATE_GROUP: {
      const newState = { ...state, [action.group.id]: action.group}
      return newState
    }
    default:
      return state;
  }
};

export default groupsReudcer;

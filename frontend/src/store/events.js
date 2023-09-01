import { csrfFetch } from "./csrf";

// constant to avoid debugging typos
const GET_EVENTS = "events/GET_EVENTS";
const GET_EVENT_DETAIL = "events/GET_EVENT_DETAIL";
const CREATE_EVENT = "events/CREATE_EVENT";
const UPDATE_EVENT = "events/UPDATE_EVENT";
const DELETE_EVENT = "events/DELETE_EVENT";

// regular action creator
const getEvents = (events) => {
  return {
    type: GET_EVENTS,
    events,
  };
};

const getEventDetail = (event) => {
  return {
    type: GET_EVENT_DETAIL,
    event,
  };
};

const createEvent = (event) => {
  return {
    type: CREATE_EVENT,
    event,
  };
};

const deleteEvent = (eventId) => {
  return {
    type: DELETE_EVENT,
    eventId,
  };
};

const updateEvent = (eventId) => {
  return {
    type: UPDATE_EVENT,
    eventId,
  };
};

// thunk action creator
export const thunkGetAllEvents = () => async (dispatch) => {
  const res = await csrfFetch("/api/events");
  if (res.ok) {
    const data = await res.json();
    dispatch(getEvents(data));
    return data;
  } else {
    return (window.location.href = "/not-found");
  }
};

export const thunkGetEventDetail = (eventId) => async (dispatch) => {
  const res = await csrfFetch(`/api/events/${eventId}`);
  if (res.ok) {
    const data = await res.json();
    dispatch(getEventDetail(data));
    return data;
  } else {
    return (window.location.href = "/not-found");
  }
};

export const thunkCreateEvent =
  (event, groupId, imageURL) => async (dispatch) => {
    const res = await csrfFetch(`/api/groups/${groupId}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
    });
    if (res.ok) {
      const data = await res.json();
      const res2 = await csrfFetch(`/api/events/${data.id}/images`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: imageURL.toString(), preview: true }),
      });
      if (res2.ok) {
        const data2 = await res2.json();
        dispatch(createEvent(data2));
        return (window.location.href = `/events/${data.id}`);
      } else {
        dispatch(createEvent(data));
      }
    }
    alert("Cannot find group!");
  };

export const thunkDeleteEvent = (eventId) => async (dispatch) => {
  const res = await csrfFetch(`/api/events/${eventId}`, {
    method: "DELETE",
  });

  if (res.ok) {
    const data = res.json();
    dispatch(deleteEvent(eventId));
    return data;
  }
};

export const thunkUpdateEvent = (event) => async (dispatch) => {
  console.log( JSON.stringify(event))
  const res = await csrfFetch(`/api/events/${event.id}`, {
    method: "PUT",
    body: JSON.stringify(event),
  });
  if (res.ok) {
    const data = res.json();
    dispatch(updateEvent(data));
    window.location.href=`/events/${event.id}`
    return data;
  }
};


// state object
const initialState = {};

// reducer
const eventsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_EVENTS: {
      const newState = {};
      action.events.Events.forEach((event) => {
        newState[event.id] = event;
      });
      return newState;
    }
    case GET_EVENT_DETAIL: {
      const newState = { [action.event.id]: action.event };
      return newState;
    }
    case CREATE_EVENT: {
      const newState = { ...state, [action.event.id]: action.event };
      return newState;
    }
    case DELETE_EVENT: {
      const newState = { ...state };
      delete newState[action.eventId];
      return newState;
    }
    case UPDATE_EVENT: {
      const newState = { ...state, [action.eventId]: action.event };
      return newState;
    }
    default:
      return state;
  }
};

export default eventsReducer;

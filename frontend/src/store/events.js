import { csrfFetch } from "./csrf";

// constant to avoid debugging typos
const GET_EVENTS = "events/GET_EVENTS"

// regular action creator
const getEvents = (events) => {
    return {
      type: GET_EVENTS,
      events,
    };
  };

// thunk action creator
export const thunkGetAllEvents = () => async (dispatch) => {
    const res = await csrfFetch("/api/events")
    if (res.ok) {
      const data = await res.json();
      dispatch(getEvents(data));
      return data;
    }
};

// state object
const initialState = {}

// reducer
const eventsReducer = (state = initialState, action) => {
    switch(action.type) {
        case GET_EVENTS: {
            const newState = {}
            action.events.Events.forEach((event) => {
                newState[event.id] = event;
              });
              return newState;
        }
        default:
            return state
    }
}

export default eventsReducer;

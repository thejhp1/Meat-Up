import { csrfFetch } from "./csrf";

// constant to avoid debugging typos
const GET_MEMBERS = "members/GET_MEMBERS";
const DELETE_MEMBER = "members/DELETE_MEMBER";
const REQUEST_MEMBER = "members/REQUEST_MEMBER";
const CLEAR_MEMBERS = "members/CLEAR_MEMBERS";
const APPROVE_MEMBER = "members/APPROVE_MEMBER";

// regular action creator
const getMembers = (members) => {
  return {
    type: GET_MEMBERS,
    members,
  };
};

const deleteMember = (memberId) => {
  return {
    type: DELETE_MEMBER,
    memberId,
  };
};

const requestMember = (memberId) => {
  return {
    type: REQUEST_MEMBER,
    memberId,
  };
};

const clearMembers = () => {
  return {
    type: CLEAR_MEMBERS,
  };
};

const approveMember = (memberId) => {
  return {
    type: APPROVE_MEMBER,
    memberId,
  };
}



// thunk action creator
export const thunkGetAllMembers = (groupId) => async (dispatch) => {
  const res = await csrfFetch(`/api/groups/${Number(groupId)}/members`);
  if (res.ok) {
    const data = await res.json();
    dispatch(getMembers(data));
    return data;
  } else {
    return (window.location.href = "/not-found");
  }
};

export const thunkDeleteMember = (safeMember) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/groups/${safeMember.groupId}/membership`, {
      method: "DELETE",
      body: JSON.stringify(safeMember.member),
    });
    if (res.ok) {
      const data = await res.json();
      dispatch(deleteMember(data));
      return data;
    }
  } catch (error) {
    return error
  }
};

export const thunkRequestMember = (groupId) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/groups/${groupId}/membership`, {
      method: "POST"
    });
    if (res.ok) {
      const data = await res.json();
      alert("Request sent! Once you are approved, you will see your name in the members list.");
      dispatch(requestMember(data));
      return data;
    }
  } catch (error) {
    alert("Request already sent.");
    return error
  }
}

export const thunkClearMembers = () => async (dispatch) => {
  dispatch(clearMembers({}));
}

export const thunkApproveMember = (safeMember) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/groups/${safeMember.groupId}/membership`, {
      method: "PUT",
      body: JSON.stringify(safeMember.member),
    });
    if (res.ok) {
      const data = await res.json();
      dispatch(approveMember(data));
      return data;
    }
  } catch (error) {
    console.log(error.json())
    return error
  }
};


// state object
const initialState = {};

// reducer
const membersReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_MEMBERS: {
      const newState = { ...state };
      const members = action.members.Members;
      for (let member of members) {
        newState[member.id] = member;
      }
      return newState;
    }
    case DELETE_MEMBER: {
      const newState = { ...state };
      delete newState[action.memberId.id];
      return newState;
    }
    case REQUEST_MEMBER: {
      const newState = { ...state };
      return newState
    }
    case CLEAR_MEMBERS: {
      const newState = {};
      return newState;
    }
    case APPROVE_MEMBER: {
      const newState = { ...state };
      console.log('newstate', newState);
      console.log('action', action);
      newState[action.memberId.id].Membership.status = action.memberId.status;
      console.log("NEWSTATE AFTER", newState)
      return newState;
    }
    default:
      return state;
  }
};

export default membersReducer;

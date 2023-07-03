import React from "react";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import SignupFormModal from "../SignupFormModal";
import { useSelector } from "react-redux";

export const JoinMeetupButton = () => {
    const sessionUser = useSelector((state) => state.session.user);

    return (
        <div className="button-container">
            {sessionUser ? null : <button className="landing-page-button"><span className="landing-page-span">
            <OpenModalMenuItem
              itemText="Join Meetup"
              modalComponent={<SignupFormModal />}
            />
          </span></button>}

        </div>
    )
}

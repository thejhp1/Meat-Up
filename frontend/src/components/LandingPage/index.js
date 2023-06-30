import React from "react";
import { SubtitleSection } from "./SubtitleSection";
import { GroupEventLinks } from "./GroupEventLinks";
import { JoinMeetupButton } from "./JoinMeetupButton";
import './LandingPage.css'

export const LandingPage = () => {
  return (
    <div className="landing-page">
      <SubtitleSection />
      <GroupEventLinks />
      <JoinMeetupButton />
    </div>
  );
};

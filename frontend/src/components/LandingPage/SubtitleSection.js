import React from "react";
import SubtitleImage from "../../images/subtitleimage.svg"

export const SubtitleSection = () => {
  return (
    <div className="subtitle-section">
      <div className="wording">
        <h1>The people platform- Where interests become friendships</h1>
        <p>Whatever your interest, from hiking and reading to networking and skill sharing, there are thousands of people who share it on Meatup. Events are happening every day—sign up to join the fun.</p>

      </div>
      <img alt="" src={SubtitleImage}></img>
    </div>
  );
};

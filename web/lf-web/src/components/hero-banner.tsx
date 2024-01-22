import React from "react";
import { Logo } from "./logos/logo";

export const HeroBanner: React.FC = () => {
  const logo = "https://cdn.auth0.com/blog/developer-hub/react-logo.svg";

  return (
    <div className="hero-banner hero-banner--pink-yellow">
      <div className="hero-banner__logo">
        <Logo />
      </div>
      <h1 className="hero-banner__headline">Hello, welcome to LearnFast!</h1>
      <p className="hero-banner__description">
        This is an app which helps you learn <strong>fast</strong>.
      </p>
    </div>
  );
};

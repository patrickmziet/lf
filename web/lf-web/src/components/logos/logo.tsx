import React from "react";

export const Logo: React.FC = () => {
  const logoUrl = process.env.PUBLIC_URL + '/lf.png';
  return (
    <img
      className="nav-bar__logo"
      src={logoUrl}
      alt="LF Logo"
      width="50"
      height="50"
    />
  );
};

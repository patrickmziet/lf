import React from "react";
import { NavLink } from "react-router-dom";

export const NavBarBrand: React.FC = () => {

  const logoUrl = process.env.PUBLIC_URL + '/lf.png';
  return (
    <div className="nav-bar__brand">
      <NavLink to="/">
        <img
          className="nav-bar__logo"
          src={logoUrl}
          alt="LF Logo"
          width="50"
          height="50"
        />
      </NavLink>
    </div>
  );
};

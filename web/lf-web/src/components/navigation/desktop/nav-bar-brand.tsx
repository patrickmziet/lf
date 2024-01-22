import React from "react";
import { NavLink } from "react-router-dom";
import { Logo } from "../../logos/logo";

export const NavBarBrand: React.FC = () => {

  return (
    <div className="nav-bar__brand">
      <NavLink to="/">
        <p className="nav-bar__name">
          LearnFast
        </p>
      </NavLink>
    </div>
  );
};

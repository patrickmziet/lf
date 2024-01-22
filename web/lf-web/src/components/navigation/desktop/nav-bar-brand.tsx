import React from "react";
import { NavLink } from "react-router-dom";
import { Logo } from "../../logos/logo";

export const NavBarBrand: React.FC = () => {

  const logoUrl = process.env.PUBLIC_URL + '/lf.png';
  return (
    <div className="nav-bar__brand">
      <NavLink to="/">
        <Logo />
      </NavLink>
    </div>
  );
};

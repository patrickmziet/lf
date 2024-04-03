import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Logo } from "../../logos/logo";

export const NavBarBrand: React.FC = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <div className="nav-bar__brand">
      {isAuthenticated ? (
        <p className="nav-bar__name">
          LearnFast
        </p>
      ) : (
        <NavLink to="/">
          <p className="nav-bar__name">
            LearnFast
          </p>
        </NavLink >
      )}
    </div>
  );
};

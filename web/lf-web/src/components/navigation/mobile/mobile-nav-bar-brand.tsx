import React from "react";
import { NavLink } from "react-router-dom";

interface MobileNavBarBrandProps {
  handleClick: () => void;
}

export const MobileNavBarBrand: React.FC<MobileNavBarBrandProps> = ({
  handleClick,
}) => {
  return (
    <div onClick={handleClick} className="mobile-nav-bar__brand">
      <NavLink to="/">
        <p className="mobile-nav-bar__name">
          LearnFast
        </p>
      </NavLink>
    </div>
  );
};

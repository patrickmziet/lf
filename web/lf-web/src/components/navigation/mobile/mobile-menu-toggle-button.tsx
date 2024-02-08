import React from "react";
import { MdMenu, MdClose } from "react-icons/md";

interface MobileMenuToggleButtonProps {
  icon: string;
  handleClick: () => void;
}

export const MobileMenuToggleButton: React.FC<MobileMenuToggleButtonProps> = ({
  icon,
  handleClick,
}) => {
  return (
    <span
      className="mobile-nav-bar__toggle material-icons"
      id="mobile-menu-toggle-button"
      onClick={handleClick}
    >
      {icon === 'menu' ? <MdMenu /> : <MdClose />}
    </span>
  );
};
import React, { useState } from "react";
import ReactModal from "react-modal";
import "./Nav.css";
import { useWindowDimensions } from "../../hooks/useWindowDimensions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import SideBarMenus from "../sidebar/SidebarMenus";
import { Link } from "react-router-dom";

const Nav = () => {
  const { width } = useWindowDimensions();
  const [showMenu, setShowMenu] = useState(false);
  const onClickToggle = (e: React.MouseEvent<Element, MouseEvent>) => {
    setShowMenu(!showMenu);
  };
  const onRequestClose = (
    e: React.MouseEvent<Element, MouseEvent> | React.KeyboardEvent<Element>
  ) => {
    setShowMenu(false);
  };
  const getMobileMenu = () => {
    if (width <= 768) {
      return (
        <FontAwesomeIcon
          onClick={onClickToggle}
          icon={faBars}
          size="lg"
          className="nav-mobile-menu"
        />
      );
    }
    return null;
  };
  return (
    <React.Fragment>
      <ReactModal
        className="model-menu"
        isOpen={showMenu}
        onRequestClose={onRequestClose}
        shouldCloseOnOverlayClick={true}
      >
        <SideBarMenus />
      </ReactModal>
      <nav className="navigation">
        {getMobileMenu()}
        <strong>
          <Link to="/">forume</Link>
        </strong>
      </nav>
    </React.Fragment>
  );
};

export default Nav;

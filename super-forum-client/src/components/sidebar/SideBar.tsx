import React from "react";
import { useWindowDimensions } from "../../hooks/useWindowDimensions";
import SideBarMenus from "./SidebarMenus";

const SideBar = () => {
  const { width } = useWindowDimensions();
  if (width <= 768) {
    return null;
  }
  return (
    <div className="sidebar">
      <SideBarMenus />
    </div>
  );
};

export default SideBar;

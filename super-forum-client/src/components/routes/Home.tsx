import React from "react";
import LeftMenu from "../areas/LeftMenu";
import Main from "../areas/main/Main";
import Nav from "../areas/Nav";
import RightMenu from "../areas/rightMenu/RightMenu";
import SideBar from "../sidebar/SideBar";
import "./Home.css";

const Home = () => {
  return (
    <div className="screen-root-container home-container">
      <div className="navigation">
        <Nav />
      </div>
      <SideBar />
      <LeftMenu />
      <Main />
      <RightMenu />
    </div>
  );
};

export default Home;

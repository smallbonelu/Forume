import React, { useEffect, useReducer, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Thread from "../../../models/Thread";
import ThreadItem from "../../../models/ThreadItem";
import { AppState } from "../../../store/AppState";
import Nav from "../../areas/Nav";
import PasswordComparison from "../../auth/common/PasswordComparison";
import userReducer from "../../auth/common/UserReducer";
import "./UserProfile.css";
import { gql, useMutation } from "@apollo/client";

const ChangePassword = gql`
  mutation ChangePassword($newPassword: String!) {
    changePassword(newpassword: $newpassword)
  }
`;

const UserProfile = () => {
  const [execChangePassword] = useMutation(ChangePassword);
  const [
    { userName, password, passwordConfirm, resultMsg, isSubmitDisabled },
    dispatch,
  ] = useReducer(userReducer, {
    userName: "",
    password: "",
    passwordConfirm: "",
    resultMsg: "",
    isSubmitDisabled: true,
  });
  const user = useSelector((state: AppState) => state.user);
  const [threads, setThreads] = useState<JSX.Element | undefined>();
  const [threadItems, setThreadItems] = useState<JSX.Element | undefined>();

  useEffect(() => {
    console.log("user", user);
    if (user) {
      dispatch({
        type: "userName",
        payload: user.userName,
      });

      const threadList = user.threads?.map((th: Thread) => {
        return (
          <li key={`user-th-${th.id}`}>
            <Link to={`/thread/${th.id}`} className="userprofile-link">
              {th.title}
            </Link>
          </li>
        );
      });
      setThreads(
        !user.threadItems || user.threadItems.length === 0 ? undefined : (
          <ul>{threadList}</ul>
        )
      );

      const threadItemList = user.threadItems?.map((ti: ThreadItem) => (
        <li key={`user-th-${ti.thread.id}`} className="userprofile-link">
          <Link to={`/thread/${ti.thread.id}`}>
            {JSON.parse(ti.body)[0].children[0].text}
          </Link>
        </li>
      ));
      setThreadItems(
        !user.threadItems || user.threadItems.length === 0 ? undefined : (
          <ul>{threadItemList}</ul>
        )
      );
    } else {
      dispatch({
        type: "userName",
        payload: "",
      });
      setThreads(undefined);
      setThreadItems(undefined);
    }
  }, [user]);

  const onClickChangePassword = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    const { data: changePasswordData } = await execChangePassword({
      variables: {
        newPassword: password,
      },
    });

    dispatch({
      type: "resultMsg",
      payload: changePasswordData ? changePasswordData.changePassword : "",
    });
  };

  return (
    <div className="screen-root-container">
      <div className="thread-nav-container">
        <Nav />
      </div>
      <form className="userprofile-content-container">
        <div>
          <strong>User Profile</strong>
          <label style={{ marginLeft: ".75em" }}>{userName}</label>
        </div>
        <div className="userprofile-password">
          <div>
            <PasswordComparison
              dispatch={dispatch}
              password={password}
              passwordConfirm={passwordConfirm}
            />
            <button
              onClick={onClickChangePassword}
              disabled={isSubmitDisabled}
              className="action-btn"
            >
              Change Password
            </button>
          </div>
          <div style={{ marginTop: ".5em" }}>
            <label>{resultMsg}</label>
          </div>
        </div>
        <div className="userprofile-postings">
          <hr className="thread-section-divider" />
          <div className="userprofile-threads">
            <strong>Threads Posted</strong>
            {threads}
          </div>
          <div className="userprofile-threadItems">
            <strong>ThreadItems Posted</strong>
            {threadItems}
          </div>
        </div>
      </form>
    </div>
  );
};

export default UserProfile;

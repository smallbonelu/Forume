import React, { FC, useReducer, useState } from "react";
import ReactModal from "react-modal";
import "./Registration.css";
import {
  isPasswordValid,
  PasswordTestResult,
} from "../../common/validators/PasswordValidator";

import ModalProps from "../types/ModalProps";
import userReducer from "./common/UserReducer";
import { allowSubmit } from "./common/Helpers";
import PasswordComparison from "./common/PasswordComparison";

const Registration: FC<ModalProps> = ({ isOpen, onClickToggle }) => {
  const [
    { userName, password, email, passwordConfirm, resultMsg, isSubmitDisabled },
    dispatch,
  ] = useReducer(userReducer, {
    userName: "",
    password: "",
    email: "",
    passwordConfirm: "",
    resultMsg: "",
    isSubmitDisabled: true,
  });

  const onChangeUserName = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "userName", payload: e.target.value });
    if (!e.target.value)
      allowSubmit(dispatch, "Username cannot be empty", true);
    else allowSubmit(dispatch, "", false);
  };

  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "email", payload: e.target.value });
    if (!e.target.value) {
      allowSubmit(dispatch, "Email cannot be empty", true);
    } else {
      allowSubmit(dispatch, "", false);
    }
  };

  const onClickRegister = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    onClickToggle(e);
  };

  const onClickCancel = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    onClickToggle(e);
  };
  return (
    <ReactModal
      className="modal-menu"
      isOpen={isOpen}
      onRequestClose={onClickToggle}
      shouldCloseOnOverlayClick={true}
    >
      <form>
        <div className="reg-inputs">
          <div>
            <label>username</label>
            <input type="text" value={userName} onChange={onChangeUserName} />
          </div>
          <div>
            <label>email</label>
            <input type="text" value={email} onChange={onChangeEmail} />
          </div>
          <PasswordComparison
            password={password}
            dispatch={dispatch}
            passwordConfirm={passwordConfirm}
          />
          <div className="reg-buttons">
            <div className="reg-btn-left">
              <button
                style={{ marginLeft: ".5em" }}
                disabled={isSubmitDisabled}
                onClick={onClickRegister}
                className="action-btn"
              >
                Register
              </button>
              <button
                style={{ marginLeft: ".5em" }}
                onClick={onClickCancel}
                className="cancel-btn"
              >
                Close
              </button>
            </div>
            <span className="reg-btn-right">
              <strong>{resultMsg}</strong>
            </span>
          </div>
        </div>
      </form>
    </ReactModal>
  );
};

export default Registration;

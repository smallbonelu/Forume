import React, { FC } from "react";

import "./ThreadCard.css";

import Thread from "../../../models/Thread";

import { Link, useHistory } from "react-router-dom";

import { faEye, faReplyAll } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useWindowDimensions } from "../../../hooks/useWindowDimensions";
import ThreadPointsBar from "../../points/ThreadPointsBar";
import ThreadPointsInline from "../../points/ThreadPointsInline";
import RichEditor from "../../editor/RichEditor";

interface ThreadCardProps {
  thread: Thread;
}

const ThreadCard: FC<ThreadCardProps> = ({ thread }) => {
  const history = useHistory();
  const { width } = useWindowDimensions();
  const onClickShowThread = (e: React.MouseEvent<HTMLDivElement>) => {
    history.push("/thread/" + thread.id);
  };

  

  const getResponses = (thread: Thread) => {
    if (width <= 768) {
      return (
        <label
          style={{
            marginRight: ".5em",
          }}
        >
          {thread && thread.threadItems && thread.threadItems.length}
          <FontAwesomeIcon
            icon={faReplyAll}
            className="points-icon"
            style={{
              marginLeft: ".25em",
              marginTop: "-.25em",
            }}
          />
        </label>
      );
    }

    return null;
  };

  return (
    <section className="panel threadcard-container">
      <div className="threadcard-txt-container">
        <div className="content-header">
          <Link
            to={`/categorythreads/${thread.category.id}`}
            className="link-txt"
          >
            <strong>{thread.category.name}</strong>
          </Link>
          <span className="username-header" style={{ marginLeft: ".5em" }}>
            {thread.user.userName}
          </span>
        </div>
        <div className="question">
          <div
            onClick={onClickShowThread}
            data-thread-id={thread.id}
            style={{ marginBottom: ".4rm" }}
          >
            <strong>{thread.title}</strong>
          </div>
        </div>
        <div
          className="threadcard-body"
          onClick={onClickShowThread}
          data-thread-id={thread.id}
        >
          <RichEditor existingBody={thread.body} readOnly={true} />
        </div>
        <div className="threadcard-footer">
          <span style={{ marginRight: ".5em" }}>
            <label>
              {thread.views}
              <FontAwesomeIcon icon={faEye} className="icon-lg" />
            </label>
          </span>
          <span>
            {/*  Mobile view */}
            {width <= 768 ? (
              <ThreadPointsInline
                points={thread?.points || 0}
                allowUpdatePoints={false}
              />
            ) : null}
            {getResponses(thread)}
          </span>
        </div>
      </div>
      <ThreadPointsBar
        points={thread?.points || 0}
        responseCount={
          thread && thread.threadItems && thread.threadItems.length
        }
      />
    </section>
  );
};

export default ThreadCard;

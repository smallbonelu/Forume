import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import Category from "../../../models/Category";
import MainHeader from "./MainHeader";
import ThreadCard from "./ThreadCard";
import { gql, useLazyQuery } from "@apollo/client";

const GetThreadsByCategoryId = gql`
  query getThreadsByCategoryId($categoryId: ID!) {
    getThreadsByCategoryId(categoryId: $categoryId) {
      ... on EntityResult {
        messages
      }
      ... on ThreadArray {
        threads {
          id
          title
          body
          views
          points
          user {
            userName
          }
          threadItems {
            id
          }
          category {
            id
            name
          }
        }
      }
    }
  }
`;

const GetThreadsLatest = gql`
  query getThreadsLatest {
    getThreadsLatest {
      ... on EntityResult {
        messages
      }
      ... on ThreadArray {
        threads {
          id
          title
          body
          views
          points
          user {
            userName
          }
          threadItems {
            id
          }
          category {
            id
            name
          }
        }
      }
    }
  }
`;

const Main = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [
    execGetThreadsByCategoryId,
    { data: threadsByCategoryData },
  ] = useLazyQuery(GetThreadsByCategoryId);
  const [execGetThreadsLatest, { data: threadsLatestData }] = useLazyQuery(
    GetThreadsLatest
  );

  const [category, setCategory] = useState<Category | undefined>();
  const [threadCards, setThreadCards] = useState<Array<JSX.Element> | null>(
    null
  );

  const history = useHistory();

  useEffect(() => {
    console.log("main categoryId", categoryId);

    if (categoryId && Number(categoryId) > 0) {
      execGetThreadsByCategoryId({
        variables: {
          categoryId,
        },
      });
    } else {
      execGetThreadsLatest();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId]);

  useEffect(() => {
    if (
      threadsByCategoryData &&
      threadsByCategoryData.getThreadsByCategoryId &&
      threadsByCategoryData.getThreadsByCategoryId.threads
    ) {
      const threads = threadsByCategoryData.getThreadsByCategoryId.threads;
      const cards = threads.map((th: any) => {
        return <ThreadCard key={`thread-${th.id}`} thread={th} />;
      });
      setCategory(threads[0].category);
      setThreadCards(cards);
    } else {
      setCategory(undefined);
      setThreadCards(null);
    }
  }, [threadsByCategoryData]);

  useEffect(() => {
    if (
      threadsLatestData &&
      threadsLatestData.getThreadsLatest &&
      threadsLatestData.getThreadsLatest.threads
    ) {
      const threads = threadsLatestData.getThreadsLatest.threads;
      const cards = threads.map((th: any) => {
        return <ThreadCard key={`thread-${th.id}`} thread={th} />;
      });
      setCategory(new Category("0", "Latest"));
      setThreadCards(cards);
    }
  }, [threadsLatestData]);

  const onClickPostThread = () => {
    history.push("/thread");
  };

  return (
    <main className="content">
      <button className="action-btn" onClick={onClickPostThread}>
        Post
      </button>
      <MainHeader category={category} />
      <div>{threadCards}</div>
    </main>
  );
};

export default Main;

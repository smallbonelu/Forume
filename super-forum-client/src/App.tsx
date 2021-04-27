import React, { useEffect } from "react";
import "./App.css";
import { Switch, Route } from "react-router-dom";
import Home from "./components/routes/Home";
import Thread from "./components/routes/thread/Thread";
import UserProfile from "./components/routes/userProfile/UserProfile";
import { useDispatch } from "react-redux";
import { gql, useQuery } from "@apollo/client";
import { ThreadCategoriesType } from "./store/categories/Reducer";
import useRefreshReduxMe from "./hooks/useRefreshReduxMe";
import { Container, Row } from "react-bootstrap";

const GetAllCategories = gql`
  query getAllCategories {
    getAllCategories {
      id
      name
    }
  }
`;

function App() {
  const dispatch = useDispatch();
  const { data: categoriesData } = useQuery(GetAllCategories);
  const { execMe, updateMe } = useRefreshReduxMe();

  useEffect(() => {
    execMe();
  }, [execMe]);

  useEffect(() => {
    updateMe();
  }, [updateMe]);

  useEffect(() => {
    if (categoriesData && categoriesData.getAllCategories) {
      dispatch({
        type: ThreadCategoriesType,
        payload: categoriesData.getAllCategories,
      });
    }
  }, [dispatch, categoriesData]);
  const renderHome = (props: any) => <Home {...props} />;
  const renderThread = (props: any) => <Thread {...props} />;
  const renderUserProfile = (props: any) => <UserProfile {...props} />;
  return (
    <Container fluid>
      <Row>
        <Switch>
          <Route exact path="/" render={renderHome} />
          <Route path="/categorythreads/:categoryId" render={renderHome} />
          <Route path="/thread/:id?" render={renderThread} />
          <Route path="/userprofile/:id" render={renderUserProfile} />
        </Switch>
      </Row>
    </Container>
  );
}

export default App;

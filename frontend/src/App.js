import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import { LandingPage } from "./components/LandingPage";
import { Route } from "react-router-dom/cjs/react-router-dom.min";
import { Groups } from "./components/Groups";
import { GroupDetail } from "./components/Groups/GroupDetail";
import { Events } from "./components/Events";
import { EventDetail } from "./components/Events/EventDetail";
import { PageNotFound } from "./components/PageNotFound";
import { CreateGroup } from "./components/Groups/CreateGroup";
import { UpdateGroup } from "./components/Groups/UpdateGroup";
import { CreateEvent } from "./components/Events/CreateEvent";
import Footer from "./components/Footer";
import UpdateEvent from "./components/Events/UpdateEvent";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);


  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Switch></Switch>}
      <Switch>
        <Route exact path="/groups/new">
          <CreateGroup />
        </Route>
        <Route exact path="/">
          <LandingPage />
        </Route>
        <Route exact path="/groups/:groupId">
          <GroupDetail />
        </Route>
        <Route path="/groups/:groupId/events/new">
          <CreateEvent />
        </Route>
        <Route path="/groups/:groupId/edit">
          <UpdateGroup />
        </Route>
        <Route path="/groups">
          <Groups />
        </Route>
        <Route path="/events/:eventId/edit">
          <UpdateEvent />
        </Route>
        <Route path="/events/:eventId">
          <EventDetail />
        </Route>
        <Route path="/events">
          <Events />
        </Route>
        <Route>
          <PageNotFound />
        </Route>
      </Switch>
      <Footer />
    </>
  );
}

export default App;

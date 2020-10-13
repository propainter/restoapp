import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';

import Users from './user/pages/Users';
import NewPlace from './places/pages/NewPlace';
import UserPlaces from './places/pages/UserPlaces';
import AllPlaces from './places/pages/AllPlaces';
import UpdatePlace from './places/pages/UpdatePlace';
import PlaceReviews from './reviews/pages/PlaceReviews';
import NewReview from './reviews/pages/NewReview';
import Auth from './user/pages/Auth';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import { AuthContext } from './shared/context/auth-context';
import { useAuth } from './shared/hooks/auth-hook';
// import {isAdmin, isOwner} from './Constants'

const App = () => {
  const { token, login, logout, userId, userRole } = useAuth();

  let routes;

  

  if (token) {
    routes = (
      <Switch>
        {/* Valid in both */}
        <Route path="/" exact>
          <AllPlaces />
        </Route>
        <Route path="/users" exact>
          <Users/>
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/:placeId/reviews" exact>
          <PlaceReviews />
        </Route>

        <Route path="/places/new" exact>
          <NewPlace />
        </Route>
        <Route path="/places/:placeId">
          <UpdatePlace />
        </Route>
        <Route path="/:placeId/reviews/new" exact>
          <NewReview />
        </Route>

        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        {/* Valid in both */}
        <Route path="/" exact>
          <AllPlaces />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/:placeId/reviews" exact>
          <PlaceReviews />
        </Route>

        <Route path="/auth">
          <Auth />
        </Route>
        <Redirect to="/auth" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        userRole: userRole,
        login: login,
        logout: logout
      }}
    >
      <Router>
        <MainNavigation />
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;

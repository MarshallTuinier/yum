import React, { Component } from "react";

import StoreCard from "./StoreCard";
import PleaseLogin from "./PleaseLogin";

import UserContext from "../utils/UserContext";

export default class FavoriteStores extends Component {
  render() {
    const { loading, storeData, isLoggedIn } = this.props;

    // Loading State View
    if (loading) {
      return (
        <div className="inner">
          <p>Loading</p>
        </div>
      );
    }

    if (!isLoggedIn) {
      return <PleaseLogin />;
    }

    // View with Stores Loaded
    return (
      <UserContext.Consumer>
        {user => (
          <div className="inner">
            <h1>Favorites</h1>
            <div className="stores">
              {storeData
                .filter(store => {
                  return user.hearts.includes(store._id);
                })
                .map(store => {
                  return <StoreCard store={store} key={store._id} />;
                })}
            </div>
          </div>
        )}
      </UserContext.Consumer>
    );
  }
}

import React, { Component } from "react";

import StoreCard from "./StoreCard";

export default class Home extends Component {
  render() {
    const { userData, storeData, loading } = this.props;
    // Loading State View
    if (loading) {
      return (
        <div className="inner">
          <h1>Loading</h1>
        </div>
      );
    }

    // View with Stores Loaded
    return (
      <div className="inner">
        <h1>Welcome{userData && `, ${userData.name}`}!</h1>
        <div className="stores">
          {storeData.map(store => {
            return <StoreCard store={store} key={store._id} />;
          })}
        </div>
      </div>
    );
  }
}

import React, { Component } from "react";

import StoreCard from "./StoreCard";

export default class Stores extends Component {
  render() {
    const { loading, storeData } = this.props;
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
        <h1>Stores</h1>
        <div className="stores">
          {storeData.map(store => {
            return <StoreCard store={store} key={store._id} />;
          })}
        </div>
      </div>
    );
  }
}

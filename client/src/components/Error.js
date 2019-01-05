import React, { Component } from "react";

export default class Error extends Component {
  render() {
    return (
      <div className="inner">
        <h1>Sorry, there was an error</h1>
        <h2>Something bad happened, please try again!</h2>
      </div>
    );
  }
}

// Placeholder page for those who aren't logged in trying to perform a tast
// where logging in is required

import React, { Component } from "react";

export default class PleaseLogin extends Component {
  render() {
    return (
      <div>
        <div className="inner">
          <h1>Sorry, please log in if you'd like to use this feature.</h1>
        </div>
      </div>
    );
  }
}

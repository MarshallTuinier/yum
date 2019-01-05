// Placeholder page for those who aren't logged in trying to perform a tast
// where logging in is required

import React, { Component } from "react";

export default class PleaseLogin extends Component {
  render() {
    return (
      <div>
        <div className="inner">
          <h1>Sorry, you must be the author of a store in order to edit it.</h1>
        </div>
      </div>
    );
  }
}

import React, { Component } from "react";
import StoreForm from "./StoreForm";
import PleaseLogin from "./PleaseLogin";

export default class Add extends Component {
  render() {
    if (!this.props.isLoggedIn) {
      return <PleaseLogin />;
    }
    return (
      <div className="inner">
        <h2>ADD STORE</h2>
        <StoreForm />
      </div>
    );
  }
}

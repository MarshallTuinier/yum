import React, { Component } from "react";
import RegisterForm from "./RegisterForm";

export default class Register extends Component {
  render() {
    return (
      <div className="inner">
        <h2>Register</h2>
        <RegisterForm handleLogin={this.props.handleLogin} />
      </div>
    );
  }
}

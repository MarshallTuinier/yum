import React, { Component } from "react";
import LoginForm from "./LoginForm";
export default class Login extends Component {
  render() {
    return (
      <div className="inner">
        <h2>Login</h2>
        <LoginForm handleLogin={this.props.handleLogin} />
      </div>
    );
  }
}

import React, { Component } from "react";
import styled from "styled-components";
import { registerUser } from "../utils/helpers";
import { navigate } from "@reach/router/lib/history";

export default class RegisterForm extends Component {
  state = {
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
    error: ""
  };

  handleSubmit = async e => {
    e.preventDefault();
    this.setState({
      error: ""
    });

    // Error handling
    try {
      const data = await registerUser(
        "https://yum-server.marshalltuinier.com/register",
        this.state
      );
      if (data.error) {
        let error;
        if (data.error.message) {
          error = data.error.message;
        } else {
          error = data.error[0].msg;
        }

        this.setState({
          error
        });
        return;
      }
      navigate("/login");
      window.location.reload();
    } catch (error) {
      console.error(error);
      navigate("/error");
    }
  };

  render() {
    return (
      <StyledForm className="card" method="POST" onSubmit={this.handleSubmit}>
        <label htmlFor="name">Name</label>
        <input
          type="name"
          name="name"
          value={this.state.name}
          onChange={event => this.setState({ name: event.target.value })}
          required={true}
        />
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          value={this.state.email}
          onChange={event => this.setState({ email: event.target.value })}
          required={true}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          value={this.state.password}
          onChange={event => this.setState({ password: event.target.value })}
          required={true}
        />
        <label htmlFor="passwordConfirm">Confirm Password</label>
        <input
          type="password"
          name="passwordConfirm"
          value={this.state.passwordConfirm}
          onChange={event =>
            this.setState({ passwordConfirm: event.target.value })
          }
          required={true}
        />
        {this.state.passwordsDontMatch && (
          <span style={{ color: "red" }}>
            Please provide matching passwords
          </span>
        )}
        {this.state.error && (
          <span style={{ color: "red" }}>{this.state.error}</span>
        )}
        <input type="submit" className="button" value="Register" />
      </StyledForm>
    );
  }
}

const StyledForm = styled.form`
  input,
  textarea {
    margin-top: 1rem;
    width: 100%;
    padding: 10px;
    border: 1px solid #333;
    &.input {
      &--error {
        border-color: red;
      }
    }
  }

  .form {
    background: white;
    padding: 2rem;
    box-shadow: linear-gradient(
      90deg,
      #48ded4 0%,
      #a026bf 20%,
      #e82c75 60%,
      #ffc40e 85%,
      #48ded4 95%
    );
    & + .form {
      margin-top: 4rem;
    }
    h2 {
      margin: 0;
      font-size: 2rem;
      padding-bottom: 2rem;
      margin-bottom: 2rem;
      border-bottom: 1px solid #333;
    }
  }
  label {
    margin-top: 10rem;
  }
`;

import React, { Component } from "react";
import styled from "styled-components";
import PleaseLogin from "./PleaseLogin";
import { navigate } from "@reach/router";
import { getToken } from "../utils/helpers";

export default class Account extends Component {
  state = {
    name: "",
    email: "",
    error: false
  };

  //Below, since we are grabbing our form data from App as props, and not directly,
  //We need to set those props to state in order to fill the form fields with the current
  //User info.
  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.userData.email !== prevState.email &&
      nextProps.userData.name !== prevState.name
    ) {
      return {
        name: nextProps.userData.name,
        email: nextProps.userData.email
      };
    }
    return null;
  }

  handleSubmit = async event => {
    event.preventDefault();
    try {
      const token = getToken();
      const response = await fetch(
        "https://yum-server.marshalltuinier.com/updateUser",
        {
          method: "POST",
          body: JSON.stringify(this.state),
          headers: {
            "Content-Type": "application/JSON",
            authorization: token
          }
        }
      );
      const data = await response.json();
      if (data.success) {
        navigate("/");
        window.location.reload();
      }
      if (data.error) {
        this.setState({
          error: true
        });
      }
    } catch (error) {
      console.error(error);
      navigate("/error");
    }
  };

  render() {
    if (!this.props.isLoggedIn) {
      return <PleaseLogin />;
    }
    return (
      <div className="inner">
        <h2>Edit Your Account</h2>
        <StyledForm onSubmit={this.handleSubmit}>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            required={true}
            name="name"
            value={this.state.name}
            onChange={event => {
              this.setState({ name: event.target.value });
            }}
          />
          <label htmlFor="email">Email</label>
          <input
            type="email"
            required={true}
            name="email"
            value={this.state.email}
            onChange={event => {
              this.setState({ email: event.target.value });
            }}
          />
          <input className="button" type="submit" value="Update My Account" />
          {this.state.error && (
            <span className="error-message">
              Sorry, there was an error updating your account. Please try again.
            </span>
          )}
          {this.state.success && (
            <span className="success-message">
              Account successfully updated
            </span>
          )}
        </StyledForm>
      </div>
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

  .error-message {
    color: red;
  }
  .success-message {
    color: blue;
  }
`;

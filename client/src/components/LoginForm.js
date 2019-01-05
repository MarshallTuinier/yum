import React, { Component } from "react";
import styled from "styled-components";

export default class LoginForm extends Component {
  state = {
    email: "",
    password: "",
    errorMessage: ""
  };

  handleSubmit = async event => {
    event.preventDefault();
    const data = await this.props.handleLogin(this.state);
    if (data.error) {
      this.setState({
        errorMessage: data.error
      });
    }
  };
  render() {
    return (
      <StyledForm className="card" method="POST" onSubmit={this.handleSubmit}>
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
        {this.state.errorMessage && (
          <p className="error-message">{this.state.errorMessage}</p>
        )}
        <input type="submit" className="button" value="Log in" />
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

  .error-message {
    color: red;
  }
`;

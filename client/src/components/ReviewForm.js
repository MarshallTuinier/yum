import React, { Component, Fragment } from "react";
import { navigate } from "@reach/router";
import styled from "styled-components";

import { getToken } from "../utils/helpers";

export default class ReviewForm extends Component {
  state = {
    rating: null,
    text: "",
    error: ""
  };

  handleSubmit = async event => {
    event.preventDefault();
    if (!this.state.rating) {
      this.setState({ error: "You must supply a rating" });
      return;
    }
    try {
      const { _id } = this.props.store;
      const token = getToken();
      const response = await fetch(`/reviews/${_id}`, {
        method: "POST",
        body: JSON.stringify(this.state),
        headers: {
          "Content-Type": "Application/JSON",
          authorization: token
        }
      });
      const data = await response.json();
      if (data.message) {
        window.location.reload();
      }
      if (data.error) {
        this.setState({ error: data.error });
      }
    } catch (error) {
      console.error(error);
      navigate("/error");
    }
  };

  render() {
    const starArray = [5, 4, 3, 2, 1];
    return (
      <Page>
        <form method="POST" className="reviewer" onSubmit={this.handleSubmit}>
          <textarea
            name="text"
            placeholder="Did you try this place? Have something to say? Leave a review..."
            value={this.state.text}
            onChange={event => this.setState({ text: event.target.value })}
            required={true}
          />
          <div className="reviewer__meta">
            <div className="reviewer__stars">
              {starArray.map(star => (
                <Fragment key={star}>
                  <input
                    type="radio"
                    id={`star${star}`}
                    name="rating"
                    value={star}
                    checked={this.state.rating === star}
                    onChange={() => this.setState({ rating: star })}
                  />
                  <label htmlFor={`star${star}`}>{star} Stars</label>
                </Fragment>
              ))}
            </div>
            <input
              className="button"
              type="submit"
              value="Submit Review"
              onSubmit={this.handleSubmit}
            />
          </div>
          {this.state.error && (
            <span className="error">{this.state.error}</span>
          )}
        </form>
      </Page>
    );
  }
}

const Page = styled.div`
  .reviewer {
    position: relative;
    box-shadow: 0 0px 10px rgba(0, 0, 0, 0.2);
    margin-bottom: 2rem;
  }
  .reviewer__stars {
    display: flex;
    justify-content: center;
    width: 50%;
  }

  /* Hide the radio buttons */
  .reviewer__stars input {
    display: none;
  }

  /* Make descendent stars yellow for a checked input*/
  .reviewer__stars input:checked ~ label {
    color: #ffc40e;
  }
  .reviewer__stars input + label {
    font-size: 0;
    /* These are in the opposite DOM order
           re-order them to be visually in normal order
           This is fine for accessibility because our labels have for()
         */
  }
  .reviewer__stars input + label:before {
    content: "\\2605";
    font-size: 2rem;
  }
  .reviewer__stars input + label[for="star5"] {
    order: 5;
  }
  .reviewer__stars input + label[for="star4"] {
    order: 4;
  }
  .reviewer__stars input + label[for="star3"] {
    order: 3;
  }
  .reviewer__stars input + label[for="star2"] {
    order: 2;
  }
  .reviewer__stars input + label[for="star1"] {
    order: 1;
  }
  .reviewer__stars input + label:hover,
  .reviewer__stars input + label:hover ~ label {
    color: #ffdd74;
  }
  .reviewer textarea {
    border: 0;
    outline: 0;
    font-size: 2rem;
    padding: 2rem;
    height: 200px;
    width: 100%;
  }
  .reviewer__meta {
    display: flex;
    justify-content: center;
    align-items: center;
    border-top: 1px solid #e6e6e6;
  }

  .button {
    width: 50%;
    height: 4rem;
  }

  .error {
    color: red;
  }
`;

import React, { Component } from "react";
import { distanceInWordsToNow } from "date-fns";

export default class Review extends Component {
  render() {
    const { text, author, rating, created } = this.props.data;

    return (
      <div className="review">
        <div className="review__header">
          <div className="review__author">
            <img
              className="avatar"
              src={`https://gravatar.com/avatar/${author.emailHash}?s=200`}
              alt={`Avatar for ${author.name}`}
            />
            <p>{author.name}</p>
          </div>
          <div
            className="review__stars"
            title={`Rated ${rating} out of 5 stars`}
          >
            {String.fromCharCode(9733).repeat(rating)}
            {String.fromCharCode(9734).repeat(5 - rating)}
          </div>
          <time className="review__time" dateTime={created}>
            {`${distanceInWordsToNow(created)} ago`}
          </time>
        </div>
        <div className="review__body">
          <p>{text}</p>
        </div>
      </div>
    );
  }
}

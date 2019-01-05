import React, { Component } from "react";
import { navigate, Link } from "@reach/router";
import styled from "styled-components";

import ReviewForm from "./ReviewForm";
import Review from "./Review";
import UserContext from "../utils/UserContext";
import { makeStaticMap } from "../utils/helpers";

export default class StorePage extends Component {
  state = {
    store: "",
    isLoading: true
  };

  // Fetch the neccessary data for the store
  componentDidMount = async () => {
    try {
      const response = await fetch(
        `https://yum-server.marshalltuinier.com/store/${this.props.storeSlug}`
      );
      const json = await response.json();
      // If we receive an error from the server, navaigate to the error page
      if (json.error) {
        navigate(`/error`);
        return;
      }

      // Set this data to state
      this.setState({
        store: json.data,
        isLoading: false
      });
    } catch (error) {
      console.error(error);
      navigate(`/error`);
    }
  };

  componentDidUpdate = async prevProps => {
    if (this.props.storeSlug === prevProps.storeSlug) {
      return;
    }
    try {
      const response = await fetch(
        `https://yum-server.marshalltuinier.com/store/${this.props.storeSlug}`
      );
      const json = await response.json();
      // If we receive an error from the server, navaigate to the error page
      if (json.error) {
        navigate(`/error`);
        return;
      }

      // Set this data to state
      this.setState({
        store: json.data,
        isLoading: false
      });
    } catch (error) {
      console.error(error);
      navigate(`/error`);
    }
  };

  render() {
    const { store } = this.state;
    if (this.state.isLoading) {
      return (
        <Page className="inner">
          <h1>Loading</h1>
        </Page>
      );
    }

    return (
      <UserContext.Consumer>
        {user => (
          <Page>
            <div className="single">
              <div className="single__hero">
                <img
                  className="single__image"
                  src={`https://res.cloudinary.com/dgt29ucc1/image/upload/v1544036354/yum/${
                    store.photo
                  }`}
                  alt={store.name}
                />
                <h2 className="title title--single">
                  <Link to={`/store/${store.slug}`}>{store.name}</Link>
                </h2>
              </div>
            </div>
            <div className="single__details inner">
              <img
                alt={`Map to ${store.name}`}
                className="single__map"
                src={makeStaticMap(store.location.coordinates)}
              />
              <p className="single__location">{store.location.address}</p>
              <p>{store.description}</p>
              {store.tags && ( //If the store has tags, show the following
                <ul className="tags">
                  {store.tags.map(tag => (
                    <li className="tag" key={tag}>
                      <Link className="tag__link" to={`/tags/${tag}`}>
                        <span className="tag__text">{tag}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              {this.props.isLoggedIn && (
                <ReviewForm {...this.state} user={user} />
              )}
              {store.reviews && (
                <div className="reviews">
                  {store.reviews.map(review => (
                    <Review key={review._id} data={review} />
                  ))}
                </div>
              )}
            </div>
          </Page>
        )}
      </UserContext.Consumer>
    );
  }
}

const Page = styled.div`
  padding: 0;
  .single {
    &__hero {
      height: 500px;
      position: relative;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      clip-path: polygon(0 0, 100% 0, 100% calc(100% - 2vw), 0% 100%);
      &:before {
        display: block;
        content: "";
        position: absolute;
        height: 100%;
        width: 100%;
        top: 0;
        right: 0;
        background: linear-gradient(
            45deg,
            hsla(190, 95%, 43%, 1) 0%,
            hsla(190, 95%, 43%, 0) 70%
          ),
          linear-gradient(
            135deg,
            hsla(219, 93%, 48%, 1) 10%,
            hsla(219, 93%, 48%, 0) 80%
          ),
          linear-gradient(
            225deg,
            hsla(293, 93%, 48%, 1) 10%,
            hsla(293, 93%, 48%, 0) 80%
          ),
          linear-gradient(
            315deg,
            hsla(130, 96%, 45%, 1) 100%,
            hsla(130, 96%, 45%, 0) 70%
          );
        opacity: 0.6;
        z-index: 1;
        clip-path: polygon(0 0, 100% 0, 100% calc(100% - 2vw), 0% 100%);
      }
    }
    &__image {
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      object-fit: cover;
      position: absolute;
    }
    &__details {
      background: white;
      // clip-path: polygon(0px 2vw, 100% 0, 100% calc(100% - 2vw), 0% 100%);
      position: relative;
      padding: 3rem;
      margin-top: -10rem;
      box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.15);
    }
    &__map {
      width: calc(100% + 6rem);
      max-width: none;
      margin-top: -3rem;
      margin-left: -3rem;
    }
    &__location {
      margin: 0;
      margin-top: -3rem;
      margin-right: -5rem;
      background: #303030;
      color: white;
      display: inline-block;
      float: right;
      position: relative;
      padding: 1rem;
      @media all and (max-width: 850px) {
        margin-right: 0;
      }
    }
  }

  .review {
    background: white;
    border: 1px solid $grey;
    border-bottom: 0;
    border-bottom: 1px solid $grey;
    margin-bottom: 2rem;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    position: relative;
    padding-left: 5px;
    &:before {
      width: 5px;
      left: 0;
      content: "";
      display: block;
      background: linear-gradient(
        0,
        #48ded4 0%,
        #a026bf 20%,
        #e82c75 60%,
        #ffc40e 85%,
        #48ded4 95%
      );
      position: absolute;
      height: 100%;
      background-attachment: fixed;
    }
    &__header {
      border-bottom: 1px solid rgb(211, 211, 211);
      display: flex;
      & > * {
        border-right: 1px solid rgb(211, 211, 211);
        padding: 0.2rem;
        display: flex;
        align-items: center;
        flex: 1;
        justify-content: center;
        &:last-child {
          border-right: 0;
        }
      }
    }
    &__author {
      justify-content: flex-start;
      padding-left: 2rem;
      display: flex;
      .avatar {
        margin-right: 2rem;
      }
    }
    &__time {
      font-size: 1.2rem;
      color: rgba(0, 0, 0, 0.5);
    }
    &__stars {
      color: #ffc40e;
    }
    &__body {
      padding: 2rem;
    }
    p {
      white-space: pre-wrap;
    }
  }
`;

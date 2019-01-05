import React, { Component } from "react";
import { Link } from "@reach/router";

import { ReactComponent as Pencil } from "../assets/icons/pencil.svg";
import { ReactComponent as Heart } from "../assets/icons/heart.svg";
import { ReactComponent as Review } from "../assets/icons/review.svg";
import { getToken } from "../utils/helpers";
import { navigate } from "@reach/router/lib/history";

import UserContext from "../utils/UserContext";

class StoreCard extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }

  handleHeartSubmit = async (event, updateUser) => {
    event.preventDefault();
    try {
      this.handleOptimisticHeartToggle();
      const token = getToken();
      await fetch(`/api/v1/stores/${this.props.store._id}/heart`, {
        method: "POST",
        headers: {
          authorization: token
        }
      });
      updateUser();
    } catch (error) {
      console.error(error);
      navigate("/error");
    }
  };

  // Instead of waiting for a db call to update the UI, we want to optimistically update
  // the UI to show the change in "heart" so the feedback is instant
  handleOptimisticHeartToggle = () => {
    const node = this.myRef.current;
    node.classList.toggle("heart__button--hearted");
  };

  render() {
    const { store } = this.props;
    const newDescription = store.description.split(" ").slice(0, 25);
    if (newDescription.length === 25) {
      newDescription.push("...");
    }

    return (
      <UserContext.Consumer>
        {user => (
          <div className="store">
            <div className="store__hero">
              <div className="store__actions">
                {/* Ensure a user is logged in to see heart interface*/}
                {user.id && (
                  <div className="store__action store__action--heart">
                    <form
                      className="heart"
                      method="post"
                      onSubmit={event =>
                        this.handleHeartSubmit(event, user.updateUser)
                      }
                    >
                      <button
                        type="submit"
                        className={
                          user.hearts.includes(store._id)
                            ? "heart__button heart__button--hearted"
                            : "heart__button"
                        }
                        name="heart"
                        ref={this.myRef}
                        onSubmit={event =>
                          this.handleHeartSubmit(event, user.updateUser)
                        }
                      >
                        <Heart />
                      </button>
                    </form>
                  </div>
                )}
                {/* Check to see if the store author is the same as the 
                
                logged in user to enable editing */}

                {user.id === store.author && (
                  <div className="store__action store__action--edit">
                    <Link to={`/stores/${store._id}/edit`}>
                      <Pencil />
                    </Link>
                  </div>
                )}

                {store.reviews.length > 0 && (
                  <div className="store__action store__action--count">
                    <Review />
                    <span>{store.reviews.length}</span>
                  </div>
                )}
              </div>
              <img
                src={`https://res.cloudinary.com/dgt29ucc1/image/upload/v1544036354/yum/${
                  this.props.store.photo
                }`}
                alt={store.name}
              />
              <h2 className="title">
                <Link to={`/store/${store.slug}`}>{store.name}</Link>
              </h2>
            </div>
            <div className="store__details">
              <p>{newDescription.join(" ")}</p>
            </div>
          </div>
        )}
      </UserContext.Consumer>
    );
  }
}

export default StoreCard;

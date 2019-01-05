import React, { Component } from "react";
import styled from "styled-components";
import { Link, Location } from "@reach/router";

import typeAhead from "../utils/typeAhead";
import { ReactComponent as Logo } from "../assets/icons/logo.svg";
import { ReactComponent as Store } from "../assets/icons/store.svg";
import { ReactComponent as Tag } from "../assets/icons/tag.svg";
import { ReactComponent as Top } from "../assets/icons/top.svg";
import { ReactComponent as Add } from "../assets/icons/add.svg";
import { ReactComponent as Map } from "../assets/icons/map.svg";
import { ReactComponent as Heart } from "../assets/icons/heart.svg";
import { ReactComponent as Logout } from "../assets/icons/logout.svg";

export default class Header extends Component {
  state = {
    searchTerm: "",
    searchResults: null
  };

  handleChange = async event => {
    const searchTerm = event.target.value;
    this.setState({ searchTerm });
    const searchResults = await typeAhead(searchTerm);
    if (searchResults) {
      this.setState({ searchResults });
    } else {
      this.setState({ searchResults: null });
    }
  };

  clearSearch = () => {
    this.setState({
      searchTerm: "",
      searchResults: null
    });
  };

  render() {
    const { name, emailHash, hearts } = this.props.userData;
    const { searchResults } = this.state;

    return (
      <Location>
        {({ location }) => {
          return (
            <StyledHeader>
              <div className="top" />
              <nav className="nav">
                <div className="nav__section nav__section--pages">
                  <li className="nav__item">
                    <Link to="/" className="nav__link nav__link--logo">
                      <Logo />
                    </Link>
                  </li>
                  <li className="nav__item">
                    <Link
                      className={`nav__link ${location.pathname.startsWith(
                        "/stores"
                      ) && "nav__link--active"}`}
                      to="/stores"
                    >
                      <Store />
                      <span>Stores</span>
                    </Link>
                  </li>
                  <li className="nav__item">
                    <Link
                      className={`nav__link ${location.pathname.startsWith(
                        "/tags"
                      ) && "nav__link--active"}`}
                      to="/tags"
                    >
                      <Tag />
                      <span>Tags</span>
                    </Link>
                  </li>
                  <li className="nav__item">
                    <Link
                      className={`nav__link ${location.pathname.startsWith(
                        "/top"
                      ) && "nav__link--active"}`}
                      to="/top"
                    >
                      <Top />
                      <span>Top</span>
                    </Link>
                  </li>
                  <li className="nav__item">
                    <Link
                      className={`nav__link ${location.pathname.startsWith(
                        "/add"
                      ) && "nav__link--active"}`}
                      to="/add"
                    >
                      <Add />
                      <span>Add</span>
                    </Link>
                  </li>
                  <li className="nav__item">
                    <Link
                      className={`nav__link ${location.pathname.startsWith(
                        "/map"
                      ) && "nav__link--active"}`}
                      to="/map"
                    >
                      <Map />
                      <span>Map</span>
                    </Link>
                  </li>
                </div>
                <div className="nav__section nav__section--search">
                  <div className="search">
                    <input
                      type="text"
                      placeholder="Search for Coffee, Beer..."
                      name="search"
                      className="search__input"
                      value={this.state.searchTerm}
                      onChange={this.handleChange}
                    />
                    <div className="search__results">
                      {searchResults &&
                        searchResults.map(store => (
                          <Link
                            className="search__result"
                            to={`/store/${store.slug}`}
                            onClick={this.clearSearch}
                            key={store.slug}
                          >
                            <strong>{store.name}</strong>
                          </Link>
                        ))}
                    </div>
                  </div>
                </div>
                <div className="nav__section nav__section--user">
                  {!this.props.isLoggedIn && (
                    <>
                      <li className="nav__item">
                        <Link
                          className={`nav__link ${location.pathname.startsWith(
                            "/register"
                          ) && "nav__link--active"}`}
                          to="/register"
                        >
                          Register
                        </Link>
                      </li>
                      <li className="nav__item">
                        <Link
                          className={`nav__link ${location.pathname.startsWith(
                            "/login"
                          ) && "nav__link--active"}`}
                          to="/login"
                        >
                          Log In
                        </Link>
                      </li>
                    </>
                  )}
                  {this.props.isLoggedIn && (
                    <>
                      <li className="nav__item">
                        <Link
                          className={`nav__link ${location.pathname.startsWith(
                            "/favorites"
                          ) && "nav__link--active"}`}
                          to="/favorites"
                        >
                          <Heart />
                          <span className="heart-count">
                            {hearts && hearts.length}
                          </span>
                        </Link>
                      </li>
                      <li className="nav__item">
                        <Link
                          className={`nav__link ${location.pathname.startsWith(
                            "/account"
                          ) && "nav__link--active"}`}
                          to="/account"
                        >
                          <img
                            className="avatar"
                            src={`https://gravatar.com/avatar/${emailHash}?s=200`}
                            alt={`Avatar for ${name}`}
                          />
                          <span>Account</span>
                        </Link>
                      </li>
                      <li className="nav__item logout-button">
                        <button
                          className="nav__link"
                          onClick={this.props.handleLogout}
                        >
                          <Logout />
                          <span>Logout</span>
                        </button>
                      </li>
                    </>
                  )}
                </div>
              </nav>
            </StyledHeader>
          );
        }}
      </Location>
    );
  }
}

//---------------Styles--------------------//

const StyledHeader = styled.header`
  position: sticky;
  z-index: 5;
  top: 0;
  .nav {
    display: flex;
    margin: 0;
    padding: 0;
    justify-content: space-between;
    background: #303030;
    &__section {
      display: flex;
      &--search {
        flex: 1 1 auto;
      }
    }
    &__item {
      display: flex;
    }
    &__link {
      background: $black;
      color: white;
      border-right: 1px solid rgba(255, 255, 255, 0.1);
      text-transform: uppercase;
      padding: 1.2rem 2rem 1rem 2rem;
      display: block;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s;
      border-bottom: 5px solid transparent;
      svg {
        width: 40px;
        transition: all 0.2s;
        fill: white;
        margin-bottom: 1rem;
      }
      &:hover,
      &--active {
        border-bottom-color: rgba(0, 0, 0, 0.2);
        border-right-color: rgba(0, 0, 0, 0.05);
        svg {
          transform: scale(1.2);
        }
        background: linear-gradient(
            90deg,
            #48ded4 0%,
            #a026bf 20%,
            #e82c75 60%,
            #ffc40e 85%,
            #48ded4 95%
          )
          fixed;
      }
      &--logo {
        &:hover {
          svg {
            transform: none;
          }
        }
        svg {
          width: 200px;
          margin: 0;
        }
      }
    }

    button {
      background: inherit;
      border: none;
      width: 100%;
      height: 100%;

      & :hover {
        cursor: pointer;
      }

      & :focus {
        border: none;
      }
    }
  }

  .search {
    width: 100%;
    display: flex;
    &__results {
      background: white;
      position: absolute;
      width: 100%;
      top: 100%;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
      z-index: 5;
    }
    &__input {
      font-size: 3rem;
      background: none;
      color: white;
      outline: 0;
      border: 0;
      @media all and (max-width: 850px) {
        font-size: 2rem;
      }
    }
    &__result {
      padding: 10px;
      display: block;
      border-bottom: 1px solid #ececec;
      &--active {
        background: #f1f1f1;
      }
    }
  }

  .logout-button {
    & :hover {
      cursor: pointer;
    }
  }

  @media all and (max-width: 1200px) {
    .nav {
      &__link {
        padding-left: 1rem;
        padding-right: 1rem;
        svg {
          width: 30px;
        }
        &--logo {
          svg {
            width: 100px;
          }
        }
      }
    }
  }

  @media all and (max-width: 900px) {
    .nav {
      flex-wrap: wrap;
      &__section {
        order: 1;
        &--search {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          order: 2;
          width: 100%;
        }
      }
    }
  }

  @media all and (max-width: 650px) {
    .nav {
      &__section {
        width: 100%;
        &--user {
          order: -1;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          .avatar {
            min-width: 20px;
            height: 20px;
          }
          svg {
            display: none;
          }
        }
      }
      &__item {
        width: 33.333333%;
      }
      &__link {
        width: 100%;
        svg {
          // width: 5px;
          max-width: 100%;
        }
        &--logo {
          svg {
            width: 100%;
          }
        }
      }
    }
    .heart-count:before {
      content: "♥️";
      margin-right: 1rem;
    }
  }
`;

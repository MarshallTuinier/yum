import React, { Component } from "react";
import styled from "styled-components";

import { navigate } from "@reach/router";

import { getPage, getToken } from "../utils/helpers";
import StoreContext from "../utils/StoreContext";

export default class StoreForm extends Component {
  constructor(props) {
    super(props);
    if (props.store) {
      const { name, description, tags, location, photo } = props.store;
      this.state = {
        name,
        description,
        tags,
        location,
        photo,
        mapsScriptLoaded: false
      };
      return;
    }
    this.state = {
      name: "",
      description: "",
      tags: [],
      location: {
        address: "",
        coordinates: ["", ""]
      },
      photo: "",
      mapsScriptLoaded: false
    };
  }

  componentDidMount = () => {
    // Initialize Google Autocomplete
    /*global google*/
    this.autocomplete = new google.maps.places.Autocomplete(
      document.getElementById("autocomplete")
    );
    // Fire Event when a suggested name is selected
    this.autocomplete.addListener("place_changed", this.handlePlaceSelect);
  };

  handlePlaceSelect = () => {
    // Extract City From Address Object
    const addressObject = this.autocomplete.getPlace();
    const address = addressObject.formatted_address;
    const lat = addressObject.geometry.location.lat();
    const lng = addressObject.geometry.location.lng();
    const location = { address, coordinates: [lng, lat] };
    //For some reason, Mongo likes lng, lat format, so we store it this way

    this.setState({
      location
    });
  };

  handleSubmit = async (event, updateStores) => {
    // Prevent page load on submit
    event.preventDefault();

    // Grab the JWT
    const token = getToken();

    // If we are editing an existing page, we want to hit a different API
    if (this.props.editing === true) {
      try {
        const data = { ...this.state };
        delete data.photo;
        const config = {
          headers: {
            "Content-Type": "application/JSON",
            authorization: token
          }
        };
        const storeResponse = await getPage(
          `/editStore/${this.props.id}`,
          JSON.stringify(data),
          config
        );
        const photoData = new FormData();
        photoData.append("photo", this.state.photo);
        await getPage(`/uploadPhoto/${storeResponse.data._id}`, photoData);
        updateStores();
        //After successful form completion/save, redirect to the newly created store page
        navigate(`/store/${storeResponse.data.slug}`);
        return;
      } catch (error) {
        console.error(error);
        navigate(`/error`);
        return;
      }
    }

    // If this is a new store, do the following
    // Post the form data to our API
    try {
      const data = { ...this.state };
      delete data.photo;
      const config = {
        headers: {
          "Content-Type": "application/JSON",
          authorization: token
        }
      };
      const storeResponse = await getPage(
        `/createStore`,
        JSON.stringify(data),
        config
      );
      const photoData = new FormData();
      photoData.append("photo", this.state.photo);
      await getPage(`/uploadPhoto/${storeResponse.data._id}`, photoData);
      updateStores();
      //After successful form completion/save, redirect to the newly created store page
      navigate(`/store/${storeResponse.data.slug}`);
    } catch (error) {
      console.error(error);
      navigate(`/error`);
    }
  };

  // This method changes the state for the selected tags, toggling them
  handleCheck = event => {
    const { value } = event.target;
    if (event.target.checked) {
      this.setState(prevState => {
        const tags = [...prevState.tags, value];
        return { tags };
      });
      return;
    }
    this.setState(prevState => {
      const tags = prevState.tags.filter(item => {
        return item !== value;
      });
      return { tags };
    });
  };

  render() {
    const tagChoices = [
      "Wifi",
      "Open Late",
      "Family Friendly",
      "Vegitarian",
      "Licensed"
    ];
    return (
      <StoreContext.Consumer>
        {stores => (
          <StyledForm className="inner">
            <form
              onSubmit={event => this.handleSubmit(event, stores.updateStores)}
              method="POST"
              className="card"
            >
              <label htmlFor="name">Name</label>
              <input
                type="text"
                name="name"
                value={this.state.name}
                onChange={event => this.setState({ name: event.target.value })}
              />
              <label htmlFor="photo">Photo</label>
              <input
                type="file"
                name="photo"
                id="photo"
                onChange={event =>
                  this.setState({ photo: event.target.files[0] })
                }
                accept="image/gif, image/png, image/jpeg"
              />
              <label htmlFor="address">
                Address
                <input
                  value={this.state.location.address}
                  onChange={event => {
                    const value = event.target.value;
                    this.setState(prevState => {
                      let location = { ...prevState.location };
                      location.address = value;
                      return { location };
                    });
                  }}
                  id="autocomplete"
                />
              </label>
              <label htmlFor="lng">Longitude</label>
              <input
                type="text"
                id="lng"
                name="lng"
                value={this.state.location.coordinates[0]}
                onChange={event => {
                  const lng = event.target.value;
                  this.setState(prevState => {
                    const location = { ...prevState.location };
                    location.coordinates[0] = lng;
                    return {
                      location
                    };
                  });
                }}
              />
              <label htmlFor="lat">Lattitude</label>
              <input
                type="text"
                id="lat"
                name="lat"
                value={this.state.location.coordinates[1]}
                onChange={event => {
                  const lat = event.target.value;
                  this.setState(prevState => {
                    const location = { ...prevState.location };
                    location.coordinates[1] = lat;
                    return {
                      location
                    };
                  });
                }}
              />
              <label htmlFor="description">Description</label>
              <textarea
                name="description"
                value={this.state.description}
                onChange={event =>
                  this.setState({ description: event.target.value })
                }
              />
              <ul className="tags">
                {tagChoices.map(choice => {
                  return (
                    <div className="tag tag__choice" key={choice}>
                      <input
                        type="checkbox"
                        id={choice}
                        value={choice}
                        name="tags"
                        onChange={this.handleCheck}
                        checked={this.state.tags.includes(choice)}
                      />
                      <label htmlFor="choice">{choice}</label>
                    </div>
                  );
                })}
              </ul>
              <input type="submit" value="Save" className="button" />
            </form>
          </StyledForm>
        )}
      </StoreContext.Consumer>
    );
  }
}

//----------------Styles------------------//

const StyledForm = styled.div`
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

  .tags {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    margin-bottom: 2rem;
    flex-wrap: wrap;
  }

  .tag {
    display: block;
    margin: 1rem 1rem 1rem 0;
    &.tag__choice {
      display: flex;
      justify-content: center;
      align-items: center;
      input {
        width: auto;
        right: -1.5rem;
        margin-right: -1rem;
        position: relative;
        z-index: 2;
        & + label {
          background: rgb(211, 211, 211);
          padding: 1rem 1rem 1rem 4rem;
        }
        &:checked + label {
          background: #ffc40e;
        }
      }
    }
    &.__link {
      background: #ffc40e;
      color: #303030;
      display: flex;
      padding-left: 10px;
      clip-path: polygon(10px 0%, 100% 1%, 100% 100%, 10px 100%, 0% 50%);
      &.--active {
        background: #262161;
        .tag__text {
          color: white;
        }
      }
    }
    &.__text {
      padding: 1rem 1rem;
      display: block;
    }
    &.__count {
      padding: 1rem 1rem;
      background: white;
      border-left: 3px solid rgba(0, 0, 0, 0.1);
      margin-right: -1px;
      background-clip: padding-box;
    }
  }

  .suggestion {
    border: 1px solid black;
    width: 100%;
  }
`;

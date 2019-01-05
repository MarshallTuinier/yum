import React, { Component } from "react";
import StoreForm from "./StoreForm";
import { navigate } from "@reach/router";
import YouMustOwnStore from "./YouMustOwnStore";

export default class EditStore extends Component {
  state = {
    loading: true,
    data: null
  };

  // Grab all the data for this particular store, based on the URL slug
  componentDidMount = async () => {
    const { storeId } = this.props;
    try {
      const response = await fetch(
        `https://yum-server.marshalltuinier.com/stores/${storeId}`
      );
      const json = await response.json();
      if (json.error) {
        navigate("error");
      }
      const { data } = json;
      this.setState({
        loading: false,
        data
      });
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    const { data } = this.state;
    if (this.state.loading) {
      return (
        <div className="inner">
          <h1>Loading</h1>
        </div>
      );
    }

    //Check to see if the user who is logged in matches the user who created the store

    if (data.author !== this.props.userData.id) {
      return <YouMustOwnStore />;
    }

    return (
      <div className="inner">
        <h2>Edit {data.name}</h2>
        <StoreForm store={data} editing={true} id={this.props.storeId} />
      </div>
    );
  }
}

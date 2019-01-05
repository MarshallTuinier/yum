import React, { Component } from "react";
import { Router } from "@reach/router";
import { navigate } from "@reach/router";

import GlobalStyles from "./components/GlobalStyles";
import Home from "./components/Home";
import AppWrapper from "./AppWrapper";
import Header from "./components/Header";
import NotFound from "./components/NotFound";
import Add from "./components/Add";
import Stores from "./components/Stores";
import StorePage from "./components/StorePage";
import EditStore from "./components/EditStore";
import Error from "./components/Error";
import Tags from "./components/Tags";
import Login from "./components/Login";
import Register from "./components/Register";
import Account from "./components/Account";
import Map from "./components/Map";
import FavoriteStores from "./components/FavoriteStores";
import TopStores from "./components/TopStores";

import { getUserData } from "./utils/helpers";
import UserContext from "./utils/UserContext";
import StoreContext from "./utils/StoreContext";

class App extends Component {
  state = {
    isLoggedIn: false,
    loading: true,
    storeData: "",
    userData: "",
    tagData: ""
  };

  handleLogin = async user => {
    try {
      const response = await fetch(
        "https://yum-server.marshalltuinier.com/login",
        {
          method: "POST",
          body: JSON.stringify({
            email: user.email,
            password: user.password
          }),
          headers: {
            "Content-Type": "application/JSON"
          }
        }
      );
      const data = await response.json();
      if (data.success) {
        localStorage.setItem("token", data.token);
        this.setState({
          isLoggedIn: true,
          userData: {
            name: data.name,
            email: data.email
          }
        });
        navigate("/");
        window.location.reload("/");
      }
      return data;
    } catch (error) {
      console.log("Sorry, an error has occured");
    }
  };

  handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  // Check to see if the user is logged in on App mounting
  componentDidMount = async () => {
    try {
      this.updateUser();
      const storeResponse = await fetch(
        "https://yum-server.marshalltuinier.com/stores"
      );
      const storeJson = await storeResponse.json();
      if (storeJson.error) {
        navigate("/error/");
        return;
      }
      const { data: storeData } = storeJson;
      this.setState({
        loading: false,
        storeData
      });
    } catch (error) {
      console.error(error);
      navigate("/error");
    }
  };

  updateStores = async () => {
    try {
      const storeResponse = await fetch(
        "https://yum-server.marshalltuinier.com/stores"
      );
      const storeJson = await storeResponse.json();
      if (storeJson.error) {
        navigate("/error/");
        return;
      }
      const { data: storeData } = storeJson;
      this.setState({
        storeData
      });
    } catch (error) {
      console.error(error);
      navigate("/error");
    }
  };

  updateUser = async () => {
    const userData = await getUserData();
    if (userData) {
      this.setState({ isLoggedIn: true, userData });
    }
  };

  render() {
    return (
      <AppWrapper>
        <UserContext.Provider
          value={{
            ...this.state.userData,
            updateUser: this.updateUser
          }}
        >
          <StoreContext.Provider
            value={{ ...this.state.storeData, updateStores: this.updateStores }}
          >
            <GlobalStyles />
            <Header {...this.state} handleLogout={this.handleLogout} />
            <div className="main">
              <Router>
                <Home path="/" {...this.state} />
                <Add path="add" {...this.state} />
                <Stores path="stores" {...this.state} />
                <StorePage path="store/:storeSlug" {...this.state} />
                <EditStore path="stores/:storeId/edit" {...this.state} />
                <Error path="error" />
                <NotFound default />
                <Tags path="tags" {...this.state} />
                <Tags path="tags/:tag" {...this.state} />
                <Login path="login" handleLogin={this.handleLogin} />
                <Register path="register" />
                <Map path="map" />
                <Account path="account" {...this.state} />
                <FavoriteStores path="favorites" {...this.state} />
                <TopStores path="top" {...this.state} />
              </Router>
            </div>
          </StoreContext.Provider>
        </UserContext.Provider>
      </AppWrapper>
    );
  }
}

export default App;

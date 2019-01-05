import React, { Component } from "react";
import Helmet from "react-helmet";
import ReactDependentScript from "react-dependent-script";
import doughnut from "./assets/icons/doughnut.png";

class AppWrapper extends Component {
  render() {
    return (
      <ReactDependentScript
        loadingComponent={<div />}
        scripts={[
          `https://maps.googleapis.com/maps/api/js?key=${
            process.env.REACT_APP_GOOGLE_MAPS_API_KEY
          }&libraries=places`
        ]}
      >
        <div className="App">
          <Helmet
            title={"Yum!"}
            meta={[
              {
                name: "Yum",
                content: "Find delicous treats, anywhere!"
              },
              {
                name: "keywords",
                content: "Food, Eating, delcious"
              }
            ]}
            link={[
              {
                rel: "shortcut icon",
                type: "image/png",
                href: `${doughnut}`
              }
            ]}
          />
          {this.props.children}
        </div>
      </ReactDependentScript>
    );
  }
}

export default AppWrapper;

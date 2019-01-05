import React, { Component } from "react";

export default class Map extends Component {
  state = {
    inputValue: ""
  };
  componentDidMount = async () => {
    // Initialize Google Autocomplete
    this.autocomplete = new window.google.maps.places.Autocomplete(
      document.getElementById("autocomplete")
    );
    // Fire Event when a suggested name is selected
    this.autocomplete.addListener("place_changed", this.handlePlaceSelect);

    // Google Map Options
    const mapOptions = {
      center: { lat: 36.16, lng: -115.14 },
      zoom: 11
    };

    this.map = new window.google.maps.Map(
      document.getElementById("map"),
      mapOptions
    );
    await this.loadPlaces();
  };

  loadPlaces = async (lat = 36.16, lng = -115.14) => {
    const response = await fetch(`/api/v1/stores/near?lat=${lat}&lng=${lng}`);
    const json = await response.json();

    // Create bounds for the map
    const bounds = new window.google.maps.LatLngBounds();

    // Create an info window to display when you click a marker
    const infoWindow = new window.google.maps.InfoWindow();

    const markers = json.map(place => {
      const [placeLng, placeLat] = place.location.coordinates;
      const position = { lat: placeLat, lng: placeLng };
      bounds.extend(position);
      const marker = new window.google.maps.Marker({
        map: this.map,
        position: position
      });
      marker.place = place;
      return marker;
    });

    // when you click a marker, show the details of that place
    markers.forEach(marker =>
      marker.addListener("click", function() {
        const html = `
          <div class="popup">
            <a href="/store/${this.place.slug}">
              <p>${this.place.name} - ${this.place.location.address}</p>
            </a>
          </div>
        `;
        infoWindow.setContent(html);
        infoWindow.open(this.map, marker);
      })
    );

    // Zoom the map to fit the markers based on bounds
    this.map.setCenter(bounds.getCenter());
    this.map.fitBounds(bounds);
  };

  handlePlaceSelect = () => {
    // grab the place
    const place = this.autocomplete.getPlace();
    try {
      this.loadPlaces(
        place.geometry.location.lat(),
        place.geometry.location.lng()
      );
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    return (
      <div className="inner">
        <h2>Store Locator</h2>
        <div className="map">
          <div className="autocomplete">
            <input
              className="autocomplete__input"
              type="text"
              placeholder="Search for anything"
              name="geolocate"
              id="autocomplete"
              value={this.state.inputValue}
              onChange={event =>
                this.setState({ inputValue: event.target.value })
              }
            />
          </div>
          <div id="map">
            <p>Loading Map</p>
          </div>
        </div>
      </div>
    );
  }
}

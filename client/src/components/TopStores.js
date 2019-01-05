import React, { Component } from "react";
import { navigate, Link } from "@reach/router";
import styled from "styled-components";

export default class TopStores extends Component {
  state = {
    stores: ""
  };
  componentDidMount = async () => {
    try {
      const response = await fetch("/getTopStores");
      const json = await response.json();
      this.setState({
        stores: json.data
      });
    } catch (error) {
      console.error(error);
      navigate("/error");
    }
  };
  render() {
    const { stores } = this.state;
    if (!stores) {
      return (
        <div className="inner">
          <h1>Loading</h1>
        </div>
      );
    }
    return (
      <TopTen className="inner">
        <h1>Top 10 Stores</h1>
        <table className="table">
          <thead>
            <td>Photo</td>
            <td>Ranking</td>
            <td>Name</td>
            <td>Reviews</td>
            <td>Average Rating</td>
          </thead>
          {stores.map((store, index) => (
            <tbody key={index}>
              <td>
                <Link to={`/store/${store.slug}`}>
                  <img
                    width={200}
                    src={`https://res.cloudinary.com/dgt29ucc1/image/upload/v1544036354/yum/${
                      store.photo
                    }`}
                    alt={store.name}
                  />
                </Link>
              </td>
              <td> {index + 1}</td>
              <td>
                <Link to={`/store/${store.slug}`}>{store.name}</Link>
              </td>
              <td>{store.reviews.length}</td>
              <td>{Math.round(store.averageRating * 10) / 10} / 5</td>
            </tbody>
          ))}
        </table>
      </TopTen>
    );
  }
}

const TopTen = styled.div`
  .table {
    width: 100%;
  }
  .table td {
    padding: 5px;
  }
  .table tr:nth-child(even) {
    background: white;
  }
  .table tr:nth-child(odd):not(:first-child) {
    background: #f7f7f7;
  }
  .table thead tr {
    background: #303030;
    color: white;
  }

  .table thead td {
    background: #303030;
    color: white;
  }
`;

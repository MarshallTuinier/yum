import React, { Component } from "react";
import styled from "styled-components";
import { Link } from "@reach/router";
import { getTags } from "../utils/helpers";
import StoreCard from "./StoreCard";

export default class Tags extends Component {
  state = {
    tags: "",
    activeTag: "",
    selectedTag: "",
    tagsLoading: true
  };

  // Grab our tags from DB with counts of each tag
  componentDidMount = async () => {
    const { data } = await getTags(this.props.tag);
    const { tags } = data;
    let activeTag;
    if (this.props.tag) {
      activeTag = this.props.tag;
    }
    this.setState({
      tags,
      tagsLoading: false,
      activeTag
    });
  };

  // Update active tag upon switching
  componentDidUpdate = prevProps => {
    if (prevProps.tag !== this.props.tag) {
      this.setState({
        activeTag: this.props.tag
      });
    }
  };

  render() {
    const { tags, tagsLoading, activeTag } = this.state;
    const { loading, storeData } = this.props;
    if (loading || tagsLoading) {
      return (
        <Page className="inner">
          <h1>Tags</h1>
          <p>Loading</p>
        </Page>
      );
    }

    return (
      <Page className="inner">
        <h1>{activeTag || "Tags"}</h1>

        <ul className="tags">
          {tags.map(tag => (
            <li className="tag" key={tag._id}>
              <Link
                className={`tag__link ${tag._id === activeTag &&
                  `tag__link--active`}`}
                to={`/tags/${tag._id}`}
              >
                <span className="tag__text">{tag._id}</span>
                <span className="tag__count">{tag.count}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="stores">
          {storeData
            .filter(store => {
              // If no tag is selected, return all the stores
              if (!activeTag) {
                return store;
              }

              // If a tag is selected, filter the stores
              if (store.tags.includes(activeTag)) {
                return store;
              }
              return null;
            })
            .map(store => {
              return <StoreCard store={store} key={store._id} />;
            })}
        </div>
      </Page>
    );
  }
}

//---------------------Styles---------------------//

const Page = styled.div``;

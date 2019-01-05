import { navigate } from "@reach/router";
import jwt_decode from "jwt-decode";

const getTags = async tag => {
  try {
    const response = await fetch(
      `https://yum-server.marshalltuinier.com/tags/${tag}`
    );
    const tags = await response.json();
    if (tags.error) {
      navigate("/error");
      return;
    }
    return tags;
  } catch (error) {
    console.error(error);
    navigate("/error");
  }
};

const registerUser = async (url, data) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({ ...data }),
      headers: {
        "Content-Type": "application/JSON"
      }
    });
    return response.json();
  } catch (error) {
    console.log("Sorry, an error has occured");
  }
};

const makeStaticMap = coords => {
  const [lng, lat] = coords;
  return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=14&size=800x150&key=${
    process.env.REACT_APP_GOOGLE_MAPS_API_KEY
  }&markers=${lat},${lng}&scale=2`;
};

const getPage = async (url, data, config) => {
  if (config) {
    try {
      const response = await fetch(url, {
        method: "POST",
        body: data,
        headers: config.headers
      });
      return response.json();
    } catch (error) {
      console.log("Sorry, an error has occured");
    }
  }
  try {
    const response = await fetch(url, {
      method: "POST",
      body: data
    });
    return response.json();
  } catch (error) {
    console.log("Sorry, an error has occured");
  }
};

const getToken = () => {
  return localStorage.getItem("token");
};

const decodeToken = () => {
  const token = getToken();
  if (!token) return;
  return jwt_decode(token.slice(7, token.length));
};

const getUserData = async () => {
  const token = getToken();
  const response = await fetch(
    "https://yum-server.marshalltuinier.com/getUserData",
    {
      headers: {
        authorization: token
      }
    }
  );
  const data = await response.json();
  if (data.success) return data;
  return null;
};

export {
  makeStaticMap,
  getTags,
  getPage,
  registerUser,
  getToken,
  decodeToken,
  getUserData
};

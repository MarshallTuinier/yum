const typeAhead = async search => {
  // if there is nothing to be searched, bail out!
  if (!search) return;

  try {
    // Grab the data from the api endpoint
    const response = await fetch(
      `https://yum-server.marshalltuinier.com/api/v1/search?q=${search}`
    );
    const data = await response.json();

    // If the data has something in it, return it
    if (data.length) {
      return await data;
    }

    // Otherwise, return nothing
    return null;
  } catch (error) {
    console.error(error);
  }
};

export default typeAhead;

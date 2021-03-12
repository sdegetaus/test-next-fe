const Home = ({ products, error }) => {
  if (error) {
    return (
      <div>
        <strong>An error occured:</strong> {error.message}
      </div>
    );
  }
  return (
    <>
      <h1>NextJS Example</h1>
      <ul>
        {products.length !== 0 ? (
          products.map((prod) => (
            <li key={prod.id}>
              {prod.name} - {prod.description}
            </li>
          ))
        ) : (
          <pre>Empty response</pre>
        )}
      </ul>
    </>
  );
};

Home.getInitialProps = async (ctx) => {
  try {
    // Parses the JSON returned by a network request
    const parseJSON = (resp) => (resp.json ? resp.json() : resp);
    // Checks if a network request came back fine, and throws an error if not
    const checkStatus = (resp) => {
      if (resp.status >= 200 && resp.status < 300) {
        return resp;
      }

      return parseJSON(resp).then((resp) => {
        throw resp;
      });
    };

    const headers = {
      "Content-Type": "application/json",
    };

    const url = process.env.NODE_STRAPI_URL || null;

    if (url == null) {
      return { products: [] };
    }

    const products = await fetch(`${url}/products`, {
      method: "GET",
      headers,
    })
      .then(checkStatus)
      .then(parseJSON);

    return { products };
  } catch (error) {
    return { error };
  }
};

export default Home;

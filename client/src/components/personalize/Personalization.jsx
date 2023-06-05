import Fetch from "./Fetch";
import "./Personalization.css";
import React, { useState, useEffect } from "react";
import Select from "react-select";
import Subscribe from "./Subscribe";

// {"options": [
//   { "value": "chocolate", "label": "Chocolate" },
//   { "value": "strawberry", "label": "Strawberry" },
//   { "value": "vanilla", "label": "Vanilla" }
// ]}

const styles = {
  control: (css) => ({
    ...css,
    width: "100%",
  }),
  menu: ({ width, ...css }) => ({
    ...css,
    width: "max-content",
    minWidth: "20%",
  }),
  // Add padding to account for width of Indicators Container plus padding
  option: (css) => ({ ...css, width: 500 }),
};

function Personalization() {
  const [options, setOptions] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);

  useEffect(() => {
    fetch("https://aac52175-1a9a-4e27-a818-3b742aab1c52.mock.pstmn.io/options")
      .then((response) => response.json())
      .then((data) => {
        setOptions(data.options);
      });
  }, []);

  const handleSubscribeClick = (email) => {
    // Perform subscription logic here
    console.log(
      `Subscribing email: ${email} and interests ${selectedInterests.map(
        (v) => v.value
      )}`
    );

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        interests: selectedInterests.map((v) => v.value),
      }),
    };
    fetch(
      "https://bc924f0f-f775-42ab-8b84-43512d73e4ef.mock.pstmn.io/subscribe",
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data.res);
      });
  };

  const handleFetchClick = (email) => {
    // Perform subscription logic here
    console.log(`fetching interests for email: ${email}`);

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
      }),
    };
    fetch(
      "https://bc924f0f-f775-42ab-8b84-43512d73e4ef.mock.pstmn.io/fetch",
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data.interests);
      });
  };

  return (
    <div className="Personalization">
      <Select
        defaultValue={selectedInterests}
        isMulti
        styles={styles}
        onChange={setSelectedInterests}
        options={options}
      />
      <Fetch onFetch={handleFetchClick} />
      <Subscribe onSubscribe={handleSubscribeClick} />
    </div>
  );
}

export default Personalization;

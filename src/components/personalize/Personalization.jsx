import Fetch from "./Fetch";
import "./Personalization.css";
import React, { useState } from "react";
import Select from "react-select";
import Subscribe from "./Subscribe";

const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];

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
  const [selectedInterests, setSelectedInterests] = useState([]);

  const handleSubscribeClick = (email) => {
    // Perform subscription logic here
    console.log(
      `Subscribing email: ${email} and interests ${selectedInterests.map(
        (v) => v.value
      )}`
    );
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
      <Fetch />
      <Subscribe onSubscribe={handleSubscribeClick} />
    </div>
  );
}

export default Personalization;

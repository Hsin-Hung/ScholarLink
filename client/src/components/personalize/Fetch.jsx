import "./Fetch.css";
import React, { useState } from "react";

function Fetch({ onFetch }) {
  const [email, setEmail] = useState("");

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter your email"
        value={email}
        onChange={handleEmailChange}
      />
      <button
        onClick={() => {
          onFetch(email);
        }}
      >
        Fetch My Interests
      </button>
    </div>
  );
}

export default Fetch;

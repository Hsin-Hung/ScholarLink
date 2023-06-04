import "./Fetch.css";
import React, { useState } from "react";

function Fetch() {
  const [email, setEmail] = useState("");

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleFetchClick = () => {
    // Perform subscription logic here
    console.log(`Fetching interests for email: ${email}`);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter your email"
        value={email}
        onChange={handleEmailChange}
      />
      <button onClick={handleFetchClick}>Fetch My Interests</button>
    </div>
  );
}

export default Fetch;

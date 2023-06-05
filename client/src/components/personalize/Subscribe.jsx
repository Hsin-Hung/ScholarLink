import "./Subscribe.css";
import React, { useState } from "react";

function Subscribe({ onSubscribe }) {
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
      <button onClick={() => onSubscribe(email)}>Subscribe</button>
    </div>
  );
}

export default Subscribe;

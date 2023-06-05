import "./Interest.css";
import React, { useState } from 'react';

function Interest({title}) {
  return (
    <div className="Interest">
      <button>{title}</button>
    </div>
  );
}

export default Interest;

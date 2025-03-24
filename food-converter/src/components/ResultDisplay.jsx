import React from "react";

const ResultDisplay = ({ result }) => {
  return (
    <div>
      {result ? (
        <h3>Converted Value: {result}</h3>
      ) : (
        <p>Enter values and click Convert to see results.</p>
      )}
    </div>
  );
};

export default ResultDisplay;

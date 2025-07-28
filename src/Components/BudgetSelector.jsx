// BudgetSelector.jsx
import React from "react";
 // Optional: style it separately

export default function BudgetSelector({ budget, setBudget }) {
  return (
    <div className="budget-selector">
      <h3>Select Your Budget Package:</h3>
      <label>
        <input
          type="radio"
          value="1000"
          checked={budget === 1000}
          onChange={() => setBudget(1000)}
        />
        Rs. 1,000
      </label>
      <label>
        <input
          type="radio"
          value="5000"
          checked={budget === 5000}
          onChange={() => setBudget(5000)}
        />
        Rs. 5,000
      </label>
      <label>
        <input
          type="radio"
          value="15000"
          checked={budget === 15000}
          onChange={() => setBudget(15000)}
        />
        Rs. 15,000
      </label>
    </div>
  );
}
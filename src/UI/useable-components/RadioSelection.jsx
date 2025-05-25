import React from "react";
import useRadioSelection from "@hooks/useRadioSelection";

const RadioSelection = ({ options, initialValue }) => {
  const { selection, setSelection } = useRadioSelection({ options, initialValue });
  return (
    <div className="radio-selection">
      {options.map(({ label, value }) => (
        <label key={value} style={{ marginRight: 15, cursor: "pointer" }}>
          <input
            type="radio"
            name="radio-selection"
            value={value}
            checked={selection === value}
            onChange={() => setSelection(value)}
            style={{ marginRight: 5 }}
          />
          {label}
        </label>
      ))}
    </div>
  );
};

export default RadioSelection;

import React from "react";
import useRadioSelection from "@hooks/useRadioSelection";

const RadioSelection = ({ options, initialValue, onChange }) => {
  const { selection, setSelection } = useRadioSelection({ options, initialValue });

  const handleChange = (value) => {
    setSelection(value);
    onChange?.(value); 
  };

  return (
    <div className="radio-selection mb-2">
      {options.map(({ label, value }) => (
        <label key={value} style={{ marginRight: 15, cursor: "pointer" }}>
          <input
            type="radio"
            name="radio-selection"
            value={value}
            checked={selection === value}
            onChange={() => handleChange(value)}
            style={{ marginRight: 5 }}
          />
          {label}
        </label>
      ))}
    </div>
  );
};

export default RadioSelection;

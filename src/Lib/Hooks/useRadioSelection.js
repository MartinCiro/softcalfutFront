import { useState } from "react";

const useRadioSelection = ({ options, initialValue }) => {
  const [selection, setSelection] = useState(
    initialValue || (options.length > 0 ? options[0].value : "")
  );

  return { selection, setSelection };
};

export default useRadioSelection;

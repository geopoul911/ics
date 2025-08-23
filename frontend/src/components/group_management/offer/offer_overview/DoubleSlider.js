import React, { useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const DoubleSlider = (props) => {
  const [values, setValues] = useState([1, props.pax]);

  const handleChange = (newValues) => {
    setValues(newValues);
    props.updateScaleRange(newValues[0], newValues[1]);
  };

  return (
    <div>
      <Slider
        range
        min={1}
        max={props.pax}
        value={values}
        onChange={handleChange}
        key={props.pax}
      />
      <div className="slider-label">
        Minimum PAX: {values[0]}
        <br />
        Maximum PAX: {values[1]}
      </div>
    </div>
  );
};

export default DoubleSlider;

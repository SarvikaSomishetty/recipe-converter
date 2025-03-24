import React from "react";
import { MenuItem, TextField } from "@mui/material";

const units = ["cup", "tablespoon", "teaspoon", "glass"];

const UnitSelector = ({ unit, onUnitChange }) => {
  return (
    <TextField
      select
      label="Measurement Type"
      variant="outlined"
      value={unit}
      onChange={(e) => onUnitChange(e.target.value)}
    >
      {units.map((unit) => (
        <MenuItem key={unit} value={unit}>
          {unit}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default UnitSelector;

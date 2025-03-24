import React from "react";
import { MenuItem, TextField } from "@mui/material";

const quantities = ["1", "1/2", "1/4", "3/4", "2", "3"];

const QuantitySelector = ({ quantity, onQuantityChange }) => {
  return (
    <TextField
      select
      label="Quantity"
      variant="outlined"
      value={quantity}
      onChange={(e) => onQuantityChange(e.target.value)}
      style={{ marginRight: "10px" }}
    >
      {quantities.map((qty) => (
        <MenuItem key={qty} value={qty}>
          {qty}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default QuantitySelector;

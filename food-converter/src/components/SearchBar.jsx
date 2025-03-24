import React, { useState, useEffect } from "react";
import { Autocomplete, TextField, CircularProgress } from "@mui/material";

const SearchBar = ({ onSelect }) => {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchSuggestions = async () => {
      if (inputValue.trim().length < 1) {
        setOptions([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:5000/api/search_foods?query=${encodeURIComponent(inputValue)}`,
          { signal }
        );
        
        if (!response.ok) throw new Error("Failed to fetch");
        
        const data = await response.json();
        setOptions(data);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error("Error fetching suggestions:", error);
          setOptions([]);
        }
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    
    return () => {
      controller.abort();
      clearTimeout(debounceTimer);
    };
  }, [inputValue]);

  return (
    <Autocomplete
      freeSolo
      options={options}
      loading={loading}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      onChange={(event, newValue) => {
        onSelect(newValue);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search food..."
          variant="outlined"
          fullWidth
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      renderOption={(props, option) => (
        <li {...props} key={option}>
          {option}
        </li>
      )}
      getOptionLabel={(option) => option || ""}
      filterOptions={(x) => x} // Disable client-side filtering
    />
  );
};

export default SearchBar;
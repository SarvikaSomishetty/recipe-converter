import React, { useState } from "react";
import SearchBar from "../components/SearchBar";
import QuantitySelector from "../components/QuantitySelector";
import UnitSelector from "../components/UnitSelector";
import ResultDisplay from "../components/ResultDisplay";
import { Button, CircularProgress } from "@mui/material";

const Home = () => {
  const [selectedFood, setSelectedFood] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [unit, setUnit] = useState("cup");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConvert = async () => {
    if (!selectedFood) {
      setResult("Please select a food item.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/convert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          food: selectedFood,
          quantity: quantity,
          unit: unit,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setResult(data.result);
      } else {
        setResult(data.error || "Conversion failed");
      }
    } catch (error) {
      setResult("Network error. Please try again.");
      console.error("Conversion error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h1>Food Measurement Converter</h1>
      <SearchBar onSelect={setSelectedFood} />
      <div style={{ display: "flex", marginTop: "10px" }}>
        <QuantitySelector quantity={quantity} onQuantityChange={setQuantity} />
        <UnitSelector unit={unit} onUnitChange={setUnit} />
      </div>
      <Button
        variant="contained"
        color="primary"
        onClick={handleConvert}
        style={{ marginTop: "10px" }}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : "Convert"}
      </Button>
      <ResultDisplay result={result} />
    </div>
  );
};

export default Home;
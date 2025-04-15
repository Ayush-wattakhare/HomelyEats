import React from "react";
import "./FilterBar.css"; // Make sure path is correct

const FilterBar = ({ filterType, setFilterType, sortOrder, setSortOrder }) => {
  return (
    <div className="filter-bar">
      <div className="filter-buttons">
        <button
          onClick={() => setFilterType("all")}
          className={filterType === "all" ? "active-all" : "inactive"}
        >
          All
        </button>
        <button
          onClick={() => setFilterType("veg")}
          className={filterType === "veg" ? "active-veg" : "inactive"}
        >
          Veg
        </button>
        <button
          onClick={() => setFilterType("nonveg")}
          className={filterType === "nonveg" ? "active-nonveg" : "inactive"}
        >
          Non-Veg
        </button>
      </div>

      <select
        className="sort-select"
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value)}
      >
        <option value="">Sort By</option>
        <option value="lowToHigh">Price: Low to High</option>
        <option value="highToLow">Price: High to Low</option>
      </select>
    </div>
  );
};

export default FilterBar;

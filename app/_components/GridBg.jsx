import React from "react";

const GridBg = () => {
  const numCells = 156; // Adjust this number as needed
  return (
    <div className="grid grid-cols-12 lg:grid-cols-32">
      {Array.from({ length: numCells }, (_, i) => (
        <div key={i} className="h-16 border border-zinc-600/20" />
      ))}
    </div>
  );
};

export default GridBg;

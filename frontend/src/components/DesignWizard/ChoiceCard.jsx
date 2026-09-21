import React from "react";

const ChoiceCard = ({ item, selected, onSelect, variant = "room" }) => {
  return (
    <button
      type="button"
      className={`dw-card dw-card-${variant}${selected ? " selected" : ""}`}
      onClick={onSelect}
      aria-pressed={selected}
    >
      {selected && (
        <span className="dw-card-check" aria-hidden="true">
          ✓
        </span>
      )}
      <span className="dw-card-visual" role="img" aria-hidden="true">
        {item.emoji}
      </span>
      <span className="dw-card-name">{item.name}</span>
      <span className="dw-card-desc">{item.description}</span>
    </button>
  );
};

export default ChoiceCard;
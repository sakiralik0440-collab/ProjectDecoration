import React from "react";
import ChoiceCard from "./ChoiceCard";
import { WIZARD_DESIGN_STYLES } from "../../data/staticData";

const StyleSelection = ({ designStyle, onSelect, ready, onGenerate, onBack }) => {
  return (
    <>
      <h2 className="dw-heading">🎨 Choose Design Style</h2>
      <p className="dw-subtitle">
        Choose the interior style you want for your room.
      </p>

      <div className="dw-grid dw-grid--styles">
        {WIZARD_DESIGN_STYLES.map((entry) => (
          <ChoiceCard
            key={entry.id}
            item={entry}
            selected={designStyle === entry.id}
            onSelect={() => onSelect(entry.id)}
            variant="style"
          />
        ))}
      </div>

      <div className="dw-actions">
        <button type="button" className="btn btn-secondary" onClick={onBack}>
          Back
        </button>
        <button
          type="button"
          className="btn btn-primary"
          disabled={!ready}
          onClick={onGenerate}
        >
          🤖 Generate Design
        </button>
      </div>
    </>
  );
};

export default StyleSelection;
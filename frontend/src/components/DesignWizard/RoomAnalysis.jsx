import React, { useState } from "react";
import ChoiceCard from "./ChoiceCard";
import { WIZARD_ROOM_TYPES } from "../../data/staticData";

const RoomAnalysis = ({ roomType, onSelect, ready, onContinue, onBack }) => {
  const [detectNote, setDetectNote] = useState("");

  const handleDetect = () => {
    setDetectNote(
      "Automatic room detection isn't connected yet. Please select a room type manually."
    );
  };

  return (
    <>
      <h2 className="dw-heading">🏠 Room Analysis</h2>
      <p className="dw-subtitle">
        Select your room type or let the system detect it from your uploaded
        image.
      </p>

      <div className="dw-grid dw-grid--rooms">
        {WIZARD_ROOM_TYPES.map((entry) => (
          <ChoiceCard
            key={entry.id}
            item={entry}
            selected={roomType === entry.id}
            onSelect={() => onSelect(entry.id)}
            variant="room"
          />
        ))}
      </div>

      <div className="dw-detect">
        <button
          type="button"
          className="btn btn-ghost"
          onClick={handleDetect}
        >
          ✨ Detect Automatically
        </button>
        {detectNote && <p className="dw-hint">{detectNote}</p>}
      </div>

      <div className="dw-actions">
        <button type="button" className="btn btn-secondary" onClick={onBack}>
          Back
        </button>
        <button
          type="button"
          className="btn btn-primary"
          disabled={!ready}
          onClick={onContinue}
        >
          Continue
        </button>
      </div>
    </>
  );
};

export default RoomAnalysis;
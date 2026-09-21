import React from "react";

const STEP_LABELS = ["Room Photo", "Room Type", "Design Style", "Generate"];

const StepProgress = ({ current }) => {
  return (
    <ol className="dw-steps">
      {STEP_LABELS.map((label, index) => {
        const step = index + 1;
        const done = step < current;
        const active = step === current;
        return (
          <li
            key={label}
            className={`dw-step${active ? " active" : ""}${done ? " done" : ""}`}
          >
            <span className="dw-step-dot" aria-hidden="true">
              {done ? "✓" : step}
            </span>
            <span className="dw-step-label">{label}</span>
          </li>
        );
      })}
    </ol>
  );
};

export default StepProgress;
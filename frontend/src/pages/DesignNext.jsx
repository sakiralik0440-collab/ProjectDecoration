import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDesignSession } from "../context/DesignContext";
import StepProgress from "../components/DesignWizard/StepProgress";
import RoomAnalysis from "../components/DesignWizard/RoomAnalysis";
import StyleSelection from "../components/DesignWizard/StyleSelection";
import GenerateStep from "../components/DesignWizard/GenerateStep";
import {
  ROOM_CATEGORIES,
  INTERIOR_STYLES,
  WIZARD_ROOM_TYPES,
  WIZARD_DESIGN_STYLES,
} from "../data/staticData";

const DesignNext = () => {
  const {
    roomImage,
    roomType,
    designStyle,
    setRoomType,
    setDesignStyle,
    clearRoomImage,
  } = useDesignSession();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [stage, setStage] = useState(() =>
    roomType ? (designStyle ? "generate" : "style") : "analysis"
  );

  useEffect(() => {
    const roomId = searchParams.get("room");
    const styleId = searchParams.get("style");

    if (!roomType && roomId && ROOM_CATEGORIES.some((c) => c.id === roomId)) {
      setRoomType(roomId);
    }
    if (!designStyle && styleId && INTERIOR_STYLES.some((s) => s.id === styleId)) {
      setDesignStyle(styleId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!roomImage) {
    return (
      <section className="container room-input">
        <h1>Design My Space</h1>
        <p className="room-no-image">No space image found yet. Start by adding one.</p>
        <Link to="/design" className="btn btn-primary">
          Upload Your Space
        </Link>
      </section>
    );
  }

  const handleChangeImage = () => {
    navigate({ pathname: "/design", search: searchParams.toString() });
  };

  const stepForStage = { analysis: 2, style: 3, generate: 4 }[stage];

  const roomLabel = (WIZARD_ROOM_TYPES.find((r) => r.id === roomType) || {}).name;
  const styleLabel = (WIZARD_DESIGN_STYLES.find((s) => s.id === designStyle) || {}).name;

  return (
    <section className="container dw-wizard">
      <StepProgress current={stepForStage} />

      <div className="dw-thumb">
        <img src={roomImage.dataUrl} alt="Your space" />
        <div className="dw-thumb-info">
          <span className="dw-thumb-title">Your Space Photo</span>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={handleChangeImage}
          >
            Change Image
          </button>
        </div>
      </div>

      {stage === "analysis" && (
        <RoomAnalysis
          roomType={roomType}
          onSelect={setRoomType}
          ready={Boolean(roomType)}
          onContinue={() => setStage("style")}
          onBack={handleChangeImage}
        />
      )}

      {stage === "style" && (
        <StyleSelection
          designStyle={designStyle}
          onSelect={setDesignStyle}
          ready={Boolean(designStyle)}
          onGenerate={() => setStage("generate")}
          onBack={() => setStage("analysis")}
        />
      )}

      {stage === "generate" && (
        <GenerateStep
          roomTypeName={roomLabel}
          designStyleName={styleLabel}
          payload={{ roomImage: roomImage.dataUrl, roomImagePreview: roomImage.dataUrl, roomType, designStyle }}
          onBack={() => setStage("style")}
          onStartNew={() => {
            clearRoomImage();
            navigate("/design");
          }}
        />
      )}
    </section>
  );
};

export default DesignNext;
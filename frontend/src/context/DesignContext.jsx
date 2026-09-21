import React, {
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";

const STORAGE_KEY = "designSession";

const EMPTY_SESSION = {
  roomImage: null,
  roomType: null,
  designStyle: null,
};

function readStoredSession() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...EMPTY_SESSION };
    const parsed = JSON.parse(raw);
    return {
      roomImage: parsed && parsed.roomImage ? parsed.roomImage : null,
      roomType: parsed && parsed.roomType ? parsed.roomType : null,
      designStyle: parsed && parsed.designStyle ? parsed.designStyle : null,
    };
  } catch {
    return { ...EMPTY_SESSION };
  }
}

function persistSession(session) {
  try {
    if (!session.roomImage) {
      sessionStorage.removeItem(STORAGE_KEY);
      return;
    }
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // QuotaExceededError / SecurityError — keep in memory only; refresh
    // survival is degraded but step navigation still works.
  }
}

export const DesignContext = createContext();

export const DesignProvider = ({ children }) => {
  const [session, setSession] = useState(readStoredSession);

  const setRoomImage = useCallback((image) => {
    setSession((prev) => {
      const next = { ...prev, roomImage: image };
      persistSession(next);
      return next;
    });
  }, []);

  const setRoomType = useCallback((roomType) => {
    setSession((prev) => {
      const next = { ...prev, roomType };
      persistSession(next);
      return next;
    });
  }, []);

  const setDesignStyle = useCallback((designStyle) => {
    setSession((prev) => {
      const next = { ...prev, designStyle };
      persistSession(next);
      return next;
    });
  }, []);

  const clearRoomImage = useCallback(() => {
    setRoomImage(null);
  }, [setRoomImage]);

  return (
    <DesignContext.Provider
      value={{
        roomImage: session.roomImage,
        roomType: session.roomType,
        designStyle: session.designStyle,
        setRoomImage,
        setRoomType,
        setDesignStyle,
        clearRoomImage,
      }}
    >
      {children}
    </DesignContext.Provider>
  );
};

export function useDesignSession() {
  return useContext(DesignContext);
}
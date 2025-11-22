import { useEffect, useCallback } from "react";
import { useStore } from "@/game/store";
import { cn } from "@/lib/utils";
import "./gameControls.css";

// Direction types for D-pad
export type Direction = "up" | "down" | "left" | "right";
export type ActionButton = "A" | "B" | "X" | "Y" | "START" | "SELECT";

interface GameControlsProps {
  onDirection?: (direction: Direction) => void;
  onDirectionRelease?: (direction: Direction) => void;
  onAction?: (action: ActionButton) => void;
  onActionRelease?: (action: ActionButton) => void;
}

function GameControls({
  onDirection,
  onDirectionRelease,
  onAction,
  onActionRelease,
}: GameControlsProps) {
  const {
    input: { setInput, mode, building },
  } = useStore();

  // Default direction handler - can be used for camera/character movement
  const handleDirection = useCallback(
    (direction: Direction) => {
      if (onDirection) {
        onDirection(direction);
      }
      // Dispatch custom event for other systems to listen
      window.dispatchEvent(
        new CustomEvent("gamepad:direction", { detail: { direction } })
      );
    },
    [onDirection]
  );

  const handleDirectionRelease = useCallback(
    (direction: Direction) => {
      if (onDirectionRelease) {
        onDirectionRelease(direction);
      }
      window.dispatchEvent(
        new CustomEvent("gamepad:direction:release", { detail: { direction } })
      );
    },
    [onDirectionRelease]
  );

  // Default action handler
  const handleAction = useCallback(
    (action: ActionButton) => {
      if (onAction) {
        onAction(action);
      }

      // Default behaviors based on action
      switch (action) {
        case "A": // Confirm/Select/Build
          window.dispatchEvent(new CustomEvent("gamepad:confirm"));
          break;
        case "B": // Cancel/Back
          setInput({ building: null, selection: null });
          window.dispatchEvent(new CustomEvent("gamepad:cancel"));
          break;
        case "X": // Attack/Special action
          window.dispatchEvent(new CustomEvent("gamepad:attack"));
          break;
        case "Y": // Inventory/Secondary action
          window.dispatchEvent(new CustomEvent("gamepad:inventory"));
          break;
        case "START": // Menu/Pause
          window.dispatchEvent(new CustomEvent("gamepad:menu"));
          break;
        case "SELECT": // Toggle modes
          const modes: Array<"select" | "build" | "delete"> = [
            "select",
            "build",
            "delete",
          ];
          const currentIndex = modes.indexOf(mode);
          const nextMode = modes[(currentIndex + 1) % modes.length];
          setInput({ mode: nextMode });
          window.dispatchEvent(
            new CustomEvent("gamepad:mode", { detail: { mode: nextMode } })
          );
          break;
      }
    },
    [onAction, setInput, mode]
  );

  const handleActionRelease = useCallback(
    (action: ActionButton) => {
      if (onActionRelease) {
        onActionRelease(action);
      }
      window.dispatchEvent(
        new CustomEvent("gamepad:action:release", { detail: { action } })
      );
    },
    [onActionRelease]
  );

  // Keyboard support for desktop
  useEffect(() => {
    const keyMap: Record<string, Direction | ActionButton> = {
      // Arrow keys and WASD for directions
      ArrowUp: "up",
      ArrowDown: "down",
      ArrowLeft: "left",
      ArrowRight: "right",
      KeyW: "up",
      KeyS: "down",
      KeyA: "left",
      KeyD: "right",
      // Action keys
      Space: "A",
      Enter: "A",
      Escape: "B",
      Backspace: "B",
      KeyE: "X",
      KeyQ: "Y",
      KeyM: "START",
      Tab: "SELECT",
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default for game keys
      if (keyMap[e.code]) {
        e.preventDefault();
        const mapped = keyMap[e.code];
        if (["up", "down", "left", "right"].includes(mapped)) {
          handleDirection(mapped as Direction);
        } else {
          handleAction(mapped as ActionButton);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (keyMap[e.code]) {
        e.preventDefault();
        const mapped = keyMap[e.code];
        if (["up", "down", "left", "right"].includes(mapped)) {
          handleDirectionRelease(mapped as Direction);
        } else {
          handleActionRelease(mapped as ActionButton);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [
    handleDirection,
    handleDirectionRelease,
    handleAction,
    handleActionRelease,
  ]);

  // Touch event handlers for mobile
  const createTouchHandler = (
    direction: Direction,
    isPress: boolean
  ) => {
    return (e: React.TouchEvent | React.MouseEvent) => {
      e.preventDefault();
      if (isPress) {
        handleDirection(direction);
      } else {
        handleDirectionRelease(direction);
      }
    };
  };

  const createActionHandler = (
    action: ActionButton,
    isPress: boolean
  ) => {
    return (e: React.TouchEvent | React.MouseEvent) => {
      e.preventDefault();
      if (isPress) {
        handleAction(action);
      } else {
        handleActionRelease(action);
      }
    };
  };

  return (
    <div className="game-controls">
      {/* D-Pad - Left side */}
      <div className="dpad-container">
        <div className="dpad">
          <button
            className="dpad-btn dpad-up"
            onTouchStart={createTouchHandler("up", true)}
            onTouchEnd={createTouchHandler("up", false)}
            onMouseDown={createTouchHandler("up", true)}
            onMouseUp={createTouchHandler("up", false)}
            onMouseLeave={createTouchHandler("up", false)}
            aria-label="Up"
          >
            <span className="dpad-arrow">&#9650;</span>
          </button>
          <button
            className="dpad-btn dpad-left"
            onTouchStart={createTouchHandler("left", true)}
            onTouchEnd={createTouchHandler("left", false)}
            onMouseDown={createTouchHandler("left", true)}
            onMouseUp={createTouchHandler("left", false)}
            onMouseLeave={createTouchHandler("left", false)}
            aria-label="Left"
          >
            <span className="dpad-arrow">&#9664;</span>
          </button>
          <div className="dpad-center"></div>
          <button
            className="dpad-btn dpad-right"
            onTouchStart={createTouchHandler("right", true)}
            onTouchEnd={createTouchHandler("right", false)}
            onMouseDown={createTouchHandler("right", true)}
            onMouseUp={createTouchHandler("right", false)}
            onMouseLeave={createTouchHandler("right", false)}
            aria-label="Right"
          >
            <span className="dpad-arrow">&#9654;</span>
          </button>
          <button
            className="dpad-btn dpad-down"
            onTouchStart={createTouchHandler("down", true)}
            onTouchEnd={createTouchHandler("down", false)}
            onMouseDown={createTouchHandler("down", true)}
            onMouseUp={createTouchHandler("down", false)}
            onMouseLeave={createTouchHandler("down", false)}
            aria-label="Down"
          >
            <span className="dpad-arrow">&#9660;</span>
          </button>
        </div>
      </div>

      {/* Center buttons - START/SELECT */}
      <div className="center-controls">
        <button
          className="center-btn select-btn"
          onTouchStart={createActionHandler("SELECT", true)}
          onTouchEnd={createActionHandler("SELECT", false)}
          onMouseDown={createActionHandler("SELECT", true)}
          onMouseUp={createActionHandler("SELECT", false)}
          onMouseLeave={createActionHandler("SELECT", false)}
          aria-label="Select"
        >
          <span className="center-label">MODE</span>
        </button>
        <button
          className="center-btn start-btn"
          onTouchStart={createActionHandler("START", true)}
          onTouchEnd={createActionHandler("START", false)}
          onMouseDown={createActionHandler("START", true)}
          onMouseUp={createActionHandler("START", false)}
          onMouseLeave={createActionHandler("START", false)}
          aria-label="Start"
        >
          <span className="center-label">MENU</span>
        </button>
      </div>

      {/* Action buttons - Right side (Diamond layout like SNES/PlayStation) */}
      <div className="action-container">
        <div className="action-buttons">
          <button
            className={cn("action-btn action-y", building && "active")}
            onTouchStart={createActionHandler("Y", true)}
            onTouchEnd={createActionHandler("Y", false)}
            onMouseDown={createActionHandler("Y", true)}
            onMouseUp={createActionHandler("Y", false)}
            onMouseLeave={createActionHandler("Y", false)}
            aria-label="Y - Inventory"
          >
            <span className="action-label">Y</span>
          </button>
          <button
            className="action-btn action-x"
            onTouchStart={createActionHandler("X", true)}
            onTouchEnd={createActionHandler("X", false)}
            onMouseDown={createActionHandler("X", true)}
            onMouseUp={createActionHandler("X", false)}
            onMouseLeave={createActionHandler("X", false)}
            aria-label="X - Attack"
          >
            <span className="action-label">X</span>
          </button>
          <button
            className="action-btn action-b"
            onTouchStart={createActionHandler("B", true)}
            onTouchEnd={createActionHandler("B", false)}
            onMouseDown={createActionHandler("B", true)}
            onMouseUp={createActionHandler("B", false)}
            onMouseLeave={createActionHandler("B", false)}
            aria-label="B - Cancel"
          >
            <span className="action-label">B</span>
          </button>
          <button
            className="action-btn action-a"
            onTouchStart={createActionHandler("A", true)}
            onTouchEnd={createActionHandler("A", false)}
            onMouseDown={createActionHandler("A", true)}
            onMouseUp={createActionHandler("A", false)}
            onMouseLeave={createActionHandler("A", false)}
            aria-label="A - Confirm"
          >
            <span className="action-label">A</span>
          </button>
        </div>
      </div>

      {/* Mode indicator */}
      <div className="mode-indicator">
        <span className={cn("mode-badge", `mode-${mode}`)}>{mode.toUpperCase()}</span>
      </div>
    </div>
  );
}

export default GameControls;

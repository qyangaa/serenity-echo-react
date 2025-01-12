import styled, { css, keyframes } from "styled-components";

const pulseAnimation = keyframes`
  0% {
    box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15),
      inset 0 0 32px rgba(67, 134, 205, 0.2);
    border-color: rgba(67, 134, 205, 0.3);
  }
  50% {
    box-shadow: 0 8px 32px rgba(255, 0, 0, 0.2),
      inset 0 0 32px rgba(255, 0, 0, 0.3);
    border-color: rgba(255, 0, 0, 0.5);
  }
  100% {
    box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15),
      inset 0 0 32px rgba(67, 134, 205, 0.2);
    border-color: rgba(67, 134, 205, 0.3);
  }
`;

export const GradientBackground = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
`;

export const RecordingsList = styled.div`
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(12px);
  padding: 1.5rem;
  border-radius: 15px;
  width: 90%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const RecordingItem = styled.div`
  background: rgba(255, 255, 255, 0.9);
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: #1a237e;

  button {
    background: #64b5f6;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background 0.2s ease;

    &:hover {
      background: #42a5f5;
    }
  }
`;

interface CalminDiskProps {
  isRecording?: boolean;
}

export const CalminDisk = styled.button<CalminDiskProps>`
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: ${(props) =>
    props.isRecording ? "rgba(255, 82, 82, 0.25)" : "rgba(67, 134, 205, 0.25)"};
  backdrop-filter: blur(12px);
  border: 2px solid
    ${(props) =>
      props.isRecording ? "rgba(255, 82, 82, 0.3)" : "rgba(67, 134, 205, 0.3)"};
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15),
    inset 0 0 32px rgba(67, 134, 205, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  color: ${(props) => (props.isRecording ? "#d32f2f" : "#1a237e")};
  font-size: 1.2rem;
  font-weight: 500;

  ${(props) =>
    props.isRecording &&
    css`
      animation: ${pulseAnimation} 2s infinite ease-in-out;
    `}

  &:hover {
    transform: scale(1.02);
    background: ${(props) =>
      props.isRecording
        ? "rgba(255, 82, 82, 0.35)"
        : "rgba(67, 134, 205, 0.35)"};
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }

  &::before {
    content: "";
    position: absolute;
    width: 280px;
    height: 280px;
    border-radius: 50%;
    background: radial-gradient(
      circle at center,
      ${(props) =>
          props.isRecording
            ? "rgba(255, 82, 82, 0.2)"
            : "rgba(67, 134, 205, 0.2)"}
        0%,
      transparent 70%
    );
    pointer-events: none;
  }
`;

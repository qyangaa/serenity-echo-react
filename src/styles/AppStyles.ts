import styled, { css, keyframes } from "styled-components";

const pulseAnimation = keyframes`
  0% {
    opacity: 0.5;
  }
  50% {
    opacity: 0.7;
  }
  100% {
    opacity: 0.5;
  }
`;

export const GradientBackground = styled.div`
  width: 100vw;
  height: 100vh;
  background: white;
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

export const TranscriptionCard = styled.div`
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(12px);
  padding: 1.5rem;
  border-radius: 15px;
  width: 90%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

export const SummarySection = styled.div`
  h3 {
    color: #1a237e;
    margin-bottom: 1rem;
    font-size: 1.2rem;
    font-weight: 500;
  }

  ul {
    margin: 0;
    padding-left: 1.5rem;
    color: #1a237e;
  }

  li {
    margin-bottom: 0.5rem;
    line-height: 1.4;
  }
`;

export const TranscriptionSection = styled.div`
  h3 {
    color: #1a237e;
    margin-bottom: 1rem;
    font-size: 1.2rem;
    font-weight: 500;
  }
`;

export const Divider = styled.hr`
  border: none;
  height: 1px;
  background: rgba(26, 35, 126, 0.2);
  margin: 0.5rem 0;
`;

export const TranscriptionText = styled.div`
  background: rgba(255, 255, 255, 0.9);
  padding: 1.5rem;
  border-radius: 8px;
  font-size: 1.1rem;
  color: #1a237e;
  line-height: 1.5;
  min-height: 60px;
`;

export const TranscriptionMeta = styled.div`
  display: flex;
  justify-content: space-between;
  color: #1a237e;
  font-size: 0.9rem;
  opacity: 0.8;
`;

interface CalminDiskProps {
  isRecording?: boolean;
}

export const CalminDisk = styled.button<CalminDiskProps>`
  width: 180px;
  height: 180px;
  background: transparent;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.5s ease;
  position: relative;
  padding: 0;
  outline: none;

  ${(props) =>
    props.isRecording &&
    css`
      animation: ${pulseAnimation} 3s infinite ease-in-out;
    `}

  &:hover {
    transform: scale(1.02);
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
    width: 100%;
    height: 100%;
    background: ${(props) =>
      props.isRecording
        ? "rgba(103, 58, 183, 0.5)"
        : "rgba(103, 58, 183, 0.3)"};
    border-radius: ${(props) => (props.isRecording ? "30px" : "50%")};
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    filter: blur(8px);
  }
`;

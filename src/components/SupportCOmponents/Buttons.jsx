import React from 'react';
import styled from 'styled-components';

const ContactButton = () => {
  return (
    <StyledWrapper>
      <button className="super-button">
        <span>Contact Us</span>
        <svg fill="none" viewBox="0 0 24 24" className="arrow">
          <path strokeLinejoin="round" strokeLinecap="round" strokeWidth={2} stroke="currentColor" d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .super-button {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 14px 28px;
    background: linear-gradient(145deg, #E4003A, #E4003A);
    border-radius: 100px;
    color: #000000ff;
    font-size: 16px;
    font-weight: 600;
    letter-spacing: 0.5px;
    cursor: pointer;
    overflow: hidden;
    transition: all 0.4s ease-in-out;
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.1);
    backdrop-filter: blur(8px);
    z-index: 1;
  }

  .super-button::before {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: conic-gradient(from 0deg, #ffffffff, #ffffffff, #ffffffff);
    animation: rotate 4s linear infinite;
    z-index: -2;
  }

  .super-button::after {
    content: "";
    position: absolute;
    inset: 2px;
    background: #ffffffff;
    border-radius: inherit;
    z-index: -1;
  }

  .super-button:hover {
    transform: scale(1.05);
    box-shadow: 0 0 40px rgba(146, 229, 229, 0.7);
  }

  .super-button:hover .arrow {
    transform: translateX(6px);
  }

  .arrow {
    width: 22px;
    height: 22px;
    transition: transform 0.3s ease-in-out;
    color: #ff2a00ff;
  }

  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }`;

export default ContactButton;
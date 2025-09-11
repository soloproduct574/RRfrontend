"use client";
import React from "react";
import styled, { keyframes } from "styled-components";

export default function HoverButton({ text }) {
  return (
    <StyledWrapper>
      <button className="leaf-button">
        <span className="button-text">{text}</span>
        {[...Array(10)].map((_, i) => (
          <div key={i} className={`leaf leaf-${i + 1}`}></div>
        ))}
      </button>
    </StyledWrapper>
  );
}

// Keyframes
const leafGrowth = keyframes`
  0% { transform: scale(0) rotate(0deg); opacity: 0; }
  70% { transform: scale(1.1) rotate(2deg); opacity: 0.8; }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
`;

const gentleShake = keyframes`
  0%, 100% { transform: translateX(0) rotate(0deg); }
  25% { transform: translateX(-1px) rotate(-1deg); }
  50% { transform: translateX(1px) rotate(1deg); }
  75% { transform: translateX(-1px) rotate(-1deg); }
`;

const StyledWrapper = styled.div`
  .leaf-button {
    position: relative;
    width: 180px;
    height: 55px;
    variant: outlined;
    color: #FF6600;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    text-transform: uppercase;
    cursor: pointer;
    overflow: visible; /* allow leaves to show outside button */
    padding: 15px;
    text-align: center;
    margin: 0 5px;
  }

  .leaf-button:hover {
    background: #ffffffff;
    color: #000000ff;
  }

  .button-text {
    position: relative;
    z-index: 2;
  }

  .leaf {
    position: absolute;
    background: #4caf50;
    opacity: 0;
    pointer-events: none;
  }

  /* Leaf shapes and positions */
  .leaf-1 { width: 20px; height: 12px; border-radius: 50% 0 50% 50%; top: 8px; left: 15px; transform-origin: bottom left; }
  .leaf-2 { width: 16px; height: 10px; border-radius: 50% 50% 0 50%; bottom: 8px; right: 15px; transform-origin: top right; }
  .leaf-3 { width: 18px; height: 14px; border-radius: 50% 0 50% 0; top: 50%; right: 20px; transform: translateY(-50%); transform-origin: center; }
  .leaf-4 { width: 16px; height: 10px; border-radius: 50% 50% 0 50%; bottom: 8px; left: 20px; transform-origin: bottom left; }
  .leaf-5 { width: 14px; height: 9px; border-radius: 50% 50% 50% 0; top: 20%; left: 50%; transform-origin: center; }
  .leaf-6 { width: 12px; height: 8px; border-radius: 50% 0 50% 50%; top: 70%; right: 40%; transform-origin: center; }
  .leaf-7 { width: 15px; height: 10px; border-radius: 0 50% 50% 50%; bottom: 20%; left: 35%; transform-origin: center; }
  .leaf-8 { width: 16px; height: 12px; border-radius: 50% 50% 0 50%; top: 10%; right: 50%; transform-origin: center; }
  .leaf-9 { width: 14px; height: 10px; border-radius: 50% 0 50% 50%; bottom: 15%; right: 25%; transform-origin: center; }
  .leaf-10 { width: 12px; height: 8px; border-radius: 50% 50% 50% 0; top: 55%; left: 60%; transform-origin: center; }

  /* Hover animation */
  .leaf-button:hover .leaf {
    opacity: 1;
    animation: ${leafGrowth} 0.5s ease forwards, ${gentleShake} 2s ease infinite 0.5s;
  }

  /* Staggered animation */
  .leaf-button:hover .leaf-1  { animation-delay: 0s, 0.5s; }
  .leaf-button:hover .leaf-2  { animation-delay: 0.2s, 0.7s; }
  .leaf-button:hover .leaf-3  { animation-delay: 0.4s, 0.9s; }
  .leaf-button:hover .leaf-4  { animation-delay: 0.6s, 1.1s; }
  .leaf-button:hover .leaf-5  { animation-delay: 0.8s, 1.3s; }
  .leaf-button:hover .leaf-6  { animation-delay: 1s, 1.5s; }
  .leaf-button:hover .leaf-7  { animation-delay: 1.2s, 1.7s; }
  .leaf-button:hover .leaf-8  { animation-delay: 1.4s, 1.9s; }
  .leaf-button:hover .leaf-9  { animation-delay: 1.6s, 2.1s; }
  .leaf-button:hover .leaf-10 { animation-delay: 1.8s, 2.3s; }
`;

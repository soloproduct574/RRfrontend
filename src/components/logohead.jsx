"use client";
import React from "react";
import styled, { keyframes } from "styled-components";
import { FaStar, FaRegSmile, FaHeart ,FaCottonBureau,FaTypo3,FaAd,FaAlignLeft,FaAmazonPay,FaAngleLeft,FaAdn} from "react-icons/fa"; // example icons

export default function HoverButton({ text }) {
  const icons = [FaStar, FaHeart, FaRegSmile, FaCottonBureau, FaTypo3,FaCottonBureau,FaAd,FaAlignLeft,FaAmazonPay,FaAngleLeft,FaAdn]; // Add more icons as needed

  return (
    <StyledWrapper>
      <button className="celebrate-button">
        <span className="button-text">{text}</span>
        {icons.map((Icon, i) => (
          <div key={i} className={`icon icon-${i + 1}`}>
            <Icon size={18} />
          </div>
        ))}
      </button>
    </StyledWrapper>
  );
}

const floatUp = keyframes`
  0% { transform: translateY(0) scale(0.5); opacity: 0; }
  50% { transform: translateY(-20px) scale(1.2); opacity: 1; }
  100% { transform: translateY(-40px) scale(1); opacity: 0; }
`;

const StyledWrapper = styled.div`
  .celebrate-button {
  variants: outline;
    position: relative;
    width: 180px;
    height: 55px;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    color: #ff7700ff;
    cursor: pointer;
    overflow: hidden;
  }

  .button-text {
    position: relative;
    z-index: 2;
  }

  .icon {
    position: absolute;
    color: orange;
    opacity: 0;
  }

  .icon-1 { left: 20%; top: 50%; }
  .icon-2 { left: 50%; top: 50%; }
  .icon-3 { left: 70%; top: 50%; }
  .icon-4 { left: 30%; top: 40%; }
  .icon-5 { left: 60%; top: 40%; }
  .icon-6 { left: 40%; top: 60%; }
  .icon-7 { left: 80%; top: 60%; }
  .icon-8 { left: 25%; top: 30%; }
  .icon-9 { left: 55%; top: 30%; }
  .icon-10 { left: 75%; top: 30%; }
  .icon-11 { left: 45%; top: 70%; }

  .celebrate-button:hover .icon {
    animation: ${floatUp} 1.2s ease forwards;
  }

  .celebrate-button:hover .icon-2 {
    animation-delay: 0.2s;
  }

  .celebrate-button:hover .icon-3 {
    animation-delay: 0.4s;s
  }
  .celebrate-button:hover .icon-4 {
    animation-delay: 0.1s;
  }
  .celebrate-button:hover .icon-5 {   

    animation-delay: 0.3s;
  }
  .celebrate-button:hover .icon-6 { 

    animation-delay: 0.5s;
  }
  .celebrate-button:hover .icon-7 {
    animation-delay: 0.7s;
  }
  .celebrate-button:hover .icon-8 {   
    animation-delay: 0.15s;
  }
  .celebrate-button:hover .icon-9 {   
    animation-delay: 0.35s;
  }
  .celebrate-button:hover .icon-10 {   
    animation-delay: 0.55s;
  }
  .celebrate-button:hover .icon-11 {   
    animation-delay: 0.75s;
  }
`;

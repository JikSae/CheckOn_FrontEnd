// src/pages/JapanMap.tsx
import React from "react";

const regions = [
  { name: "홋카이도", x: 100, y: 80 },
  { name: "도호쿠", x: 180, y: 130 },
  { name: "간토", x: 240, y: 150 },
  { name: "주부", x: 300, y: 170 },
  { name: "간사이", x: 360, y: 190 },
  { name: "주고쿠", x: 420, y: 210 },
  { name: "시코쿠", x: 480, y: 230 },
  { name: "규슈", x: 540, y: 250 },
  { name: "오키나와", x: 620, y: 280 },
];

export default function JapanMap() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <svg
        viewBox="0 0 700 360"
        className="w-full max-w-[960px] h-auto"
      >
        {regions.map((region, idx) => (
          <g key={idx}>
            <circle
              cx={region.x}
              cy={region.y}
              r="12"
              fill="#E53E3E"
              className="hover:fill-red-600 cursor-pointer transition duration-200"
            />
            <text
              x={region.x + 16}
              y={region.y + 5}
              fontSize="12"
              fill="#333"
            >
              {region.name}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
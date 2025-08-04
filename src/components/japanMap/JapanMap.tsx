import React, { useState, useRef } from 'react';

interface RegionInfo {
  id: string;
  name: string;
  description: string;
  url: string;
  // SVG path data or any identifier
  d: string;
  fill?: string;
}

const regions: RegionInfo[] = [
  {
    id: 'kyushu',
    name: '규슈',
    description: '규슈 남쪽 섬은 온천이 많고 지형이 거친 것이 특징이며…',
    url: '/regions/kyushu',
    d: 'M10,80 L40,10 L70,80 Z', // 예시 경로, 실제는 정확한 SVG path
    fill: '#f2c2c8',
  },
  {
    id: 'osaka',
    name: '오사카',
    description: '오사카는 음식 문화로 유명하며…',
    url: '/regions/osaka',
    d: 'M100,120 L130,60 L160,120 Z',
  },
  // 필요한 지역들 추가
];

const JapanMap: React.FC = () => {
  const [hovered, setHovered] = useState<RegionInfo | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement | null>(null);

  const onMouseMove = (e: React.MouseEvent, region: RegionInfo) => {
    // 툴팁 위치 조정 (약간 offset 줌)
    const rect = svgRef.current?.getBoundingClientRect();
    setTooltipPos({
      x: e.clientX - (rect?.left || 0) + 10,
      y: e.clientY - (rect?.top || 0) + 10,
    });
    setHovered(region);
  };

  const onMouseLeave = () => {
    setHovered(null);
  };

  const onClickRegion = (region: RegionInfo) => {
    // SPA 내부 라우트면 react-router의 navigate 사용, 아니면 location.href
    window.location.href = region.url;
  };

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        viewBox="0 0 500 300"
        className="w-full h-auto"
        style={{ userSelect: 'none' }}
      >
        {regions.map((r) => (
          <path
            key={r.id}
            d={r.d}
            fill={r.fill || '#c8d8d0'}
            stroke="#888"
            strokeWidth={1}
            className="cursor-pointer transition"
            onMouseMove={(e) => onMouseMove(e, r)}
            onMouseLeave={onMouseLeave}
            onClick={() => onClickRegion(r)}
            style={{
              filter: hovered?.id === r.id ? 'brightness(1.1)' : undefined,
            }}
          />
        ))}
      </svg>

      {hovered && (
        <div
          className="absolute z-10 max-w-xs bg-black text-white p-4 rounded shadow-lg text-sm"
          style={{
            left: tooltipPos.x,
            top: tooltipPos.y,
            transform: 'translate(-5px, 5px)',
            width: 220,
          }}
          onClick={() => onClickRegion(hovered)}
        >
          <div className="font-bold mb-1">{hovered.name}</div>
          <div className="mb-2">{hovered.description}</div>
          <div className="text-xs underline">자세히 보기 →</div>
        </div>
      )}
    </div>
  );
};

export default JapanMap;

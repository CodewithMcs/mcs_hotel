import React from 'react';

interface ChartData {
  [key: string]: string | number;
}

interface ChartProps {
  data: ChartData[];
  type: 'bar' | 'line';
  color: string;
}

const Chart: React.FC<ChartProps> = ({ data, type, color }) => {
  const maxValue = Math.max(...data.map(item => Object.values(item)[1] as number));
  const xKey = Object.keys(data[0])[0];
  const yKey = Object.keys(data[0])[1];

  if (type === 'bar') {
    return (
      <div className="flex items-end space-x-2 h-48">
        {data.map((item, index) => {
          const height = ((item[yKey] as number) / maxValue) * 100;
          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className="w-full rounded-t transition-all duration-500 hover:opacity-80"
                style={{
                  height: `${height}%`,
                  backgroundColor: color,
                  minHeight: '4px'
                }}
              ></div>
              <span className="text-xs text-gray-400 mt-2">{item[xKey]}</span>
            </div>
          );
        })}
      </div>
    );
  }

  // Line chart using SVG
  const width = 400;
  const height = 200;
  const padding = 20;

  const xStep = (width - 2 * padding) / (data.length - 1);
  const points = data.map((item, index) => {
    const x = padding + index * xStep;
    const y = height - padding - ((item[yKey] as number) / maxValue) * (height - 2 * padding);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="h-48">
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
        {data.map((item, index) => {
          const x = padding + index * xStep;
          const y = height - padding - ((item[yKey] as number) / maxValue) * (height - 2 * padding);
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="4"
              fill={color}
              className="hover:r-6 transition-all"
            />
          );
        })}
      </svg>
      <div className="flex justify-between mt-2 px-5">
        {data.map((item, index) => (
          <span key={index} className="text-xs text-gray-400">{item[xKey]}</span>
        ))}
      </div>
    </div>
  );
};

export default Chart;
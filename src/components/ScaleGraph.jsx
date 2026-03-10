"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-3.5 py-2.5 font-mono text-[12px] text-[#e0e0e0]">
      <p className="text-[#8b8b8b] mb-1">screen</p>
      <p className="text-white font-semibold">{payload[0].payload.screen}px</p>
      <p className="text-[#8b8b8b] mt-1.5 mb-1">font-size</p>
      <p className="text-violet-400 font-semibold">{payload[0].value}px</p>
    </div>
  );
};

export default function ScaleGraph({ graphData, minScreen, maxScreen }) {
  return (
    <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-2xl p-7 mb-6">
      <p className="text-[11px] text-[#555] uppercase tracking-widest mb-5 font-mono">
        Scale Visualization
      </p>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart
          data={graphData}
          margin={{ top: 4, right: 4, left: -10, bottom: 4 }}
        >
          <XAxis
            dataKey="screen"
            tick={{ fill: "#444", fontSize: 11, fontFamily: "DM Mono" }}
            tickLine={false}
            axisLine={{ stroke: "#1e1e1e" }}
            tickFormatter={(v) => `${v}px`}
          />
          <YAxis
            tick={{ fill: "#444", fontSize: 11, fontFamily: "DM Mono" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${v}px`}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine x={minScreen} stroke="#2a2a2a" strokeDasharray="4 4" />
          <ReferenceLine x={maxScreen} stroke="#2a2a2a" strokeDasharray="4 4" />
          <Line
            type="monotone"
            dataKey="size"
            stroke="#a78bfa"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: "#a78bfa", strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="flex justify-center gap-6 mt-2">
        <span className="text-[11px] text-[#444] font-mono">
          ← min screen: {minScreen}px
        </span>
        <span className="text-[11px] text-[#444] font-mono">
          max screen: {maxScreen}px →
        </span>
      </div>
    </div>
  );
}

'use client';

import { Gate, Hall, CrowdPerson } from '@/types';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface VenueMapProps {
    gates: Gate[];
    halls: Hall[];
    selectedGate: Gate | null;
    onGateSelect: (gate: Gate) => void;
    crowdPeople: CrowdPerson[];
}

export default function VenueMap({ gates, halls, selectedGate, onGateSelect, crowdPeople }: VenueMapProps) {
    return (
        <div className="card h-[600px] relative overflow-hidden bg-gray-100">
            {/* Live indicator */}
            <div className="absolute top-4 left-4 bg-white rounded-lg shadow-md px-3 py-2 flex items-center gap-2 z-30">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-bold text-gray-800">LIVE SIMULATION</span>
            </div>

            {/* Legend */}
            <div className="absolute top-4 right-4 bg-white rounded-xl shadow-md p-4 z-30 min-w-[160px]">
                <div className="font-bold text-gray-900 mb-3 text-sm">Crowd Density</div>
                <div className="space-y-2.5">
                    <div className="flex items-center gap-2.5">
                        <div className="w-4 h-4 rounded bg-crowd-low"></div>
                        <span className="text-xs text-gray-700 font-medium">Low (&lt;40%)</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <div className="w-4 h-4 rounded bg-crowd-medium"></div>
                        <span className="text-xs text-gray-700 font-medium">Medium (40-60%)</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <div className="w-4 h-4 rounded bg-crowd-high"></div>
                        <span className="text-xs text-gray-700 font-medium">High (60-80%)</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <div className="w-4 h-4 rounded bg-crowd-critical"></div>
                        <span className="text-xs text-gray-700 font-medium">Critical (&gt;80%)</span>
                    </div>
                </div>
            </div>

            {/* Main Venue SVG Map */}
            <div className="absolute inset-0 flex items-center justify-center p-8">
                <svg viewBox="0 0 800 800" className="w-full h-full max-w-[700px] max-h-[700px]">
                    {/* Background */}
                    <rect width="800" height="800" fill="#e5e7eb" />

                    {/* Central corridor vertical */}
                    <rect x="380" y="0" width="40" height="800" fill="#d1d5db" />

                    {/* Central corridor horizontal */}
                    <rect x="0" y="380" width="800" height="40" fill="#d1d5db" />

                    {/* Hall 1 - Top Left */}
                    <HallWithHeatmap hall={halls[0]} x={120} y={120} width={240} height={240} />

                    {/* Hall 2 - Top Right */}
                    <HallWithHeatmap hall={halls[1]} x={440} y={120} width={240} height={240} />

                    {/* Hall 3 - Bottom Left */}
                    <HallWithHeatmap hall={halls[2]} x={120} y={440} width={240} height={240} />

                    {/* Hall 4 - Bottom Right */}
                    <HallWithHeatmap hall={halls[3]} x={440} y={440} width={240} height={240} />

                    {/* Exit 1 - Top */}
                    <ExitGate gate={gates[0]} x={380} y={10} width={40} height={80} label="EXIT 1" />

                    {/* Exit 2 - Right */}
                    <ExitGate gate={gates[1]} x={710} y={380} width={80} height={40} label="EXIT 2" />

                    {/* Exit 3 - Bottom */}
                    <ExitGate gate={gates[2]} x={380} y={710} width={40} height={80} label="EXIT 3" />

                    {/* Exit 4 - Left */}
                    <ExitGate gate={gates[3]} x={10} y={380} width={80} height={40} label="EXIT 4" />

                    {/* Crowd simulation dots */}
                    {crowdPeople.map((person) => (
                        <circle
                            key={person.id}
                            cx={person.x}
                            cy={person.y}
                            r="2"
                            fill="#3b82f6"
                            opacity="0.6"
                        >
                            <animate
                                attributeName="opacity"
                                values="0.4;0.8;0.4"
                                dur="2s"
                                repeatCount="indefinite"
                            />
                        </circle>
                    ))}
                </svg>
            </div>

            {/* Exit labels overlay */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-700 z-20">
                EXIT 1
            </div>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-700 z-20">
                EXIT 3
            </div>
            <div className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-700 -rotate-90 z-20">
                EXIT 4
            </div>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-700 rotate-90 z-20">
                EXIT 2
            </div>
        </div>
    );
}

// Hall with heatmap overlay component
function HallWithHeatmap({ hall, x, y, width, height }: {
    hall: Hall;
    x: number;
    y: number;
    width: number;
    height: number;
}) {
    // Handle undefined hall
    if (!hall) {
        return (
            <g>
                <rect
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    fill="#f5f5f0"
                    stroke="#9ca3af"
                    strokeWidth="2"
                    rx="15"
                />
            </g>
        );
    }

    // Calculate opacity based on density
    const opacity = Math.min(0.7, hall.density_percent / 100);

    return (
        <g>
            {/* Hall background */}
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                fill="#f5f5f0"
                stroke="#9ca3af"
                strokeWidth="2"
                rx="15"
            />

            {/* Heatmap overlay */}
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                fill={hall.heatmap_color}
                opacity={opacity}
                rx="15"
            >
                <animate
                    attributeName="opacity"
                    values={`${opacity};${opacity + 0.1};${opacity}`}
                    dur="3s"
                    repeatCount="indefinite"
                />
            </rect>

            {/* Hall label */}
            <text
                x={x + width / 2}
                y={y + height / 2 - 15}
                textAnchor="middle"
                className="fill-gray-600 font-bold text-4xl"
                style={{ userSelect: 'none' }}
            >
                {hall.name.replace('Hall ', 'HALL ')}
            </text>

            {/* Crowd count */}
            <text
                x={x + width / 2}
                y={y + height / 2 + 15}
                textAnchor="middle"
                className="fill-gray-700 text-sm font-semibold"
                style={{ userSelect: 'none' }}
            >
                {hall.current_count} / {hall.capacity}
            </text>

            {/* Density percentage */}
            <text
                x={x + width / 2}
                y={y + height / 2 + 35}
                textAnchor="middle"
                className="fill-gray-600 text-xs font-medium"
                style={{ userSelect: 'none' }}
            >
                ({hall.density_percent}% capacity)
            </text>

            {/* Stampede warning icon for high risk */}
            {hall.stampede_risk === 'high' || hall.stampede_risk === 'critical' ? (
                <g>
                    <circle
                        cx={x + width - 30}
                        cy={y + 30}
                        r="18"
                        fill="#ef4444"
                        opacity="0.9"
                    >
                        <animate
                            attributeName="r"
                            values="18;22;18"
                            dur="1.5s"
                            repeatCount="indefinite"
                        />
                    </circle>
                    <text
                        x={x + width - 30}
                        y={y + 37}
                        textAnchor="middle"
                        className="fill-white text-xl font-bold"
                    >
                        ⚠
                    </text>
                </g>
            ) : null}
        </g>
    );
}

// Exit gate component
function ExitGate({ gate, x, y, width, height, label }: {
    gate: Gate;
    x: number;
    y: number;
    width: number;
    height: number;
    label: string;
}) {
    // Handle undefined gate
    if (!gate) {
        return null;
    }

    const isHorizontal = width > height;

    return (
        <g>
            {/* Exit background */}
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                fill={gate.crowd_color}
                stroke="#374151"
                strokeWidth="2"
                rx="5"
                opacity="0.8"
            >
                <animate
                    attributeName="opacity"
                    values="0.7;0.9;0.7"
                    dur="2s"
                    repeatCount="indefinite"
                />
            </rect>

            {/* Stripes pattern for exit */}
            {Array.from({ length: 5 }).map((_, i) => (
                <rect
                    key={i}
                    x={isHorizontal ? x + i * 16 : x}
                    y={isHorizontal ? y : y + i * 16}
                    width={isHorizontal ? 8 : width}
                    height={isHorizontal ? height : 8}
                    fill="white"
                    opacity="0.4"
                />
            ))}

            {/* Wait time label */}
            <text
                x={x + width / 2}
                y={y + height / 2 + 4}
                textAnchor="middle"
                className="fill-white text-xs font-bold"
                style={{ userSelect: 'none' }}
            >
                {gate.metrics.wait_time_formatted}
            </text>
        </g>
    );
}

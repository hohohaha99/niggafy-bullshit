'use client';

import { Gate } from '@/types';
import { Users, Clock, TrendingUp, TrendingDown, Minus, Accessibility } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface GateStatusPanelProps {
    gates: Gate[];
    selectedGate: Gate | null;
    onGateSelect: (gate: Gate) => void;
}

export default function GateStatusPanel({ gates, selectedGate, onGateSelect }: GateStatusPanelProps) {
    return (
        <div className="card h-[500px] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4 sticky top-0 bg-white pb-2">
                Gate Status
            </h2>

            <div className="space-y-3">
                {gates.map((gate) => (
                    <GateCard
                        key={gate.id}
                        gate={gate}
                        isSelected={selectedGate?.id === gate.id}
                        onClick={() => onGateSelect(gate)}
                    />
                ))}
            </div>
        </div>
    );
}

function GateCard({ gate, isSelected, onClick }: {
    gate: Gate;
    isSelected: boolean;
    onClick: () => void;
}) {
    const trendIcons = {
        increasing: <TrendingUp className="w-4 h-4 text-red-500" />,
        stable: <Minus className="w-4 h-4 text-gray-500" />,
        decreasing: <TrendingDown className="w-4 h-4 text-green-500" />,
    };

    // Prepare sparkline data
    const sparklineData = (gate.trend?.sparkline || []).map((value, index) => ({
        value,
        index,
    }));

    return (
        <button
            onClick={onClick}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-300 hover:shadow-md ${isSelected
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{gate.name}</h3>
                        {gate.has_accessibility && (
                            <Accessibility className="w-4 h-4 text-blue-600" />
                        )}
                    </div>
                    <div className={`crowd-badge crowd-badge-${gate.crowd_level} inline-flex`}>
                        {gate.crowd_level.toUpperCase()}
                    </div>
                </div>
                {trendIcons[gate.trend.direction]}
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                <div className="flex items-center gap-1.5 text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{gate.metrics.people_count} people</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{gate.metrics.wait_time_formatted}</span>
                </div>
            </div>

            {/* Sparkline */}
            <div className="h-12 -mx-2">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sparklineData}>
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke={gate.crowd_color}
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Prediction */}
            <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-500">
                <div className="flex justify-between">
                    <span>In 5 min:</span>
                    <span className="font-medium text-gray-700">
                        {gate.prediction['5_min_ahead'].count} people
                        <span className="text-gray-500 ml-1">
                            ({Math.round(gate.prediction['5_min_ahead'].confidence * 100)}%)
                        </span>
                    </span>
                </div>
            </div>
        </button>
    );
}

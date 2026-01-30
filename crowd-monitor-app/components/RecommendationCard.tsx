'use client';

import { Gate } from '@/types';
import { ArrowRight, Clock, MapPin, TrendingDown, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface RecommendationCardProps {
    gate: Gate;
    gates: Gate[];
    userLocation: { lat: number; lon: number };
}

export default function RecommendationCard({ gate, gates, userLocation }: RecommendationCardProps) {
    // Calculate time saved vs worst gate
    const worstGate = gates.reduce((worst, current) =>
        current.metrics.wait_time_seconds > worst.metrics.wait_time_seconds ? current : worst
    );

    const timeSaved = worstGate.metrics.wait_time_seconds - gate.metrics.wait_time_seconds;
    const distance = 85; // Mock distance in meters
    const walkingTime = Math.round(distance / 1.4); // Assuming 1.4 m/s walking speed

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-xl"
        >
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
            </div>

            <div className="relative p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Zap className="w-5 h-5" />
                            <span className="text-sm font-semibold uppercase tracking-wide">Smart Recommendation</span>
                        </div>
                        <h2 className="text-2xl font-bold">Use {gate.name}</h2>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-semibold">
                        Fastest Route
                    </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <MetricBox
                        icon={<Clock className="w-5 h-5" />}
                        label="Wait Time"
                        value={gate.metrics.wait_time_formatted}
                        highlight={true}
                    />
                    <MetricBox
                        icon={<MapPin className="w-5 h-5" />}
                        label="Distance"
                        value={`${distance}m away`}
                    />
                    <MetricBox
                        icon={<TrendingDown className="w-5 h-5" />}
                        label="Time Saved"
                        value={`${Math.round(timeSaved / 60)} min`}
                        highlight={timeSaved > 0}
                    />
                    <MetricBox
                        icon={<ArrowRight className="w-5 h-5" />}
                        label="Total Time"
                        value={`${Math.round((gate.metrics.wait_time_seconds + walkingTime) / 60)} min`}
                    />
                </div>

                {/* Why this gate section */}
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-4">
                    <h3 className="font-semibold mb-2 text-sm">Why this gate?</h3>
                    <ul className="space-y-1.5 text-sm opacity-90">
                        <li className="flex items-center gap-2">
                            <CheckIcon />
                            <span>Lowest wait time ({gate.metrics.wait_time_formatted})</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckIcon />
                            <span>Close to your location ({distance}m walk)</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckIcon />
                            <span>{gate.trend.direction === 'decreasing' ? 'Crowd decreasing' : 'Stable crowd levels'}</span>
                        </li>
                        {gate.has_accessibility && (
                            <li className="flex items-center gap-2">
                                <CheckIcon />
                                <span>Accessibility features available</span>
                            </li>
                        )}
                    </ul>
                </div>

                {/* CTA Button */}
                <button className="w-full bg-white text-blue-700 font-semibold py-3 px-6 rounded-lg hover:bg-blue-50 transition-colors duration-300 flex items-center justify-center gap-2 group">
                    <span>Navigate to {gate.name}</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Comparison text */}
                {timeSaved > 0 && (
                    <p className="mt-3 text-center text-sm opacity-90">
                        ⚡ Save <strong>{Math.round(timeSaved / 60)}+ minutes</strong> compared to {worstGate.name}
                    </p>
                )}
            </div>
        </motion.div>
    );
}

function MetricBox({ icon, label, value, highlight }: {
    icon: React.ReactNode;
    label: string;
    value: string;
    highlight?: boolean;
}) {
    return (
        <div className={`${highlight ? 'bg-white/20' : 'bg-white/10'} backdrop-blur-sm rounded-lg p-3`}>
            <div className="flex items-center gap-2 mb-1 opacity-80">
                {icon}
                <span className="text-xs font-medium">{label}</span>
            </div>
            <div className={`text-lg font-bold ${highlight ? 'text-yellow-300' : ''}`}>
                {value}
            </div>
        </div>
    );
}

function CheckIcon() {
    return (
        <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
    );
}

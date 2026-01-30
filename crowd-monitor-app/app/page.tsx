'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import VenueMap from '@/components/VenueMap';
import GateStatusPanel from '@/components/GateStatusPanel';
import AlertBanner from '@/components/AlertBanner';
import { Gate, Hall, CrowdPerson, Alert } from '@/types';
import { simulateCrowdData, simulateHallData, initializeCrowdSimulation, updateCrowdPositions, generateRoutingAlert } from '@/lib/mockData';
import { AlertTriangle, Users, Clock, DoorOpen } from 'lucide-react';

export default function Home() {
    const [gates, setGates] = useState<Gate[]>([]);
    const [halls, setHalls] = useState<Hall[]>([]);
    const [selectedGate, setSelectedGate] = useState<Gate | null>(null);
    const [crowdPeople, setCrowdPeople] = useState<CrowdPerson[]>([]);
    const [currentAlert, setCurrentAlert] = useState<Alert | null>(null);

    // Initialize crowd simulation
    useEffect(() => {
        setGates(simulateCrowdData());
        setHalls(simulateHallData());
        setCrowdPeople(initializeCrowdSimulation());
    }, []);

    // Update gate and hall data every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            const newGates = simulateCrowdData();
            const newHalls = simulateHallData();
            setGates(newGates);
            setHalls(newHalls);

            // Generate routing alert
            const alert = generateRoutingAlert(newGates, newHalls);
            if (alert) {
                setCurrentAlert(alert);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    // Animate crowd movement
    useEffect(() => {
        const interval = setInterval(() => {
            setCrowdPeople(prev => updateCrowdPositions(prev));
        }, 50); // 20 FPS

        return () => clearInterval(interval);
    }, []);

    // Get overall venue stats
    const totalCrowd = gates.reduce((sum, g) => sum + g.metrics.people_count, 0);
    const highRiskHalls = halls.filter(h => h.stampede_risk === 'high' || h.stampede_risk === 'critical');
    const avgWaitTime = Math.round(gates.reduce((sum, g) => sum + g.metrics.wait_time_seconds, 0) / gates.length / 60);
    const bestGate = gates.length > 0 ? gates.reduce((best, current) =>
        current.metrics.wait_time_seconds < best.metrics.wait_time_seconds ? current : best
    ) : null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            <Header />

            <main className="container mx-auto px-4 py-6">
                {/* Header Section */}
                <div className="mb-6 animate-fade-in">
                    <div className="flex items-center justify-between mb-2">
                        <h1 className="text-4xl font-bold text-gray-900">
                            Stampede Prevention & Crowd Management System
                        </h1>
                        {highRiskHalls.length > 0 && (
                            <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg flex items-center gap-2 animate-pulse">
                                <AlertTriangle className="w-5 h-5" />
                                <span className="font-semibold">{highRiskHalls.length} High Risk Area{highRiskHalls.length > 1 ? 's' : ''}</span>
                            </div>
                        )}
                    </div>
                    <p className="text-gray-600 text-lg">
                        Real-time crowd monitoring • AI-powered stampede prediction • Dynamic exit routing
                    </p>
                </div>

                {/* Alert Banner */}
                {currentAlert && (
                    <div className="mb-6">
                        <AlertBanner
                            alert={currentAlert}
                            onDismiss={() => setCurrentAlert(null)}
                        />
                    </div>
                )}

                {/* Main Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Map & Stats */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Venue Map with Simulation */}
                        <VenueMap
                            gates={gates}
                            halls={halls}
                            selectedGate={selectedGate}
                            onGateSelect={setSelectedGate}
                            crowdPeople={crowdPeople}
                        />

                        {/* Hall Statistics Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {halls.map((hall) => (
                                <HallStatCard key={hall.id} hall={hall} />
                            ))}
                        </div>
                    </div>

                    {/* Right Column - Gate Status */}
                    <div className="lg:col-span-1">
                        <GateStatusPanel
                            gates={gates}
                            selectedGate={selectedGate}
                            onGateSelect={setSelectedGate}
                        />
                    </div>
                </div>

                {/* Bottom Statistics Section */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <StatCard
                        title="Total Crowd"
                        value={totalCrowd}
                        icon={<Users className="w-6 h-6" />}
                        color="blue"
                    />
                    <StatCard
                        title="Avg Wait Time"
                        value={`${avgWaitTime} min`}
                        icon={<Clock className="w-6 h-6" />}
                        color="amber"
                    />
                    <StatCard
                        title="Best Exit"
                        value={bestGate ? `Exit ${bestGate.gate_number}` : 'N/A'}
                        icon={<DoorOpen className="w-6 h-6" />}
                        color="green"
                    />
                    <StatCard
                        title="Risk Level"
                        value={highRiskHalls.length > 0 ? 'HIGH' : 'LOW'}
                        icon={<AlertTriangle className="w-6 h-6" />}
                        color={highRiskHalls.length > 0 ? 'red' : 'green'}
                    />
                </div>
            </main>
        </div>
    );
}

// Hall Stat Card Component
function HallStatCard({ hall }: { hall: Hall }) {
    return (
        <div
            className="card hover:shadow-xl transition-all duration-300 relative overflow-hidden"
            style={{ borderLeft: `4px solid ${hall.heatmap_color}` }}
        >
            <div className="font-semibold text-gray-900 mb-2">{hall.name}</div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
                {hall.current_count}
                <span className="text-sm text-gray-500 font-normal ml-1">/ {hall.capacity}</span>
            </div>
            <div className="text-sm text-gray-600 mb-2">{hall.density_percent}% capacity</div>
            <div className={`crowd-badge crowd-badge-${hall.crowd_level} text-xs`}>
                {hall.crowd_level.toUpperCase()}
            </div>
            {hall.stampede_risk === 'high' || hall.stampede_risk === 'critical' ? (
                <div className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full animate-pulse">
                    <AlertTriangle className="w-4 h-4" />
                </div>
            ) : null}
        </div>
    );
}

// Stat Card Component
function StatCard({ title, value, icon, color }: {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: 'blue' | 'green' | 'amber' | 'red';
}) {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        amber: 'bg-amber-50 text-amber-600',
        red: 'bg-red-50 text-red-600',
    };

    return (
        <div className="card hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
                    {icon}
                </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
    );
}

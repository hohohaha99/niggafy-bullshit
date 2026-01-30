'use client';

import { Alert } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, Navigation, Info } from 'lucide-react';

interface AlertBannerProps {
    alert: Alert | null;
    onDismiss: () => void;
}

export default function AlertBanner({ alert, onDismiss }: AlertBannerProps) {
    if (!alert || !alert.active) return null;

    const getAlertConfig = () => {
        switch (alert.severity) {
            case 'critical':
                return {
                    bg: 'bg-gradient-to-r from-red-600 to-red-700',
                    icon: <AlertTriangle className="w-6 h-6" />,
                    textColor: 'text-white',
                };
            case 'high':
                return {
                    bg: 'bg-gradient-to-r from-orange-500 to-orange-600',
                    icon: <AlertTriangle className="w-6 h-6" />,
                    textColor: 'text-white',
                };
            case 'medium':
                return {
                    bg: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
                    icon: <Navigation className="w-6 h-6" />,
                    textColor: 'text-white',
                };
            default:
                return {
                    bg: 'bg-gradient-to-r from-blue-500 to-blue-600',
                    icon: <Info className="w-6 h-6" />,
                    textColor: 'text-white',
                };
        }
    };

    const config = getAlertConfig();

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className={`${config.bg} ${config.textColor} shadow-2xl rounded-xl p-4 relative overflow-hidden`}
            >
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse"></div>
                </div>

                <div className="relative flex items-start gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-0.5">
                        {config.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <div className="font-bold text-lg mb-1">
                                    {alert.type === 'stampede' ? '⚠️ STAMPEDE RISK ALERT' : '🚨 CROWD ROUTING ALERT'}
                                </div>
                                <p className="text-sm opacity-95">
                                    {alert.message}
                                </p>

                                {/* Suggested action */}
                                {alert.suggestedExit && (
                                    <div className="mt-3 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 inline-block">
                                        <div className="text-xs font-semibold mb-1">RECOMMENDED ACTION:</div>
                                        <div className="text-sm font-bold flex items-center gap-2">
                                            <Navigation className="w-4 h-4" />
                                            <span>Use Exit {alert.suggestedExit} for fastest evacuation</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Close button */}
                            <button
                                onClick={onDismiss}
                                className="flex-shrink-0 p-1 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Pulse animation for critical alerts */}
                {alert.severity === 'critical' && (
                    <motion.div
                        className="absolute inset-0 border-4 border-white rounded-xl"
                        animate={{ opacity: [0, 0.5, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                    />
                )}
            </motion.div>
        </AnimatePresence>
    );
}

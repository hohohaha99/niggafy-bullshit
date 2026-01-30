// Extended types for crowd management system

export interface Gate {
    id: string;
    gate_number: number;
    name: string;
    location: {
        lat: number;
        lon: number;
    };
    status: 'active' | 'closed' | 'maintenance';
    crowd_level: 'low' | 'medium' | 'high' | 'critical';
    crowd_color: string;
    metrics: {
        people_count: number;
        density: number;
        density_level: string;
        wait_time_seconds: number;
        wait_time_formatted: string;
        queue_length_meters: number;
    };
    trend: {
        direction: 'increasing' | 'stable' | 'decreasing';
        change_percent: number;
        sparkline: number[];
    };
    prediction: {
        '5_min_ahead': {
            count: number;
            confidence: number;
        };
        '10_min_ahead': {
            count: number;
            confidence: number;
        };
    };
    has_accessibility: boolean;
    efficiency_percent: number;
}

export interface Hall {
    id: string;
    number: number;
    name: string;
    capacity: number;
    current_count: number;
    density_percent: number;
    crowd_level: 'low' | 'medium' | 'high' | 'critical';
    heatmap_color: string;
    stampede_risk: 'low' | 'medium' | 'high' | 'critical';
}

export interface CrowdPerson {
    id: string;
    x: number;
    y: number;
    vx: number;
    vy: number;
    hall: number;
    targetExit: number;
    speed: number;
    status: 'in_hall' | 'merging' | 'in_lane' | 'at_exit';
    targetX?: number;
    targetY?: number;
}

export interface Alert {
    id: string;
    type: 'routing' | 'stampede' | 'warning' | 'info';
    severity: 'low' | 'medium' | 'high' | 'critical';
    message: string;
    suggestedExit: number;
    timestamp: number;
    active: boolean;
}

export interface VenueStats {
    total_crowd: number;
    capacity: number;
    utilization_percent: number;
    active_gates: number;
}

export interface Notification {
    id: string;
    type: 'redirect' | 'alert' | 'info';
    priority: 'low' | 'medium' | 'high' | 'critical';
    title: string;
    message: string;
    created_at: string;
    read: boolean;
    action_required: boolean;
}

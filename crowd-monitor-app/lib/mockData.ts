import { Gate, Hall, CrowdPerson, Alert } from '@/types';

// Simulate realistic crowd data for the 4 gates
export function simulateCrowdData(): Gate[] {
    const baseTime = Date.now();

    // Create realistic variations in crowd levels
    const variation1 = Math.sin(baseTime / 10000) * 20 + Math.random() * 10;
    const variation2 = Math.cos(baseTime / 8000) * 30 + Math.random() * 15;
    const variation3 = Math.sin(baseTime / 12000) * 25 + Math.random() * 12;
    const variation4 = Math.cos(baseTime / 15000) * 18 + Math.random() * 8;

    const gates: Gate[] = [
        createGate(1, '40.7495,-73.9685', 45 + Math.round(variation1)),
        createGate(2, '40.7485,-73.9675', 230 + Math.round(variation2)),
        createGate(3, '40.7483,-73.9695', 125 + Math.round(variation3)),
        createGate(4, '40.7493,-73.9665', 112 + Math.round(variation4)),
    ];

    return gates;
}

// Simulate hall data
export function simulateHallData(): Hall[] {
    const baseTime = Date.now();

    const halls: Hall[] = [
        createHall(1, Math.round(180 + Math.sin(baseTime / 5000) * 50)),
        createHall(2, Math.round(320 + Math.cos(baseTime / 6000) * 80)),
        createHall(3, Math.round(150 + Math.sin(baseTime / 7000) * 40)),
        createHall(4, Math.round(280 + Math.cos(baseTime / 8000) * 60)),
    ];

    return halls;
}

function createHall(hallNumber: number, count: number): Hall {
    const capacity = 400;
    const densityPercent = (count / capacity) * 100;

    let crowdLevel: 'low' | 'medium' | 'high' | 'critical';
    let heatmapColor: string;
    let stampede_risk: 'low' | 'medium' | 'high' | 'critical';

    if (densityPercent < 40) {
        crowdLevel = 'low';
        heatmapColor = '#10b981';
        stampede_risk = 'low';
    } else if (densityPercent < 60) {
        crowdLevel = 'medium';
        heatmapColor = '#f59e0b';
        stampede_risk = 'low';
    } else if (densityPercent < 80) {
        crowdLevel = 'high';
        heatmapColor = '#f97316';
        stampede_risk = 'medium';
    } else {
        crowdLevel = 'critical';
        heatmapColor = '#ef4444';
        stampede_risk = 'high';
    }

    return {
        id: `hall-${hallNumber}`,
        number: hallNumber,
        name: `Hall ${hallNumber}`,
        capacity,
        current_count: count,
        density_percent: parseFloat(densityPercent.toFixed(1)),
        crowd_level: crowdLevel,
        heatmap_color: heatmapColor,
        stampede_risk,
    };
}

// Initialize crowd simulation with people
export function initializeCrowdSimulation(hallCount: number = 4): CrowdPerson[] {
    const people: CrowdPerson[] = [];
    const totalPeople = 800;

    for (let i = 0; i < totalPeople; i++) {
        const hall = Math.floor(Math.random() * hallCount) + 1;
        const targetExit = Math.floor(Math.random() * 4) + 1;

        // Initial placement logic
        let x, y;
        if (hall === 1) { // Top Left
            x = 120 + Math.random() * 240;
            y = 120 + Math.random() * 240;
        } else if (hall === 2) { // Top Right
            x = 440 + Math.random() * 240;
            y = 120 + Math.random() * 240;
        } else if (hall === 3) { // Bottom Left
            x = 120 + Math.random() * 240;
            y = 440 + Math.random() * 240;
        } else { // Bottom Right
            x = 440 + Math.random() * 240;
            y = 440 + Math.random() * 240;
        }

        people.push({
            id: `person-${i}`,
            x,
            y,
            vx: 0,
            vy: 0,
            hall,
            targetExit,
            speed: 0.5 + Math.random() * 0.5,
            status: 'in_hall',
        });
    }

    return people;
}

// Update crowd positions for animation with structured movement
export function updateCrowdPositions(people: CrowdPerson[]): CrowdPerson[] {
    return people.map(person => {
        let { x, y, status, targetExit, hall, speed } = person;
        let vx = 0;
        let vy = 0;

        // Structured Movement Logic
        if (status === 'in_hall') {
            // Move towards the central corridor "gate" of the hall
            // Hall 1 (TL) -> Target: (380, 240) or (240, 380) depending on exit?
            // Simplified: All halls empty into the central cross intersection area
            let targetX = 400;
            let targetY = 400;

            if (hall === 1) { targetX = 370; targetY = 370; }
            else if (hall === 2) { targetX = 430; targetY = 370; }
            else if (hall === 3) { targetX = 370; targetY = 430; }
            else if (hall === 4) { targetX = 430; targetY = 430; }

            // Move towards target
            const dx = targetX - x;
            const dy = targetY - y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 10) {
                status = 'merging';
            } else {
                vx = (dx / dist) * speed;
                vy = (dy / dist) * speed;
            }
        }
        else if (status === 'merging') {
            // Move to center of corridor lanes
            const targetX = 400;
            const targetY = 400;
            const dx = targetX - x;
            const dy = targetY - y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 5) {
                status = 'in_lane';
            } else {
                vx = (dx / dist) * speed;
                vy = (dy / dist) * speed;
            }
        }
        else if (status === 'in_lane') {
            // Move along the main axes towards target exit
            // Exit 1 (Top): x=380..420, y -> 0
            // Exit 2 (Right): y=380..420, x -> 800
            // Exit 3 (Bottom): x=380..420, y -> 800
            // Exit 4 (Left): y=380..420, x -> 0

            if (targetExit === 1) { // Top
                if (Math.abs(x - 400) > 15) { // Center X first
                    vx = (400 - x) * 0.1;
                } else {
                    vy = -speed * 1.5; // Move Up
                }
                if (y < 50) status = 'at_exit';
            }
            else if (targetExit === 2) { // Right
                if (Math.abs(y - 400) > 15) { // Center Y first
                    vy = (400 - y) * 0.1;
                } else {
                    vx = speed * 1.5; // Move Right
                }
                if (x > 750) status = 'at_exit';
            }
            else if (targetExit === 3) { // Bottom
                if (Math.abs(x - 400) > 15) {
                    vx = (400 - x) * 0.1;
                } else {
                    vy = speed * 1.5; // Move Down
                }
                if (y > 750) status = 'at_exit';
            }
            else if (targetExit === 4) { // Left
                if (Math.abs(y - 400) > 15) {
                    vy = (400 - y) * 0.1;
                } else {
                    vx = -speed * 1.5; // Move Left
                }
                if (x < 50) status = 'at_exit';
            }
        }
        else if (status === 'at_exit') {
            // Congregate and move slowly near exit
            // Add some jitter to look like a crowd
            vx = (Math.random() - 0.5) * 0.5;
            vy = (Math.random() - 0.5) * 0.5;

            // Keep within exit zone
            if (targetExit === 1) { // Top
                if (y > 60) vy -= 0.2;
                if (y < 10) vy += 0.2;
                if (x < 360) vx += 0.2;
                if (x > 440) vx -= 0.2;
            }
            else if (targetExit === 2) { // Right
                if (x < 740) vx += 0.2;
                if (x > 790) vx -= 0.2;
                if (y < 360) vy += 0.2;
                if (y > 440) vy -= 0.2;
            }
            else if (targetExit === 3) { // Bottom
                if (y < 740) vy += 0.2;
                if (y > 790) vy -= 0.2;
                if (x < 360) vx += 0.2;
                if (x > 440) vx -= 0.2;
            }
            else if (targetExit === 4) { // Left
                if (x > 60) vx -= 0.2;
                if (x < 10) vx += 0.2;
                if (y < 360) vy += 0.2;
                if (y > 440) vy -= 0.2;
            }

            // Occasionally reset to hall to keep simulation flowing
            if (Math.random() < 0.005) {
                status = 'in_hall';
                hall = Math.floor(Math.random() * 4) + 1;
                person.targetExit = Math.floor(Math.random() * 4) + 1; // Pick new target
                // Reset pos
                if (hall === 1) { x = 200; y = 200; }
                else if (hall === 2) { x = 600; y = 200; }
                else if (hall === 3) { x = 200; y = 600; }
                else { x = 600; y = 600; }
            }
        }

        // Apply movement
        let newX = x + vx;
        let newY = y + vy;

        // Hard boundaries for map
        newX = Math.max(0, Math.min(800, newX));
        newY = Math.max(0, Math.min(800, newY));

        return {
            ...person,
            x: newX,
            y: newY,
            vx,
            vy,
            status,
            hall
        };
    });
}

// Generate dynamic routing alerts
export function generateRoutingAlert(gates: Gate[], halls: Hall[]): Alert | null {
    const bestGate = gates.reduce((best, current) =>
        current.metrics.wait_time_seconds < best.metrics.wait_time_seconds ? current : best
    );

    const worstGate = gates.reduce((worst, current) =>
        current.metrics.wait_time_seconds > worst.metrics.wait_time_seconds ? current : worst
    );

    // Check for high-risk halls
    const highRiskHalls = halls.filter(h => h.stampede_risk === 'high' || h.stampede_risk === 'critical');

    if (highRiskHalls.length > 0) {
        return {
            id: `alert-${Date.now()}`,
            type: 'stampede',
            severity: 'critical',
            message: `⚠️ High stampede risk in ${highRiskHalls.map(h => h.name).join(', ')}! Avoid these areas.`,
            suggestedExit: bestGate.gate_number,
            timestamp: Date.now(),
            active: true,
        };
    }

    if (worstGate.crowd_level === 'critical' && bestGate.crowd_level === 'low') {
        return {
            id: `alert-${Date.now()}`,
            type: 'routing',
            severity: 'high',
            message: `🚨 Exit ${worstGate.gate_number} is overcrowded! Use Exit ${bestGate.gate_number} instead (${bestGate.metrics.wait_time_formatted} wait).`,
            suggestedExit: bestGate.gate_number,
            timestamp: Date.now(),
            active: true,
        };
    }

    if (worstGate.crowd_level === 'high' && bestGate.crowd_level === 'low') {
        return {
            id: `alert-${Date.now()}`,
            type: 'routing',
            severity: 'medium',
            message: `💡 Exit ${bestGate.gate_number} has the shortest wait time (${bestGate.metrics.wait_time_formatted}).`,
            suggestedExit: bestGate.gate_number,
            timestamp: Date.now(),
            active: true,
        };
    }

    return null;
}

function createGate(gateNumber: number, coordinates: string, count: number): Gate {
    const [lat, lon] = coordinates.split(',').map(Number);

    // Determine crowd level
    let crowdLevel: 'low' | 'medium' | 'high' | 'critical';
    let crowdColor: string;

    if (count < 80) {
        crowdLevel = 'low';
        crowdColor = '#10b981';
    } else if (count < 150) {
        crowdLevel = 'medium';
        crowdColor = '#f59e0b';
    } else if (count < 220) {
        crowdLevel = 'high';
        crowdColor = '#f97316';
    } else {
        crowdLevel = 'critical';
        crowdColor = '#ef4444';
    }

    // Calculate metrics
    const density = count / 200;
    const waitTime = Math.max(30, count * 2);
    const queueLength = count * 0.08;

    // Generate trend
    const sparkline = generateSparkline(count);
    const trend = determineTrend(sparkline);

    // Gate names
    const gateNames = ['North Exit (Exit 1)', 'East Exit (Exit 2)', 'South Exit (Exit 3)', 'West Exit (Exit 4)'];

    return {
        id: `gate-${gateNumber}`,
        gate_number: gateNumber,
        name: gateNames[gateNumber - 1],
        location: { lat, lon },
        status: 'active',
        crowd_level: crowdLevel,
        crowd_color: crowdColor,
        metrics: {
            people_count: count,
            density: parseFloat(density.toFixed(2)),
            density_level: crowdLevel,
            wait_time_seconds: waitTime,
            wait_time_formatted: formatWaitTime(waitTime),
            queue_length_meters: parseFloat(queueLength.toFixed(1)),
        },
        trend: {
            ...trend,
            sparkline
        },
        prediction: {
            '5_min_ahead': {
                count: Math.round(count * (1 + (Math.random() - 0.4) * 0.2)),
                confidence: 0.85 + Math.random() * 0.1,
            },
            '10_min_ahead': {
                count: Math.round(count * (1 + (Math.random() - 0.4) * 0.3)),
                confidence: 0.75 + Math.random() * 0.1,
            },
        },
        has_accessibility: gateNumber === 1 || gateNumber === 3,
        efficiency_percent: Math.round(70 + Math.random() * 25),
    };
}

function generateSparkline(currentCount: number): number[] {
    const points = 10;
    const sparkline: number[] = [];
    let value = currentCount - 20;

    for (let i = 0; i < points; i++) {
        value += (Math.random() - 0.5) * 10;
        value = Math.max(20, Math.min(300, value));
        sparkline.push(Math.round(value));
    }

    sparkline[sparkline.length - 1] = currentCount;
    return sparkline;
}

function determineTrend(sparkline: number[]): {
    direction: 'increasing' | 'stable' | 'decreasing';
    change_percent: number;
} {
    const first = sparkline[0];
    const last = sparkline[sparkline.length - 1];
    const change = ((last - first) / first) * 100;

    let direction: 'increasing' | 'stable' | 'decreasing';
    if (change > 10) {
        direction = 'increasing';
    } else if (change < -10) {
        direction = 'decreasing';
    } else {
        direction = 'stable';
    }

    return {
        direction,
        change_percent: parseFloat(Math.abs(change).toFixed(1)),
    };
}

function formatWaitTime(seconds: number): string {
    const minutes = Math.round(seconds / 60);
    if (minutes === 0) return '<1 minute';
    if (minutes === 1) return '1 minute';
    return `${minutes} minutes`;
}

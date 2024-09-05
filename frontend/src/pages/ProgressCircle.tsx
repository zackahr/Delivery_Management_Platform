import React from 'react';
import './ProgressCircle.css';

interface ProgressCircleProps {
    percentage: number;
    label: string;
}

const ProgressCircle: React.FC<ProgressCircleProps> = ({ percentage, label }) => {
    const getColor = () => {
        if (percentage === 0) return '#d3d3d3'; // Gray for 0%
        if (percentage > 0 && percentage <= 10) return '#ff0000'; // Red for 1-10%
        if (percentage > 10 && percentage <= 20) return '#ff4500'; // Orange for 11-20%
        if (percentage > 20 && percentage <= 30) return '#ff8c00'; // Dark orange for 21-30%
        if (percentage > 30 && percentage <= 40) return '#ffd700'; // Gold for 31-40%
        if (percentage > 40 && percentage <= 50) return '#9acd32'; // Yellowgreen for 41-50%
        if (percentage > 50 && percentage <= 60) return '#32cd32'; // Limegreen for 51-60%
        if (percentage > 60 && percentage <= 70) return '#00fa9a'; // Medium spring green for 61-70%
        if (percentage > 70 && percentage <= 80) return '#00ff7f'; // Spring green for 71-80%
        if (percentage > 80 && percentage <= 90) return '#3cb371'; // Medium sea green for 81-90%
        return '#4caf50'; // Green for 91-100%
    };

    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="progress-circle">
            <svg width="120" height="120">
                <circle
                    className="progress-background"
                    cx="60"
                    cy="60"
                    r={radius}
                    strokeWidth="10"
                />
                <circle
                    className="progress-bar"
                    cx="60"
                    cy="60"
                    r={radius}
                    strokeWidth="10"
                    stroke={getColor()}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                />
                <text
                    x="50%"
                    y="50%"
                    dominantBaseline="middle"
                    textAnchor="middle"
                    className="progress-label"
                >
                    {percentage}%
                </text>
                <text
                    x="50%"
                    y="65%"
                    dominantBaseline="middle"
                    textAnchor="middle"
                    className="progress-sub-label"
                >
                    {label}
                </text>
            </svg>
        </div>
    );
};

export default ProgressCircle;

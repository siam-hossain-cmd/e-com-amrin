'use client';

export default function StatsCard({ icon, iconColor, value, label, trend, trendUp }) {
    return (
        <div className="stat-card fade-in">
            <div className="stat-card-header">
                <div className={`stat-card-icon ${iconColor}`}>
                    {icon}
                </div>
                {trend && (
                    <div className={`stat-card-trend ${trendUp ? 'up' : 'down'}`}>
                        {trendUp ? '↑' : '↓'} {trend}
                    </div>
                )}
            </div>
            <div className="stat-card-value">{value}</div>
            <div className="stat-card-label">{label}</div>
        </div>
    );
}

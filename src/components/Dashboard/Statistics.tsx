import React from 'react';
import { useApp } from '../../context/AppContext';
import NeumorphCard from '../UI/NeumorphCard';
import { Target, CheckCircle2, Clock, TrendingUp } from 'lucide-react';

interface StatisticsProps {
    userName?: string;
}

const Statistics: React.FC<StatisticsProps> = ({ userName }) => {
    const { getUserStats, currentUser } = useApp();

    const stats = userName ? getUserStats(userName) : getUserStats(currentUser || '');

    const statCards = [
        {
            icon: Target,
            label: 'Toplam Görev',
            value: stats.totalTasks,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50'
        },
        {
            icon: CheckCircle2,
            label: 'Tamamlanan',
            value: stats.completedTasks,
            color: 'text-green-600',
            bgColor: 'bg-green-50'
        },
        {
            icon: Clock,
            label: 'Devam Eden',
            value: stats.pendingTasks,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50'
        },
        {
            icon: TrendingUp,
            label: 'Başarı Oranı',
            value: `${stats.completionRate}%`,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50'
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {statCards.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <NeumorphCard key={index} className="hover:shadow-neumorph-sm transition-shadow">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm text-gray-500 font-medium mb-1">{stat.label}</p>
                                <p className="text-3xl font-bold text-text">{stat.value}</p>
                            </div>
                            <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                                <Icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                        </div>

                        {/* Progress bar for completion rate */}
                        {stat.label === 'Başarı Oranı' && (
                            <div className="mt-4 bg-gray-200 rounded-full h-2 overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-500"
                                    style={{ width: `${stats.completionRate}%` }}
                                ></div>
                            </div>
                        )}
                    </NeumorphCard>
                );
            })}
        </div>
    );
};

export default Statistics;

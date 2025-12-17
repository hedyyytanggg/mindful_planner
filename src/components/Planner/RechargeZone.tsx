'use client';

import { Card, Button, Input } from '@/components/Common';
import { useState } from 'react';

const RECHARGE_ACTIVITIES = [
    { emoji: '🚶', id: 'Take a Walk', description: 'Get fresh air and move' },
    { emoji: '🧘', id: 'Meditate', description: '5-10 min meditation' },
    { emoji: '🍎', id: 'Snack Break', description: 'Enjoy a beverage or snack' },
    { emoji: '🎵', id: 'Listen to Music', description: 'Your favorite songs' },
    { emoji: '📞', id: 'Talk to a Friend', description: 'Connect with someone' },
    { emoji: '🎮', id: 'Entertain', description: 'A quick game or hobby' },
    { emoji: '🛌', id: 'Rest', description: 'Take a short break' },
    { emoji: '🪟', id: 'Look Outside', description: 'Notice nature' },
];

interface RechargeZoneRecord {
    id: string;
    activityId: string | null;
    customActivity: string | null;
    completed: boolean;
    createdAt?: string;
    updatedAt?: string;
}

interface RechargeZoneProps {
    items: RechargeZoneRecord[] | null;
    onAdd: (activity: { activityId?: string; customActivity?: string; completed: boolean }) => void;
    onUpdate: (id: string, updates: Partial<RechargeZoneRecord>) => void;
    onDelete?: (id: string) => void;
    disabled?: boolean;
}

export function RechargeZone({ items = [], onAdd, onUpdate, onDelete, disabled = false }: RechargeZoneProps) {
    const [showCustomInput, setShowCustomInput] = useState(false);
    const [customActivity, setCustomActivity] = useState('');

    const handleActivityClick = (activityId: string) => {
        if (disabled) return;
        const existing = items?.find(item => item.activityId === activityId);
        if (existing) {
            onUpdate(existing.id, { completed: !existing.completed });
        } else {
            onAdd({ activityId, completed: true });
        }
    };

    const handleAddCustom = () => {
        if (disabled) return;
        if (customActivity.trim()) {
            onAdd({ customActivity: customActivity.trim(), completed: true });
            setCustomActivity('');
            setShowCustomInput(false);
        }
    };

    const itemsArray = Array.isArray(items) ? items : [];
    const completedActivityIds = new Set(
        itemsArray.filter(item => item.completed && item.activityId).map(item => item.activityId)
    );

    return (
        <Card padding="lg" elevation="md">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">🌟 Recharge Zone</h2>
                <p className="text-sm text-gray-600">Click activities you've done to mark them as completed</p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
                {RECHARGE_ACTIVITIES.map((activity) => {
                    const isCompleted = completedActivityIds.has(activity.id);

                    return (
                        <button
                            key={activity.id}
                            onClick={() => handleActivityClick(activity.id)}
                            disabled={disabled}
                            className={`p-3 text-left rounded-lg transition-all duration-200 ${isCompleted
                                ? 'bg-green-100 ring-2 ring-green-400'
                                : 'bg-blue-50 hover:bg-blue-100'
                                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <div className="text-2xl mb-1">{activity.emoji}</div>
                            <p className={`text-sm font-medium ${isCompleted ? 'text-green-700' : 'text-gray-900'}`}>
                                {activity.id}
                            </p>
                            <p className={`text-xs ${isCompleted ? 'text-green-600' : 'text-gray-600'}`}>
                                {activity.description}
                            </p>
                        </button>
                    );
                })}
            </div>

            {/* Custom Activities */}
            {itemsArray
                .filter(item => item.customActivity)
                .map(item => (
                    <div
                        key={item.id}
                        className={`p-3 mb-2 rounded-lg flex items-center justify-between ${item.completed ? 'bg-green-100' : 'bg-gray-100'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={item.completed}
                                onChange={() => !disabled && onUpdate(item.id, { completed: !item.completed })}
                                disabled={disabled}
                                className="w-4 h-4"
                            />
                            <span className="text-sm">{item.customActivity}</span>
                        </div>
                        {onDelete && !disabled && (
                            <button onClick={() => onDelete(item.id)} className="text-xs text-red-500 hover:text-red-700">
                                ✕
                            </button>
                        )}
                    </div>
                ))}
        </Card>
    );
}

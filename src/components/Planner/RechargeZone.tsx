'use client';

import { Card, Button, Input } from '@/components/Common';
import { useState } from 'react';

const RECHARGE_ACTIVITIES = [
    { emoji: '🚶', id: 'Take a Walk', description: 'Get fresh air and move' },
    { emoji: '🧘', id: 'Meditate', description: '5-10 min meditation' },
    { emoji: '☕', id: 'Coffee Break', description: 'Enjoy a beverage' },
    { emoji: '🎵', id: 'Listen to Music', description: 'Your favorite songs' },
    { emoji: '📞', id: 'Call a Friend', description: 'Connect with someone' },
    { emoji: '🎮', id: 'Play', description: 'A quick game or hobby' },
    { emoji: '🍎', id: 'Snack', description: 'Eat something healthy' },
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
}

export function RechargeZone({ items = [], onAdd, onUpdate, onDelete }: RechargeZoneProps) {
    const [showCustomInput, setShowCustomInput] = useState(false);
    const [customActivity, setCustomActivity] = useState('');

    const handleActivityClick = (activityId: string) => {
        const existing = items?.find(item => item.activityId === activityId);
        if (existing) {
            // Toggle completion
            onUpdate(existing.id, { completed: !existing.completed });
        } else {
            // Add new activity
            onAdd({ activityId, completed: true });
        }
    };

    const handleAddCustom = () => {
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
                            aria-label={`Mark ${activity.id} as ${isCompleted ? 'incomplete' : 'complete'}`}
                            aria-pressed={isCompleted}
                            className={`p-3 text-left rounded-lg transition-all duration-200 transform focus:outline-none focus:ring-2 focus:ring-blue-500 ${isCompleted
                                    ? 'bg-green-100 ring-2 ring-green-400 scale-105'
                                    : 'bg-blue-50 hover:bg-blue-100 active:scale-95'
                                }`}
                        >
                            <div
                                className={`text-2xl mb-1 transition-transform ${isCompleted ? 'scale-110' : ''}`}
                                aria-hidden="true"
                            >
                                {activity.emoji}
                            </div>
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
                        className={`p-3 mb-2 rounded-lg flex items-center justify-between ${item.completed
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={item.completed}
                                onChange={() => onUpdate(item.id, { completed: !item.completed })}
                                className="w-4 h-4"
                            />
                            <span className="text-sm">{item.customActivity}</span>
                        </div>
                        {onDelete && (
                            <button
                                onClick={() => onDelete(item.id)}
                                className="text-xs text-red-500 hover:text-red-700"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                ))}

            {/* Add Custom Activity */}
            {showCustomInput ? (
                <div className="flex gap-2">
                    <Input
                        type="text"
                        placeholder="Custom recharge activity..."
                        value={customActivity}
                        onChange={(e) => setCustomActivity(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAddCustom();
                            if (e.key === 'Escape') {
                                setShowCustomInput(false);
                                setCustomActivity('');
                            }
                        }}
                        autoFocus
                    />
                    <Button onClick={handleAddCustom} variant="primary" size="sm">
                        Add
                    </Button>
                </div>
            ) : (
                <button
                    onClick={() => setShowCustomInput(true)}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                    + Add Custom Activity
                </button>
            )}
        </Card>
    );
}

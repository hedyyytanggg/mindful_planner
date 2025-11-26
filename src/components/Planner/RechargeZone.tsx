'use client';

import { Card } from '@/components/Common';

const RECHARGE_ACTIVITIES = [
    { emoji: '🚶', name: 'Take a Walk', description: 'Get fresh air and move' },
    { emoji: '🧘', name: 'Meditate', description: '5-10 min meditation' },
    { emoji: '☕', name: 'Coffee Break', description: 'Enjoy a beverage' },
    { emoji: '🎵', name: 'Listen to Music', description: 'Your favorite songs' },
    { emoji: '📞', name: 'Call a Friend', description: 'Connect with someone' },
    { emoji: '🎮', name: 'Play', description: 'A quick game or hobby' },
    { emoji: '🍎', name: 'Snack', description: 'Eat something healthy' },
    { emoji: '🪟', name: 'Look Outside', description: 'Notice nature' },
];

interface RechargeItem {
    id: string;
    activities: string[];
    completed: boolean[];
}

interface RechargeZoneProps {
    item: RechargeItem | null;
    onAdd: (item: { activities: string[]; completed: boolean[] }) => void;
    onUpdate: (id: string, item: Partial<RechargeItem>) => void;
}

export function RechargeZone({ item, onAdd, onUpdate }: RechargeZoneProps) {
    const handleActivityClick = (activity: string) => {
        if (item) {
            // If activity already exists, toggle its completion status
            const existingIndex = item.activities.indexOf(activity);
            if (existingIndex !== -1) {
                const newCompleted = [...item.completed];
                newCompleted[existingIndex] = !newCompleted[existingIndex];
                onUpdate(item.id, { completed: newCompleted });
            } else {
                // Add new activity
                const newActivities = [...item.activities, activity];
                const newCompleted = [...item.completed, true]; // Auto-mark as done
                onUpdate(item.id, { activities: newActivities, completed: newCompleted });
            }
        } else {
            // Create new recharge item with this activity
            onAdd({ activities: [activity], completed: [true] }); // Auto-mark as done
        }
    };

    return (
        <Card padding="lg" elevation="md">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">🌟 Recharge Zone</h2>
                <p className="text-sm text-gray-600">Click activities you've done to mark them as completed</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {RECHARGE_ACTIVITIES.map((activity) => {
                    const activityIndex = item?.activities.indexOf(activity.name) ?? -1;
                    const isCompleted = activityIndex !== -1 && item?.completed[activityIndex];

                    return (
                        <button
                            key={activity.name}
                            onClick={() => handleActivityClick(activity.name)}
                            aria-label={`Mark ${activity.name} as ${isCompleted ? 'incomplete' : 'complete'}`}
                            aria-pressed={isCompleted}
                            className={`p-3 text-left rounded-lg transition-all duration-200 transform focus:outline-none focus:ring-2 focus:ring-blue-500 ${isCompleted
                                ? 'bg-green-100 ring-2 ring-green-400 scale-105'
                                : 'bg-blue-50 hover:bg-blue-100 active:scale-95'
                                }`}
                        >
                            <div className={`text-2xl mb-1 transition-transform ${isCompleted ? 'scale-110' : ''}`} aria-hidden="true">
                                {activity.emoji}
                            </div>
                            <p className={`text-sm font-medium ${isCompleted ? 'text-green-700' : 'text-gray-900'}`}>
                                {activity.name}
                            </p>
                            <p className={`text-xs ${isCompleted ? 'text-green-600' : 'text-gray-600'}`}>
                                {activity.description}
                            </p>
                        </button>
                    );
                })}
            </div>
        </Card>
    );
}

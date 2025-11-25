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
    activity: string;
    completed: boolean;
}

interface RechargeZoneProps {
    item: RechargeItem | null;
    onAdd: (item: { activity: string; completed: boolean }) => void;
    onUpdate: (id: string, item: Partial<RechargeItem>) => void;
}

export function RechargeZone({ item, onAdd, onUpdate }: RechargeZoneProps) {
    const handleSelect = (activity: string) => {
        if (!item) {
            onAdd({ activity, completed: false });
        }
    };

    return (
        <Card padding="lg" elevation="md">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">🌟 Recharge Zone</h2>
                <p className="text-sm text-gray-600">Pick an activity for mental rest</p>
            </div>

            {item ? (
                <div className="p-4 bg-green-50 rounded-lg text-center">
                    <p className="text-3xl mb-2">✓</p>
                    <p className="font-semibold text-gray-900">{item.activity}</p>
                    {!item.completed && (
                        <button
                            onClick={() => onUpdate(item.id, { completed: true })}
                            className="mt-3 text-green-600 hover:text-green-700 text-sm font-medium"
                        >
                            Mark as done
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-3">
                    {RECHARGE_ACTIVITIES.map((activity) => (
                        <button
                            key={activity.name}
                            onClick={() => handleSelect(activity.name)}
                            className="p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                            <div className="text-xl mb-1">{activity.emoji}</div>
                            <p className="text-sm font-medium text-gray-900">{activity.name}</p>
                            <p className="text-xs text-gray-600">{activity.description}</p>
                        </button>
                    ))}
                </div>
            )}
        </Card>
    );
}

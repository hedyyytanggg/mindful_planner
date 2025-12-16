'use client';

import { useState, ChangeEvent } from 'react';
import { Card, Input, Button } from '@/components/Common';

interface MakeItHappenItem {
    id: string;
    task: string;
    completed: boolean;
}

interface MakeItHappenProps {
    item: MakeItHappenItem | null;
    onAdd: (item: { task: string; completed: boolean }) => void;
    onUpdate: (id: string, item: Partial<MakeItHappenItem>) => void;
    onDelete: (id: string) => void;
    disabled?: boolean;
}

export function MakeItHappen({ item, onAdd, onUpdate, onDelete, disabled = false }: MakeItHappenProps) {
    const [newTask, setNewTask] = useState('');

    const handleAdd = () => {
        if (newTask.trim()) {
            onAdd({ task: newTask, completed: false });
            setNewTask('');
        }
    };

    return (
        <Card padding="lg" elevation="md">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">💪 Make It Happen</h2>
                <p className="text-sm text-gray-600">Spend 5 to 15 minutes on the one task you've been avoiding</p>
            </div>

            {item ? (
                <div className="p-4 bg-red-50 rounded-lg">
                    <div className="flex items-center gap-4">
                        <input
                            type="checkbox"
                            checked={item.completed}
                            onChange={(e) => onUpdate(item.id, { completed: e.target.checked })}
                            disabled={disabled}
                            className="w-5 h-5 text-red-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        <div className="flex-1">
                            <p className={`font-semibold ${item.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                                {item.task}
                            </p>
                            {item.completed && <p className="text-green-600 text-sm mt-1">✓ You did it!</p>}
                        </div>
                        {!disabled && (
                            <button
                                onClick={() => onDelete(item.id)}
                                className="text-red-500 hover:text-red-700"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>
            ) : disabled ? (
                <div className="p-4 bg-gray-100 rounded-lg text-center text-gray-500">
                    No task set for this date
                </div>
            ) : (
                <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                    <Input
                        placeholder="What have you been putting off?..."
                        value={newTask}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setNewTask(e.target.value)}
                        fullWidth
                    />
                    <Button onClick={handleAdd} fullWidth variant="primary">
                        Add Task
                    </Button>
                </div>
            )}
        </Card>
    );
}

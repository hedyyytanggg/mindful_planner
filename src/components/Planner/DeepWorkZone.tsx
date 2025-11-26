'use client';

import { useState, ChangeEvent } from 'react';
import { Card, Input, Button, Textarea } from '@/components/Common';

interface DeepWorkItem {
    id: string;
    title: string;
    timeEstimate?: number;
    notes?: string;
    completed: boolean;
}

interface DeepWorkZoneProps {
    items: DeepWorkItem[];
    onAdd: (item: { title: string; timeEstimate?: number; notes?: string; completed: boolean }) => void;
    onUpdate: (id: string, item: Partial<DeepWorkItem>) => void;
    onDelete: (id: string) => void;
}

export function DeepWorkZone({ items, onAdd, onUpdate, onDelete }: DeepWorkZoneProps) {
    const [newTitle, setNewTitle] = useState('');
    const [newTime, setNewTime] = useState('');
    const [newNotes, setNewNotes] = useState('');

    const handleAdd = () => {
        if (newTitle.trim()) {
            onAdd({
                title: newTitle,
                timeEstimate: newTime ? parseInt(newTime) : undefined,
                notes: newNotes || undefined,
                completed: false,
            });
            setNewTitle('');
            setNewTime('');
            setNewNotes('');
        }
    };

    return (
        <Card padding="lg" elevation="md">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">🎯 Deep Work Zone</h2>
                <p className="text-sm text-gray-600">1-2 high concentration tasks</p>
            </div>

            <div className="space-y-4 mb-6">
                {items.map((item) => (
                    <div key={item.id} className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
                        <input
                            type="checkbox"
                            checked={item.completed}
                            onChange={(e) => onUpdate(item.id, { completed: e.target.checked })}
                            aria-label={`Mark task "${item.title}" as ${item.completed ? 'incomplete' : 'complete'}`}
                            className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        />
                        <div className="flex-1 min-w-0">
                            <h3 className={`font-semibold ${item.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                                {item.title}
                            </h3>
                            {item.timeEstimate && (
                                <p className="text-xs text-gray-500 mt-1">⏱️ {item.timeEstimate} min</p>
                            )}
                            {item.notes && (
                                <p className="text-xs text-gray-600 mt-2">{item.notes}</p>
                            )}
                        </div>
                        <button
                            onClick={() => onDelete(item.id)}
                            aria-label={`Delete task "${item.title}"`}
                            className="text-red-600 hover:text-red-700 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-red-500 rounded px-2 py-1"
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>

            {items.length < 2 && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                    <Input
                        label="Task Title"
                        placeholder="Enter deep work task..."
                        value={newTitle}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setNewTitle(e.target.value)}
                        fullWidth
                    />
                    <Input
                        label="Time Estimate (minutes)"
                        type="number"
                        placeholder="e.g., 90"
                        value={newTime}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setNewTime(e.target.value)}
                        fullWidth
                    />
                    <Textarea
                        label="Notes (optional)"
                        placeholder="Add context or reminders..."
                        value={newNotes}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNewNotes(e.target.value)}
                        rows={2}
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

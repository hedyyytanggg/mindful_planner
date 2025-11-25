'use client';

import { useState, ChangeEvent } from 'react';
import { Card, Input, Button } from '@/components/Common';

interface QuickWinItem {
    id: string;
    title: string;
    completed: boolean;
}

interface QuickWinsProps {
    items: QuickWinItem[];
    onAdd: (item: { title: string; completed: boolean }) => void;
    onUpdate: (id: string, item: Partial<QuickWinItem>) => void;
    onDelete: (id: string) => void;
}

export function QuickWins({ items, onAdd, onUpdate, onDelete }: QuickWinsProps) {
    const [newTitle, setNewTitle] = useState('');

    const handleAdd = () => {
        if (newTitle.trim()) {
            onAdd({ title: newTitle, completed: false });
            setNewTitle('');
        }
    };

    const completed = items.filter(item => item.completed).length;

    return (
        <Card padding="lg" elevation="md">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">⚡ Quick Wins</h2>
                <p className="text-sm text-gray-600">Small achievable tasks ({completed}/{items.length})</p>
            </div>

            <div className="space-y-2 mb-6">
                {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-yellow-50 rounded">
                        <input
                            type="checkbox"
                            checked={item.completed}
                            onChange={(e) => onUpdate(item.id, { completed: e.target.checked })}
                            className="w-5 h-5 text-yellow-600 rounded"
                        />
                        <span className={`flex-1 ${item.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                            {item.title}
                        </span>
                        <button
                            onClick={() => onDelete(item.id)}
                            className="text-red-500 hover:text-red-700 text-sm"
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>

            {items.length < 5 && (
                <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                    <Input
                        placeholder="Add a quick win (email, call, etc.)..."
                        value={newTitle}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setNewTitle(e.target.value)}
                        fullWidth
                    />
                    <Button onClick={handleAdd} fullWidth variant="primary" size="sm">
                        Add
                    </Button>
                </div>
            )}
        </Card>
    );
}

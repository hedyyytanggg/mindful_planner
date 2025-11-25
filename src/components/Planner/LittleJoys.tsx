'use client';

import { useState, ChangeEvent } from 'react';
import { Card, Textarea, Button } from '@/components/Common';

interface LittleJoysProps {
    joys: string[];
    onAdd: (joy: string) => void;
    onDelete: (index: number) => void;
}

export function LittleJoys({ joys, onAdd, onDelete }: LittleJoysProps) {
    const [newJoy, setNewJoy] = useState('');

    const handleAdd = () => {
        if (newJoy.trim()) {
            onAdd(newJoy);
            setNewJoy('');
        }
    };

    return (
        <Card padding="lg" elevation="md">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">✨ Little Joys</h2>
                <p className="text-sm text-gray-600">Capture 1-3 positive moments ({joys.length})</p>
            </div>

            <div className="space-y-3 mb-6">
                {joys.map((joy, index) => (
                    <div key={index} className="p-4 bg-purple-50 rounded-lg">
                        <div className="flex justify-between items-start gap-3">
                            <p className="text-gray-800 text-sm">{joy}</p>
                            <button
                                onClick={() => onDelete(index)}
                                className="text-red-500 hover:text-red-700 font-bold"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {joys.length < 3 && (
                <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                    <Textarea
                        placeholder="What made you smile today? What are you grateful for?"
                        value={newJoy}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNewJoy(e.target.value)}
                        rows={3}
                        fullWidth
                        charLimit={200}
                    />
                    <Button onClick={handleAdd} fullWidth variant="primary" size="sm">
                        Add Joy
                    </Button>
                </div>
            )}
        </Card>
    );
}

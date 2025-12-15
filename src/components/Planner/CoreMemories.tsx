import React, { useState, ChangeEvent } from 'react';
import { Card, Textarea, Button, Input } from '@/components/Common';

interface CoreMemory {
    id: string;
    title: string;
    description: string;
    memoryDate: string;
}

interface CoreMemoriesProps {
    memories: CoreMemory[];
    currentDate: string;
    onAdd: (memory: Omit<CoreMemory, 'id'>) => void;
    onDelete: (id: string) => void;
}

export function CoreMemories({ memories, currentDate, onAdd, onDelete }: CoreMemoriesProps) {
    const [newTitle, setNewTitle] = useState('');
    const [newDescription, setNewDescription] = useState('');

    const handleAdd = () => {
        if (newTitle.trim() && newDescription.trim()) {
            onAdd({
                title: newTitle.trim(),
                description: newDescription.trim(),
                memoryDate: currentDate,
            });
            setNewTitle('');
            setNewDescription('');
        }
    };

    const sortedMemories = [...memories].sort((a, b) => {
        const dateA = new Date(a.memoryDate).getTime();
        const dateB = new Date(b.memoryDate).getTime();
        return dateB - dateA; // Newest first
    });

    return (
        <Card padding="lg" elevation="md">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">💎 Core Memories</h2>
                <p className="text-sm text-gray-600">Capture your cherished moments ({memories.length})</p>
            </div>

            {/* Memories List */}
            <div className="space-y-3 mb-6">
                {sortedMemories.map((memory) => (
                    <div key={memory.id} className="p-4 bg-blue-50 rounded-lg">
                        <div className="flex justify-between items-start gap-3">
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 mb-1">{memory.title}</h4>
                                <p className="text-gray-700 text-sm">{memory.description}</p>
                            </div>
                            <button
                                onClick={() => onDelete(memory.id)}
                                className="text-red-500 hover:text-red-700 font-bold flex-shrink-0 text-lg"
                                aria-label="Delete memory"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Memory Form */}
            <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                <Input
                    type="text"
                    placeholder="Memory title"
                    value={newTitle}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setNewTitle(e.target.value)}
                    fullWidth
                />

                <Textarea
                    placeholder="Tell the story of this memory..."
                    value={newDescription}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNewDescription(e.target.value)}
                    rows={3}
                    fullWidth
                    charLimit={500}
                />

                <Button onClick={handleAdd} fullWidth variant="primary" size="sm">
                    Add Memory
                </Button>
            </div>
        </Card>
    );
}

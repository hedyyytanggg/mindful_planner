'use client';

import { useState, ChangeEvent, useEffect } from 'react';
import { Card, Textarea, Button } from '@/components/Common';

interface ReflectionProps {
    content: string | null;
    onSave: (content: string | null) => void;
    disabled?: boolean;
}

export function ReflectionToday({ content, onSave, disabled = false }: ReflectionProps) {
    const [isEditing, setIsEditing] = useState(!content);
    const [text, setText] = useState(content || '');

    // Sync internal state when content prop changes
    useEffect(() => {
        setText(content || '');
        setIsEditing(!content);
    }, [content]);

    const handleSave = () => {
        onSave(text.trim() || null);
        setIsEditing(false);
    };

    return (
        <Card padding="lg" elevation="md">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">🤔 Reflection for Today</h2>
                <p className="text-sm text-gray-600">What did you learn? What went well?</p>
            </div>

            {disabled ? (
                content ? (
                    <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="text-gray-800 whitespace-pre-wrap">{content}</p>
                    </div>
                ) : (
                    <div className="p-4 bg-gray-100 rounded-lg text-center text-gray-500">
                        No reflection for this date
                    </div>
                )
            ) : isEditing ? (
                <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                    <Textarea
                        placeholder="Reflect on your day... What worked well? What did you learn?"
                        value={text}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)}
                        rows={4}
                        fullWidth
                        charLimit={500}
                    />
                    <div className="flex gap-2">
                        <Button onClick={handleSave} variant="primary" fullWidth>
                            Save Reflection
                        </Button>
                        {content && (
                            <Button
                                onClick={() => {
                                    setIsEditing(false);
                                    setText(content);
                                }}
                                variant="secondary"
                            >
                                Cancel
                            </Button>
                        )}
                    </div>
                </div>
            ) : (
                <div className="p-4 bg-indigo-50 rounded-lg">
                    <p className="text-gray-800 mb-4">{content}</p>
                    {!disabled && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                            Edit
                        </button>
                    )}
                </div>
            )}
        </Card>
    );
}

'use client';

import { useState, ChangeEvent, useEffect } from 'react';
import { Card, Textarea, Button } from '@/components/Common';

interface FocusTomorrowProps {
    content: string | null;
    onSave: (content: string | null) => void;
    disabled?: boolean;
}

export function FocusTomorrow({ content, onSave, disabled = false }: FocusTomorrowProps) {
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
                <h2 className="text-xl font-bold text-gray-900 mb-2">🎯 Focus for Tomorrow</h2>
                <p className="text-sm text-gray-600">1-3 priorities to focus on</p>
            </div>

            {disabled ? (
                content ? (
                    <div className="p-4 bg-purple-50 rounded-lg">
                        <p className="text-gray-800 whitespace-pre-wrap">{content}</p>
                    </div>
                ) : (
                    <div className="p-4 bg-gray-100 rounded-lg text-center text-gray-500">
                        No focus set for this date
                    </div>
                )
            ) : isEditing ? (
                <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                    <Textarea
                        placeholder="What will be your top 1-3 priorities tomorrow?"
                        value={text}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)}
                        rows={4}
                        fullWidth
                        charLimit={300}
                    />
                    <div className="flex gap-2">
                        <Button onClick={handleSave} variant="primary" fullWidth>
                            Set Focus
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
                <div className="p-4 bg-orange-50 rounded-lg">
                    <p className="text-gray-800 mb-4 whitespace-pre-wrap">{content}</p>
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

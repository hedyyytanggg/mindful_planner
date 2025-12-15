import React, { useState } from 'react';

interface CoreMemory {
    id: string;
    title: string;
    description: string;
    memoryDate: string;
    tags: string[];
    createdAt?: string;
}

interface MemoriesTimelineProps {
    memories: CoreMemory[];
    onDelete: (id: string) => void;
}

export function MemoriesTimeline({ memories, onDelete }: MemoriesTimelineProps) {
    const [filterTag, setFilterTag] = useState<string | null>(null);

    // Group memories by year
    const memoryGroups = memories.reduce(
        (acc, memory) => {
            const year = new Date(memory.memoryDate).getFullYear();
            if (!acc[year]) {
                acc[year] = [];
            }
            acc[year].push(memory);
            return acc;
        },
        {} as Record<number, CoreMemory[]>
    );

    // Get all unique tags
    const allTags = Array.from(
        new Set(memories.flatMap((m) => m.tags))
    );

    // Filter memories
    const filteredMemories = filterTag
        ? memories.filter((m) => m.tags.includes(filterTag))
        : memories;

    const filteredGroups = Object.entries(memoryGroups).reduce(
        (acc, [year, mems]) => {
            const filtered = mems.filter((m) => !filterTag || m.tags.includes(filterTag));
            if (filtered.length > 0) {
                acc[Number(year)] = filtered;
            }
            return acc;
        },
        {} as Record<number, CoreMemory[]>
    );

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">📅 Memory Timeline</h2>

            {/* Tag Filter */}
            {allTags.length > 0 && (
                <div className="mb-6">
                    <p className="text-sm text-gray-600 mb-2">Filter by tag:</p>
                    <div className="flex gap-2 flex-wrap">
                        <button
                            onClick={() => setFilterTag(null)}
                            className={`px-3 py-1 rounded-full text-sm ${filterTag === null
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            All
                        </button>
                        {allTags.map((tag) => (
                            <button
                                key={tag}
                                onClick={() => setFilterTag(tag)}
                                className={`px-3 py-1 rounded-full text-sm ${filterTag === tag
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Timeline */}
            {Object.keys(filteredGroups).length > 0 ? (
                <div className="space-y-8">
                    {Object.entries(filteredGroups)
                        .sort(([yearA], [yearB]) => Number(yearB) - Number(yearA))
                        .map(([year, yearMemories]) => (
                            <div key={year}>
                                <h3 className="text-xl font-bold text-gray-700 mb-4 flex items-center">
                                    <span className="inline-block w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm mr-3">
                                        {year}
                                    </span>
                                    {year}
                                </h3>

                                <div className="space-y-4 pl-8 border-l-2 border-blue-200">
                                    {yearMemories
                                        .sort(
                                            (a, b) =>
                                                new Date(b.memoryDate).getTime() -
                                                new Date(a.memoryDate).getTime()
                                        )
                                        .map((memory) => (
                                            <div key={memory.id} className="relative pb-4">
                                                <div className="absolute -left-10 top-0 w-4 h-4 bg-blue-600 rounded-full border-4 border-white"></div>

                                                <div className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div>
                                                            <h4 className="font-semibold text-gray-800">{memory.title}</h4>
                                                            <p className="text-sm text-gray-500">
                                                                {new Date(memory.memoryDate).toLocaleDateString('en-US', {
                                                                    month: 'long',
                                                                    day: 'numeric',
                                                                    year: 'numeric',
                                                                })}
                                                            </p>
                                                        </div>
                                                        <button
                                                            onClick={() => onDelete(memory.id)}
                                                            className="text-red-600 hover:text-red-800 text-sm ml-2"
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>

                                                    <p className="text-gray-700 text-sm mb-3">{memory.description}</p>

                                                    {memory.tags.length > 0 && (
                                                        <div className="flex gap-1 flex-wrap">
                                                            {memory.tags.map((tag) => (
                                                                <span
                                                                    key={tag}
                                                                    className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                                                                >
                                                                    {tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        ))}
                </div>
            ) : (
                <div className="text-center py-8">
                    <p className="text-gray-500">
                        {filterTag ? `No memories with tag "${filterTag}" yet.` : 'No memories to display.'}
                    </p>
                </div>
            )}
        </div>
    );
}

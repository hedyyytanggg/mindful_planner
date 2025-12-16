import React, { useState, ChangeEvent } from 'react';
import { Card, Button, Textarea } from '@/components/Common';

interface Project {
    id: string;
    name: string;
    description: string | null;
    isActive: boolean;
}

interface ProjectUpdate {
    id: string;
    projectId: string;
    projectName?: string;
    content: string;
    updateDate: string;
}

interface ProjectUpdatesProps {
    projects: Project[];
    updates: ProjectUpdate[];
    currentDate: string;
    onAddProject: (name: string, description: string) => void;
    onAddUpdate: (projectId: string, content: string) => void;
    onDeleteUpdate: (id: string) => void;
    disabled?: boolean;
}

export function ProjectUpdates({
    projects,
    updates,
    currentDate,
    onAddProject,
    onAddUpdate,
    onDeleteUpdate,
    disabled = false,
}: ProjectUpdatesProps) {
    const [showProjectForm, setShowProjectForm] = useState(false);
    const [newProjectName, setNewProjectName] = useState('');
    const [newProjectDesc, setNewProjectDesc] = useState('');
    const [selectedProjectId, setSelectedProjectId] = useState('');
    const [updateContent, setUpdateContent] = useState('');

    const handleAddProject = () => {
        if (newProjectName.trim()) {
            onAddProject(newProjectName.trim(), newProjectDesc.trim());
            setNewProjectName('');
            setNewProjectDesc('');
            setShowProjectForm(false);
        }
    };

    const handleAddUpdate = () => {
        if (selectedProjectId && updateContent.trim()) {
            onAddUpdate(selectedProjectId, updateContent.trim());
            setUpdateContent('');
            setSelectedProjectId('');
        }
    };

    return (
        <Card padding="lg" elevation="md">
            <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">📚 Activity Log</h2>
                        <p className="text-sm text-gray-600">Track projects, hobbies, and events ({updates.length} today)</p>
                    </div>
                    {!disabled && (
                        <button
                            onClick={() => setShowProjectForm(!showProjectForm)}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                            {showProjectForm ? 'Cancel' : '+ New Activity'}
                        </button>
                    )}
                </div>
            </div>

            {/* New Project Form */}
            {showProjectForm && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-gray-900 mb-3">Create New Activity</h3>
                    <div className="space-y-3">
                        <input
                            type="text"
                            placeholder="Activity name (e.g., Learn Guitar, Build Garden Shed)"
                            value={newProjectName}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setNewProjectName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="text"
                            placeholder="Description (optional)"
                            value={newProjectDesc}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setNewProjectDesc(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <Button onClick={handleAddProject} variant="primary" size="sm" fullWidth>
                            Create Activity
                        </Button>
                    </div>
                </div>
            )}

            {/* Updates List */}
            <div className="space-y-3 mb-6">
                {updates.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-4">No activity updates yet for today</p>
                ) : (
                    updates.map((update) => (
                        <div key={update.id} className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                            <div className="flex justify-between items-start gap-3">
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-purple-900 mb-1">
                                        {update.projectName || 'Project'}
                                    </h4>
                                    <p className="text-gray-700 text-sm whitespace-pre-wrap">{update.content}</p>
                                </div>
                                {!disabled && (
                                    <button
                                        onClick={() => onDeleteUpdate(update.id)}
                                        className="text-red-500 hover:text-red-700 font-bold flex-shrink-0 text-lg"
                                        aria-label="Delete update"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Add Update Form */}
            {!disabled && (
                <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-900">Log Update</h3>
                    {projects.length === 0 ? (
                        <p className="text-sm text-gray-600">Create an activity first to start logging updates</p>
                    ) : (
                        <>
                            <select
                                value={selectedProjectId}
                                onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedProjectId(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="">Select an activity...</option>
                                {projects.map((project) => (
                                    <option key={project.id} value={project.id}>
                                        {project.name}
                                    </option>
                                ))}
                            </select>

                            <Textarea
                                placeholder="What did you work on? (e.g., Practiced chords for 30 mins, Installed deck posts)"
                                value={updateContent}
                                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setUpdateContent(e.target.value)}
                                rows={3}
                                fullWidth
                                charLimit={500}
                            />

                            <Button
                                onClick={handleAddUpdate}
                                fullWidth
                                variant="primary"
                                size="sm"
                                disabled={!selectedProjectId || !updateContent.trim()}
                            >
                                Log Update
                            </Button>
                        </>
                    )}
                </div>
            )}
        </Card>
    );
}

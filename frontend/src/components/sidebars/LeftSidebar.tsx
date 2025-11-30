'use client';

import { X, TextAaIcon, HashStraightIcon, CalendarDotsIcon, CheckCircleIcon, RadioButtonIcon } from '@phosphor-icons/react';
import { useFormBuilderStore } from '@/store/formBuilderStore';

export const LeftSidebar = () => {
    const toggleLeftSidebar = useFormBuilderStore((state) => state.toggleLeftSidebar);
    const addNode = useFormBuilderStore((state) => state.addNode);

    const onDragStart = (event: React.DragEvent, nodeType: string, questionType?: string) => {
        const data = questionType ? `${nodeType}:${questionType}` : nodeType;
        event.dataTransfer.setData('application/reactflow', data);
        event.dataTransfer.effectAllowed = 'move';
    };

    const handleAddNode = (nodeType: string, questionType?: string) => {
        addNode(nodeType as any, undefined, questionType);
    };

    return (
        <div className="h-full flex flex-col w-80">
            {/* Header */}
            <div className="p-4 border-b border-sidebar-border flex items-center justify-between flex-shrink-0">
                <div>
                    <h3 className="text-lg font-semibold text-sidebar-foreground">
                        Components
                    </h3>
                    <p className="text-sm text-sidebar-foreground/70">
                        Drag to canvas
                    </p>
                </div>

                {/* Close button */}
                <button
                    onClick={toggleLeftSidebar}
                    className="p-1.5 rounded-md hover:bg-secondary transition-colors"
                    title="Close sidebar"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Content area */}
            <div className="flex-1 p-4 overflow-y-auto">
                {/* Input/Question Nodes Section */}
                <div className="mb-6">
                    <h4 className="text-sm font-medium text-sidebar-foreground mb-3">
                        Input/Question Nodes
                    </h4>

                    {/* Input Node */}
                    <div
                        draggable
                        onDragStart={(event) => onDragStart(event, 'question', 'input')}
                        onClick={() => handleAddNode('question', 'input')}
                        className="flex items-center gap-3 p-3 rounded-lg border border-sidebar-border bg-card hover:bg-accent cursor-pointer transition-colors group mb-2"
                    >
                        <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                            <TextAaIcon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                            <div className="text-sm font-medium text-card-foreground">
                                Input Field
                            </div>
                            <div className="text-xs text-muted-foreground">
                                Text, number, email, phone, CPF, currency
                            </div>
                        </div>
                    </div>

                    {/* Date Input Node */}
                    <div
                        draggable
                        onDragStart={(event) => onDragStart(event, 'question', 'date')}
                        onClick={() => handleAddNode('question', 'date')}
                        className="flex items-center gap-3 p-3 rounded-lg border border-sidebar-border bg-card hover:bg-accent cursor-pointer transition-colors group mb-2"
                    >
                        <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                            <CalendarDotsIcon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                            <div className="text-sm font-medium text-card-foreground">
                                Date Input
                            </div>
                            <div className="text-xs text-muted-foreground">
                                Date picker with range validation
                            </div>
                        </div>
                    </div>

                    {/* Choice Node */}
                    <div
                        draggable
                        onDragStart={(event) => onDragStart(event, 'question', 'choice')}
                        onClick={() => handleAddNode('question', 'choice')}
                        className="flex items-center gap-3 p-3 rounded-lg border border-sidebar-border bg-card hover:bg-accent cursor-pointer transition-colors group"
                    >
                        <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                            <RadioButtonIcon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                            <div className="text-sm font-medium text-card-foreground">
                                Choice
                            </div>
                            <div className="text-xs text-muted-foreground">
                                Single or multiple selection from options
                            </div>
                        </div>
                    </div>
                </div>

                {/* Placeholder for other sections */}
                <div className="text-xs text-muted-foreground text-center py-8">
                    Logic and transaction nodes coming soon...
                </div>
            </div>
        </div>
    );
}
'use client';

import { useFormBuilderStore } from '@/store/formBuilderStore';
import { X, TextAaIcon, HashStraightIcon, CalendarDotsIcon, RadioButtonIcon, CheckCircleIcon } from '@phosphor-icons/react';
import { isQuestionNode } from '@/types/nodes';

export const RightSidebar = () => {
    const {
        formId,
        title,
        description,
        creatorAddress,
        collectionSettings,
        setFormMetadata,
        setCollectionSettings,
        saveForm,
        isSaving,
        toggleRightSidebar,
        selectedNodeId,
        nodes,
        updateNode
    } = useFormBuilderStore();

    const handleTitleChange = (value: string) => {
        setFormMetadata({ title: value });
    };

    const handleDescriptionChange = (value: string) => {
        setFormMetadata({ description: value });
    };

    const handleCreatorAddressChange = (value: string) => {
        setFormMetadata({ creatorAddress: value });
    };

    const handleCollectionNameChange = (value: string) => {
        setCollectionSettings({ collectionName: value });
    };

    const handleCollectionAddressChange = (value: string) => {
        setCollectionSettings({ collectionAddress: value });
    };

    const handleRoyaltiesChange = (value: string) => {
        const numValue = parseFloat(value);
        if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
            setCollectionSettings({ royalties: numValue });
        }
    };

    const handleCollectionDescriptionChange = (value: string) => {
        setCollectionSettings({ collectionDescription: value });
    };

    // Get selected node
    const selectedNode = selectedNodeId ? nodes.find(node => node.id === selectedNodeId) : null;

    // Get node type info
    const getNodeTypeInfo = (questionType: string, inputType?: string, multiSelect?: boolean) => {
        switch (questionType) {
            case 'input':
                const inputTypeTitle = inputType ? inputType.charAt(0).toUpperCase() + inputType.slice(1) : 'Text';
                return {
                    icon: inputType === 'number' || inputType === 'currency' ? <HashStraightIcon className="w-4 h-4 text-primary" /> : <TextAaIcon className="w-4 h-4 text-primary" />,
                    title: `${inputTypeTitle} Input Node`,
                    type: inputType || 'text'
                };
            case 'date':
                return {
                    icon: <CalendarDotsIcon className="w-4 h-4 text-primary" />,
                    title: 'Date Input Node',
                    type: 'date'
                };
            case 'choice':
                return {
                    icon: multiSelect ? <CheckCircleIcon className="w-4 h-4 text-primary" /> : <RadioButtonIcon className="w-4 h-4 text-primary" />,
                    title: multiSelect ? 'Checkbox Node' : 'Choice Node',
                    type: multiSelect ? 'choice (multiple)' : 'choice (single)'
                };
            default:
                return {
                    icon: <TextAaIcon className="w-4 h-4 text-primary" />,
                    title: 'Input Node',
                    type: 'text'
                };
        }
    };

    const nodeTypeInfo = selectedNode && isQuestionNode(selectedNode) ?
        getNodeTypeInfo(selectedNode.data.questionType, selectedNode.data.inputType, selectedNode.data.multiSelect) : null;

    // Node configuration handlers
    const handleNodeQuestionTextChange = (value: string) => {
        if (selectedNodeId) {
            updateNode(selectedNodeId, { questionText: value });
        }
    };

    const handleNodePlaceholderChange = (value: string) => {
        if (selectedNodeId) {
            updateNode(selectedNodeId, { placeholder: value });
        }
    };

    const handleNodeValidationChange = (field: string, value: any) => {
        if (selectedNodeId && selectedNode && isQuestionNode(selectedNode)) {
            const currentValidation = selectedNode.data.validation || {};
            updateNode(selectedNodeId, {
                validation: { ...currentValidation, [field]: value }
            });
        }
    };

    // Render validation fields based on question type and input type
    const renderValidationFields = () => {
        if (!selectedNode || !isQuestionNode(selectedNode)) return null;

        const questionType = selectedNode.data.questionType;
        const inputType = selectedNode.data.inputType;
        const validation = selectedNode.data.validation || {};

        switch (questionType) {
            case 'input':
                switch (inputType) {
                    case 'text':
                        return (
                            <>
                                <div>
                                    <label className="block text-xs font-medium text-sidebar-foreground mb-1">Minimum Length</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={validation.minLength || ''}
                                        onChange={(e) => handleNodeValidationChange('minLength', e.target.value ? parseInt(e.target.value) : undefined)}
                                        className="w-full px-3 py-3 lg:py-2 text-base lg:text-sm min-h-[44px] border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                                        placeholder="No minimum"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-sidebar-foreground mb-1">Maximum Length</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={validation.maxLength || ''}
                                        onChange={(e) => handleNodeValidationChange('maxLength', e.target.value ? parseInt(e.target.value) : undefined)}
                                        className="w-full px-3 py-3 lg:py-2 text-base lg:text-sm min-h-[44px] border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                                        placeholder="No maximum"
                                    />
                                </div>
                            </>
                        );
                    case 'number':
                    case 'currency':
                        return (
                            <>
                                <div>
                                    <label className="block text-xs font-medium text-sidebar-foreground mb-1">Minimum Value</label>
                                    <input
                                        type="number"
                                        value={validation.min || ''}
                                        onChange={(e) => handleNodeValidationChange('min', e.target.value ? parseFloat(e.target.value) : undefined)}
                                        className="w-full px-3 py-3 lg:py-2 text-base lg:text-sm min-h-[44px] border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                                        placeholder="No minimum"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-sidebar-foreground mb-1">Maximum Value</label>
                                    <input
                                        type="number"
                                        value={validation.max || ''}
                                        onChange={(e) => handleNodeValidationChange('max', e.target.value ? parseFloat(e.target.value) : undefined)}
                                        className="w-full px-3 py-3 lg:py-2 text-base lg:text-sm min-h-[44px] border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                                        placeholder="No maximum"
                                    />
                                </div>
                            </>
                        );
                    case 'email':
                    case 'phone':
                    case 'cpf':
                        // These have built-in validation, only show length limits
                        return (
                            <>
                                <div>
                                    <label className="block text-xs font-medium text-sidebar-foreground mb-1">Minimum Length</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={validation.minLength || ''}
                                        onChange={(e) => handleNodeValidationChange('minLength', e.target.value ? parseInt(e.target.value) : undefined)}
                                        className="w-full px-3 py-3 lg:py-2 text-base lg:text-sm min-h-[44px] border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                                        placeholder="No minimum"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-sidebar-foreground mb-1">Maximum Length</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={validation.maxLength || ''}
                                        onChange={(e) => handleNodeValidationChange('maxLength', e.target.value ? parseInt(e.target.value) : undefined)}
                                        className="w-full px-3 py-3 lg:py-2 text-base lg:text-sm min-h-[44px] border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                                        placeholder="No maximum"
                                    />
                                </div>
                            </>
                        );
                    case 'custom':
                        return (
                            <>
                                <div>
                                    <label className="block text-xs font-medium text-sidebar-foreground mb-1">Custom Pattern (Regex)</label>
                                    <input
                                        type="text"
                                        value={validation.pattern || ''}
                                        onChange={(e) => handleNodeValidationChange('pattern', e.target.value)}
                                        className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent font-mono"
                                        placeholder="e.g., ^[A-Z]{2}[0-9]{8}$"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-sidebar-foreground mb-1">Minimum Length</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={validation.minLength || ''}
                                        onChange={(e) => handleNodeValidationChange('minLength', e.target.value ? parseInt(e.target.value) : undefined)}
                                        className="w-full px-3 py-3 lg:py-2 text-base lg:text-sm min-h-[44px] border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                                        placeholder="No minimum"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-sidebar-foreground mb-1">Maximum Length</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={validation.maxLength || ''}
                                        onChange={(e) => handleNodeValidationChange('maxLength', e.target.value ? parseInt(e.target.value) : undefined)}
                                        className="w-full px-3 py-3 lg:py-2 text-base lg:text-sm min-h-[44px] border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                                        placeholder="No maximum"
                                    />
                                </div>
                            </>
                        );
                    default:
                        return null;
                }
            case 'date':
                return (
                    <>
                        <div>
                            <label className="block text-xs font-medium text-sidebar-foreground mb-1">Minimum Date</label>
                            <input
                                type="date"
                                value={validation.min || ''}
                                onChange={(e) => handleNodeValidationChange('min', e.target.value)}
                                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-sidebar-foreground mb-1">Maximum Date</label>
                            <input
                                type="date"
                                value={validation.max || ''}
                                onChange={(e) => handleNodeValidationChange('max', e.target.value)}
                                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                            />
                        </div>
                    </>
                );
            case 'choice':
                if (selectedNode.data.multiSelect) {
                    // Multi-select validation
                    return (
                        <>
                            <div>
                                <label className="block text-xs font-medium text-sidebar-foreground mb-1">Minimum Selections</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={validation.min || ''}
                                    onChange={(e) => handleNodeValidationChange('min', e.target.value ? parseInt(e.target.value) : undefined)}
                                    className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                                    placeholder="No minimum"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-sidebar-foreground mb-1">Maximum Selections</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={validation.max || ''}
                                    onChange={(e) => handleNodeValidationChange('max', e.target.value ? parseInt(e.target.value) : undefined)}
                                    className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                                    placeholder="No maximum"
                                />
                            </div>
                        </>
                    );
                }
                return null; // Single choice nodes only have required validation
            default:
                return null;
        }
    };

    return (
        <div className="h-full flex flex-col w-80">
            <div className="p-4 border-b border-sidebar-border">
                <div className="flex items-center justify-between mb-2">
                    <div>
                        <h3 className="text-lg font-semibold text-sidebar-foreground">
                            {selectedNode ? 'Node Properties' : 'Form Properties'}
                        </h3>
                        <p className="text-sm text-sidebar-foreground/70">
                            {selectedNode ? 'Configure node settings' : 'Configure form settings'}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={saveForm}
                            disabled={isSaving}
                            className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                            {isSaving ? 'Saving...' : 'Save'}
                        </button>

                        {/* Close button */}
                        <button
                            onClick={toggleRightSidebar}
                            className="p-1.5 rounded-md hover:bg-secondary transition-colors"
                            title="Close sidebar"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
                {selectedNode && isQuestionNode(selectedNode) ? (
                    /* Node Configuration */
                    <div className="space-y-6">
                        {/* Node Type Header */}
                        <div className="flex items-center gap-2 pb-2 border-b border-sidebar-border">
                            <div className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center">
                                {nodeTypeInfo?.icon}
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-sidebar-foreground">{nodeTypeInfo?.title}</h4>
                                <p className="text-xs text-sidebar-foreground/70">Question type: {nodeTypeInfo?.type}</p>
                            </div>
                        </div>

                        {/* Question Settings */}
                        <div>
                            <h4 className="text-sm font-medium text-sidebar-foreground mb-3">Question Settings</h4>
                            <div className="space-y-4 lg:space-y-3">
                                <div>
                                    <label className="block text-xs font-medium text-sidebar-foreground mb-1">Question Text</label>
                                    <input
                                        type="text"
                                        value={selectedNode.data.questionText || ''}
                                        onChange={(e) => handleNodeQuestionTextChange(e.target.value)}
                                        className="w-full px-3 py-3 lg:py-2 text-base lg:text-sm min-h-[44px] border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                                        placeholder="Enter your question..."
                                    />
                                </div>
                                {selectedNode.data.questionType === 'input' && (
                                    <>
                                        <div>
                                            <label className="block text-xs font-medium text-sidebar-foreground mb-1">Input Type</label>
                                            <select
                                                value={selectedNode.data.inputType || 'text'}
                                                onChange={(e) => selectedNodeId && updateNode(selectedNodeId, { inputType: e.target.value })}
                                                className="w-full px-3 py-3 lg:py-2 text-base lg:text-sm min-h-[44px] border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                                            >
                                                <option value="text">Text</option>
                                                <option value="number">Number</option>
                                                <option value="email">Email</option>
                                                <option value="phone">Phone</option>
                                                <option value="cpf">CPF (Brazilian ID)</option>
                                                <option value="currency">Currency</option>
                                                <option value="custom">Custom Pattern</option>
                                            </select>
                                        </div>
                                        {(selectedNode.data.inputType === 'text' || !selectedNode.data.inputType) && (
                                            <div>
                                                <label className="block text-xs font-medium text-sidebar-foreground mb-1">Placeholder Text</label>
                                                <input
                                                    type="text"
                                                    value={selectedNode.data.placeholder || ''}
                                                    onChange={(e) => handleNodePlaceholderChange(e.target.value)}
                                                    className="w-full px-3 py-3 lg:py-2 text-base lg:text-sm min-h-[44px] border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                                                    placeholder="Enter placeholder text..."
                                                />
                                            </div>
                                        )}
                                    </>
                                )}
                                {selectedNode.data.questionType === 'choice' && (
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="multiSelect"
                                            checked={selectedNode.data.multiSelect || false}
                                            onChange={(e) => selectedNodeId && updateNode(selectedNodeId, { multiSelect: e.target.checked })}
                                            className="rounded border-input"
                                        />
                                        <label htmlFor="multiSelect" className="text-sm text-sidebar-foreground">Allow multiple selections</label>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Options Settings (for choice nodes) */}
                        {selectedNode.data.questionType === 'choice' && (
                            <div>
                                <h4 className="text-sm font-medium text-sidebar-foreground mb-3">Options</h4>
                                <div className="space-y-2">
                                    {(selectedNode.data.options || []).map((option, index) => (
                                        <div key={option.id} className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                value={option.label}
                                                onChange={(e) => {
                                                    if (selectedNodeId) {
                                                        const newOptions = [...(selectedNode.data.options || [])];
                                                        newOptions[index] = { ...newOptions[index], label: e.target.value, value: e.target.value };
                                                        updateNode(selectedNodeId, { options: newOptions });
                                                    }
                                                }}
                                                className="flex-1 px-3 py-2 border border-input bg-background rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                                                placeholder={`Option ${index + 1}`}
                                            />
                                            <button
                                                onClick={() => {
                                                    if (selectedNodeId) {
                                                        const newOptions = (selectedNode.data.options || []).filter((_, i) => i !== index);
                                                        updateNode(selectedNodeId, { options: newOptions });
                                                    }
                                                }}
                                                className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded"
                                                title="Remove option"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => {
                                            if (selectedNodeId) {
                                                const newOptions = [...(selectedNode.data.options || [])];
                                                const newId = `option-${Date.now()}`;
                                                newOptions.push({ id: newId, label: `Option ${newOptions.length + 1}`, value: `option${newOptions.length + 1}` });
                                                updateNode(selectedNodeId, { options: newOptions });
                                            }
                                        }}
                                        className="w-full px-3 py-3 lg:py-2 text-base lg:text-sm min-h-[44px] border border-dashed border-input bg-background hover:bg-accent rounded-md text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        + Add Option
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Validation Settings */}
                        <div>
                            <h4 className="text-sm font-medium text-sidebar-foreground mb-3">Validation Rules</h4>
                            <div className="space-y-4 lg:space-y-3">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="required"
                                        checked={selectedNode.data.validation?.required || false}
                                        onChange={(e) => handleNodeValidationChange('required', e.target.checked)}
                                        className="rounded border-input"
                                    />
                                    <label htmlFor="required" className="text-sm text-sidebar-foreground">Required field</label>
                                </div>

                                {renderValidationFields()}
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Form Configuration */
                    <div className="space-y-6">
                        {/* Form ID */}
                        <div>
                            <h4 className="text-sm font-medium text-sidebar-foreground mb-3">Form ID</h4>
                            <div className="px-3 py-2 bg-muted rounded-md text-sm text-sidebar-foreground/70 font-mono">
                                {formId || 'Not saved yet'}
                            </div>
                        </div>

                        {/* Basic Form Settings */}
                        <div>
                            <h4 className="text-sm font-medium text-sidebar-foreground mb-3">Basic Settings</h4>
                            <div className="space-y-4 lg:space-y-3">
                                <div>
                                    <label className="block text-xs font-medium text-sidebar-foreground mb-1">Form Title</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => handleTitleChange(e.target.value)}
                                        className="w-full px-3 py-3 lg:py-2 text-base lg:text-sm min-h-[44px] border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                                        placeholder="Untitled Form"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-sidebar-foreground mb-1">Description</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => handleDescriptionChange(e.target.value)}
                                        className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                                        rows={3}
                                        placeholder="Form description..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-sidebar-foreground mb-1">Creator Address</label>
                                    <input
                                        type="text"
                                        value={creatorAddress || ''}
                                        onChange={(e) => handleCreatorAddressChange(e.target.value)}
                                        className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent font-mono"
                                        placeholder="Solana address..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Collection Settings */}
                        <div>
                            <h4 className="text-sm font-medium text-sidebar-foreground mb-3">Collection Settings</h4>
                            <div className="space-y-4 lg:space-y-3">
                                <div>
                                    <label className="block text-xs font-medium text-sidebar-foreground mb-1">Collection Name</label>
                                    <input
                                        type="text"
                                        value={collectionSettings?.collectionName || ''}
                                        onChange={(e) => handleCollectionNameChange(e.target.value)}
                                        className="w-full px-3 py-3 lg:py-2 text-base lg:text-sm min-h-[44px] border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                                        placeholder="My NFT Collection"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-sidebar-foreground mb-1">Collection Address</label>
                                    <input
                                        type="text"
                                        value={collectionSettings?.collectionAddress || ''}
                                        onChange={(e) => handleCollectionAddressChange(e.target.value)}
                                        className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent font-mono"
                                        placeholder="Collection mint address..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-sidebar-foreground mb-1">Royalties (%)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        step="0.1"
                                        value={collectionSettings?.royalties || 0}
                                        onChange={(e) => handleRoyaltiesChange(e.target.value)}
                                        className="w-full px-3 py-3 lg:py-2 text-base lg:text-sm min-h-[44px] border border-input bg-background rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                                        placeholder="5.0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-sidebar-foreground mb-1">Collection Description</label>
                                    <textarea
                                        value={collectionSettings?.collectionDescription || ''}
                                        onChange={(e) => handleCollectionDescriptionChange(e.target.value)}
                                        className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                                        rows={2}
                                        placeholder="Collection description..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
'use client';

import { useEffect } from 'react';
import { useFormBuilderStore } from '@/store/formBuilderStore';
import { X, Type, Hash, Calendar, Circle, CheckCircle, CreditCard, Image, Code, GitBranch, Shield, Calculator, Save, Info } from 'lucide-react';
import { isQuestionNode, isTransactionNode, isLogicNode, isValidationNode, isCalculationNode, isEndNode, isStartNode, TransactionType, ConditionOperator, BRANCH_COLORS, ConditionalBranch, Condition, ValidationRule, CalculationOperation, CalculationOperator, SuccessAction, SuccessActionType } from '@/types/nodes';

// Type guard for NFT minting nodes
const isMintNFTNode = (node: any): boolean => {
  return isTransactionNode(node) &&
         node.data.transactionType === 'SPL_MINT' &&
         Boolean(node.data.parameters?.name || node.data.parameters?.symbol || node.data.parameters?.uri);
};

// Type guard for contract call nodes
const isCallContractNode = (node: any): boolean => {
  return isTransactionNode(node) && node.data.transactionType === 'CUSTOM_CALL';
};

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
        publishToTwitter,
        toggleRightSidebar,
        selectedNodeId,
        nodes,
        updateNode,
        rightSidebarActiveTab,
        setRightSidebarActiveTab
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

    // Auto-switch to node tab when a node is selected, form tab when deselected
    useEffect(() => {
        if (selectedNodeId) {
            setRightSidebarActiveTab('node');
        } else {
            setRightSidebarActiveTab('form');
        }
    }, [selectedNodeId, setRightSidebarActiveTab]);

    // Get transaction node info
    const getTransactionNodeInfo = (transactionType: TransactionType) => {
        const getTransactionTypeLabel = (type: TransactionType): string => {
            switch (type) {
                case 'SPL_MINT':
                    return 'Mint Token';
                case 'SPL_TRANSFER':
                    return 'Transfer Token';
                case 'SYSTEM_TRANSFER':
                    return 'Transfer SOL';
                default:
                    return 'Transaction';
            }
        };

        return {
            icon: <CreditCard className="w-4 h-4 text-primary" />,
            title: 'Transaction Node',
            type: getTransactionTypeLabel(transactionType)
        };
    };

    // Get node type info
    const getNodeTypeInfo = (questionType: string, inputType?: string, multiSelect?: boolean) => {
        switch (questionType) {
            case 'input':
                const inputTypeTitle = inputType ? inputType.charAt(0).toUpperCase() + inputType.slice(1) : 'Text';
                return {
                    icon: inputType === 'number' || inputType === 'currency' ? <Hash className="w-4 h-4 text-primary" /> : <Type className="w-4 h-4 text-primary" />,
                    title: `${inputTypeTitle} Input Node`,
                    type: inputType || 'text'
                };
            case 'date':
                return {
                    icon: <Calendar className="w-4 h-4 text-primary" />,
                    title: 'Date Input Node',
                    type: 'date'
                };
            case 'choice':
                return {
                    icon: multiSelect ? <CheckCircle className="w-4 h-4 text-primary" /> : <Circle className="w-4 h-4 text-primary" />,
                    title: multiSelect ? 'Checkbox Node' : 'Choice Node',
                    type: multiSelect ? 'choice (multiple)' : 'choice (single)'
                };
            default:
                return {
                    icon: <Type className="w-4 h-4 text-primary" />,
                    title: 'Input Node',
                    type: 'text'
                };
        }
    };

    const nodeTypeInfo = selectedNode && isQuestionNode(selectedNode) ?
        getNodeTypeInfo(selectedNode.data.questionType, selectedNode.data.inputType, selectedNode.data.multiSelect) : null;

    const transactionNodeInfo = selectedNode && isTransactionNode(selectedNode) && !isMintNFTNode(selectedNode) ?
        getTransactionNodeInfo(selectedNode.data.transactionType) : null;

    const mintNFTNodeInfo = selectedNode && isMintNFTNode(selectedNode) ? {
        icon: <Image className="w-4 h-4 text-primary" />,
        title: 'Mint NFT Node',
        type: 'NFT Minting'
    } : null;

    const callContractNodeInfo = selectedNode && isCallContractNode(selectedNode) ? {
        icon: <Code className="w-4 h-4 text-primary" />,
        title: 'Call Contract Node',
        type: 'Custom Program Call'
    } : null;

    const logicNodeInfo = selectedNode && isLogicNode(selectedNode) ? {
      icon: <GitBranch className="w-4 h-4 text-primary" />,
      title: 'Conditional Node',
      type: 'If/Then Logic'
    } : null;

/*     const validationNodeInfo = selectedNode && isValidationNode(selectedNode) ? {
      icon: <Shield className="w-4 h-4 text-primary" />,
      title: 'Validation Node',
      type: 'Cross-field Validation'
    } : null; */

    const calculationNodeInfo = selectedNode && isCalculationNode(selectedNode) ? {
      icon: <Calculator className="w-4 h-4 text-primary" />,
      title: 'Calculation Node',
      type: 'Mathematical Operations'
    } : null;

    const endNodeInfo = selectedNode && isEndNode(selectedNode) ? {
      icon: <CheckCircle className="w-4 h-4 text-primary" />,
      title: 'End Form Node',
      type: 'Form Completion'
    } : null;

    const startNodeInfo = selectedNode && isStartNode(selectedNode) ? {
      icon: <Info className="w-4 h-4 text-primary" />,
      title: 'Start Form Node',
      type: 'Form Introduction'
    } : null;

    // Helper to get all question nodes for conditional logic
    const getAvailableQuestionNodes = () => {
        return nodes
            .filter(node => isQuestionNode(node))
            .map(node => ({
                id: node.id,
                questionText: node.data.questionText || 'Untitled Question',
                questionType: node.data.questionType,
            }));
    };

    // Logic node configuration handlers
    const handleLogicNodeUpdate = (field: string, value: any) => {
        if (selectedNodeId) {
            updateNode(selectedNodeId, { [field]: value });
        }
    };

    // Transaction node configuration handlers
    const handleTransactionTypeChange = (value: TransactionType) => {
        if (selectedNodeId) {
            updateNode(selectedNodeId, { transactionType: value, parameters: {} }); // Reset parameters when type changes
        }
    };

    const handleTransactionParameterChange = (key: string, value: any) => {
        if (selectedNodeId && selectedNode && isTransactionNode(selectedNode)) {
            const currentParameters = selectedNode.data.parameters || {};
            updateNode(selectedNodeId, {
                parameters: { ...currentParameters, [key]: value }
            });
        }
    };

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

    // Branch management
    const handleAddBranch = () => {
        if (selectedNodeId && selectedNode && isLogicNode(selectedNode)) {
            const newBranch: ConditionalBranch = {
                id: `branch-${Date.now()}`,
                label: `Branch ${(selectedNode.data.branches?.length || 0) + 1}`,
                color: BRANCH_COLORS[(selectedNode.data.branches?.length || 0) % BRANCH_COLORS.length].value,
                matchValues: selectedNode.data.mode === 'switch' ? [''] : undefined,
                conditions: selectedNode.data.mode === 'multi-condition' ? [] : undefined,
                conditionOperator: 'AND',
            };

            const currentBranches = selectedNode.data.branches || [];
            updateNode(selectedNodeId, {
                branches: [...currentBranches, newBranch]
            });
        }
    };

    const handleDeleteBranch = (index: number) => {
        if (selectedNodeId && selectedNode && isLogicNode(selectedNode)) {
            const currentBranches = selectedNode.data.branches || [];
            updateNode(selectedNodeId, {
                branches: currentBranches.filter((_, i) => i !== index)
            });
        }
    };

    const handleBranchUpdate = (branchIndex: number, field: string, value: any) => {
        if (selectedNodeId && selectedNode && isLogicNode(selectedNode)) {
            const currentBranches = [...(selectedNode.data.branches || [])];
            currentBranches[branchIndex] = {
                ...currentBranches[branchIndex],
                [field]: value
            };
            updateNode(selectedNodeId, { branches: currentBranches });
        }
    };

    // Condition management (for multi-condition mode)
    const handleAddCondition = (branchIndex: number) => {
        if (selectedNodeId && selectedNode && isLogicNode(selectedNode)) {
            const currentBranches = [...(selectedNode.data.branches || [])];
            const newCondition: Condition = {
                id: `condition-${Date.now()}`,
                operator: 'equals',
                comparisonValue: '',
            };

            currentBranches[branchIndex] = {
                ...currentBranches[branchIndex],
                conditions: [...(currentBranches[branchIndex].conditions || []), newCondition]
            };

            updateNode(selectedNodeId, { branches: currentBranches });
        }
    };

    const handleDeleteCondition = (branchIndex: number, conditionIndex: number) => {
        if (selectedNodeId && selectedNode && isLogicNode(selectedNode)) {
            const currentBranches = [...(selectedNode.data.branches || [])];
            currentBranches[branchIndex] = {
                ...currentBranches[branchIndex],
                conditions: (currentBranches[branchIndex].conditions || []).filter((_, i) => i !== conditionIndex)
            };
            updateNode(selectedNodeId, { branches: currentBranches });
        }
    };

    const handleConditionUpdate = (branchIndex: number, conditionIndex: number, field: string, value: any) => {
        if (selectedNodeId && selectedNode && isLogicNode(selectedNode)) {
            const currentBranches = [...(selectedNode.data.branches || [])];
            const conditions = [...(currentBranches[branchIndex].conditions || [])];
            conditions[conditionIndex] = {
                ...conditions[conditionIndex],
                [field]: value
            };
            currentBranches[branchIndex] = {
                ...currentBranches[branchIndex],
                conditions
            };
            updateNode(selectedNodeId, { branches: currentBranches });
        }
    };

    // Validation rule handlers
    const handleAddValidationRule = () => {
        if (selectedNodeId && selectedNode && isValidationNode(selectedNode)) {
            const newRule: ValidationRule = {
                id: `rule-${Date.now()}`,
                type: 'compare',
                description: 'New validation rule',
                errorMessage: 'Validation failed',
            };

            const currentRules = selectedNode.data.validationRules || [];
            updateNode(selectedNodeId, {
                validationRules: [...currentRules, newRule]
            });
        }
    };

    const handleDeleteValidationRule = (index: number) => {
        if (selectedNodeId && selectedNode && isValidationNode(selectedNode)) {
            const currentRules = selectedNode.data.validationRules || [];
            updateNode(selectedNodeId, {
                validationRules: currentRules.filter((_, i) => i !== index)
            });
        }
    };

    const handleValidationRuleUpdate = (ruleIndex: number, field: string, value: any) => {
        if (selectedNodeId && selectedNode && isValidationNode(selectedNode)) {
            const currentRules = [...(selectedNode.data.validationRules || [])];
            currentRules[ruleIndex] = {
                ...currentRules[ruleIndex],
                [field]: value
            };
            updateNode(selectedNodeId, { validationRules: currentRules });
        }
    };

    // Validation preview renderer
    const renderValidationPreview = (data: any) => {
        const rules = data.validationRules || [];
        if (rules.length === 0) {
            return <span className="italic">No validation rules configured</span>;
        }

        return (
            <div>
                <strong>Validation Rules:</strong>
                {rules.map((rule: ValidationRule, i: number) => (
                    <div key={rule.id} className="ml-2 mt-1">
                        <div className="text-green-600 font-medium">
                            ✓ {rule.description}
                        </div>
                        <div className="ml-3 text-xs text-muted-foreground">
                            Type: {rule.type} | Error: {rule.errorMessage}
                        </div>
                    </div>
                ))}
                <div className="mt-2">
                    <strong>Outputs:</strong>
                    <div className="flex items-center gap-2 ml-2 mt-1">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-green-600 font-medium">VALID</span>
                        <span className="text-muted-foreground">→ Continue to next step</span>
                    </div>
                    <div className="flex items-center gap-2 ml-2 mt-1">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-red-600 font-medium">INVALID</span>
                        <span className="text-muted-foreground">→ Show error message</span>
                    </div>
                </div>
            </div>
        );
    };

    // Calculation operation handlers
    const handleAddCalculationOperation = () => {
        if (selectedNodeId && selectedNode && isCalculationNode(selectedNode)) {
            const newOperation: CalculationOperation = {
                id: `calc-${Date.now()}`,
                operator: 'add',
                operands: ['', ''],
                resultVariable: `result_${(selectedNode.data.operations || []).length + 1}`,
                description: 'New calculation',
            };

            const currentOperations = selectedNode.data.operations || [];
            updateNode(selectedNodeId, {
                operations: [...currentOperations, newOperation]
            });
        }
    };

    const handleDeleteCalculationOperation = (index: number) => {
        if (selectedNodeId && selectedNode && isCalculationNode(selectedNode)) {
            const currentOperations = selectedNode.data.operations || [];
            updateNode(selectedNodeId, {
                operations: currentOperations.filter((_, i) => i !== index)
            });
        }
    };

    const handleCalculationOperationUpdate = (operationIndex: number, field: string, value: any) => {
        if (selectedNodeId && selectedNode && isCalculationNode(selectedNode)) {
            const currentOperations = [...(selectedNode.data.operations || [])];
            currentOperations[operationIndex] = {
                ...currentOperations[operationIndex],
                [field]: value
            };
            updateNode(selectedNodeId, { operations: currentOperations });
        }
    };

    // Calculation preview renderer
    const renderCalculationPreview = (data: any) => {
        const operations = data.operations || [];
        if (operations.length === 0) {
            return <span className="italic">No calculations configured</span>;
        }

        return (
            <div>
                <strong>Calculations:</strong>
                {operations.map((op: CalculationOperation, i: number) => (
                    <div key={op.id} className="ml-2 mt-1">
                        <div className="text-blue-600 font-medium">
                            {op.resultVariable} = {op.description}
                        </div>
                        <div className="ml-3 text-xs text-muted-foreground">
                            Operator: {op.operator} | Operands: {op.operands.join(', ')}
                        </div>
                    </div>
                ))}
                <div className="mt-2">
                    <strong>Output:</strong>
                    <div className="flex items-center gap-2 ml-2 mt-1">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-blue-600 font-medium">CALCULATED</span>
                        <span className="text-muted-foreground">→ Continue with results</span>
                    </div>
                </div>
            </div>
        );
    };

    // Success action handlers
    const handleAddSuccessAction = () => {
        if (selectedNodeId && selectedNode && isEndNode(selectedNode)) {
            const newAction: SuccessAction = {
                id: `action-${Date.now()}`,
                type: 'email',
                enabled: true,
                description: 'Send confirmation email',
                emailRecipient: '',
                emailSubject: 'Form Submission Confirmation',
                emailTemplate: 'Thank you for your submission!',
            };

            const currentActions = selectedNode.data.successActions || [];
            updateNode(selectedNodeId, {
                successActions: [...currentActions, newAction]
            });
        }
    };

    const handleDeleteSuccessAction = (index: number) => {
        if (selectedNodeId && selectedNode && isEndNode(selectedNode)) {
            const currentActions = selectedNode.data.successActions || [];
            updateNode(selectedNodeId, {
                successActions: currentActions.filter((_, i) => i !== index)
            });
        }
    };

    const handleSuccessActionUpdate = (actionIndex: number, field: string, value: any) => {
        if (selectedNodeId && selectedNode && isEndNode(selectedNode)) {
            const currentActions = [...(selectedNode.data.successActions || [])];
            currentActions[actionIndex] = {
                ...currentActions[actionIndex],
                [field]: value
            };
            updateNode(selectedNodeId, { successActions: currentActions });
        }
    };

    // Success actions preview renderer
    const renderSuccessActionsPreview = (data: any) => {
        const actions = data.successActions || [];
        if (actions.length === 0) {
            return <span className="italic">No success actions configured</span>;
        }

        return (
            <div>
                <strong>Success Actions:</strong>
                {actions.filter((action: SuccessAction) => action.enabled).map((action: SuccessAction, i: number) => (
                    <div key={action.id} className="ml-2 mt-1">
                        <div className="text-green-600 font-medium">
                            ✓ {action.description}
                        </div>
                        <div className="ml-3 text-xs text-muted-foreground">
                            Type: {action.type}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    // Preview renderer
    const renderLogicPreview = (data: any) => {
        if (data.mode === 'switch') {
            const questionNode = nodes.find(n => n.id === data.switchQuestionId);
            const questionText = questionNode && isQuestionNode(questionNode)
                ? questionNode.data.questionText
                : 'No question selected';

            return (
                <div>
                    <strong>Switch on:</strong> {questionText}<br />
                    <strong>Branches:</strong>
                    {(data.branches || []).map((branch: ConditionalBranch, i: number) => (
                        <div key={branch.id} className="ml-2 mt-1">
                            <div
                                className="inline-block w-3 h-3 rounded-full mr-2"
                                style={{ backgroundColor: branch.color }}
                            />
                            <strong>{branch.label}:</strong> {
                                (branch.matchValues || []).join(', ') || 'No values'
                            }
                        </div>
                    ))}
                </div>
            );
        } else {
            return (
                <div>
                    <strong>Multi-Condition Logic:</strong>
                    {(data.branches || []).map((branch: ConditionalBranch, i: number) => (
                        <div key={branch.id} className="ml-2 mt-2">
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: branch.color }}
                                />
                                <strong>{branch.label}:</strong>
                            </div>
                            <div className="ml-5 text-xs">
                                {(branch.conditions || []).length === 0 ? (
                                    <span className="italic">No conditions</span>
                                ) : (
                                    (branch.conditions || []).map((cond: Condition, condIndex: number) => {
                                        const q = nodes.find(n => n.id === cond.questionId);
                                        const qText = q && isQuestionNode(q) ? q.data.questionText : 'Question';
                                        return (
                                            <div key={cond.id}>
                                                {condIndex > 0 && (
                                                    <span className="font-bold text-primary">
                                                        {branch.conditionOperator || 'AND'}{' '}
                                                    </span>
                                                )}
                                                {qText} {cond.operator} "{cond.comparisonValue}"
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            );
        }
    };

    // Render transaction parameter fields based on transaction type
    const renderTransactionParameterFields = () => {
        if (!selectedNode || !isTransactionNode(selectedNode)) return null;

        const transactionType = selectedNode.data.transactionType;
        const parameters = selectedNode.data.parameters || {};

        switch (transactionType) {
            case 'SPL_MINT':
                return (
                    <>
                        <div>
                            <label className="block text-xs font-medium text-sidebar-foreground mb-1">Mint Address</label>
                            <input
                                type="text"
                                value={parameters.mintAddress || ''}
                                onChange={(e) => handleTransactionParameterChange('mintAddress', e.target.value)}
                                className="w-full bg-[#13131A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#460DF2] transition-colors font-mono"
                                placeholder="Token mint address..."
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-sidebar-foreground mb-1">Recipient Address</label>
                            <input
                                type="text"
                                value={parameters.recipientAddress || ''}
                                onChange={(e) => handleTransactionParameterChange('recipientAddress', e.target.value)}
                                className="w-full bg-[#13131A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#460DF2] transition-colors font-mono"
                                placeholder="Recipient address or {{parameterName}}..."
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-sidebar-foreground mb-1">Amount</label>
                            <input
                                type="number"
                                min="0"
                                step="0.000001"
                                value={parameters.amount || ''}
                                onChange={(e) => handleTransactionParameterChange('amount', e.target.value ? parseFloat(e.target.value) : undefined)}
                                className="w-full bg-[#13131A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#460DF2] transition-colors"
                                placeholder="Amount to mint..."
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-sidebar-foreground mb-1">Decimals</label>
                            <input
                                type="number"
                                min="0"
                                max="9"
                                value={parameters.decimals || ''}
                                onChange={(e) => handleTransactionParameterChange('decimals', e.target.value ? parseInt(e.target.value) : undefined)}
                                className="w-full bg-[#13131A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#460DF2] transition-colors"
                                placeholder="Token decimals..."
                            />
                        </div>
                    </>
                );
            case 'SPL_TRANSFER':
                return (
                    <>
                        <div>
                            <label className="block text-xs font-medium text-sidebar-foreground mb-1">Mint Address</label>
                            <input
                                type="text"
                                value={parameters.mintAddress || ''}
                                onChange={(e) => handleTransactionParameterChange('mintAddress', e.target.value)}
                                className="w-full bg-[#13131A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#460DF2] transition-colors font-mono"
                                placeholder="Token mint address..."
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-sidebar-foreground mb-1">Recipient Address</label>
                            <input
                                type="text"
                                value={parameters.recipientAddress || ''}
                                onChange={(e) => handleTransactionParameterChange('recipientAddress', e.target.value)}
                                className="w-full bg-[#13131A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#460DF2] transition-colors font-mono"
                                placeholder="Recipient Solana address..."
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-sidebar-foreground mb-1">Amount</label>
                            <input
                                type="number"
                                min="0"
                                step="0.000001"
                                value={parameters.amount || ''}
                                onChange={(e) => handleTransactionParameterChange('amount', e.target.value ? parseFloat(e.target.value) : undefined)}
                                className="w-full bg-[#13131A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#460DF2] transition-colors"
                                placeholder="Amount to transfer..."
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-sidebar-foreground mb-1">Decimals</label>
                            <input
                                type="number"
                                min="0"
                                max="9"
                                value={parameters.decimals || ''}
                                onChange={(e) => handleTransactionParameterChange('decimals', e.target.value ? parseInt(e.target.value) : undefined)}
                                className="w-full bg-[#13131A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#460DF2] transition-colors"
                                placeholder="Token decimals (usually 6 or 9)..."
                            />
                        </div>
                    </>
                );
            case 'SYSTEM_TRANSFER':
                return (
                    <>
                        <div>
                            <label className="block text-xs font-medium text-sidebar-foreground mb-1">Recipient Address</label>
                            <input
                                type="text"
                                value={parameters.recipientAddress || ''}
                                onChange={(e) => handleTransactionParameterChange('recipientAddress', e.target.value)}
                                className="w-full bg-[#13131A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#460DF2] transition-colors font-mono"
                                placeholder="Recipient Solana address..."
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-sidebar-foreground mb-1">Amount (SOL)</label>
                            <input
                                type="number"
                                min="0"
                                step="0.000000001"
                                value={parameters.amount || ''}
                                onChange={(e) => handleTransactionParameterChange('amount', e.target.value ? parseFloat(e.target.value) : undefined)}
                                className="w-full bg-[#13131A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#460DF2] transition-colors"
                                placeholder="Amount in SOL..."
                            />
                        </div>
                    </>
                );
            case 'CREATE_TOKEN':
                return (
                    <>
                        <div>
                            <label className="block text-xs font-medium text-sidebar-foreground mb-1">Token Name</label>
                            <input
                                type="text"
                                value={parameters.name || ''}
                                onChange={(e) => handleTransactionParameterChange('name', e.target.value)}
                                className="w-full bg-[#13131A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#460DF2] transition-colors"
                                placeholder="My Token"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-sidebar-foreground mb-1">Token Symbol</label>
                            <input
                                type="text"
                                value={parameters.symbol || ''}
                                onChange={(e) => handleTransactionParameterChange('symbol', e.target.value)}
                                className="w-full bg-[#13131A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#460DF2] transition-colors"
                                placeholder="TKN"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-sidebar-foreground mb-1">Decimals</label>
                            <input
                                type="number"
                                min="0"
                                max="9"
                                value={parameters.decimals || 9}
                                onChange={(e) => handleTransactionParameterChange('decimals', e.target.value ? parseInt(e.target.value) : 9)}
                                className="w-full bg-[#13131A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#460DF2] transition-colors"
                                placeholder="9"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-sidebar-foreground mb-1">Initial Supply</label>
                            <input
                                type="number"
                                min="0"
                                step="0.000001"
                                value={parameters.initialSupply || ''}
                                onChange={(e) => handleTransactionParameterChange('initialSupply', e.target.value ? parseFloat(e.target.value) : undefined)}
                                className="w-full bg-[#13131A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#460DF2] transition-colors"
                                placeholder="1000000"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-sidebar-foreground mb-1">Recipient Address</label>
                            <input
                                type="text"
                                value={parameters.recipientAddress || ''}
                                onChange={(e) => handleTransactionParameterChange('recipientAddress', e.target.value)}
                                className="w-full bg-[#13131A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#460DF2] transition-colors font-mono"
                                placeholder="Recipient address or {{parameterName}}..."
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-sidebar-foreground mb-1">Metadata URI (Optional)</label>
                            <input
                                type="url"
                                value={parameters.uri || ''}
                                onChange={(e) => handleTransactionParameterChange('uri', e.target.value)}
                                className="w-full bg-[#13131A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#460DF2] transition-colors font-mono"
                                placeholder="https://..."
                            />
                        </div>
                    </>
                );
            case 'MINT_TOKENS':
                return (
                    <>
                        <div>
                            <label className="block text-xs font-medium text-sidebar-foreground mb-1">Mint Address</label>
                            <input
                                type="text"
                                value={parameters.mintAddress || ''}
                                onChange={(e) => handleTransactionParameterChange('mintAddress', e.target.value)}
                                className="w-full bg-[#13131A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#460DF2] transition-colors font-mono"
                                placeholder="Token mint address..."
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-sidebar-foreground mb-1">Recipient Address</label>
                            <input
                                type="text"
                                value={parameters.recipientAddress || ''}
                                onChange={(e) => handleTransactionParameterChange('recipientAddress', e.target.value)}
                                className="w-full bg-[#13131A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#460DF2] transition-colors font-mono"
                                placeholder="Recipient address or {{parameterName}}..."
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-sidebar-foreground mb-1">Amount</label>
                            <input
                                type="number"
                                min="0"
                                step="0.000001"
                                value={parameters.amount || ''}
                                onChange={(e) => handleTransactionParameterChange('amount', e.target.value ? parseFloat(e.target.value) : undefined)}
                                className="w-full bg-[#13131A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#460DF2] transition-colors"
                                placeholder="Amount to mint..."
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-sidebar-foreground mb-1">Decimals</label>
                            <input
                                type="number"
                                min="0"
                                max="9"
                                value={parameters.decimals || 9}
                                onChange={(e) => handleTransactionParameterChange('decimals', e.target.value ? parseInt(e.target.value) : 9)}
                                className="w-full bg-[#13131A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#460DF2] transition-colors"
                                placeholder="Token decimals..."
                            />
                        </div>
                    </>
                );
            case 'CREATE_NFT_COLLECTION':
                return (
                    <>
                        <div>
                            <label className="block text-xs font-medium text-sidebar-foreground mb-1">Collection Name</label>
                            <input
                                type="text"
                                value={parameters.name || ''}
                                onChange={(e) => handleTransactionParameterChange('name', e.target.value)}
                                className="w-full bg-[#13131A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#460DF2] transition-colors"
                                placeholder="My NFT Collection"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-sidebar-foreground mb-1">Collection Symbol</label>
                            <input
                                type="text"
                                value={parameters.symbol || ''}
                                onChange={(e) => handleTransactionParameterChange('symbol', e.target.value)}
                                className="w-full bg-[#13131A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#460DF2] transition-colors"
                                placeholder="COL"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-sidebar-foreground mb-1">Metadata URI</label>
                            <input
                                type="url"
                                value={parameters.uri || ''}
                                onChange={(e) => handleTransactionParameterChange('uri', e.target.value)}
                                className="w-full bg-[#13131A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#460DF2] transition-colors font-mono"
                                placeholder="https://arweave.net/..."
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-sidebar-foreground mb-1">Royalty Percentage (0-20%)</label>
                            <input
                                type="number"
                                min="0"
                                max="20"
                                step="0.1"
                                value={parameters.sellerFeeBasisPoints ? (parameters.sellerFeeBasisPoints / 100) : 5}
                                onChange={(e) => handleTransactionParameterChange('sellerFeeBasisPoints', e.target.value ? Math.round(parseFloat(e.target.value) * 100) : 500)}
                                className="w-full bg-[#13131A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#460DF2] transition-colors"
                                placeholder="5"
                            />
                        </div>
                    </>
                );
            case 'MINT_NFT':
                return (
                    <>
                        <div>
                            <label className="block text-xs font-medium text-sidebar-foreground mb-1">Collection Address</label>
                            <input
                                type="text"
                                value={parameters.collectionAddress || ''}
                                onChange={(e) => handleTransactionParameterChange('collectionAddress', e.target.value)}
                                className="w-full bg-[#13131A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#460DF2] transition-colors font-mono"
                                placeholder="Collection mint address..."
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-sidebar-foreground mb-1">NFT Name</label>
                            <input
                                type="text"
                                value={parameters.name || ''}
                                onChange={(e) => handleTransactionParameterChange('name', e.target.value)}
                                className="w-full bg-[#13131A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#460DF2] transition-colors"
                                placeholder="My Awesome NFT"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-sidebar-foreground mb-1">Metadata URI</label>
                            <input
                                type="url"
                                value={parameters.uri || ''}
                                onChange={(e) => handleTransactionParameterChange('uri', e.target.value)}
                                className="w-full bg-[#13131A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#460DF2] transition-colors font-mono"
                                placeholder="https://arweave.net/..."
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-sidebar-foreground mb-1">Recipient Address</label>
                            <input
                                type="text"
                                value={parameters.recipientAddress || ''}
                                onChange={(e) => handleTransactionParameterChange('recipientAddress', e.target.value)}
                                className="w-full bg-[#13131A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#460DF2] transition-colors font-mono"
                                placeholder="Recipient address or {{parameterName}}..."
                            />
                        </div>
                    </>
                );
            case 'BATCH_AIRDROP':
                return (
                    <>
                        <div>
                            <label className="block text-xs font-medium text-sidebar-foreground mb-1">Mint Address</label>
                            <input
                                type="text"
                                value={parameters.mintAddress || ''}
                                onChange={(e) => handleTransactionParameterChange('mintAddress', e.target.value)}
                                className="w-full bg-[#13131A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#460DF2] transition-colors font-mono"
                                placeholder="Token mint address..."
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-sidebar-foreground mb-1">Recipients</label>
                            <div className="space-y-2 max-h-32 overflow-y-auto">
                                {(parameters.recipients || []).map((recipient: any, index: number) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={recipient.address || ''}
                                            onChange={(e) => {
                                                const newRecipients = [...(parameters.recipients || [])];
                                                newRecipients[index] = { ...newRecipients[index], address: e.target.value };
                                                handleTransactionParameterChange('recipients', newRecipients);
                                            }}
                                            className="flex-1 bg-[#13131A] border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-[#460DF2] font-mono"
                                            placeholder="Address..."
                                        />
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.000001"
                                            value={recipient.amount || ''}
                                            onChange={(e) => {
                                                const newRecipients = [...(parameters.recipients || [])];
                                                newRecipients[index] = { ...newRecipients[index], amount: parseFloat(e.target.value) || 0 };
                                                handleTransactionParameterChange('recipients', newRecipients);
                                            }}
                                            className="w-20 bg-[#13131A] border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-[#460DF2]"
                                            placeholder="Amount..."
                                        />
                                        <button
                                            onClick={() => {
                                                const newRecipients = (parameters.recipients || []).filter((_: any, i: number) => i !== index);
                                                handleTransactionParameterChange('recipients', newRecipients);
                                            }}
                                            className="text-red-400 hover:text-red-300 px-1"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                                <button
                                    onClick={() => {
                                        const newRecipients = [...(parameters.recipients || []), { address: '', amount: 0 }];
                                        handleTransactionParameterChange('recipients', newRecipients);
                                    }}
                                    className="w-full px-2 py-1.5 border border-dashed border-white/10 bg-white/5 hover:bg-white/10 rounded text-xs text-gray-400 hover:text-white transition-all hover:border-[#460DF2]/30"
                                >
                                    + Add Recipient
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-sidebar-foreground mb-1">Decimals</label>
                            <input
                                type="number"
                                min="0"
                                max="9"
                                value={parameters.decimals || 9}
                                onChange={(e) => handleTransactionParameterChange('decimals', e.target.value ? parseInt(e.target.value) : 9)}
                                className="w-full bg-[#13131A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#460DF2] transition-colors"
                                placeholder="Token decimals..."
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-sidebar-foreground mb-1">Total Recipients</label>
                            <div className="w-full bg-[#13131A] border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-400">
                                {(parameters.recipients || []).length} recipients
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-sidebar-foreground mb-1">Total Amount</label>
                            <div className="w-full bg-[#13131A] border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-400">
                                {(parameters.recipients || []).reduce((sum: number, r: any) => sum + (r.amount || 0), 0).toLocaleString()} tokens
                            </div>
                        </div>
                    </>
                );
            default:
                return null;
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
                                        className="w-full bg-[#13131A] border border-white/10 rounded-lg px-3 py-3 lg:py-2 text-base lg:text-sm min-h-[44px] text-white focus:outline-none focus:border-[#460DF2] transition-colors"
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
                                        className="w-full bg-[#13131A] border border-white/10 rounded-lg px-3 py-3 lg:py-2 text-base lg:text-sm min-h-[44px] text-white focus:outline-none focus:border-[#460DF2] transition-colors"
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
                                        className="w-full bg-[#13131A] border border-white/10 rounded-lg px-3 py-3 lg:py-2 text-base lg:text-sm min-h-[44px] text-white focus:outline-none focus:border-[#460DF2] transition-colors"
                                        placeholder="No minimum"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-sidebar-foreground mb-1">Maximum Value</label>
                                    <input
                                        type="number"
                                        value={validation.max || ''}
                                        onChange={(e) => handleNodeValidationChange('max', e.target.value ? parseFloat(e.target.value) : undefined)}
                                        className="w-full bg-[#13131A] border border-white/10 rounded-lg px-3 py-3 lg:py-2 text-base lg:text-sm min-h-[44px] text-white focus:outline-none focus:border-[#460DF2] transition-colors"
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
                                        className="w-full bg-[#13131A] border border-white/10 rounded-lg px-3 py-3 lg:py-2 text-base lg:text-sm min-h-[44px] text-white focus:outline-none focus:border-[#460DF2] transition-colors"
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
                                        className="w-full bg-[#13131A] border border-white/10 rounded-lg px-3 py-3 lg:py-2 text-base lg:text-sm min-h-[44px] text-white focus:outline-none focus:border-[#460DF2] transition-colors"
                                        placeholder="No maximum"
                                    />
                                </div>
                            </>
                        );
                    case 'date':
                        return (
                            <>
                                <div>
                                    <label className="block text-xs font-medium text-sidebar-foreground mb-1">Minimum Date</label>
                                    <input
                                        type="date"
                                        value={validation.min || ''}
                                        onChange={(e) => handleNodeValidationChange('min', e.target.value)}
                                        className="w-full bg-[#13131A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#460DF2] transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-sidebar-foreground mb-1">Maximum Date</label>
                                    <input
                                        type="date"
                                        value={validation.max || ''}
                                        onChange={(e) => handleNodeValidationChange('max', e.target.value)}
                                        className="w-full bg-[#13131A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#460DF2] transition-colors"
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
                                        className="w-full bg-[#13131A] border border-white/10 rounded-lg px-3 py-3 lg:py-2 text-base lg:text-sm min-h-[44px] text-white focus:outline-none focus:border-[#460DF2] transition-colors"
                                        placeholder="No maximum"
                                    />
                                </div>
                            </>
                        );
                    default:
                        return null;
                }
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
                                    className="w-full bg-[#13131A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#460DF2] transition-colors"
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
                                    className="w-full bg-[#13131A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#460DF2] transition-colors"
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
        <div className="h-full flex flex-col w-80 bg-[#0C0C12]">
            {/* Header */}
            <div className="p-4 border-b border-white/5 bg-white/[0.02]">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <h2 className="text-white font-semibold">
                            {rightSidebarActiveTab === 'form' ? 'Form Properties' : 'Node Settings'}
                        </h2>
                        <p className="text-xs text-gray-500">
                            {rightSidebarActiveTab === 'form' ? 'Global configuration' : 'Configure node properties'}
                        </p>
                    </div>
                    <button onClick={toggleRightSidebar} className="text-gray-500 hover:text-white">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-1">
                    <button
                        onClick={() => setRightSidebarActiveTab('form')}
                        className={`flex-1 px-3 py-2 text-xs font-medium rounded-lg transition-all ${
                            rightSidebarActiveTab === 'form'
                                ? 'bg-[#460DF2] text-white shadow-[0_0_10px_-2px_#460DF2]'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                        }`}
                    >
                        Form
                    </button>
                    <button
                        onClick={() => setRightSidebarActiveTab('node')}
                        className={`flex-1 px-3 py-2 text-xs font-medium rounded-lg transition-all ${
                            rightSidebarActiveTab === 'node'
                                ? 'bg-[#460DF2] text-white shadow-[0_0_10px_-2px_#460DF2]'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                        }`}
                        disabled={!selectedNode}
                    >
                        Node
                    </button>
                </div>

                {/* Auto-saved indicator for form tab */}
                {rightSidebarActiveTab === 'form' && (
                    <div className="mt-2 bg-[#460DF2] text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-[0_0_10px_-2px_#460DF2] w-fit">
                        AUTO-SAVED
                    </div>
                )}
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-6">
                {/* Form Properties */}
                {rightSidebarActiveTab === 'form' && (
                    <>
                        {/* Form ID */}
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-400">Form ID</label>
                            <div className="w-full bg-[#13131A] border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-500 font-mono">
                                {formId || 'blk_8a92b3c...'}
                            </div>
                        </div>

                        {/* Form Title */}
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-400">Form Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => handleTitleChange(e.target.value)}
                                className="w-full bg-[#13131A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#460DF2] transition-colors"
                                placeholder="Untitled Form"
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-400">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => handleDescriptionChange(e.target.value)}
                                rows={3}
                                className="w-full bg-[#13131A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#460DF2] transition-colors"
                                placeholder="Form description..."
                            />
                        </div>

                        {/* Creator Address */}
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-400">Creator Address</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={creatorAddress || ''}
                                    readOnly
                                    className="w-full bg-[#13131A] border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-400 font-mono"
                                />
                                <CheckCircle className="absolute right-3 top-2.5 w-4 h-4 text-green-500" />
                            </div>
                        </div>

                        {/* Collection Settings */}
                        <div className="pt-4 border-t border-white/5">
                            <div className="mb-2">
                                <span className="text-xs font-bold text-gray-400 uppercase">Collection Settings</span>
                            </div>
                            <div className="p-3 bg-[#13131A] border border-white/5 rounded-lg space-y-3">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-medium text-gray-500">Collection Name</label>
                                    <input
                                        type="text"
                                        value={collectionSettings?.collectionName || ''}
                                        onChange={(e) => handleCollectionNameChange(e.target.value)}
                                        className="w-full bg-[#13131A] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#460DF2] transition-colors"
                                        placeholder="My Collection"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-medium text-gray-500">Symbol</label>
                                    <input
                                        type="text"
                                        className="w-full bg-[#13131A] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#460DF2] transition-colors"
                                        placeholder="RWRD"
                                    />
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* Node Properties */}
                {rightSidebarActiveTab === 'node' && selectedNode && (
                    <div className="space-y-4">
                        <div className="text-sm font-medium text-sidebar-foreground border-b border-sidebar-border pb-2">
                            Node Properties
                        </div>
                    </div>
                )}

                {/* No node selected message */}
                {rightSidebarActiveTab === 'node' && !selectedNode && (
                    <div className="text-center py-8">
                        <div className="text-gray-400 text-sm">
                            Select a node to configure its properties
                        </div>
                    </div>
                )}

                {rightSidebarActiveTab === 'node' && selectedNode && isValidationNode(selectedNode) ? (
                    <></>
                ) : rightSidebarActiveTab === 'node' && selectedNode && isCalculationNode(selectedNode) ? (
                    <div className="space-y-6">
                        {/* Node Type Header */}
                        <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                            <div className="w-6 h-6 bg-purple-400/10 rounded-lg flex items-center justify-center">
                                {calculationNodeInfo?.icon}
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-white">{calculationNodeInfo?.title}</h4>
                                <p className="text-xs text-gray-400">Node type: {calculationNodeInfo?.type}</p>
                            </div>
                        </div>

                        {/* Operations Configuration */}
                        <div>
                            <h4 className="text-sm font-medium text-white mb-3">
                                Calculation Operations ({(selectedNode.data.operations || []).length})
                            </h4>

                            <div className="space-y-3">
                                {(selectedNode.data.operations || []).map((operation, index) => (
                                    <div key={operation.id} className="p-3 border border-white/10 rounded-lg bg-[#13131A]">
                                        {/* Operation Description */}
                                        <div className="mb-2">
                                            <label className="block text-xs font-medium text-gray-400 mb-1">
                                                Description
                                            </label>
                                            <input
                                                type="text"
                                                value={operation.description}
                                                onChange={(e) => handleCalculationOperationUpdate(index, 'description', e.target.value)}
                                                className="w-full px-3 py-2 border border-white/10 bg-[#13131A] rounded-lg text-sm text-white focus:outline-none focus:border-[#460DF2]"
                                                placeholder="e.g., Total price calculation"
                                            />
                                        </div>

                                        {/* Result Variable */}
                                        <div className="mb-2">
                                            <label className="block text-xs font-medium text-gray-400 mb-1">
                                                Result Variable Name
                                            </label>
                                            <input
                                                type="text"
                                                value={operation.resultVariable}
                                                onChange={(e) => handleCalculationOperationUpdate(index, 'resultVariable', e.target.value)}
                                                className="w-full px-3 py-2 border border-white/10 bg-[#13131A] rounded-lg text-sm text-white focus:outline-none focus:border-[#460DF2]"
                                                placeholder="e.g., totalPrice"
                                            />
                                        </div>

                                        {/* Operator Selection */}
                                        <div className="mb-2">
                                            <label className="block text-xs font-medium text-gray-400 mb-1">
                                                Operation
                                            </label>
                                            <select
                                                value={operation.operator}
                                                onChange={(e) => handleCalculationOperationUpdate(index, 'operator', e.target.value)}
                                                className="w-full px-3 py-2 border border-white/10 bg-[#13131A] rounded-lg text-sm text-white focus:outline-none focus:border-[#460DF2]"
                                            >
                                                <option value="add">Addition (+)</option>
                                                <option value="subtract">Subtraction (-)</option>
                                                <option value="multiply">Multiplication (×)</option>
                                                <option value="divide">Division (÷)</option>
                                                <option value="modulo">Modulo (%)</option>
                                                <option value="power">Power (^)</option>
                                            </select>
                                        </div>

                                        {/* Operands */}
                                        <div className="mb-2">
                                            <label className="block text-xs font-medium text-gray-400 mb-1">
                                                Operands (Fields or Numbers)
                                            </label>
                                            <div className="space-y-1">
                                                {(operation.operands || []).map((operand, operandIndex) => (
                                                    <div key={operandIndex} className="flex gap-2">
                                                        <select
                                                            value={typeof operand === 'string' && operand.startsWith('field-') ? operand : 'literal'}
                                                            onChange={(e) => {
                                                                const newOperands = [...(operation.operands || [])];
                                                                if (e.target.value === 'literal') {
                                                                    newOperands[operandIndex] = '';
                                                                } else {
                                                                    newOperands[operandIndex] = e.target.value;
                                                                }
                                                                handleCalculationOperationUpdate(index, 'operands', newOperands);
                                                            }}
                                                            className="px-2 py-1.5 border border-white/10 bg-black/20 rounded text-xs text-white flex-1 focus:outline-none focus:border-[#460DF2]"
                                                        >
                                                            <option value="literal">Literal Number</option>
                                                            {getAvailableQuestionNodes().map(q => (
                                                                <option key={q.id} value={q.id}>Field: {q.questionText}</option>
                                                            ))}
                                                        </select>
                                                        {typeof operand === 'string' && !operand.startsWith('field-') && (
                                                            <input
                                                                type="number"
                                                                value={operand}
                                                                onChange={(e) => {
                                                                    const newOperands = [...(operation.operands || [])];
                                                                    newOperands[operandIndex] = e.target.value ? parseFloat(e.target.value) : '';
                                                                    handleCalculationOperationUpdate(index, 'operands', newOperands);
                                                                }}
                                                                className="px-2 py-1.5 border border-white/10 bg-black/20 rounded text-xs text-white flex-1 focus:outline-none focus:border-[#460DF2]"
                                                                placeholder="Number..."
                                                            />
                                                        )}
                                                        <button
                                                            onClick={() => {
                                                                const newOperands = (operation.operands || []).filter((_, i) => i !== operandIndex);
                                                                handleCalculationOperationUpdate(index, 'operands', newOperands);
                                                            }}
                                                            className="p-1 text-muted-foreground hover:text-destructive"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                ))}
                                                <button
                                                    onClick={() => {
                                                        const newOperands = [...(operation.operands || []), ''];
                                                        handleCalculationOperationUpdate(index, 'operands', newOperands);
                                                    }}
                                                    className="w-full px-2 py-1.5 border border-dashed border-white/10 bg-white/5 hover:bg-white/10 rounded-lg text-xs text-gray-400 hover:text-white transition-all hover:border-[#460DF2]/30"
                                                >
                                                    + Add Operand
                                                </button>
                                            </div>
                                        </div>

                                        {/* Delete Operation Button */}
                                        <button
                                            onClick={() => handleDeleteCalculationOperation(index)}
                                            className="w-full px-2 py-1.5 text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg border border-red-500/20 hover:border-red-500/40 transition-all"
                                        >
                                            Delete Operation
                                        </button>
                                    </div>
                                ))}

                                {/* Add Operation Button */}
                                <button
                                    onClick={handleAddCalculationOperation}
                                    className="w-full px-3 py-2 border border-dashed border-white/10 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all hover:border-[#460DF2]/30"
                                >
                                    + Add Calculation Operation
                                </button>
                            </div>
                        </div>

                        {/* Calculation Preview */}
                        <div>
                            <h4 className="text-sm font-medium text-sidebar-foreground mb-3">Calculation Preview</h4>
                            <div className="p-3 bg-[#13131A] border border-white/5 rounded-lg backdrop-blur-sm">
                                <div className="text-xs text-gray-400">
                                    {renderCalculationPreview(selectedNode.data)}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : rightSidebarActiveTab === 'node' && selectedNode && isEndNode(selectedNode) ? (
                    /* End Node Configuration */
                    <div className="space-y-6">
                        {/* Node Type Header */}
                        <div className="flex items-center gap-2 pb-2 border-b border-sidebar-border">
                            <div className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center">
                                {endNodeInfo?.icon}
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-sidebar-foreground">{endNodeInfo?.title}</h4>
                                <p className="text-xs text-sidebar-foreground/70">Node type: {endNodeInfo?.type}</p>
                            </div>
                        </div>

                        {/* Completion Message */}
                        <div>
                            <h4 className="text-sm font-medium text-sidebar-foreground mb-3">Completion Message</h4>
                            <div className="space-y-4 lg:space-y-3">
                                <div>
                                    <label className="block text-xs font-medium text-sidebar-foreground mb-1">Display Label</label>
                                    <input
                                        type="text"
                                        value={selectedNode.data.label}
                                        onChange={(e) => handleLogicNodeUpdate('label', e.target.value)}
                                        className="w-full bg-[#13131A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#460DF2] transition-colors"
                                        placeholder="Form Complete"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-sidebar-foreground mb-1">Success Message</label>
                                    <textarea
                                        value={selectedNode.data.message || ''}
                                        onChange={(e) => handleLogicNodeUpdate('message', e.target.value)}
                                        className="w-full bg-[#13131A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#460DF2] transition-colors resize-none"
                                        rows={3}
                                        placeholder="Thank you for completing this form..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Success Actions */}
                        <div>
                            <h4 className="text-sm font-medium text-sidebar-foreground mb-3">
                                Success Actions ({(selectedNode.data.successActions || []).filter((action: SuccessAction) => action.enabled).length})
                            </h4>

                            <div className="space-y-3">
                                {(selectedNode.data.successActions || []).map((action, index) => (
                                    <div key={action.id} className="p-3 border border-input rounded-md bg-background">
                                        {/* Action Header */}
                                        <div className="flex items-center gap-2 mb-2">
                                            <input
                                                type="checkbox"
                                                checked={action.enabled}
                                                onChange={(e) => handleSuccessActionUpdate(index, 'enabled', e.target.checked)}
                                                className="rounded border-white/10 bg-[#13131A] text-[#460DF2] focus:outline-none focus:ring-2 focus:ring-[#460DF2]/20 focus:border-[#460DF2] transition-colors cursor-pointer hover:border-[#460DF2]/50"
                                            />
                                            <span className="text-sm font-medium text-sidebar-foreground flex-1">
                                                {action.description}
                                            </span>
                                            <button
                                                onClick={() => handleDeleteSuccessAction(index)}
                                                className="p-1 text-muted-foreground hover:text-destructive"
                                            >
                                                ×
                                            </button>
                                        </div>

                                        {/* Action Type */}
                                        <div className="mb-2">
                                            <label className="block text-xs font-medium text-sidebar-foreground mb-1">Action Type</label>
                                            <select
                                                value={action.type}
                                                onChange={(e) => handleSuccessActionUpdate(index, 'type', e.target.value)}
                                                className="w-full px-2 py-1 border border-input bg-background rounded text-sm"
                                            >
                                                <option value="email">Send Email</option>
                                                <option value="webhook">Call Webhook</option>
                                                <option value="redirect">Redirect User</option>
                                                <option value="custom">Custom Action</option>
                                            </select>
                                        </div>

                                        {/* Action Description */}
                                        <div className="mb-2">
                                            <label className="block text-xs font-medium text-sidebar-foreground mb-1">Description</label>
                                            <input
                                                type="text"
                                                value={action.description}
                                                onChange={(e) => handleSuccessActionUpdate(index, 'description', e.target.value)}
                                                className="w-full px-2 py-1 border border-input bg-background rounded text-sm"
                                                placeholder="Describe this action..."
                                            />
                                        </div>

                                        {/* Type-specific fields */}
                                        {action.type === 'email' && (
                                            <div className="space-y-2">
                                                <div>
                                                    <label className="block text-xs text-sidebar-foreground mb-1">Recipient Email</label>
                                                    <input
                                                        type="email"
                                                        value={action.emailRecipient || ''}
                                                        onChange={(e) => handleSuccessActionUpdate(index, 'emailRecipient', e.target.value)}
                                                        className="w-full px-2 py-1 border border-input bg-background rounded text-sm"
                                                        placeholder="user@example.com"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-sidebar-foreground mb-1">Email Subject</label>
                                                    <input
                                                        type="text"
                                                        value={action.emailSubject || ''}
                                                        onChange={(e) => handleSuccessActionUpdate(index, 'emailSubject', e.target.value)}
                                                        className="w-full px-2 py-1 border border-input bg-background rounded text-sm"
                                                        placeholder="Form Submission Confirmation"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-sidebar-foreground mb-1">Email Template</label>
                                                    <textarea
                                                        value={action.emailTemplate || ''}
                                                        onChange={(e) => handleSuccessActionUpdate(index, 'emailTemplate', e.target.value)}
                                                        className="w-full px-2 py-1 border border-input bg-background rounded text-sm resize-none"
                                                        rows={2}
                                                        placeholder="Thank you for your submission!"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {action.type === 'webhook' && (
                                            <div className="space-y-2">
                                                <div>
                                                    <label className="block text-xs text-sidebar-foreground mb-1">Webhook URL</label>
                                                    <input
                                                        type="url"
                                                        value={action.webhookUrl || ''}
                                                        onChange={(e) => handleSuccessActionUpdate(index, 'webhookUrl', e.target.value)}
                                                        className="w-full px-2 py-1 border border-input bg-background rounded text-sm"
                                                        placeholder="https://api.example.com/webhook"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-sidebar-foreground mb-1">HTTP Method</label>
                                                    <select
                                                        value={action.webhookMethod || 'POST'}
                                                        onChange={(e) => handleSuccessActionUpdate(index, 'webhookMethod', e.target.value)}
                                                        className="w-full px-2 py-1 border border-input bg-background rounded text-sm"
                                                    >
                                                        <option value="POST">POST</option>
                                                        <option value="PUT">PUT</option>
                                                    </select>
                                                </div>
                                            </div>
                                        )}

                                        {action.type === 'redirect' && (
                                            <div>
                                                <label className="block text-xs text-sidebar-foreground mb-1">Redirect URL</label>
                                                <input
                                                    type="url"
                                                    value={action.redirectUrl || ''}
                                                    onChange={(e) => handleSuccessActionUpdate(index, 'redirectUrl', e.target.value)}
                                                    className="w-full px-2 py-1 border border-input bg-background rounded text-sm"
                                                    placeholder="https://example.com/thank-you"
                                                />
                                            </div>
                                        )}

                                        {action.type === 'custom' && (
                                            <div>
                                                <label className="block text-xs text-sidebar-foreground mb-1">Custom Code/Logic</label>
                                                <textarea
                                                    value={action.customCode || ''}
                                                    onChange={(e) => handleSuccessActionUpdate(index, 'customCode', e.target.value)}
                                                    className="w-full px-2 py-1 border border-input bg-background rounded text-sm resize-none"
                                                    rows={3}
                                                    placeholder="Enter custom success action logic..."
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {/* Add Action Button */}
                                <button
                                    onClick={handleAddSuccessAction}
                                    className="w-full px-3 py-2 border border-dashed border-white/10 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all hover:border-[#460DF2]/30"
                                >
                                    + Add Success Action
                                </button>
                            </div>
                        </div>

                        {/* Preview */}
                        <div>
                            <h4 className="text-sm font-medium text-sidebar-foreground mb-3">Completion Preview</h4>
                            <div className="p-3 bg-[#13131A] border border-white/5 rounded-lg backdrop-blur-sm">
                                <div className="text-xs text-gray-400">
                                    <strong>Message:</strong> {selectedNode.data.message || 'No message configured'}<br />
                                    {renderSuccessActionsPreview(selectedNode.data)}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : rightSidebarActiveTab === 'node' && selectedNode && isLogicNode(selectedNode) ? (
                    <div className="space-y-6">
                        {/* Node Type Header (existing) */}
                        <div className="flex items-center gap-2 pb-2 border-b border-sidebar-border">
                            <div className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center">
                                {logicNodeInfo?.icon}
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-sidebar-foreground">{logicNodeInfo?.title}</h4>
                                <p className="text-xs text-sidebar-foreground/70">Node type: {logicNodeInfo?.type}</p>
                            </div>
                        </div>

                        {/* Mode Selector */}
                        <div>
                            <h4 className="text-sm font-medium text-sidebar-foreground mb-3">Pattern Mode</h4>
                            <select
                                value={selectedNode.data.mode || 'switch'}
                                onChange={(e) => handleLogicNodeUpdate('mode', e.target.value)}
                                className="w-full bg-[#13131A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#460DF2] transition-colors"
                            >
                                <option value="switch">Switch (One question → Multiple branches)</option>
                                <option value="multi-condition">Multi-Condition (Complex AND/OR logic)</option>
                            </select>
                            <p className="text-xs text-muted-foreground mt-1">
                                {selectedNode.data.mode === 'switch'
                                    ? 'Evaluate one question and branch based on its value'
                                    : 'Combine multiple conditions with AND/OR operators'
                                }
                            </p>
                        </div>

                        {/* Switch Mode Configuration */}
                        {selectedNode.data.mode === 'switch' ? (
                            <>
                                {/* Question Selection */}
                                <div>
                                    <h4 className="text-sm font-medium text-sidebar-foreground mb-3">Question to Evaluate</h4>
                                    <select
                                        value={selectedNode.data.switchQuestionId || ''}
                                        onChange={(e) => handleLogicNodeUpdate('switchQuestionId', e.target.value)}
                                        className="w-full bg-[#13131A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#460DF2] transition-colors"
                                    >
                                        <option value="">Select a question...</option>
                                        {getAvailableQuestionNodes().map(question => (
                                            <option key={question.id} value={question.id}>
                                                {question.questionText} ({question.questionType})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Branches Configuration */}
                                <div>
                                    <h4 className="text-sm font-medium text-sidebar-foreground mb-3">
                                        Branches ({(selectedNode.data.branches || []).length})
                                    </h4>

                                    <div className="space-y-3">
                                        {(selectedNode.data.branches || []).map((branch, index) => (
                                            <div key={branch.id} className="p-3 border border-input rounded-md bg-background">
                                                {/* Branch Label */}
                                                <div className="mb-2">
                                                    <label className="block text-xs font-medium text-sidebar-foreground mb-1">
                                                        Branch Label
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={branch.label}
                                                        onChange={(e) => handleBranchUpdate(index, 'label', e.target.value)}
                                                        className="w-full px-2 py-1 border border-input bg-background rounded text-sm"
                                                        placeholder="e.g., Yes, No, Maybe"
                                                    />
                                                </div>

                                                {/* Branch Color */}
                                                <div className="mb-2">
                                                    <label className="block text-xs font-medium text-sidebar-foreground mb-1">
                                                        Color
                                                    </label>
                                                    <div className="flex gap-2 flex-wrap">
                                                        {BRANCH_COLORS.map(color => (
                                                            <button
                                                                key={color.value}
                                                                onClick={() => handleBranchUpdate(index, 'color', color.value)}
                                                                className={`w-8 h-8 rounded border-2 transition-all ${
                                                                    branch.color === color.value
                                                                        ? 'border-primary scale-110'
                                                                        : 'border-border hover:scale-105'
                                                                }`}
                                                                style={{ backgroundColor: color.value }}
                                                                title={color.name}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Match Values */}
                                                <div className="mb-2">
                                                    <label className="block text-xs font-medium text-sidebar-foreground mb-1">
                                                        Match Values (take this branch if question value matches any)
                                                    </label>
                                                    <div className="space-y-1">
                                                        {(branch.matchValues || []).map((value, valueIndex) => (
                                                            <div key={valueIndex} className="flex gap-2">
                                                                <input
                                                                    type="text"
                                                                    value={value}
                                                                    onChange={(e) => {
                                                                        const newMatchValues = [...(branch.matchValues || [])];
                                                                        newMatchValues[valueIndex] = e.target.value;
                                                                        handleBranchUpdate(index, 'matchValues', newMatchValues);
                                                                    }}
                                                                    className="flex-1 px-2 py-1 border border-input bg-background rounded text-sm"
                                                                    placeholder="Value..."
                                                                />
                                                                <button
                                                                    onClick={() => {
                                                                        const newMatchValues = (branch.matchValues || []).filter((_, i) => i !== valueIndex);
                                                                        handleBranchUpdate(index, 'matchValues', newMatchValues);
                                                                    }}
                                                                    className="p-1 text-muted-foreground hover:text-destructive"
                                                                >
                                                                    ×
                                                                </button>
                                                            </div>
                                                        ))}
                                                        <button
                                                            onClick={() => {
                                                                const newMatchValues = [...(branch.matchValues || []), ''];
                                                                handleBranchUpdate(index, 'matchValues', newMatchValues);
                                                            }}
                                                            className="w-full px-2 py-1.5 border border-dashed border-white/10 bg-white/5 hover:bg-white/10 rounded-lg text-xs text-gray-400 hover:text-white transition-all hover:border-[#460DF2]/30"
                                                        >
                                                            + Add Value
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Delete Branch Button */}
                                                <button
                                                    onClick={() => handleDeleteBranch(index)}
                                                    className="w-full px-2 py-1.5 text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg border border-red-500/20 hover:border-red-500/40 transition-all"
                                                >
                                                    Delete Branch
                                                </button>
                                            </div>
                                        ))}

                                        {/* Add Branch Button */}
                                        <button
                                            onClick={handleAddBranch}
                                            className="w-full px-3 py-2 border border-dashed border-white/10 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all hover:border-[#460DF2]/30"
                                        >
                                            + Add Branch
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            /* Multi-Condition Mode Configuration */
                            <>
                                <div>
                                    <h4 className="text-sm font-medium text-sidebar-foreground mb-3">
                                        Branches with Conditions
                                    </h4>
                                    <p className="text-xs text-muted-foreground mb-3">
                                        Each branch can have multiple conditions combined with AND/OR logic.
                                    </p>

                                    <div className="space-y-4">
                                        {(selectedNode.data.branches || []).map((branch, branchIndex) => (
                                            <div key={branch.id} className="p-3 border border-input rounded-md bg-background">
                                                {/* Branch Header */}
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div
                                                        className="w-4 h-4 rounded-full"
                                                        style={{ backgroundColor: branch.color }}
                                                    />
                                                    <input
                                                        type="text"
                                                        value={branch.label}
                                                        onChange={(e) => handleBranchUpdate(branchIndex, 'label', e.target.value)}
                                                        className="flex-1 px-2 py-1 border border-input bg-background rounded text-sm font-medium"
                                                        placeholder="Branch label"
                                                    />
                                                    <button
                                                        onClick={() => handleDeleteBranch(branchIndex)}
                                                        className="p-1 text-muted-foreground hover:text-destructive"
                                                    >
                                                        ×
                                                    </button>
                                                </div>

                                                {/* Condition Operator */}
                                                {(branch.conditions || []).length > 1 && (
                                                    <div className="mb-2">
                                                        <label className="block text-xs font-medium text-sidebar-foreground mb-1">
                                                            Combine conditions with:
                                                        </label>
                                                        <select
                                                            value={branch.conditionOperator || 'AND'}
                                                            onChange={(e) => handleBranchUpdate(branchIndex, 'conditionOperator', e.target.value)}
                                                            className="w-full px-2 py-1 border border-input bg-background rounded text-sm"
                                                        >
                                                            <option value="AND">AND (all must be true)</option>
                                                            <option value="OR">OR (any can be true)</option>
                                                        </select>
                                                    </div>
                                                )}

                                                {/* Conditions List */}
                                                <div className="space-y-2">
                                                    {(branch.conditions || []).map((condition, condIndex) => (
                                                        <div key={condition.id} className="p-2 border border-input rounded bg-muted/50">
                                                            <div className="grid grid-cols-3 gap-2 mb-2">
                                                                {/* Question */}
                                                                <select
                                                                    value={condition.questionId || ''}
                                                                    onChange={(e) => handleConditionUpdate(branchIndex, condIndex, 'questionId', e.target.value)}
                                                                    className="col-span-3 px-2 py-1 border border-input bg-background rounded text-xs"
                                                                >
                                                                    <option value="">Select question...</option>
                                                                    {getAvailableQuestionNodes().map(q => (
                                                                        <option key={q.id} value={q.id}>{q.questionText}</option>
                                                                    ))}
                                                                </select>

                                                                {/* Operator */}
                                                                <select
                                                                    value={condition.operator}
                                                                    onChange={(e) => handleConditionUpdate(branchIndex, condIndex, 'operator', e.target.value)}
                                                                    className="px-2 py-1 border border-input bg-background rounded text-xs"
                                                                >
                                                                    <option value="equals">=</option>
                                                                    <option value="not_equals">≠</option>
                                                                    <option value="contains">contains</option>
                                                                    <option value="greater_than">{">"}</option>
                                                                    <option value="less_than">{"<"}</option>
                                                                </select>

                                                                {/* Value */}
                                                                <input
                                                                    type="text"
                                                                    value={condition.comparisonValue}
                                                                    onChange={(e) => handleConditionUpdate(branchIndex, condIndex, 'comparisonValue', e.target.value)}
                                                                    className="col-span-2 px-2 py-1 border border-input bg-background rounded text-xs"
                                                                    placeholder="Value..."
                                                                />
                                                            </div>

                                                            <button
                                                                onClick={() => handleDeleteCondition(branchIndex, condIndex)}
                                                                className="text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300 px-2 py-1 rounded-lg border border-red-500/20 hover:border-red-500/40 transition-all"
                                                            >
                                                                Remove condition
                                                            </button>
                                                        </div>
                                                    ))}

                                                    <button
                                                        onClick={() => handleAddCondition(branchIndex)}
                                                        className="w-full px-2 py-1.5 border border-dashed border-white/10 bg-white/5 hover:bg-white/10 rounded-lg text-xs text-gray-400 hover:text-white transition-all hover:border-[#460DF2]/30"
                                                    >
                                                        + Add Condition
                                                    </button>
                                                </div>
                                            </div>
                                        ))}

                                        <button
                                            onClick={handleAddBranch}
                                            className="w-full px-3 py-2 border border-dashed border-white/10 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all hover:border-[#460DF2]/30"
                                        >
                                            + Add Branch
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Preview Section */}
                        <div>
                            <h4 className="text-sm font-medium text-sidebar-foreground mb-3">Logic Preview</h4>
                            <div className="p-3 bg-[#13131A] border border-white/5 rounded-lg backdrop-blur-sm">
                                <div className="text-xs text-gray-400">
                                    {renderLogicPreview(selectedNode.data)}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : rightSidebarActiveTab === 'node' && selectedNode && isMintNFTNode(selectedNode) ? (
                    /* Mint NFT Node Configuration */
                    <div className="space-y-6">
                        {/* Node Type Header */}
                        <div className="flex items-center gap-2 pb-2 border-b border-sidebar-border">
                            <div className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center">
                                {mintNFTNodeInfo?.icon}
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-sidebar-foreground">{mintNFTNodeInfo?.title}</h4>
                                <p className="text-xs text-sidebar-foreground/70">Transaction type: {mintNFTNodeInfo?.type}</p>
                            </div>
                        </div>

                        {/* NFT Settings */}
                        <div>
                            <h4 className="text-sm font-medium text-sidebar-foreground mb-3">NFT Settings</h4>
                            <div className="space-y-4 lg:space-y-3">
                                <div>
                                    <label className="block text-xs font-medium text-sidebar-foreground mb-1">NFT Name</label>
                                    <input
                                        type="text"
                                        value={(selectedNode.data.parameters as any)?.name || ''}
                                        onChange={(e) => handleTransactionParameterChange('name', e.target.value)}
                                        className="w-full bg-[#13131A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#460DF2] transition-colors"
                                        placeholder="My Awesome NFT"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-sidebar-foreground mb-1">Symbol</label>
                                    <input
                                        type="text"
                                        value={(selectedNode.data.parameters as any)?.symbol || ''}
                                        onChange={(e) => handleTransactionParameterChange('symbol', e.target.value)}
                                        className="w-full bg-[#13131A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#460DF2] transition-colors"
                                        placeholder="NFT"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-sidebar-foreground mb-1">Metadata URI</label>
                                    <input
                                        type="url"
                                        value={(selectedNode.data.parameters as any)?.uri || ''}
                                        onChange={(e) => handleTransactionParameterChange('uri', e.target.value)}
                                        className="w-full bg-[#13131A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#460DF2] transition-colors font-mono"
                                        placeholder="https://arweave.net/..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-sidebar-foreground mb-1">Mint Amount</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={(selectedNode.data.parameters as any)?.amount || 1}
                                        onChange={(e) => handleTransactionParameterChange('amount', e.target.value ? parseInt(e.target.value) : 1)}
                                        className="w-full bg-[#13131A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#460DF2] transition-colors"
                                        placeholder="1"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Collection Settings */}
                        <div>
                            <h4 className="text-sm font-medium text-sidebar-foreground mb-3">Collection Settings</h4>
                            <div className="space-y-4 lg:space-y-3">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="useFormCollection"
                                        checked={(selectedNode.data.parameters as any)?.useFormCollection || false}
                                        onChange={(e) => handleTransactionParameterChange('useFormCollection', e.target.checked)}
                                        className="rounded border-input"
                                    />
                                    <label htmlFor="useFormCollection" className="text-sm text-sidebar-foreground">Use form collection settings</label>
                                </div>
                                {!(selectedNode.data.parameters as any)?.useFormCollection && (
                                    <div>
                                        <label className="block text-xs font-medium text-sidebar-foreground mb-1">Collection Address</label>
                                        <input
                                            type="text"
                                            value={(selectedNode.data.parameters as any)?.collectionAddress || ''}
                                            onChange={(e) => handleTransactionParameterChange('collectionAddress', e.target.value)}
                                            className="w-full bg-[#13131A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#460DF2] transition-colors font-mono"
                                            placeholder="Collection mint address..."
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* NFT Preview */}
                        <div>
                            <h4 className="text-sm font-medium text-sidebar-foreground mb-3">NFT Preview</h4>
                            <div className="p-3 bg-[#13131A] border border-white/5 rounded-lg backdrop-blur-sm">
                                <div className="text-xs text-gray-400">
                                    <strong>{(selectedNode.data.parameters as any)?.name || 'NFT Name'}</strong><br />
                                    Symbol: {(selectedNode.data.parameters as any)?.symbol || 'NFT'}<br />
                                    Amount: {(selectedNode.data.parameters as any)?.amount || 1}<br />
                                    URI: {(selectedNode.data.parameters as any)?.uri ? (selectedNode.data.parameters as any).uri.slice(0, 30) + '...' : 'Not set'}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : rightSidebarActiveTab === 'node' && selectedNode && isCallContractNode(selectedNode) ? (
                    /* Call Contract Node Configuration */
                    <div className="space-y-6">
                        {/* Node Type Header */}
                        <div className="flex items-center gap-2 pb-2 border-b border-sidebar-border">
                            <div className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center">
                                {callContractNodeInfo?.icon}
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-sidebar-foreground">{callContractNodeInfo?.title}</h4>
                                <p className="text-xs text-sidebar-foreground/70">Transaction type: {callContractNodeInfo?.type}</p>
                            </div>
                        </div>

                        {/* Program Settings */}
                        <div>
                            <h4 className="text-sm font-medium text-sidebar-foreground mb-3">Program Settings</h4>
                            <div className="space-y-4 lg:space-y-3">
                                <div>
                                    <label className="block text-xs font-medium text-sidebar-foreground mb-1">Program ID</label>
                                    <input
                                        type="text"
                                        value={(selectedNode.data.parameters as any)?.programId || ''}
                                        onChange={(e) => handleTransactionParameterChange('programId', e.target.value)}
                                        className="w-full bg-[#13131A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#460DF2] transition-colors font-mono"
                                        placeholder="Program public key..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Instruction Data */}
                        <div>
                            <h4 className="text-sm font-medium text-sidebar-foreground mb-3">Instruction Data</h4>
                            <div className="space-y-4 lg:space-y-3">
                                <div>
                                    <label className="block text-xs font-medium text-sidebar-foreground mb-1">Instruction Data (Hex)</label>
                                    <textarea
                                        value={(selectedNode.data.parameters as any)?.instructionData || ''}
                                        onChange={(e) => handleTransactionParameterChange('instructionData', e.target.value)}
                                        className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent font-mono resize-none"
                                        rows={3}
                                        placeholder="Hex-encoded instruction data..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Accounts */}
                        <div>
                            <h4 className="text-sm font-medium text-sidebar-foreground mb-3">Accounts</h4>
                            <div className="space-y-2">
                                {((selectedNode.data.parameters as any)?.accounts || []).map((account: any, index: number) => (
                                    <div key={index} className="flex items-center gap-2 p-2 border border-input bg-background rounded-md">
                                        <input
                                            type="text"
                                            value={account.pubkey || ''}
                                            onChange={(e) => {
                                                const newAccounts = [...((selectedNode.data.parameters as any)?.accounts || [])];
                                                newAccounts[index] = { ...newAccounts[index], pubkey: e.target.value };
                                                handleTransactionParameterChange('accounts', newAccounts);
                                            }}
                                            className="flex-1 px-2 py-1 border border-input bg-background rounded text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring font-mono"
                                            placeholder="Account public key..."
                                        />
                                        <div className="flex items-center gap-1">
                                            <input
                                                type="checkbox"
                                                checked={account.isSigner || false}
                                                onChange={(e) => {
                                                    const newAccounts = [...((selectedNode.data.parameters as any)?.accounts || [])];
                                                    newAccounts[index] = { ...newAccounts[index], isSigner: e.target.checked };
                                                    handleTransactionParameterChange('accounts', newAccounts);
                                                }}
                                                className="rounded border-white/10 bg-[#13131A] text-[#460DF2] focus:outline-none focus:ring-2 focus:ring-[#460DF2]/20 focus:border-[#460DF2] transition-colors cursor-pointer hover:border-[#460DF2]/50"
                                            />
                                            <label className="text-xs text-sidebar-foreground">Signer</label>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <input
                                                type="checkbox"
                                                checked={account.isWritable || false}
                                                onChange={(e) => {
                                                    const newAccounts = [...((selectedNode.data.parameters as any)?.accounts || [])];
                                                    newAccounts[index] = { ...newAccounts[index], isWritable: e.target.checked };
                                                    handleTransactionParameterChange('accounts', newAccounts);
                                                }}
                                                className="rounded border-white/10 bg-[#13131A] text-[#460DF2] focus:outline-none focus:ring-2 focus:ring-[#460DF2]/20 focus:border-[#460DF2] transition-colors cursor-pointer hover:border-[#460DF2]/50"
                                            />
                                            <label className="text-xs text-sidebar-foreground">Writable</label>
                                        </div>
                                        <button
                                            onClick={() => {
                                                const newAccounts = ((selectedNode.data.parameters as any)?.accounts || []).filter((_: any, i: number) => i !== index);
                                                handleTransactionParameterChange('accounts', newAccounts);
                                            }}
                                            className="p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded"
                                            title="Remove account"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                                <button
                                    onClick={() => {
                                        const newAccounts = [...((selectedNode.data.parameters as any)?.accounts || []), { pubkey: '', isSigner: false, isWritable: false }];
                                        handleTransactionParameterChange('accounts', newAccounts);
                                    }}
                                    className="w-full px-3 py-2 border border-dashed border-white/10 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all hover:border-[#460DF2]/30"
                                >
                                    + Add Account
                                </button>
                            </div>
                        </div>

                        {/* Advanced Mode Toggle */}
                        <div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="advancedMode"
                                    checked={(selectedNode.data.parameters as any)?.advancedMode || false}
                                    onChange={(e) => handleTransactionParameterChange('advancedMode', e.target.checked)}
                                    className="rounded border-input"
                                />
                                <label htmlFor="advancedMode" className="text-sm text-sidebar-foreground">Advanced Mode</label>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Show additional configuration options</p>
                        </div>

                        {/* Contract Call Preview */}
                        <div>
                            <h4 className="text-sm font-medium text-sidebar-foreground mb-3">Contract Call Preview</h4>
                            <div className="p-3 bg-[#13131A] border border-white/5 rounded-lg backdrop-blur-sm">
                                <div className="text-xs text-gray-400">
                                    <strong>Program:</strong> {(selectedNode.data.parameters as any)?.programId ? (selectedNode.data.parameters as any).programId.slice(0, 16) + '...' : 'Not set'}<br />
                                    <strong>Instruction:</strong> {(selectedNode.data.parameters as any)?.instructionData ? (selectedNode.data.parameters as any).instructionData.slice(0, 16) + '...' : 'Not set'}<br />
                                    <strong>Accounts:</strong> {((selectedNode.data.parameters as any)?.accounts || []).length}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : rightSidebarActiveTab === 'node' && selectedNode && isTransactionNode(selectedNode) ? (
                    /* Transaction Node Configuration */
                    <div className="space-y-6">
                        {/* Node Type Header */}
                        <div className="flex items-center gap-2 pb-2 border-b border-sidebar-border">
                            <div className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center">
                                {transactionNodeInfo?.icon}
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-sidebar-foreground">{transactionNodeInfo?.title}</h4>
                                <p className="text-xs text-sidebar-foreground/70">Transaction type: {transactionNodeInfo?.type}</p>
                            </div>
                        </div>

                        {/* Transaction Settings */}
                        <div>
                            <h4 className="text-sm font-medium text-sidebar-foreground mb-3">Transaction Settings</h4>
                            <div className="space-y-4 lg:space-y-3">
                                <div>
                                    <label className="block text-xs font-medium text-sidebar-foreground mb-1">Transaction Type</label>
                                    <select
                                        value={selectedNode.data.transactionType}
                                        onChange={(e) => handleTransactionTypeChange(e.target.value as TransactionType)}
                                        className="w-full bg-[#13131A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#460DF2] transition-colors"
                                    >
                                        <option value="SYSTEM_TRANSFER">Transfer SOL</option>
                                        <option value="SPL_TRANSFER">Transfer Token</option>
                                        <option value="SPL_MINT">Mint Token</option>
                                        <option value="CREATE_TOKEN">Create Token</option>
                                        <option value="MINT_TOKENS">Mint Tokens</option>
                                        <option value="CREATE_NFT_COLLECTION">Create NFT Collection</option>
                                        <option value="MINT_NFT">Mint NFT</option>
                                        <option value="BATCH_AIRDROP">Batch Airdrop</option>
                                    </select>
                                </div>

                                {renderTransactionParameterFields()}
                            </div>
                        </div>

                        {/* Transaction Preview */}
                        <div>
                            <h4 className="text-sm font-medium text-sidebar-foreground mb-3">Transaction Preview</h4>
                            <div className="p-3 bg-[#13131A] border border-white/5 rounded-lg backdrop-blur-sm">
                                <div className="text-xs text-gray-400">
                                    {selectedNode.data.transactionType === 'SYSTEM_TRANSFER' && (
                                        <div>
                                            <strong>Transfer SOL:</strong><br />
                                            To: {selectedNode.data.parameters?.recipientAddress || 'Not set'}<br />
                                            Amount: {selectedNode.data.parameters?.amount || 0} SOL
                                        </div>
                                    )}
                                    {selectedNode.data.transactionType === 'SPL_TRANSFER' && (
                                        <div>
                                            <strong>Transfer Token:</strong><br />
                                            Token: {selectedNode.data.parameters?.mintAddress || 'Not set'}<br />
                                            To: {selectedNode.data.parameters?.recipientAddress || 'Not set'}<br />
                                            Amount: {selectedNode.data.parameters?.amount || 0}
                                        </div>
                                    )}
                                    {selectedNode.data.transactionType === 'SPL_MINT' && (
                                        <div>
                                            <strong>Mint Token:</strong><br />
                                            Token: {selectedNode.data.parameters?.mintAddress || 'Not set'}<br />
                                            To: {selectedNode.data.parameters?.recipientAddress || 'Not set'}<br />
                                            Amount: {selectedNode.data.parameters?.amount || 0}<br />
                                            Decimals: {selectedNode.data.parameters?.decimals || 0}
                                        </div>
                                    )}
                                    {selectedNode.data.transactionType === 'CREATE_TOKEN' && (
                                        <div>
                                            <strong>Create Token:</strong><br />
                                            Name: {selectedNode.data.parameters?.name || 'Not set'}<br />
                                            Symbol: {selectedNode.data.parameters?.symbol || 'Not set'}<br />
                                            Supply: {selectedNode.data.parameters?.initialSupply || 0}<br />
                                            Decimals: {selectedNode.data.parameters?.decimals || 9}<br />
                                            To: {selectedNode.data.parameters?.recipientAddress || 'Not set'}
                                        </div>
                                    )}
                                    {selectedNode.data.transactionType === 'MINT_TOKENS' && (
                                        <div>
                                            <strong>Mint Tokens:</strong><br />
                                            Token: {selectedNode.data.parameters?.mintAddress || 'Not set'}<br />
                                            To: {selectedNode.data.parameters?.recipientAddress || 'Not set'}<br />
                                            Amount: {selectedNode.data.parameters?.amount || 0}<br />
                                            Decimals: {selectedNode.data.parameters?.decimals || 9}
                                        </div>
                                    )}
                                    {selectedNode.data.transactionType === 'CREATE_NFT_COLLECTION' && (
                                        <div>
                                            <strong>Create NFT Collection:</strong><br />
                                            Name: {selectedNode.data.parameters?.name || 'Not set'}<br />
                                            Symbol: {selectedNode.data.parameters?.symbol || 'Not set'}<br />
                                            Royalties: {selectedNode.data.parameters?.sellerFeeBasisPoints ? (selectedNode.data.parameters.sellerFeeBasisPoints / 100) + '%' : '5%'}
                                        </div>
                                    )}
                                    {selectedNode.data.transactionType === 'MINT_NFT' && (
                                        <div>
                                            <strong>Mint NFT:</strong><br />
                                            Collection: {selectedNode.data.parameters?.collectionAddress ? selectedNode.data.parameters.collectionAddress.slice(0, 16) + '...' : 'Not set'}<br />
                                            Name: {selectedNode.data.parameters?.name || 'Not set'}<br />
                                            To: {selectedNode.data.parameters?.recipientAddress ? selectedNode.data.parameters.recipientAddress.slice(0, 16) + '...' : 'Not set'}
                                        </div>
                                    )}
                                    {selectedNode.data.transactionType === 'BATCH_AIRDROP' && (
                                        <div>
                                            <strong>Batch Airdrop:</strong><br />
                                            Token: {selectedNode.data.parameters?.mintAddress ? selectedNode.data.parameters.mintAddress.slice(0, 16) + '...' : 'Not set'}<br />
                                            Recipients: {(selectedNode.data.parameters?.recipients || []).length}<br />
                                            Total: {(selectedNode.data.parameters?.recipients || []).reduce((sum: number, r: any) => sum + (r.amount || 0), 0).toLocaleString()} tokens
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : rightSidebarActiveTab === 'node' && selectedNode && isStartNode(selectedNode) ? (
                    /* Start Form Node Configuration */
                    <div className="space-y-6">
                        {/* Node Type Header */}
                        <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                            <div className="w-6 h-6 bg-indigo-400/10 rounded-lg flex items-center justify-center">
                                {startNodeInfo?.icon}
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-white">{startNodeInfo?.title}</h4>
                                <p className="text-xs text-gray-400">{startNodeInfo?.type}</p>
                            </div>
                        </div>

                        {/* Form Introduction Settings */}
                        <div>
                            <h4 className="text-sm font-medium text-white mb-3">Introduction Content</h4>
                            <div className="space-y-4">
                                {/* Title */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1">Form Title</label>
                                    <input
                                        type="text"
                                        value={selectedNode.data.title || ''}
                                        onChange={(e) => selectedNodeId && updateNode(selectedNodeId, { title: e.target.value })}
                                        className="w-full bg-[#13131A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#460DF2] transition-colors"
                                        placeholder="e.g., Make a Donation"
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1">Description</label>
                                    <textarea
                                        value={selectedNode.data.description || ''}
                                        onChange={(e) => selectedNodeId && updateNode(selectedNodeId, { description: e.target.value })}
                                        className="w-full bg-[#13131A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#460DF2] transition-colors"
                                        rows={3}
                                        placeholder="Brief description of your form..."
                                    />
                                </div>

                                {/* Image URL */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1">Image URL (Optional)</label>
                                    <input
                                        type="text"
                                        value={selectedNode.data.imageUrl || ''}
                                        onChange={(e) => selectedNodeId && updateNode(selectedNodeId, { imageUrl: e.target.value })}
                                        className="w-full bg-[#13131A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#460DF2] transition-colors"
                                        placeholder="https://example.com/image.png"
                                    />
                                    {selectedNode.data.imageUrl && (
                                        <div className="mt-2">
                                            <img
                                                src={selectedNode.data.imageUrl}
                                                alt="Preview"
                                                className="w-full h-20 object-cover rounded border border-white/10"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>
                    </div>
                ) : rightSidebarActiveTab === 'node' && selectedNode && isQuestionNode(selectedNode) ? (
                    /* Question Node Configuration */
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
                                                <option value="date">Date</option>
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
                                        <div>
                                            <label className="block text-xs font-medium text-sidebar-foreground mb-1">
                                                Parameter Name
                                                <span className="text-muted-foreground ml-1">(for use in transactions)</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={selectedNode.data.parameterName || ''}
                                                onChange={(e) => selectedNodeId && updateNode(selectedNodeId, { parameterName: e.target.value })}
                                                className="w-full px-3 py-3 lg:py-2 text-base lg:text-sm min-h-[44px] border border-input bg-background rounded-md text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                                                placeholder="e.g., recipientAddress, amount"
                                            />
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Use in transaction nodes as: <code className="bg-muted px-1 py-0.5 rounded">{'{{' + (selectedNode.data.parameterName || 'parameterName') + '}}'}</code>
                                            </p>
                                        </div>
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
                                        className="w-full px-3 py-3 lg:py-2 text-base lg:text-sm min-h-[44px] border border-dashed border-white/10 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all hover:border-[#460DF2]/30"
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
                    /* Empty fallback for when no specific node type matches */
                    rightSidebarActiveTab === 'node' && selectedNode && <div className="text-sm text-muted-foreground">Node configuration not available</div>
                )}
            </div>
        </div>
    )
}
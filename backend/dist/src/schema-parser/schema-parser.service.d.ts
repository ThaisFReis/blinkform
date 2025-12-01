export interface FormNode {
    id: string;
    type: string;
    data: any;
}
export interface FormEdge {
    id: string;
    source: string;
    target: string;
}
export interface FormSchema {
    nodes: FormNode[];
    edges: FormEdge[];
}
export interface ActionResponse {
    icon: string;
    title: string;
    description: string;
    label: string;
    links: {
        actions: Array<{
            label: string;
            href: string;
        }>;
    };
}
export declare class SchemaParserService {
    getCurrentNode(schema: FormSchema, currentNodeId: string): FormNode | null;
    getStartNode(schema: FormSchema): FormNode | null;
    getNextNode(schema: FormSchema, currentNodeId: string): FormNode | null;
    generateActionResponse(formTitle: string, currentNode: FormNode, nextNodeId?: string): ActionResponse;
    validateNodeInput(node: FormNode, input: any): boolean;
    processUserInput(schema: FormSchema, currentNodeId: string, userInput: any): {
        nextNodeId: string | null;
        isValid: boolean;
        error?: string;
    };
}

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaParserService = void 0;
const common_1 = require("@nestjs/common");
let SchemaParserService = class SchemaParserService {
    getCurrentNode(schema, currentNodeId) {
        return schema.nodes.find(node => node.id === currentNodeId) || null;
    }
    getStartNode(schema) {
        if (schema.nodes.length === 0)
            return null;
        return schema.nodes[0];
    }
    getNextNode(schema, currentNodeId) {
        const edge = schema.edges.find(edge => edge.source === currentNodeId);
        if (!edge)
            return null;
        return schema.nodes.find(node => node.id === edge.target) || null;
    }
    generateActionResponse(formTitle, currentNode, nextNodeId) {
        const baseResponse = {
            icon: 'https://blinkform.xyz/og/start.png',
            title: formTitle,
            description: `Question: ${currentNode.data.questionText || 'Complete the form'}`,
            label: 'Continue',
            links: {
                actions: []
            }
        };
        switch (currentNode.type) {
            case 'input':
                baseResponse.links.actions = [{
                        label: currentNode.data.questionText || 'Enter your response',
                        href: `/api/actions/${currentNode.id}?node=${currentNode.id}`
                    }];
                break;
            case 'choice':
                baseResponse.links.actions = (currentNode.data.options || []).map((option) => ({
                    label: option.label,
                    href: `/api/actions/${currentNode.id}?choice=${option.value}&next=${nextNodeId || 'end'}`
                }));
                break;
            case 'end':
                baseResponse.title = formTitle;
                baseResponse.description = currentNode.data.message || 'Thank you for your response!';
                baseResponse.label = 'Complete';
                baseResponse.links.actions = [{
                        label: 'Finish',
                        href: `/api/actions/complete`
                    }];
                break;
            default:
                baseResponse.links.actions = [{
                        label: 'Continue',
                        href: `/api/actions/${currentNode.id}?next=${nextNodeId || 'end'}`
                    }];
        }
        return baseResponse;
    }
    validateNodeInput(node, input) {
        if (!node.data.required)
            return true;
        switch (node.type) {
            case 'input':
                return input && input.trim().length > 0;
            case 'choice':
                return input && node.data.options?.some((opt) => opt.value === input);
            default:
                return true;
        }
    }
    processUserInput(schema, currentNodeId, userInput) {
        const currentNode = this.getCurrentNode(schema, currentNodeId);
        if (!currentNode) {
            return { nextNodeId: null, isValid: false, error: 'Node not found' };
        }
        const isValid = this.validateNodeInput(currentNode, userInput);
        if (!isValid) {
            return { nextNodeId: currentNodeId, isValid: false, error: 'Invalid input' };
        }
        const nextNode = this.getNextNode(schema, currentNodeId);
        const nextNodeId = nextNode ? nextNode.id : null;
        return { nextNodeId, isValid: true };
    }
};
exports.SchemaParserService = SchemaParserService;
exports.SchemaParserService = SchemaParserService = __decorate([
    (0, common_1.Injectable)()
], SchemaParserService);
//# sourceMappingURL=schema-parser.service.js.map
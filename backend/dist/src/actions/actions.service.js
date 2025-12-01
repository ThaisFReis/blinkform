"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const redis_service_1 = require("../redis/redis.service");
const schema_parser_service_1 = require("../schema-parser/schema-parser.service");
let ActionsService = class ActionsService {
    prisma;
    redis;
    schemaParser;
    constructor(prisma, redis, schemaParser) {
        this.prisma = prisma;
        this.redis = redis;
        this.schemaParser = schemaParser;
    }
    async getAction(formId, account) {
        const form = await this.prisma.form.findUnique({
            where: { id: formId },
        });
        if (!form) {
            throw new Error('Form not found');
        }
        let currentNodeId = 'start';
        if (account) {
            const sessionKey = `session:${formId}:${account}`;
            const session = await this.redis.get(sessionKey);
            if (session) {
                const sessionData = JSON.parse(session);
                currentNodeId = sessionData.current_node_id || 'start';
            }
        }
        const schema = form.schema;
        let currentNode = this.schemaParser.getCurrentNode(schema, currentNodeId);
        if (!currentNode) {
            currentNode = this.schemaParser.getStartNode(schema);
            if (currentNode) {
                currentNodeId = currentNode.id;
            }
        }
        if (!currentNode) {
            throw new Error('No valid node found in form schema');
        }
        const nextNode = this.schemaParser.getNextNode(schema, currentNodeId);
        return this.schemaParser.generateActionResponse(form.title, currentNode, nextNode?.id);
    }
    async postAction(formId, account, body) {
        const form = await this.prisma.form.findUnique({
            where: { id: formId },
        });
        if (!form) {
            throw new Error('Form not found');
        }
        const sessionKey = `session:${formId}:${account}`;
        const session = await this.redis.get(sessionKey);
        const sessionData = session ? JSON.parse(session) : { current_node_id: null, answers: {} };
        const schema = form.schema;
        let currentNodeId = sessionData.current_node_id;
        let currentNode = currentNodeId ? this.schemaParser.getCurrentNode(schema, currentNodeId) : null;
        if (!currentNode) {
            currentNode = this.schemaParser.getStartNode(schema);
            if (currentNode) {
                currentNodeId = currentNode.id;
                sessionData.current_node_id = currentNodeId;
            }
        }
        if (!currentNode) {
            throw new Error('No valid node found in form schema');
        }
        const userInput = body.input || body.choice || body;
        const result = this.schemaParser.processUserInput(schema, currentNodeId, userInput);
        if (!result.isValid) {
            return {
                type: 'error',
                message: result.error || 'Invalid input',
                links: {
                    actions: [{
                            label: 'Try Again',
                            href: `/api/actions/${formId}?account=${account}`
                        }]
                }
            };
        }
        sessionData.answers = sessionData.answers || {};
        sessionData.answers[currentNodeId] = userInput;
        if (result.nextNodeId) {
            sessionData.current_node_id = result.nextNodeId;
            await this.redis.set(sessionKey, JSON.stringify(sessionData), 3600);
            const nextNode = this.schemaParser.getCurrentNode(schema, result.nextNodeId);
            if (nextNode) {
                const nextNextNode = this.schemaParser.getNextNode(schema, result.nextNodeId);
                return this.schemaParser.generateActionResponse(form.title, nextNode, nextNextNode?.id);
            }
        }
        await this.prisma.submission.create({
            data: {
                formId: form.id,
                userAccount: account,
                answers: sessionData.answers,
            },
        });
        await this.redis.del(sessionKey);
        return {
            type: 'completed',
            icon: 'https://blinkform.xyz/og/complete.png',
            title: form.title,
            description: 'Thank you for completing the form!',
            label: 'Completed',
            links: {
                actions: [{
                        label: 'View Results',
                        href: `/api/forms/${formId}/results`
                    }]
            }
        };
    }
};
exports.ActionsService = ActionsService;
exports.ActionsService = ActionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        redis_service_1.RedisService,
        schema_parser_service_1.SchemaParserService])
], ActionsService);
//# sourceMappingURL=actions.service.js.map
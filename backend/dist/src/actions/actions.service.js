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
let ActionsService = class ActionsService {
    prisma;
    redis;
    constructor(prisma, redis) {
        this.prisma = prisma;
        this.redis = redis;
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
        return {
            icon: 'https://blinkform.xyz/og/start.png',
            title: form.title,
            description: `Step 1 of 3`,
            label: 'Start',
            links: {
                actions: [
                    {
                        label: 'Start',
                        href: `/api/actions/${formId}?next_node=question_1`,
                    },
                ],
            },
        };
    }
};
exports.ActionsService = ActionsService;
exports.ActionsService = ActionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        redis_service_1.RedisService])
], ActionsService);
//# sourceMappingURL=actions.service.js.map
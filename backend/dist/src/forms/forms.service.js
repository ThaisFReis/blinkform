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
exports.FormsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let FormsService = class FormsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createFormDto) {
        const form = await this.prisma.form.create({
            data: {
                creatorAddress: createFormDto.creatorAddress,
                title: createFormDto.title,
                description: createFormDto.description,
                schema: createFormDto.schema,
            },
        });
        return { id: form.id };
    }
    async findOne(id) {
        const form = await this.prisma.form.findUnique({
            where: { id },
        });
        if (!form) {
            throw new Error('Form not found');
        }
        return form;
    }
    async update(id, updateFormDto) {
        const form = await this.prisma.form.update({
            where: { id },
            data: updateFormDto,
        });
        return form;
    }
    async findAllByCreator(creatorAddress) {
        return this.prisma.form.findMany({
            where: { creatorAddress },
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.FormsService = FormsService;
exports.FormsService = FormsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FormsService);
//# sourceMappingURL=forms.service.js.map
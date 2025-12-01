"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_module_1 = require("./prisma/prisma.module");
const redis_module_1 = require("./redis/redis.module");
const actions_module_1 = require("./actions/actions.module");
const forms_controller_1 = require("./forms/forms.controller");
const forms_service_1 = require("./forms/forms.service");
const schema_parser_service_1 = require("./schema-parser/schema-parser.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot(),
            prisma_module_1.PrismaModule,
            redis_module_1.RedisModule,
            actions_module_1.ActionsModule,
        ],
        controllers: [app_controller_1.AppController, forms_controller_1.FormsController],
        providers: [app_service_1.AppService, forms_service_1.FormsService, schema_parser_service_1.SchemaParserService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map
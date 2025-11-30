"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrismaClientClass = getPrismaClientClass;
const runtime = __importStar(require("@prisma/client/runtime/client"));
const config = {
    "previewFeatures": [],
    "clientVersion": "7.0.1",
    "engineVersion": "f09f2815f091dbba658cdcd2264306d88bb5bda6",
    "activeProvider": "postgresql",
    "inlineSchema": "// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = \"prisma-client\"\n  output   = \"../src/generated\"\n}\n\ndatasource db {\n  provider = \"postgresql\"\n}\n\nmodel Form {\n  id             String       @id @default(dbgenerated(\"gen_random_uuid()\")) @db.Uuid\n  creatorAddress String       @map(\"creator_address\") @db.VarChar(44)\n  title          String       @db.Text\n  description    String?      @db.Text\n  schema         Json         @db.JsonB\n  isActive       Boolean      @default(true) @map(\"is_active\")\n  createdAt      DateTime     @default(now()) @map(\"created_at\") @db.Timestamptz\n  submissions    Submission[]\n}\n\nmodel Submission {\n  id                   String   @id @default(dbgenerated(\"gen_random_uuid()\")) @db.Uuid\n  formId               String   @map(\"form_id\") @db.Uuid\n  form                 Form     @relation(fields: [formId], references: [id])\n  userAccount          String   @map(\"user_account\") @db.VarChar(44)\n  answers              Json     @db.JsonB\n  transactionSignature String?  @map(\"transaction_signature\") @db.VarChar(88)\n  completedAt          DateTime @default(now()) @map(\"completed_at\") @db.Timestamptz\n}\n",
    "runtimeDataModel": {
        "models": {},
        "enums": {},
        "types": {}
    }
};
config.runtimeDataModel = JSON.parse("{\"models\":{\"Form\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"creatorAddress\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"creator_address\"},{\"name\":\"title\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"schema\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"isActive\",\"kind\":\"scalar\",\"type\":\"Boolean\",\"dbName\":\"is_active\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"},{\"name\":\"submissions\",\"kind\":\"object\",\"type\":\"Submission\",\"relationName\":\"FormToSubmission\"}],\"dbName\":null},\"Submission\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"formId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"form_id\"},{\"name\":\"form\",\"kind\":\"object\",\"type\":\"Form\",\"relationName\":\"FormToSubmission\"},{\"name\":\"userAccount\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"user_account\"},{\"name\":\"answers\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"transactionSignature\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"transaction_signature\"},{\"name\":\"completedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"completed_at\"}],\"dbName\":null}},\"enums\":{},\"types\":{}}");
async function decodeBase64AsWasm(wasmBase64) {
    const { Buffer } = await import('node:buffer');
    const wasmArray = Buffer.from(wasmBase64, 'base64');
    return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
    getRuntime: async () => await import("@prisma/client/runtime/query_compiler_bg.postgresql.mjs"),
    getQueryCompilerWasmModule: async () => {
        const { wasm } = await import("@prisma/client/runtime/query_compiler_bg.postgresql.wasm-base64.mjs");
        return await decodeBase64AsWasm(wasm);
    }
};
function getPrismaClientClass() {
    return runtime.getPrismaClient(config);
}
//# sourceMappingURL=class.js.map
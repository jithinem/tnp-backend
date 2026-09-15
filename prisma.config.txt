"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const node_path_1 = __importDefault(require("node:path"));
const config_1 = require("prisma/config");
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
    throw new Error('DATABASE_URL is not defined in .env');
}
exports.default = (0, config_1.defineConfig)({
    schema: node_path_1.default.join(process.cwd(), 'prisma'),
    datasource: {
        url: databaseUrl,
    },
});

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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharedService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const notification_templates_entity_1 = require("../../entities/notification-templates.entity");
const utils_1 = require("../../utils");
const typeorm_2 = require("typeorm");
const nodemailer_promise_1 = __importDefault(require("nodemailer-promise"));
let SharedService = class SharedService {
    constructor(configService, notificationTemplateRepository) {
        this.configService = configService;
        this.notificationTemplateRepository = notificationTemplateRepository;
        this.smtpConfig = this.configService.get('smtpConfig');
    }
    async sendEmail(email) {
        const sendMail = nodemailer_promise_1.default.config({
            host: this.smtpConfig.host,
            port: this.smtpConfig.port,
            secure: true,
            from: 'DY Travels <info@thecanadapathway.com>',
            auth: {
                user: this.smtpConfig.username,
                pass: this.smtpConfig.password,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });
        const notificationTemplate = await this.notificationTemplateRepository.findOne({
            where: {
                code: email.templateCode,
            },
        });
        if (!notificationTemplate)
            throw new common_1.NotFoundException(`Notification template: ${email.templateCode} does not exist`);
        email.html = email.data
            ? (0, utils_1.replacer)(0, Object.entries(email.data), notificationTemplate.body)
            : notificationTemplate.body;
        delete email.templateCode;
        if (!email.bcc)
            email.bcc = 'info@thecanadapathway.com';
        if (!email.from)
            email.from = 'TheCanadaPathway <info@thecanadapathway.com>';
        sendMail(email);
    }
};
SharedService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(notification_templates_entity_1.NotificationTemplates)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        typeorm_2.Repository])
], SharedService);
exports.SharedService = SharedService;
//# sourceMappingURL=shared.service.js.map
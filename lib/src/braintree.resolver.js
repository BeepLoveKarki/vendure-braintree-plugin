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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BraintreeResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const core_1 = require("@vendure/core");
const braintree_common_1 = require("./braintree-common");
const braintree_payment_method_1 = require("./braintree-payment-method");
const constants_1 = require("./constants");
let BraintreeResolver = class BraintreeResolver {
    constructor(connection, orderService) {
        this.connection = connection;
        this.orderService = orderService;
    }
    async generateBraintreeClientToken(ctx, { orderId }) {
        const order = await this.orderService.findOne(ctx, orderId);
        if (order && order.customer) {
            const customerId = order.customer.id.toString();
            const args = await this.getPaymentMethodArgs(ctx);
            const gateway = braintree_common_1.getGateway(args);
            try {
                const result = await gateway.clientToken.generate({
                    customerId,
                });
                return result.clientToken;
            }
            catch (e) {
                core_1.Logger.error(e);
            }
        }
        else {
            throw new core_1.InternalServerError(`[${constants_1.loggerCtx}] Could not find a Customer for the given Order`);
        }
    }
    async getPaymentMethodArgs(ctx) {
        const method = await this.connection.getRepository(ctx, core_1.PaymentMethod).findOne({
            where: {
                code: braintree_payment_method_1.braintreePaymentMethodHandler.code,
            },
        });
        if (!method) {
            throw new core_1.InternalServerError(`[${constants_1.loggerCtx}] Could not find Braintree PaymentMethod`);
        }
        return method.configArgs.reduce((hash, arg) => {
            return Object.assign(Object.assign({}, hash), { [arg.name]: arg.value });
        }, {});
    }
};
__decorate([
    graphql_1.Query(),
    __param(0, core_1.Ctx()), __param(1, graphql_1.Args()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [core_1.RequestContext, Object]),
    __metadata("design:returntype", Promise)
], BraintreeResolver.prototype, "generateBraintreeClientToken", null);
BraintreeResolver = __decorate([
    graphql_1.Resolver(),
    __metadata("design:paramtypes", [core_1.TransactionalConnection, core_1.OrderService])
], BraintreeResolver);
exports.BraintreeResolver = BraintreeResolver;
//# sourceMappingURL=braintree.resolver.js.map
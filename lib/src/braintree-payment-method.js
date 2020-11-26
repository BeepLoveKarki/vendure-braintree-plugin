"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.braintreePaymentMethodHandler = void 0;
const generated_types_1 = require("@vendure/common/lib/generated-types");
const core_1 = require("@vendure/core");
const braintree_common_1 = require("./braintree-common");
const constants_1 = require("./constants");
/**
 * The handler for Braintree payments.
 */
exports.braintreePaymentMethodHandler = new core_1.PaymentMethodHandler({
    code: 'braintree',
    description: [{ languageCode: generated_types_1.LanguageCode.en, value: 'Braintree' }],
    args: {
        merchantId: { type: 'string' },
        publicKey: { type: 'string' },
        privateKey: { type: 'string' },
    },
    async createPayment(ctx, order, args, metadata) {
        const gateway = braintree_common_1.getGateway(args);
        try {
            const response = await gateway.transaction.sale({
                amount: (order.total / 100).toString(10),
                orderId: order.code,
                paymentMethodNonce: metadata.nonce,
                options: {
                    submitForSettlement: true,
                },
            });
            if (!response.success) {
                return {
                    amount: order.total,
                    state: 'Declined',
                    transactionId: response.transaction.id,
                    errorMessage: response.message,
                    metadata: braintree_common_1.extractMetadataFromTransaction(response.transaction),
                };
            }
            return {
                amount: order.total,
                state: 'Settled',
                transactionId: response.transaction.id,
                metadata: braintree_common_1.extractMetadataFromTransaction(response.transaction),
            };
        }
        catch (e) {
            core_1.Logger.error(e, constants_1.loggerCtx);
            return {
                amount: order.total,
                state: 'Error',
                transactionId: '',
                errorMessage: e.toString(),
                metadata: e,
            };
        }
    },
    settlePayment() {
        return {
            success: true,
        };
    },
    async createRefund(ctx, input, total, order, payment, args) {
        const gateway = braintree_common_1.getGateway(args);
        const response = await gateway.transaction.refund(payment.transactionId, (total / 100).toString(10));
        if (!response.success) {
            return {
                state: 'Failed',
                transactionId: response.transaction.id,
                metadata: response,
            };
        }
        return {
            state: 'Settled',
            transactionId: response.transaction.id,
            metadata: response,
        };
    },
});
//# sourceMappingURL=braintree-payment-method.js.map
import { PaymentMethodHandler } from '@vendure/core';
/**
 * The handler for Braintree payments.
 */
export declare const braintreePaymentMethodHandler: PaymentMethodHandler<{
    merchantId: {
        type: "string";
    };
    publicKey: {
        type: "string";
    };
    privateKey: {
        type: "string";
    };
}>;

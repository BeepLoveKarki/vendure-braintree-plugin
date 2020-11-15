"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractMetadataFromTransaction = exports.getGateway = void 0;
const braintree_1 = require("braintree");
function getGateway(args) {
    return new braintree_1.BraintreeGateway({
        environment: braintree_1.Environment.Sandbox,
        merchantId: args.merchantId,
        privateKey: args.privateKey,
        publicKey: args.publicKey,
    });
}
exports.getGateway = getGateway;
/**
 * Returns a subset of the Transaction object of interest to the Administrator.
 */
function extractMetadataFromTransaction(transaction) {
    const metadata = {
        status: transaction.status,
        currencyIsoCode: transaction.currencyIsoCode,
        merchantAccountId: transaction.merchantAccountId,
        cvvCheck: decodeAvsCode(transaction.cvvResponseCode),
        avsPostCodeCheck: decodeAvsCode(transaction.avsPostalCodeResponseCode),
        avsStreetAddressCheck: decodeAvsCode(transaction.avsStreetAddressResponseCode),
        processorAuthorizationCode: transaction.processorAuthorizationCode,
        processorResponseText: transaction.processorResponseText,
        paymentMethod: transaction.paymentInstrumentType,
    };
    if (transaction.creditCard && transaction.creditCard.cardType) {
        metadata.cardData = {
            cardType: transaction.creditCard.cardType,
            last4: transaction.creditCard.last4,
            expirationDate: transaction.creditCard.expirationDate,
        };
    }
    if (transaction.paypalAccount && transaction.paypalAccount.authorizationId) {
        metadata.paypalData = {
            payerEmail: transaction.paypalAccount.payerEmail,
            paymentId: transaction.paypalAccount.paymentId,
            authorizationId: transaction.paypalAccount.authorizationId,
            payerStatus: transaction.paypalAccount.payerStatus,
            sellerProtectionStatus: transaction.paypalAccount.sellerProtectionStatus,
            transactionFeeAmount: transaction.paypalAccount.transactionFeeAmount,
        };
    }
    return metadata;
}
exports.extractMetadataFromTransaction = extractMetadataFromTransaction;
function decodeAvsCode(code) {
    switch (code) {
        case 'I':
            return 'Not Provided';
        case 'M':
            return 'Matched';
        case 'N':
            return 'Not Matched';
        case 'U':
            return 'Not Verified';
        case 'S':
            return 'Not Supported';
        case 'E':
            return 'AVS System Error';
        case 'A':
            return 'Not Applicable';
        case 'B':
            return 'Skipped';
        default:
            return 'Unknown';
    }
}
//# sourceMappingURL=braintree-common.js.map
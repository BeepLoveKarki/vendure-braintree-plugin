import { BraintreeGateway, Transaction } from 'braintree';
import { PaymentMethodArgsHash } from './types';
export declare function getGateway(args: PaymentMethodArgsHash): BraintreeGateway;
/**
 * Returns a subset of the Transaction object of interest to the Administrator.
 */
export declare function extractMetadataFromTransaction(transaction: Transaction): {
    [key: string]: any;
};

import { ID, OrderService, RequestContext, TransactionalConnection } from '@vendure/core';
export declare class BraintreeResolver {
    private connection;
    private orderService;
    constructor(connection: TransactionalConnection, orderService: OrderService);
    generateBraintreeClientToken(ctx: RequestContext, { orderId }: {
        orderId: ID;
    }): Promise<string | undefined>;
    private getPaymentMethodArgs;
}

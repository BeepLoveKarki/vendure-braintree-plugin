"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BraintreePlugin = void 0;
const core_1 = require("@vendure/core");
const apollo_server_core_1 = require("apollo-server-core");
const braintree_payment_method_1 = require("./braintree-payment-method");
const braintree_resolver_1 = require("./braintree.resolver");
/**
 * This plugin implements the Braintree (https://www.braintreepayments.com/) payment provider.
 */
let BraintreePlugin = class BraintreePlugin {
};
BraintreePlugin = __decorate([
    core_1.VendurePlugin({
        imports: [core_1.PluginCommonModule],
        providers: [],
        configuration: config => {
            config.paymentOptions.paymentMethodHandlers.push(braintree_payment_method_1.braintreePaymentMethodHandler);
            return config;
        },
        shopApiExtensions: {
            schema: apollo_server_core_1.gql `
            extend type Query {
                generateBraintreeClientToken(orderId: ID!): String!
            }
        `,
            resolvers: [braintree_resolver_1.BraintreeResolver],
        },
    })
], BraintreePlugin);
exports.BraintreePlugin = BraintreePlugin;
//# sourceMappingURL=braintree-plugin.js.map
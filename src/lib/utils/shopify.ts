import {createStorefrontApiClient} from '@shopify/storefront-api-client';

export const client = createStorefrontApiClient({
  storeDomain: 'http://locdessence.myshopify.com',
  apiVersion: '2025-04',
  publicAccessToken: 'a29870b8468ea9adc97dd07b0bbad120',
});
import "server-only";

export interface CheckoutRequest {
  priceId: string;
  memberId: string;
  successUrl: string;
  cancelUrl: string;
}

/**
 * Implemented with Stripe Checkout in the memberships and class passes use
 * cases. Order state comes from the verified webhook, never from the redirect.
 */
export interface PaymentService {
  createCheckout(request: CheckoutRequest): Promise<{ url: string }>;
}

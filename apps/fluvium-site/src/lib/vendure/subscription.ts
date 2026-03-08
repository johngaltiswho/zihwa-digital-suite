import { vendureClient } from './client';

type SubscriptionTier = 'FREE' | 'BASIC' | 'PREMIUM';
type SubscriptionStatus = 'ACTIVE' | 'EXPIRED' | 'CANCELLED';

export interface SubscriptionInfo {
  isActive: boolean;
  tier: SubscriptionTier;
  expiresAt: Date | null;
  status: SubscriptionStatus;
}

const GET_CUSTOMER_ORDERS = `
  query GetCustomerOrders($customerId: ID!) {
    customer(id: $customerId) {
      id
      orders(options: {
        filter: {
          state: { eq: "PaymentSettled" }
        }
        sort: { createdAt: DESC }
      }) {
        items {
          id
          code
          createdAt
          lines {
            id
            productVariant {
              id
              name
              product {
                id
                name
                customFields
              }
            }
          }
        }
      }
    }
  }
`;

/**
 * Check if a customer has an active Humility DB subscription
 * @param customerId - Vendure customer ID
 * @returns Subscription info including tier, status, and expiration
 */
interface CustomerOrdersResponse {
  customer: {
    id: string;
    orders: {
      items: Array<{
        id: string;
        code: string;
        createdAt: string;
        lines: Array<{
          id: string;
          productVariant: {
            id: string;
            name: string;
            product: {
              id: string;
              name: string;
              customFields?: {
                subscriptionTier?: string;
                subscriptionDuration?: number;
              };
            };
          };
        }>;
      }>;
    };
  } | null;
}

export async function checkSubscription(
  customerId: string,
  headers?: Record<string, string>
): Promise<SubscriptionInfo> {
  try {
    // Query Vendure for customer orders
    const data = (await vendureClient.request(
      GET_CUSTOMER_ORDERS,
      { customerId },
      headers
    )) as CustomerOrdersResponse;

    if (!data.customer || !data.customer.orders || data.customer.orders.items.length === 0) {
      return {
        isActive: false,
        tier: 'FREE',
        expiresAt: null,
        status: 'EXPIRED',
      };
    }

    // Find the latest membership order
    const orders = data.customer.orders.items;

    for (const order of orders) {
      for (const line of order.lines) {
        const product = line.productVariant.product;
        const customFields = product.customFields;

        // Check if this is a Humility DB membership product
        if (customFields?.subscriptionTier) {
          const tier = customFields.subscriptionTier as SubscriptionTier;
          const duration = customFields.subscriptionDuration || 30; // days

          // Calculate expiration
          const orderDate = new Date(order.createdAt);
          const expiresAt = new Date(orderDate);
          expiresAt.setDate(expiresAt.getDate() + duration);

          // Check if still active
          const now = new Date();
          const isActive = now < expiresAt;

          return {
            isActive,
            tier,
            expiresAt,
            status: isActive ? 'ACTIVE' : 'EXPIRED',
          };
        }
      }
    }

    // No membership product found
    return {
      isActive: false,
      tier: 'FREE',
      expiresAt: null,
      status: 'EXPIRED',
    };
  } catch (error) {
    console.error('Error checking subscription:', error);
    // Return FREE tier on error
    return {
      isActive: false,
      tier: 'FREE',
      expiresAt: null,
      status: 'EXPIRED',
    };
  }
}

/**
 * Check if a subscription tier allows a specific feature
 * @param tier - Subscription tier
 * @param feature - Feature name
 * @returns Whether the feature is allowed
 */
export function hasFeatureAccess(tier: SubscriptionTier, feature: string): boolean {
  const featuresByTier: Record<SubscriptionTier, string[]> = {
    FREE: ['techniques_view', 'reflections'],
    BASIC: ['techniques_view', 'reflections', 'copilot', 'video_upload_limited', 'progress_tracking'],
    PREMIUM: [
      'techniques_view',
      'reflections',
      'copilot',
      'video_upload_unlimited',
      'video_analysis',
      'progress_tracking',
      'training_plans',
    ],
  };

  return featuresByTier[tier]?.includes(feature) || false;
}

/**
 * Get the upload limit for a subscription tier
 * @param tier - Subscription tier
 * @returns Number of videos allowed per month
 */
export function getVideoUploadLimit(tier: SubscriptionTier): number {
  const limits: Record<SubscriptionTier, number> = {
    FREE: 1, // 1 video per month
    BASIC: 3, // 3 videos per month
    PREMIUM: -1, // Unlimited (-1)
  };

  return limits[tier] || 0;
}

/**
 * Get the copilot message limit for a subscription tier
 * @param tier - Subscription tier
 * @returns Number of messages allowed per day
 */
export function getCopilotMessageLimit(tier: SubscriptionTier): number {
  const limits: Record<SubscriptionTier, number> = {
    FREE: 5, // 5 messages per day
    BASIC: -1, // Unlimited
    PREMIUM: -1, // Unlimited
  };

  return limits[tier] || 0;
}

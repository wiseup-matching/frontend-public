import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { Badge } from '../../components/ui/badge';
import { Loader2 } from 'lucide-react';
import { useStartup } from '@/hooks/useStartup';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import ProtectedRoute from '@/components/custom/ProtectedRoute';

type SubscriptionTier = 'free' | 'silver' | 'gold';
type BillingCycle = 'yearly' | 'monthly';

interface SubscriptionData {
  tier: SubscriptionTier;
  cycle: BillingCycle;
  priceId: string | null;
  stripeSubscriptionExpiryDate: Date | null;
  connectionBalance: number;
  connectionAllowance: number;
}

const PLANS = {
  free: {
    name: 'Free',
    yearlyPrice: 0,
    monthlyPrice: 0,
    connectionsPerMonth: 1,
    monthPriceId: 'price_1Reh7MFQr2Nl7IwIQ3JMXnvU',
    yearPriceId: 'price_1Reh7MFQr2Nl7IwIQ3JMXnvU',
    color: 'blue',
    bgColor: 'bg-tier-free/60',
    buttonColor:
      'bg-white hover:bg-secondary text-primary border-primary hover:border-primary hover:text-primary',
  },
  silver: {
    name: 'Silver',
    yearlyPrice: 700,
    monthlyPrice: 70,
    connectionsPerMonth: 10,
    monthPriceId: 'price_1RfLGoFQr2Nl7IwILNAVc59H',
    yearPriceId: 'price_1Reh7KFQr2Nl7IwILuBNdAyt',
    color: 'silver',
    bgColor: 'bg-tier-silver/60',
    buttonColor:
      'bg-white hover:bg-secondary text-primary border-primary hover:border-primary hover:text-primary',
  },
  gold: {
    name: 'Gold',
    yearlyPrice: 1000,
    monthlyPrice: 100,
    connectionsPerMonth: 30,
    monthPriceId: 'price_1RfLHnFQr2Nl7IwIOQ1GJow5',
    yearPriceId: 'price_1Reh7LFQr2Nl7IwIXaH0P1BE',
    color: 'gold',
    bgColor: 'bg-tier-gold/60',
    buttonColor:
      'bg-white hover:bg-secondary text-primary border-primary hover:border-primary hover:text-primary',
    hasDiscount: true,
  },
};

// Add connection product price ID
const ADDITIONAL_CONNECTIONS_PRICE_ID = 'price_1RedsbFQr2Nl7IwIzyeqa4CB';
const CONNECTION_BUNDLE_SIZE = 5;
const CONNECTION_BUNDLE_PRICE = 50;

// Helper to determine subscription details from a price ID
const getSubscriptionDetailsFromPriceId = (
  priceId: string | null,
): { tier: SubscriptionTier; cycle: BillingCycle } => {
  if (!priceId) return { tier: 'free', cycle: 'monthly' };

  // Check each plan to find matching price ID
  for (const [tierKey, tierData] of Object.entries(PLANS)) {
    if (tierData.monthPriceId === priceId) {
      return { tier: tierKey as SubscriptionTier, cycle: 'monthly' };
    }
    if (tierData.yearPriceId === priceId) {
      return { tier: tierKey as SubscriptionTier, cycle: 'yearly' };
    }
  }

  // Default if no match found
  return { tier: 'free', cycle: 'monthly' };
};

//helper to get allowances for each tier
const getTierAllowance = (tier: SubscriptionTier) => {
  switch (tier) {
    case 'free':
      return { connections: PLANS.free.connectionsPerMonth };
    case 'silver':
      return { connections: PLANS.silver.connectionsPerMonth };
    case 'gold':
      return { connections: PLANS.gold.connectionsPerMonth };
  }
};

const Paywall = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly'); // Default to monthly
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [connectionCount, setConnectionCount] = useState(5);
  const [isNewStartup, setIsNewStartup] = useState(false);

  //get current user id from auth
  const { user } = useAuth();

  // get startup from user id
  const {
    startup,
    loading: startupLoading,
    refreshStartup,
  } = useStartup(user?.userType === 'Startup' ? user.id : undefined);

  // Initialize subscription data based on startup information
  const [subscription, setSubscription] = useState<SubscriptionData>({
    tier: 'free',
    cycle: 'monthly',
    priceId: null,
    stripeSubscriptionExpiryDate: null,
    connectionBalance: 0,
    connectionAllowance: 1,
  });

  //fetch the subscription data on component mount
  useEffect(() => {
    const fetchSubscription = () => {
      try {
        setIsLoading(true);
        setError(null);

        // Initialize with startup data if available
        if (startup) {
          // Simply check if the subscription tier is null to determine if it's a new startup
          setIsNewStartup(startup.wiseUpSubscriptionTier == null); // null or undefined

          const currentTier = (startup.wiseUpSubscriptionTier ?? 'free') as SubscriptionTier;

          // Determine cycle and tier based on price ID if available
          const currentPriceId = startup.stripePriceId ?? null;
          const { tier: detectedTier, cycle: detectedCycle } =
            getSubscriptionDetailsFromPriceId(currentPriceId);

          // Use detected values if we have a price ID, otherwise use defaults
          const finalTier = currentPriceId ? detectedTier : currentTier;
          const finalCycle = currentPriceId ? detectedCycle : 'monthly';

          // Set the billing cycle to match the user's current subscription
          setBillingCycle(finalCycle);

          setSubscription({
            tier: finalTier,
            cycle: finalCycle,
            priceId: currentPriceId,
            stripeSubscriptionExpiryDate: startup.stripeSubscriptionExpiryDate
              ? new Date(startup.stripeSubscriptionExpiryDate)
              : null,
            connectionBalance: startup.monthlyConnectionBalance ?? 0,
            connectionAllowance: getTierAllowance(finalTier).connections,
          });
        }
      } catch (err) {
        setError('Failed to load subscription data. Please try again.');
        console.error('Error fetching subscription:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (!startupLoading && startup) {
      fetchSubscription();
    }
  }, [startup, startupLoading]);

  // Create Stripe Checkout Session then redirect
  const handleCheckout = async (tier: SubscriptionTier) => {
    if (!startup) return;

    const priceId = billingCycle === 'yearly' ? PLANS[tier].yearPriceId : PLANS[tier].monthPriceId;

    setCheckoutLoading(tier);

    try {
      const { data } = await axios.post<{ url: string }>('/api/v1/stripe/create-checkout-session', {
        priceId,
        customer_email: startup.email,
        wiseUpUserId: startup.id,
      });

      if (data.url) {
        window.location.href = data.url; // Redirect to Stripe Checkout
      }
    } catch (err) {
      setError('Failed to create checkout session. Please try again.');
      console.error('Error creating checkout:', err);
    } finally {
      setCheckoutLoading(null);
    }
  };

  // Open Billing Portal for existing customers
  const handlePortal = async () => {
    if (!startup?.stripeCustomerId) {
      setError('No subscription found. Please subscribe to a plan first.');
      return;
    }

    setPortalLoading(true);

    try {
      const { data } = await axios.post<{ url: string }>('/api/v1/stripe/billing-portal', {
        stripeCustomerId: startup.stripeCustomerId,
      });

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setError('Failed to open billing portal. Please try again.');
      console.error('Error opening portal:', err);
    } finally {
      setPortalLoading(false);
    }
  };

  //handle subscription plan change
  const handleSubscriptionChange = async (newTier: SubscriptionTier) => {
    // Get the target price ID based on current billing cycle
    const targetPriceId =
      billingCycle === 'yearly' ? PLANS[newTier].yearPriceId : PLANS[newTier].monthPriceId;

    // Only exit early if we're already on this exact plan (same tier AND same billing cycle)
    if (subscription.tier === newTier && subscription.priceId === targetPriceId) {
      return; // Already on this exact plan
    }

    setIsProcessingPayment(true);

    try {
      // If user already has a subscription, open the billing portal
      if (startup?.stripeCustomerId) {
        await handlePortal();
      } else {
        // Otherwise create a new checkout session
        await handleCheckout(newTier);
      }
    } catch (error) {
      console.error('Error processing subscription change:', error);
      setError('Failed to process payment. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Specialized checkout function for additional connections
  const handleConnectionsCheckout = async () => {
    if (!startup) return;

    if (!isCurrentPlan('gold')) {
      setError('You need to have a Gold plan to purchase additional connections.');
      return;
    }

    setCheckoutLoading('connections');

    try {
      // Calculate number of bundles
      const bundleCount = calculateBundles();

      const { data } = await axios.post<{ url: string }>('/api/v1/stripe/create-checkout-session', {
        priceId: ADDITIONAL_CONNECTIONS_PRICE_ID,
        customer_email: startup.email,
        wiseUpUserId: startup.id,
        quantity: bundleCount, // Send number of bundles, not connections
      });

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setError('Failed to create checkout session. Please try again.');
      console.error('Error creating checkout:', err);
    } finally {
      setCheckoutLoading(null);
    }
  };

  // Increment connection count by 5
  const incrementConnectionCount = () => {
    setConnectionCount((prev) => Math.min(prev + CONNECTION_BUNDLE_SIZE, 50)); // Max 50 connections (10 bundles)
  };

  // Decrement connection count by 5
  const decrementConnectionCount = () => {
    setConnectionCount((prev) => Math.max(prev - CONNECTION_BUNDLE_SIZE, 5)); // Min 5 connections (1 bundle)
  };

  // Calculate number of bundles
  const calculateBundles = () => {
    return connectionCount / CONNECTION_BUNDLE_SIZE;
  };

  //calculate prices based on billing cycle monthyl or yearly
  const getPriceDisplay = (yearlyPrice: number, monthlyPrice: number) => {
    if (billingCycle === 'yearly') {
      return {
        price: yearlyPrice,
        cycle: '/year',
        display: '€' + yearlyPrice.toString(),
      };
    } else {
      return {
        price: monthlyPrice,
        cycle: '/month',
        display: '€' + monthlyPrice.toString(),
      };
    }
  };

  //check if current plan - compares both tier and billing cycle for paid plans
  const isCurrentPlan = (tier: SubscriptionTier): boolean => {
    if (isNewStartup) return false;

    // For free plan, just check the tier
    if (tier === 'free') {
      return subscription.tier === 'free';
    }

    // For paid plans, check both tier and cycle
    return (
      subscription.tier === tier &&
      ((billingCycle === 'monthly' && subscription.priceId === PLANS[tier].monthPriceId) ||
        (billingCycle === 'yearly' && subscription.priceId === PLANS[tier].yearPriceId))
    );
  };

  // Check if this is exactly the user's current subscription (regardless of displayed billing cycle)
  const isExactCurrentPlan = (tier: SubscriptionTier, cycle: BillingCycle): boolean => {
    if (isNewStartup) return false;

    if (tier === 'free') {
      return subscription.tier === 'free';
    }

    const planPriceId = cycle === 'monthly' ? PLANS[tier].monthPriceId : PLANS[tier].yearPriceId;
    return subscription.priceId === planPriceId;
  };

  // Check if URL has session_id parameter after returning from Checkout
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('session_id')) {
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname);
      // Refresh startup data to get updated subscription
      void refreshStartup();
    }
  }, [refreshStartup]);

  // Check if user has any Gold subscription (regardless of billing cycle)
  const hasGoldSubscription = (): boolean => {
    if (isNewStartup) return false;

    // Check if tier is gold and priceId matches either monthly or yearly gold plan
    return (
      subscription.tier === 'gold' &&
      (subscription.priceId === PLANS.gold.monthPriceId ||
        subscription.priceId === PLANS.gold.yearPriceId)
    );
  };

  if (isLoading || startupLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-6 h-[600px]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-gray-600">Loading subscription details...</p>
      </div>
    );
  }

  return (
    <ProtectedRoute requiredUserType="Startup">
      <Helmet>
        <title>Choose Subscription Plan</title>
        <meta
          name="description"
          content="Choose the perfect WiseUp subscription plan to unlock more connections with retirees."
        />
      </Helmet>
      <div className="flex flex-col items-center justify-center p-6 max-w-6xl mx-auto mt-8 mb-16">
        <div className="text-center mb-10 w-full">
          <h1 className="text-3xl font-bold mb-3 text-primary">
            {isNewStartup ? 'Choose Your First Subscription Plan' : 'Choose Your Subscription Plan'}
          </h1>
          <h2 className="text-xl text-gray-800 mb-4">
            {isNewStartup ? '' : 'Upgrade to unlock more connections with retirees'}
          </h2>

          {/* Summary Subscription status - only show for existing subscriptions */}
          {startup && !isNewStartup && (
            <div className="mt-4 p-5 bg-tier-free/50 rounded-lg inline-block shadow-sm">
              <p className="flex flex-wrap items-center justify-center gap-3">
                <span>
                  Current Plan:{' '}
                  <span className="text-primary font-medium">{PLANS[subscription.tier].name}</span>
                </span>
                <span className="hidden md:inline text-gray-400">•</span>
                <span>
                  Connections:{' '}
                  <span className="text-primary font-medium">
                    {startup.monthlyConnectionBalance ?? subscription.connectionBalance}/
                    {subscription.connectionAllowance}
                  </span>
                </span>
                {(startup.permanentConnectionBalance ?? 0) > 0 && (
                  <>
                    <span className="hidden md:inline text-gray-400">•</span>
                    <span>
                      Additional Connections:{' '}
                      <span className="text-primary font-medium">
                        {startup.permanentConnectionBalance}
                      </span>
                    </span>
                  </>
                )}
                {subscription.stripeSubscriptionExpiryDate && (
                  <>
                    <span className="hidden md:inline text-gray-400">•</span>
                    <span>
                      Renews:{' '}
                      <span className="text-primary font-medium">
                        {subscription.stripeSubscriptionExpiryDate.toLocaleDateString()}
                      </span>
                    </span>
                  </>
                )}
              </p>
            </div>
          )}

          {/* For new startups, show a welcome message */}
          {isNewStartup && (
            <div className="mt-4 p-5 bg-tier-free/50 rounded-lg inline-block shadow-sm">
              <p className="text-gray-700">
                Welcome! To start connecting with retirees, please select a subscription plan below.
              </p>
            </div>
          )}

          {error && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>}
        </div>

        {/* Billing cycle selector */}
        <div className="mb-10">
          <RadioGroup
            className="flex bg-background rounded-full shadow-sm"
            defaultValue="yearly"
            onValueChange={(value) => setBillingCycle(value as BillingCycle)}
            value={billingCycle}
          >
            <div className="relative flex space-x-1">
              <RadioGroupItem value="yearly" id="yearly" className="sr-only" />
              <label
                htmlFor="yearly"
                className={`px-10 py-3 rounded-full cursor-pointer flex items-center transition-all font-medium ${
                  billingCycle === 'yearly'
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <span>Yearly</span>
                <Badge className="bg-white text-primary ml-2 h-6 w-6 flex items-center justify-center rounded-full">
                  %
                </Badge>
              </label>

              <RadioGroupItem value="monthly" id="monthly" className="sr-only" />
              <label
                htmlFor="monthly"
                className={`px-10 py-3 rounded-full cursor-pointer flex items-center transition-all font-medium ${
                  billingCycle === 'monthly'
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Monthly
              </label>
            </div>
          </RadioGroup>
        </div>

        {/* Subscription plan cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
          {/* Free Plan */}
          <Card
            className={`p-0 border rounded-xl shadow-sm flex flex-col overflow-hidden transform transition hover:scale-102 duration-250 ${
              isCurrentPlan('free') ? 'border-primary border-2' : ''
            }`}
          >
            <div className={`p-6 ${PLANS.free.bgColor}`}>
              <h3 className="text-2xl font-semibold mb-2 text-primary">{PLANS.free.name}</h3>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold">€0</span>
                <span className="text-gray-800 ml-1">
                  {billingCycle === 'yearly' ? '/year' : '/month'}
                </span>
              </div>
            </div>
            <div className="p-6 bg-white flex-grow">
              <ul className="list-disc pl-6 space-y-3 text-gray-700">
                <li>{PLANS.free.connectionsPerMonth} connection per month</li>
                <li>Community support</li>
              </ul>
            </div>
            <div className="px-6 pb-6 bg-white">
              {!isCurrentPlan('free') ? (
                <Button
                  className={`mt-4 w-full ${PLANS.free.buttonColor}`}
                  onClick={() => {
                    void handleSubscriptionChange('free');
                  }}
                  disabled={isProcessingPayment || checkoutLoading !== null || portalLoading}
                >
                  {isNewStartup ? 'Choose Free' : 'Switch now'}
                </Button>
              ) : (
                <div className="mt-4 w-full text-center py-2 bg-tier-free/50 rounded-lg border border-primary text-sm font-medium text-gray-800">
                  Current Plan
                </div>
              )}
            </div>
          </Card>

          {/* Silver Plan */}
          <Card
            className={`p-0 border rounded-xl shadow-sm flex flex-col overflow-hidden transform transition hover:scale-102 duration-250 ${
              isExactCurrentPlan('silver', billingCycle) ? 'border-primary border-2' : ''
            }`}
          >
            <div className={`p-6 ${PLANS.silver.bgColor}`}>
              <h3 className="text-2xl font-semibold mb-2 text-primary">{PLANS.silver.name}</h3>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold">
                  {billingCycle === 'yearly'
                    ? getPriceDisplay(PLANS.silver.yearlyPrice, 0).display
                    : getPriceDisplay(0, PLANS.silver.monthlyPrice).display}
                </span>
                <span className="text-gray-800 ml-1">
                  {billingCycle === 'yearly' ? '/year' : '/month'}
                </span>
              </div>
            </div>
            <div className="p-6 bg-white flex-grow">
              <ul className="list-disc pl-6 space-y-3 text-gray-700">
                <li>{PLANS.silver.connectionsPerMonth} connections per month</li>
                <li>Highlighted job postings</li>
                <li>Standard support</li>
                {billingCycle === 'yearly' && <li>Save with yearly billing</li>}
              </ul>
            </div>
            <div className="px-6 pb-6 bg-white">
              {!isExactCurrentPlan('silver', billingCycle) ? (
                <Button
                  className={`mt-4 w-full ${PLANS.silver.buttonColor}`}
                  onClick={() => {
                    void handleSubscriptionChange('silver');
                  }}
                  disabled={isProcessingPayment || checkoutLoading !== null || portalLoading}
                >
                  {isNewStartup ? 'Choose Silver' : 'Switch now'}
                </Button>
              ) : (
                <div className="mt-4 w-full text-center py-2 bg-tier-silver/50 rounded-lg border border-tier-silver text-sm font-medium text-gray-800">
                  Current plan
                </div>
              )}
            </div>
          </Card>

          {/* Gold Plan */}
          <Card
            className={`p-0 border rounded-xl shadow-sm flex flex-col overflow-hidden transform transition hover:scale-102 duration-250 ${
              isExactCurrentPlan('gold', billingCycle) ? 'border-primary border-2' : ''
            }`}
          >
            <div className={`p-6 ${PLANS.gold.bgColor} relative`}>
              <h3 className="text-2xl font-semibold mb-2 text-primary">{PLANS.gold.name}</h3>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold">
                  {billingCycle === 'yearly'
                    ? getPriceDisplay(PLANS.gold.yearlyPrice, 0).display
                    : getPriceDisplay(0, PLANS.gold.monthlyPrice).display}
                </span>
                <span className="text-gray-800 ml-1">
                  {billingCycle === 'yearly' ? '/year' : '/month'}
                </span>
              </div>
            </div>
            <div className="p-6 bg-white flex-grow">
              <ul className="list-disc pl-6 space-y-3 text-gray-700">
                <li>{PLANS.gold.connectionsPerMonth} connections per month</li>
                <li>Highlighted job postings</li>
                <li>Priority support</li>
                {billingCycle === 'yearly' && <li>Save with yearly billing</li>}
              </ul>
            </div>
            <div className="px-6 pb-6 bg-white">
              {!isExactCurrentPlan('gold', billingCycle) ? (
                <Button
                  className={`mt-4 w-full ${PLANS.gold.buttonColor}`}
                  onClick={() => {
                    void handleSubscriptionChange('gold');
                  }}
                  disabled={isProcessingPayment || checkoutLoading !== null || portalLoading}
                >
                  {isNewStartup ? 'Choose Gold' : 'Switch now'}
                </Button>
              ) : (
                <div className="mt-4 w-full text-center py-2 bg-tier-gold/50 rounded-lg border border-tier-gold text-sm font-medium text-gray-800">
                  Current plan
                </div>
              )}
            </div>
          </Card>

          {/* Add Connections */}
          <Card
            className={`p-0 border rounded-xl shadow-sm flex flex-col overflow-hidden transform transition hover:scale-102 duration-250 ${
              hasGoldSubscription() ? '' : 'opacity-60'
            }`}
          >
            <div className="p-6 bg-tier-free/30">
              <h3 className="text-2xl font-semibold mb-2 text-primary">Add Connections</h3>
              <div className="text-sm text-gray-800 mb-4">Add-On • Gold plan exclusive</div>
            </div>
            <div className="p-6 bg-white flex-grow">
              <ul className="list-disc pl-6 space-y-3 text-gray-800">
                <li className={hasGoldSubscription() ? '' : 'text-gray-400'}>
                  Purchase connections in bundles of 5
                </li>
                <li className={hasGoldSubscription() ? '' : 'text-gray-400'}>
                  Requires active Gold plan
                </li>
                <li className={hasGoldSubscription() ? '' : 'text-gray-400'}>
                  Permanent connections (don't expire)
                </li>
              </ul>

              {/* Quantity selector */}
              {hasGoldSubscription() && (
                <div className="mt-6">
                  <p className="mb-3 font-medium text-gray-700 text-center">
                    How many connections?
                  </p>
                  <div className="flex items-center justify-center space-x-4">
                    <button
                      type="button"
                      onClick={decrementConnectionCount}
                      disabled={connectionCount <= 5}
                      className="cursor-pointer w-10 h-10 rounded-full flex items-center justify-center bg-tier-free text-primary hover:bg-[#dbd6ff] disabled:opacity-40 disabled:hover:bg-tier-free transition-colors"
                      aria-label="Decrease connection count by 5"
                    >
                      -5
                    </button>
                    <div className="px-4 py-2 font-medium text-center">
                      <span className="text-xl block">{connectionCount}</span>
                      <span className="text-xs text-gray-500 block">connections</span>
                    </div>
                    <button
                      type="button"
                      onClick={incrementConnectionCount}
                      disabled={connectionCount >= 50}
                      className="cursor-pointer w-10 h-10 rounded-full flex items-center justify-center bg-tier-free text-primary hover:bg-[#dbd6ff] disabled:opacity-40 disabled:hover:bg-tier-free transition-colors"
                      aria-label="Increase connection count by 5"
                    >
                      +5
                    </button>
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                      {calculateBundles()} {calculateBundles() === 1 ? 'bundle' : 'bundles'} × €
                      {CONNECTION_BUNDLE_PRICE}
                    </p>
                    <p className="mt-1 font-semibold text-gray-800">
                      €{calculateBundles() * CONNECTION_BUNDLE_PRICE} total
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="px-6 pb-6 bg-white">
              {hasGoldSubscription() ? (
                <Button
                  className="mt-4 w-full bg-white hover:bg-tier-free text-primary border-primary hover:border-primary hover:text-primary"
                  onClick={() => {
                    void handleConnectionsCheckout();
                  }}
                  disabled={checkoutLoading === 'connections'}
                >
                  {checkoutLoading === 'connections' ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                    </>
                  ) : (
                    `Buy ${String(connectionCount)} connections`
                  )}
                </Button>
              ) : (
                <div className="mt-4 w-full text-center text-sm text-gray-500 py-2">
                  Upgrade to Gold to unlock
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Manage existing subscription button */}
        {startup?.stripeCustomerId && (
          <Button
            className="mt-8 bg-white hover:bg-gray-50 text-primary border-primary hover:border-primary hover:text-primary"
            onClick={() => {
              void handlePortal();
            }}
            disabled={portalLoading}
          >
            {portalLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Opening Billing Portal...
              </>
            ) : (
              'Cancel Current Subscription'
            )}
          </Button>
        )}

        {/* Additional information */}
        <div className="mt-10 text-center text-sm text-gray-600 max-w-2xl">
          <p className="bg-tier-free/30 p-4 rounded-lg">
            All plans include access to our platform's core features. You will be charged at the
            beginning of each billing period. You can cancel or change your subscription at any time
            using the billing portal.
          </p>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Paywall;

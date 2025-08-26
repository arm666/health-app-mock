import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Crown, 
  Check, 
  X, 
  CreditCard, 
  Calendar, 
  Users, 
  Shield, 
  Cloud, 
  Smartphone,
  BarChart3,
  Download,
  Zap,
  Star,
  AlertCircle,
  Gift
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { toast } from 'sonner@2.0.3';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';

interface SubscriptionScreenProps {
  onBack: () => void;
}

export default function SubscriptionScreen({ onBack }: SubscriptionScreenProps) {
  const [currentPlan, setCurrentPlan] = useState('free');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const currentSubscription = {
    plan: 'free',
    status: 'active',
    nextBilling: '2025-09-26',
    amount: '$0.00',
    paymentMethod: 'No payment method',
    usage: {
      records: 24,
      recordsLimit: 50,
      storage: 18.9,
      storageLimit: 100,
      appointments: 12,
      appointmentsLimit: 20
    }
  };

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: { monthly: 0, yearly: 0 },
      description: 'Perfect for basic health tracking',
      features: [
        'Up to 50 health records',
        '100 MB storage',
        'Basic appointment tracking',
        'Medication reminders',
        'Export data (PDF)',
        'Email support'
      ],
      limitations: [
        'Limited to 20 appointments/month',
        'No family sharing',
        'No advanced analytics',
        'No priority support'
      ],
      color: 'gray',
      popular: false
    },
    {
      id: 'premium',
      name: 'Premium',
      price: { monthly: 9.99, yearly: 99.99 },
      description: 'Advanced features for serious health management',
      features: [
        'Unlimited health records',
        '5 GB storage',
        'Unlimited appointments',
        'Advanced medication tracking',
        'Health analytics & insights',
        'Multiple export formats',
        'Priority support',
        'Biometric integration',
        'Custom reminders'
      ],
      limitations: [],
      color: 'blue',
      popular: true
    },
    {
      id: 'family',
      name: 'Family',
      price: { monthly: 19.99, yearly: 199.99 },
      description: 'Complete health management for the whole family',
      features: [
        'Everything in Premium',
        'Up to 6 family members',
        'Shared emergency contacts',
        'Family health dashboard',
        'Caregiver access controls',
        'Family medication tracking',
        'Bulk data export',
        'Dedicated support',
        'Advanced sharing features'
      ],
      limitations: [],
      color: 'purple',
      popular: false
    }
  ];

  const handleUpgrade = (planId: string) => {
    if (planId === 'free') {
      toast.success('Downgraded to Free plan');
    } else {
      toast.success(`Upgraded to ${plans.find(p => p.id === planId)?.name} plan!`);
    }
    setCurrentPlan(planId);
  };

  const getCurrentPlanData = () => plans.find(p => p.id === currentPlan);

  const UsageSection = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
          Current Usage
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Health Records</span>
            <span>{currentSubscription.usage.records}/{currentSubscription.usage.recordsLimit}</span>
          </div>
          <Progress value={(currentSubscription.usage.records / currentSubscription.usage.recordsLimit) * 100} className="h-2" />
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Storage Used</span>
            <span>{currentSubscription.usage.storage} MB/{currentSubscription.usage.storageLimit} MB</span>
          </div>
          <Progress value={(currentSubscription.usage.storage / currentSubscription.usage.storageLimit) * 100} className="h-2" />
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Appointments This Month</span>
            <span>{currentSubscription.usage.appointments}/{currentSubscription.usage.appointmentsLimit}</span>
          </div>
          <Progress value={(currentSubscription.usage.appointments / currentSubscription.usage.appointmentsLimit) * 100} className="h-2" />
        </div>

        {currentPlan === 'free' && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mt-4">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5" />
              <div>
                <p className="text-sm text-orange-800">Usage Alert</p>
                <p className="text-xs text-orange-700">
                  You're using {Math.round((currentSubscription.usage.records / currentSubscription.usage.recordsLimit) * 100)}% of your records limit. 
                  Consider upgrading for unlimited storage.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const CurrentPlanSection = () => {
    const plan = getCurrentPlanData();
    if (!plan) return null;

    return (
      <Card className={`border-2 ${plan.color === 'blue' ? 'border-blue-200 bg-blue-50' : 
                                     plan.color === 'purple' ? 'border-purple-200 bg-purple-50' : 
                                     'border-gray-200 bg-gray-50'}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Crown className={`w-5 h-5 mr-2 ${plan.color === 'blue' ? 'text-blue-600' : 
                                                  plan.color === 'purple' ? 'text-purple-600' : 
                                                  'text-gray-600'}`} />
              Current Plan: {plan.name}
            </CardTitle>
            <Badge variant={currentSubscription.status === 'active' ? 'default' : 'secondary'}>
              {currentSubscription.status === 'active' ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Monthly Cost</p>
              <p className="text-lg font-medium">${plan.price.monthly}/month</p>
            </div>
            <div>
              <p className="text-muted-foreground">Next Billing</p>
              <p className="text-lg font-medium">
                {currentPlan === 'free' ? 'N/A' : currentSubscription.nextBilling}
              </p>
            </div>
          </div>

          {currentPlan !== 'free' && (
            <div className="bg-white rounded-lg p-3 border">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">Payment Method</span>
                </div>
                <span className="text-sm text-gray-600">•••• •••• •••• 4242</span>
              </div>
            </div>
          )}

          <div className="flex space-x-2">
            {currentPlan !== 'free' && (
              <Button variant="outline" size="sm" className="flex-1">
                <CreditCard className="w-4 h-4 mr-1" />
                Billing
              </Button>
            )}
            <Button variant="outline" size="sm" className="flex-1">
              <Download className="w-4 h-4 mr-1" />
              Invoice
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const PlanCard = ({ plan }: { plan: typeof plans[0] }) => {
    const isCurrentPlan = currentPlan === plan.id;
    const price = billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly;
    const yearlyDiscount = plan.price.monthly > 0 ? Math.round((1 - (plan.price.yearly / 12) / plan.price.monthly) * 100) : 0;

    return (
      <Card className={`relative ${isCurrentPlan ? 'ring-2 ring-blue-500' : ''} ${plan.popular ? 'border-blue-200' : ''}`}>
        {plan.popular && (
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-blue-600 text-white">
              <Star className="w-3 h-3 mr-1" />
              Most Popular
            </Badge>
          </div>
        )}
        
        <CardHeader className="text-center pb-2">
          <CardTitle className="flex items-center justify-center space-x-2">
            <span>{plan.name}</span>
            {isCurrentPlan && <Badge variant="secondary">Current</Badge>}
          </CardTitle>
          <div className="space-y-1">
            <div className="text-3xl font-bold">
              ${price}
              {plan.price.monthly > 0 && <span className="text-base font-normal text-muted-foreground">/{billingCycle === 'monthly' ? 'month' : 'year'}</span>}
            </div>
            {billingCycle === 'yearly' && plan.price.monthly > 0 && (
              <div className="text-sm text-green-600">
                Save {yearlyDiscount}% annually
              </div>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{plan.description}</p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-green-600">✓ Included Features</h4>
            {plan.features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-2">
                <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>

          {plan.limitations.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-500">✗ Limitations</h4>
              {plan.limitations.map((limitation, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <X className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-600">{limitation}</span>
                </div>
              ))}
            </div>
          )}

          <div className="pt-4">
            {isCurrentPlan ? (
              <Button disabled className="w-full">
                <Check className="w-4 h-4 mr-2" />
                Current Plan
              </Button>
            ) : (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className={`w-full ${plan.color === 'blue' ? 'bg-blue-600 hover:bg-blue-700' : 
                                                plan.color === 'purple' ? 'bg-purple-600 hover:bg-purple-700' : 
                                                'bg-gray-600 hover:bg-gray-700'}`}>
                    <Zap className="w-4 h-4 mr-2" />
                    {plan.id === 'free' ? 'Downgrade' : 'Upgrade'} to {plan.name}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {plan.id === 'free' ? 'Downgrade' : 'Upgrade'} to {plan.name}?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {plan.id === 'free' 
                        ? 'You will lose access to premium features but keep your existing data. You can upgrade again anytime.'
                        : `You'll be charged $${price} ${billingCycle === 'monthly' ? 'monthly' : 'annually'} starting immediately. You can cancel anytime.`
                      }
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleUpgrade(plan.id)}>
                      {plan.id === 'free' ? 'Downgrade' : 'Upgrade'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="h-full bg-gray-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b sticky top-0 z-10">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="p-0">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl text-gray-900">Subscription</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Current Plan Status */}
        <CurrentPlanSection />

        {/* Usage Tracking */}
        <UsageSection />

        {/* Billing Cycle Toggle */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-center space-x-4">
              <span className={`text-sm ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
                Monthly
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                className="h-8 px-3"
              >
                {billingCycle === 'monthly' ? 'Switch to Yearly' : 'Switch to Monthly'}
              </Button>
              <span className={`text-sm ${billingCycle === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
                Yearly
              </span>
              {billingCycle === 'yearly' && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <Gift className="w-3 h-3 mr-1" />
                  Save up to 17%
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Available Plans */}
        <div className="space-y-4">
          <h2 className="text-lg text-gray-900 text-center">Choose Your Plan</h2>
          {plans.map(plan => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>

        {/* Features Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Feature Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-2 text-sm">
                <div className="font-medium">Feature</div>
                <div className="text-center font-medium">Free</div>
                <div className="text-center font-medium">Premium</div>
                <div className="text-center font-medium">Family</div>
              </div>
              
              <Separator />

              {[
                { feature: 'Health Records', free: '50', premium: 'Unlimited', family: 'Unlimited' },
                { feature: 'Storage', free: '100 MB', premium: '5 GB', family: '5 GB' },
                { feature: 'Family Members', free: '1', premium: '1', family: '6' },
                { feature: 'Analytics', free: '❌', premium: '✅', family: '✅' },
                { feature: 'Priority Support', free: '❌', premium: '✅', family: '✅' },
                { feature: 'Biometric Integration', free: '❌', premium: '✅', family: '✅' }
              ].map((row, index) => (
                <div key={index} className="grid grid-cols-4 gap-2 text-sm py-2">
                  <div>{row.feature}</div>
                  <div className="text-center">{row.free}</div>
                  <div className="text-center">{row.premium}</div>
                  <div className="text-center">{row.family}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-1">Can I cancel anytime?</h4>
              <p className="text-sm text-muted-foreground">
                Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-1">What happens to my data if I downgrade?</h4>
              <p className="text-sm text-muted-foreground">
                Your data is always safe. If you exceed the free plan limits, you'll have read-only access until you upgrade again or delete some records.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-1">Is my health data secure?</h4>
              <p className="text-sm text-muted-foreground">
                Absolutely. All data is encrypted end-to-end and we're HIPAA compliant. We never share your personal health information.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="pb-4"></div>
      </div>
    </div>
  );
}
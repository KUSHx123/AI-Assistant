import React, { useState } from 'react';
import { Check, Zap, Crown, Rocket, ArrowRight, Star, Users, MessageCircle, Bot, Shield, Headphones } from 'lucide-react';
import { PaymentModal } from '../components/PaymentModal';

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  icon: React.ReactNode;
  gradient: string;
  buttonText: string;
  priceId?: string;
}

export const PricingPage: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const plans: PricingPlan[] = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      period: 'forever',
      description: 'Perfect for getting started with AI assistance',
      icon: <MessageCircle size={24} />,
      gradient: 'from-gray-500 to-gray-600',
      buttonText: 'Get Started Free',
      features: [
        '50 messages per month',
        'Basic AI responses',
        'Text conversations only',
        'Standard response time',
        'Community support'
      ]
    },
    {
      id: 'plus',
      name: 'Plus',
      price: isAnnual ? 15 : 19,
      period: 'month',
      description: 'Enhanced features for power users',
      icon: <Zap size={24} />,
      gradient: 'from-blue-500 to-blue-600',
      buttonText: 'Upgrade to Plus',
      popular: true,
      priceId: isAnnual ? 'price_plus_annual' : 'price_plus_monthly',
      features: [
        '1,000 messages per month',
        'Advanced AI model (GPT-4)',
        'File upload & analysis',
        'Voice messages & transcription',
        'Image analysis',
        'Priority response time',
        'Email support',
        'Chat history export'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      price: isAnnual ? 35 : 49,
      period: 'month',
      description: 'Ultimate AI experience for professionals',
      icon: <Crown size={24} />,
      gradient: 'from-purple-500 to-purple-600',
      buttonText: 'Go Professional',
      priceId: isAnnual ? 'price_pro_annual' : 'price_pro_monthly',
      features: [
        'Unlimited messages',
        'Latest AI models (GPT-4 Turbo)',
        'Advanced file processing',
        'Voice synthesis (Text-to-Speech)',
        'Custom AI personalities',
        'API access',
        'Team collaboration',
        'Priority support',
        'Custom integrations',
        'Advanced analytics'
      ]
    }
  ];

  const handlePlanSelect = (plan: PricingPlan) => {
    if (plan.id === 'free') {
      // Handle free plan signup
      alert('Free plan activated! You can start using the AI assistant immediately.');
      return;
    }
    
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    alert(`Successfully subscribed to ${selectedPlan?.name} plan!`);
  };

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-full text-sm font-medium text-blue-700 mb-6">
            <Star size={16} className="text-yellow-500" />
            Choose Your AI Experience
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Unlock the full potential of AI assistance with our flexible plans. 
            Start free and upgrade as your needs grow.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-12 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-200">
            <div className="flex items-center gap-4">
              <span className={`text-sm font-medium transition-colors ${!isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
                Monthly
              </span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
                  isAnnual ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
                    isAnnual ? 'translate-x-8' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-sm font-medium transition-colors ${isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
                Annual
              </span>
              {isAnnual && (
                <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                  Save 20%
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-3xl shadow-xl border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 animate-fade-in ${
                plan.popular 
                  ? 'border-blue-500 ring-4 ring-blue-100' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              style={{ animationDelay: `${300 + index * 100}ms` }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="p-8">
                {/* Plan Header */}
                <div className="text-center mb-8">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${plan.gradient} text-white mb-4 shadow-lg`}>
                    {plan.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{plan.description}</p>
                </div>

                {/* Pricing */}
                <div className="text-center mb-8">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-bold text-gray-900">${plan.price}</span>
                    <span className="text-gray-500 text-lg">/{plan.period}</span>
                  </div>
                  {isAnnual && plan.price > 0 && (
                    <div className="text-sm text-green-600 font-medium mt-2">
                      Save ${((plan.price / 0.8) - plan.price) * 12}/year
                    </div>
                  )}
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                        <Check size={12} className="text-green-600" />
                      </div>
                      <span className="text-gray-700 text-sm leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => handlePlanSelect(plan)}
                  className={`w-full py-4 px-6 rounded-2xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 hover-lift ${
                    plan.popular
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:shadow-xl'
                      : plan.id === 'free'
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg hover:shadow-xl'
                  }`}
                >
                  {plan.buttonText}
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Features Comparison */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-16 animate-fade-in" style={{ animationDelay: '600ms' }}>
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Why Choose Our AI Assistant?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Bot size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Advanced AI Models</h3>
              <p className="text-gray-600 leading-relaxed">
                Powered by the latest GPT models for intelligent, context-aware conversations
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Shield size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Privacy & Security</h3>
              <p className="text-gray-600 leading-relaxed">
                Your conversations are encrypted and secure. We never store or share your data
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Headphones size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">24/7 Support</h3>
              <p className="text-gray-600 leading-relaxed">
                Get help whenever you need it with our dedicated support team
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="text-center animate-fade-in" style={{ animationDelay: '800ms' }}>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg text-left">
              <h3 className="font-semibold text-gray-900 mb-2">Can I change my plan anytime?</h3>
              <p className="text-gray-600">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg text-left">
              <h3 className="font-semibold text-gray-900 mb-2">Is there a free trial for paid plans?</h3>
              <p className="text-gray-600">We offer a generous free plan to get started. You can upgrade when you need more features.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg text-left">
              <h3 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">We accept all major credit cards, PayPal, and other secure payment methods through Stripe.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedPlan && (
        <PaymentModal
          plan={selectedPlan}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Check,
  Star,
  Users,
  Clock,
  BookOpen,
  MessageCircle,
  Video,
  Shield,
  Zap,
  Target,
  Award,
  Sparkles,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Globe,
  Calendar,
  HeadphonesIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null);

  // Student pricing plans
  const studentPlans = [
    {
      id: "basic",
      name: "Basic",
      description: "Perfect for casual learners",
      price: isAnnual ? 0 : 0,
      originalPrice: null,
      period: "month",
      popular: false,
      features: [
        "Browse all teachers",
        "Basic search filters",
        "Standard support",
        "Pay per lesson",
        "Basic review system",
        "Mobile app access",
      ],
      limitations: [
        "No priority booking",
        "Limited customer support",
        "No advanced analytics",
      ],
      cta: "Get Started Free",
      color: "border-gray-200",
    },
    {
      id: "premium",
      name: "Premium",
      description: "Most popular for serious students",
      price: isAnnual ? 199000 : 19900,
      originalPrice: isAnnual ? 239000 : 23900,
      period: isAnnual ? "year" : "month",
      popular: true,
      features: [
        "Everything in Basic",
        "Priority teacher booking",
        "Advanced search & filters",
        "Lesson scheduling tools",
        "Progress tracking",
        "24/7 priority support",
        "Homework management",
        "Study group access",
        "Certificate tracking",
        "Mobile notifications",
      ],
      limitations: [],
      cta: "Start Premium",
      color: "border-blue-500",
    },
    {
      id: "enterprise",
      name: "Enterprise",
      description: "For institutions and teams",
      price: isAnnual ? 999000 : 99900,
      originalPrice: null,
      period: isAnnual ? "year" : "month",
      popular: false,
      features: [
        "Everything in Premium",
        "Bulk lesson packages",
        "Team management",
        "Custom learning paths",
        "Advanced analytics",
        "Dedicated account manager",
        "API access",
        "White-label options",
        "Custom integrations",
        "Training & onboarding",
      ],
      limitations: [],
      cta: "Contact Sales",
      color: "border-purple-500",
    },
  ];

  // Teacher commission structure
  const teacherPlans = [
    {
      name: "Standard",
      commission: 15,
      description: "For new teachers getting started",
      features: [
        "Profile creation",
        "Basic calendar",
        "Payment processing",
        "Student messaging",
        "Basic analytics",
      ],
      requirements: "No minimum requirements",
    },
    {
      name: "Professional",
      commission: 12,
      description: "For experienced teachers",
      features: [
        "Everything in Standard",
        "Priority listing",
        "Advanced scheduling",
        "Marketing tools",
        "Detailed analytics",
        "Priority support",
      ],
      requirements: "50+ completed lessons",
    },
    {
      name: "Expert",
      commission: 8,
      description: "For top-rated teachers",
      features: [
        "Everything in Professional",
        "Premium badge",
        "Featured placement",
        "Custom branding",
        "API access",
        "Dedicated support",
      ],
      requirements: "4.8+ rating, 200+ lessons",
    },
  ];

  const features = [
    {
      category: "Learning Experience",
      items: [
        {
          name: "1-on-1 Video Lessons",
          description:
            "High-quality video sessions with screen sharing and interactive whiteboard",
          icon: Video,
        },
        {
          name: "Flexible Scheduling",
          description:
            "Book lessons at your convenience with automatic timezone handling",
          icon: Calendar,
        },
        {
          name: "Progress Tracking",
          description:
            "Monitor your learning journey with detailed analytics and achievements",
          icon: Target,
        },
        {
          name: "Study Materials",
          description:
            "Access to shared notes, assignments, and downloadable resources",
          icon: BookOpen,
        },
      ],
    },
    {
      category: "Teacher Quality",
      items: [
        {
          name: "Verified Instructors",
          description:
            "All teachers undergo background checks and qualification verification",
          icon: Shield,
        },
        {
          name: "Expert Ratings",
          description:
            "Detailed student reviews and ratings help you choose the best teachers",
          icon: Star,
        },
        {
          name: "Specialized Skills",
          description:
            "Find teachers with specific expertise in your subject area",
          icon: Award,
        },
        {
          name: "Native Speakers",
          description: "Learn languages from native speakers worldwide",
          icon: Globe,
        },
      ],
    },
    {
      category: "Support & Technology",
      items: [
        {
          name: "24/7 Support",
          description:
            "Get help anytime with our dedicated customer support team",
          icon: HeadphonesIcon,
        },
        {
          name: "Mobile Learning",
          description: "Access lessons and materials from any device, anywhere",
          icon: Zap,
        },
        {
          name: "Secure Payments",
          description:
            "Safe and secure payment processing with multiple payment options",
          icon: Shield,
        },
        {
          name: "Community Access",
          description: "Join study groups and connect with other learners",
          icon: Users,
        },
      ],
    },
  ];

  const faqs = [
    {
      question: "How does the pricing work?",
      answer:
        "Our pricing is transparent and flexible. Students can choose between pay-per-lesson or subscription plans. Teachers set their own hourly rates, and we take a small commission to maintain the platform.",
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer:
        "Yes, you can cancel your subscription at any time. If you cancel, you'll continue to have access to premium features until the end of your current billing period.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards (Visa, Mastercard), UZCard, Humo, and bank transfers. All payments are processed securely through our encrypted payment system.",
    },
    {
      question: "Is there a free trial available?",
      answer:
        "Yes! New students get a 7-day free trial of our Premium plan. You can also book a free 15-minute consultation with any teacher to get started.",
    },
    {
      question: "How do teacher commissions work?",
      answer:
        "Teachers keep 85-92% of their lesson fees depending on their performance tier. We handle all payment processing, provide the platform, and offer marketing support.",
    },
    {
      question: "What if I'm not satisfied with a lesson?",
      answer:
        "We offer a satisfaction guarantee. If you're not happy with a lesson, contact our support team within 24 hours and we'll work to resolve the issue or provide a refund.",
    },
    {
      question: "Are there any setup fees?",
      answer:
        "No setup fees for students or teachers. You only pay for the lessons you book or the subscription plan you choose.",
    },
    {
      question: "Can I change my plan later?",
      answer:
        "Absolutely! You can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.",
    },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("uz-UZ").format(price);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-200">
            💰 Save 20% with annual billing
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Simple, Transparent
            <span className="text-blue-600"> Pricing</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Choose the perfect plan for your learning journey. No hidden fees,
            no surprises. Start with our free plan and upgrade when you're
            ready.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center mb-12">
            <span
              className={`mr-3 ${!isAnnual ? "text-gray-900 font-medium" : "text-gray-500"}`}
            >
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isAnnual ? "bg-blue-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isAnnual ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span
              className={`ml-3 ${isAnnual ? "text-gray-900 font-medium" : "text-gray-500"}`}
            >
              Annual
              <Badge className="ml-2 bg-green-100 text-green-800">
                Save 20%
              </Badge>
            </span>
          </div>
        </div>
      </section>

      {/* Student Pricing Plans */}
      <section className="px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Student Plans
            </h2>
            <p className="text-gray-600">
              Choose the plan that fits your learning goals
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {studentPlans.map((plan) => (
              <Card
                key={plan.id}
                className={`relative ${plan.color} ${plan.popular ? "ring-2 ring-blue-500 shadow-lg scale-105" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-600 text-white px-4 py-1">
                      <Star className="h-3 w-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-2xl font-bold">
                    {plan.name}
                  </CardTitle>
                  <p className="text-gray-600 mt-2">{plan.description}</p>

                  <div className="mt-6">
                    <div className="flex items-center justify-center">
                      <span className="text-4xl font-bold text-gray-900">
                        {plan.price === 0
                          ? "Free"
                          : `${formatPrice(plan.price)} UZS`}
                      </span>
                      {plan.price > 0 && (
                        <span className="text-gray-600 ml-2">
                          /{plan.period}
                        </span>
                      )}
                    </div>
                    {plan.originalPrice && (
                      <div className="text-sm text-gray-500 line-through mt-1">
                        {formatPrice(plan.originalPrice)} UZS
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    to={
                      plan.id === "enterprise"
                        ? "/contact"
                        : "/student-register"
                    }
                  >
                    <Button
                      className={`w-full ${plan.popular ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                      variant={plan.popular ? "default" : "outline"}
                    >
                      {plan.cta}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Teacher Commission Structure */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Teacher Commission Structure
            </h2>
            <p className="text-gray-600">
              Earn more as you grow your teaching reputation
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {teacherPlans.map((plan, index) => (
              <Card
                key={plan.name}
                className={`${index === 1 ? "ring-2 ring-green-500 scale-105" : ""}`}
              >
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold">
                    {plan.name}
                  </CardTitle>
                  <p className="text-gray-600 mt-2">{plan.description}</p>

                  <div className="mt-6">
                    <div className="text-4xl font-bold text-green-600">
                      {100 - plan.commission}%
                    </div>
                    <div className="text-sm text-gray-600">You keep</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {plan.commission}% platform fee
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="mb-6">
                    <div className="text-sm font-medium text-gray-700 mb-2">
                      Requirements:
                    </div>
                    <div className="text-sm text-gray-600 bg-gray-100 p-3 rounded">
                      {plan.requirements}
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link to="/teacher-register">
                    <Button
                      className="w-full"
                      variant={index === 1 ? "default" : "outline"}
                    >
                      Start Teaching
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-gray-600">
              Comprehensive tools and features for an exceptional learning
              experience
            </p>
          </div>

          {features.map((category, categoryIndex) => (
            <div key={category.category} className="mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                {category.category}
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {category.items.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <Card
                      key={index}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                          <Icon className="h-6 w-6 text-blue-600" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          {feature.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {feature.description}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600">
              Get answers to common questions about our pricing and platform
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-white border rounded-lg px-6"
              >
                <AccordionTrigger className="text-left font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Start Learning?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of students already learning with expert teachers
              on TutorUZ
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/student-register">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100"
                >
                  Start Learning Today
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Link to="/teacher-register">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-blue-600"
                >
                  Become a Teacher
                  <Users className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>
            <div className="mt-6 text-sm opacity-75">
              No credit card required • 7-day free trial • Cancel anytime
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

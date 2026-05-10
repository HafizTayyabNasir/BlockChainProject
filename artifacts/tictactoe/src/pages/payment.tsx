import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, Zap, Gift } from "lucide-react";

interface PaymentPlan {
  id: string;
  name: string;
  price: number;
  credits: number;
  icon: React.ReactNode;
  description: string;
}

const PAYMENT_PLANS: PaymentPlan[] = [
  {
    id: "starter",
    name: "Starter",
    price: 9.99,
    credits: 100,
    icon: <Zap className="w-6 h-6" />,
    description: "Perfect for beginners"
  },
  {
    id: "pro",
    name: "Pro",
    price: 29.99,
    credits: 500,
    icon: <Gift className="w-6 h-6" />,
    description: "Best for regular players"
  },
  {
    id: "premium",
    name: "Premium",
    price: 99.99,
    credits: 2000,
    icon: <CheckCircle2 className="w-6 h-6" />,
    description: "For hardcore gamers"
  }
];

export default function PaymentPage() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: ""
  });
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Please login to access payment options.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handlePayment = async () => {
    if (!selectedPlan) {
      toast({
        title: "Error",
        description: "Please select a plan",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const plan = PAYMENT_PLANS.find(p => p.id === selectedPlan);
      toast({
        title: "Success",
        description: `Payment processed! You received ${plan?.credits} credits.`
      });
      
      // Reset form
      setSelectedPlan(null);
      setCardDetails({ cardNumber: "", expiryDate: "", cvv: "" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Payment failed. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Get Credits</h1>
          <p className="text-gray-400">Purchase credits to play and win rewards</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {PAYMENT_PLANS.map((plan) => (
            <Card
              key={plan.id}
              className={`cursor-pointer transition-all ${
                selectedPlan === plan.id
                  ? "ring-2 ring-blue-500 bg-blue-50"
                  : "hover:shadow-lg"
              }`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-blue-600">{plan.icon}</div>
                  <CardTitle>{plan.name}</CardTitle>
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="text-3xl font-bold text-gray-900">${plan.price}</p>
                  <p className="text-sm text-gray-600">{plan.credits} credits</p>
                </div>
                <Button 
                  className="w-full" 
                  variant={selectedPlan === plan.id ? "default" : "outline"}
                >
                  {selectedPlan === plan.id ? "Selected" : "Select"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedPlan && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
              <CardDescription>Enter your payment information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Card Number</Label>
                <Input
                  placeholder="4242 4242 4242 4242"
                  value={cardDetails.cardNumber}
                  onChange={(e) => setCardDetails({
                    ...cardDetails,
                    cardNumber: e.target.value
                  })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Expiry Date</Label>
                  <Input
                    placeholder="MM/YY"
                    value={cardDetails.expiryDate}
                    onChange={(e) => setCardDetails({
                      ...cardDetails,
                      expiryDate: e.target.value
                    })}
                  />
                </div>
                <div>
                  <Label>CVV</Label>
                  <Input
                    placeholder="123"
                    type="password"
                    value={cardDetails.cvv}
                    onChange={(e) => setCardDetails({
                      ...cardDetails,
                      cvv: e.target.value
                    })}
                  />
                </div>
              </div>

              <Button 
                className="w-full" 
                size="lg"
                onClick={handlePayment}
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Complete Payment"}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                This is a demo. Use test card 4242 4242 4242 4242 for testing.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { usePayment } from "@/hooks/use-payment";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Copy, Wallet, CreditCard, History } from "lucide-react";

export default function ProfilePage() {
  const { user, connectWallet, logout } = useAuth();
  const { paymentMethods, transactions, isLoading } = usePayment();
  const { toast } = useToast();
  const [walletAddress, setWalletAddress] = useState("");

  if (!user) {
    return null;
  }

  const handleConnectWallet = async () => {
    if (walletAddress.length === 0) {
      toast({
        title: "Error",
        description: "Please enter a wallet address",
        variant: "destructive"
      });
      return;
    }

    try {
      await connectWallet(walletAddress);
      toast({
        title: "Success",
        description: "Wallet connected successfully!"
      });
      setWalletAddress("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect wallet",
        variant: "destructive"
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Copied to clipboard"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Account Settings</h1>
          <p className="text-gray-400">Manage your profile and payment methods</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="wallet">Wallet</TabsTrigger>
            <TabsTrigger value="payment">Payment Methods</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Your account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Username</Label>
                  <p className="font-semibold text-lg">{user.username}</p>
                </div>
                <div>
                  <Label>Email</Label>
                  <p className="font-semibold text-lg">{user.email}</p>
                </div>
                <div>
                  <Label>Account Status</Label>
                  <p className="font-semibold text-lg">
                    {user.isPremium ? "Premium Member" : "Free Member"}
                  </p>
                </div>
                <Button 
                  variant="destructive" 
                  onClick={logout}
                  className="mt-4"
                >
                  Logout
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wallet" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="w-5 h-5" />
                  Wallet Connection
                </CardTitle>
                <CardDescription>Connect your blockchain wallet</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {user.walletAddress ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm text-green-600 mb-2">Connected Wallet</p>
                    <div className="flex items-center justify-between">
                      <p className="font-mono font-semibold text-gray-900">
                        {user.walletAddress}
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(user.walletAddress!)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Label htmlFor="wallet">Wallet Address</Label>
                    <Input
                      id="wallet"
                      placeholder="0x..."
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
                    />
                    <Button 
                      onClick={handleConnectWallet}
                      disabled={isLoading}
                    >
                      Connect Wallet
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Methods
                </CardTitle>
                <CardDescription>Manage your payment information</CardDescription>
              </CardHeader>
              <CardContent>
                {paymentMethods.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No payment methods added yet</p>
                    <Button>Add Payment Method</Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {paymentMethods.map((pm) => (
                      <div key={pm.id} className="border rounded-lg p-4">
                        <p className="font-semibold">{pm.cardholderName}</p>
                        <p className="text-sm text-gray-500">
                          {pm.cardNumber.slice(-4).padStart(pm.cardNumber.length, '*')}
                        </p>
                        <p className="text-sm text-gray-500">Expires: {pm.expiryDate}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Transaction History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {transactions.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No transactions yet</p>
                ) : (
                  <div className="space-y-2">
                    {transactions.map((tx) => (
                      <div key={tx.id} className="flex justify-between items-center border-b pb-2">
                        <div>
                          <p className="font-semibold">${tx.amount.toFixed(2)}</p>
                          <p className="text-sm text-gray-500">{tx.credits} credits</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm">{new Date(tx.date).toLocaleDateString()}</p>
                          <span className={`text-xs px-2 py-1 rounded ${
                            tx.status === 'completed' 
                              ? 'bg-green-100 text-green-800'
                              : tx.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {tx.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

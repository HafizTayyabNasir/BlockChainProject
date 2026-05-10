import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Wallet, CreditCard, History } from "lucide-react";

export function ProfileMockup() {
  const [walletAddress, setWalletAddress] = useState("0x742d35Cc6634C0532925a3b844Bc9e7595f42D");

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
                  <p className="font-semibold text-lg">player_legend</p>
                </div>
                <div>
                  <Label>Email</Label>
                  <p className="font-semibold text-lg">player@example.com</p>
                </div>
                <div>
                  <Label>Account Status</Label>
                  <p className="font-semibold text-lg text-blue-600">Premium Member</p>
                </div>
                <Button variant="destructive" className="mt-4">
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
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-600 mb-2">Connected Wallet</p>
                  <div className="flex items-center justify-between">
                    <p className="font-mono font-semibold text-gray-900">
                      {walletAddress}
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(walletAddress);
                      }}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
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
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <p className="font-semibold">John Doe</p>
                    <p className="text-sm text-gray-500">•••• •••• •••• 4242</p>
                    <p className="text-sm text-gray-500">Expires: 12/25</p>
                  </div>
                </div>
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
                <div className="space-y-2">
                  <div className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="font-semibold">$29.99</p>
                      <p className="text-sm text-gray-500">500 credits</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">May 10, 2026</p>
                      <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-800">
                        Completed
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="font-semibold">$9.99</p>
                      <p className="text-sm text-gray-500">100 credits</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">May 8, 2026</p>
                      <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-800">
                        Completed
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export function Preview() {
  return <ProfileMockup />;
}

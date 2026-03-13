import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, LogIn, Package, Settings, UserPlus } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const MOCK_ORDERS = [
  {
    id: "EL-483920",
    date: "March 8, 2026",
    status: "Delivered",
    total: 174.97,
    items: 3,
  },
  {
    id: "EL-391847",
    date: "February 22, 2026",
    status: "Shipped",
    total: 49.99,
    items: 1,
  },
  {
    id: "EL-275634",
    date: "January 15, 2026",
    status: "Delivered",
    total: 89.98,
    items: 2,
  },
];

export default function AccountPage() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState("login");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const isLoggingIn = loginStatus === "logging-in";
  const isAuthenticated = !!identity;

  const handleLogin = async () => {
    try {
      await login();
      toast.success("Welcome back!");
    } catch (error: any) {
      if (error?.message === "User is already authenticated") {
        await clear();
        setTimeout(() => login(), 300);
      } else {
        toast.error("Login failed. Please try again.");
      }
    }
  };

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    toast.success("Logged out successfully");
  };

  if (!isAuthenticated) {
    return (
      <main className="container max-w-md mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center mb-8">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">
              Welcome
            </p>
            <h1 className="font-display text-4xl font-semibold">
              Your Account
            </h1>
          </div>
          <Card>
            <CardContent className="pt-6">
              <Tabs value={tab} onValueChange={setTab}>
                <TabsList className="w-full mb-6">
                  <TabsTrigger
                    value="login"
                    className="flex-1"
                    data-ocid="auth.login_button"
                  >
                    Login
                  </TabsTrigger>
                  <TabsTrigger
                    value="register"
                    className="flex-1"
                    data-ocid="auth.register_button"
                  >
                    Register
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="login" className="space-y-4">
                  <p className="text-sm text-muted-foreground text-center mb-4">
                    Sign in securely with Internet Identity
                  </p>
                  <Button
                    className="w-full h-11 gap-2"
                    onClick={handleLogin}
                    disabled={isLoggingIn}
                    data-ocid="auth.login_button"
                  >
                    {isLoggingIn ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Signing
                        in...
                      </>
                    ) : (
                      <>
                        <LogIn className="h-4 w-4" /> Sign in with Internet
                        Identity
                      </>
                    )}
                  </Button>
                </TabsContent>
                <TabsContent value="register" className="space-y-4">
                  <div>
                    <Label>Full Name</Label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Smith"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@example.com"
                      className="mt-1"
                    />
                  </div>
                  <Button
                    className="w-full h-11 gap-2"
                    onClick={handleLogin}
                    disabled={isLoggingIn}
                    data-ocid="auth.register_button"
                  >
                    {isLoggingIn ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Creating
                        account...
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4" /> Create Account
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Uses Internet Identity for secure, passwordless
                    authentication
                  </p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    );
  }

  const principal = identity.getPrincipal().toString();
  const shortPrincipal = `${principal.slice(0, 8)}...${principal.slice(-6)}`;

  return (
    <main className="container max-w-4xl mx-auto px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-4 mb-10">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-primary/10 text-primary text-xl font-display">
              {shortPrincipal.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-display text-2xl font-semibold">
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground font-mono">
              {shortPrincipal}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>

        <Tabs defaultValue="orders">
          <TabsList className="mb-8">
            <TabsTrigger value="orders" className="gap-2">
              <Package className="h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>
          <TabsContent value="orders">
            <div className="space-y-4">
              {MOCK_ORDERS.map((order, idx) => (
                <Card key={order.id} data-ocid={`account.item.${idx + 1}`}>
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-sm">
                          Order #{order.id}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {order.date} · {order.items} item
                          {order.items !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${order.status === "Delivered" ? "bg-primary/10 text-primary" : "bg-amber-100 text-amber-800"}`}
                        >
                          {order.status}
                        </span>
                        <p className="text-sm font-semibold mt-1">
                          ${order.total.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Principal ID</Label>
                  <Input
                    value={principal}
                    readOnly
                    className="mt-1 font-mono text-xs"
                  />
                </div>
                <Button variant="destructive" onClick={handleLogout}>
                  Logout
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </main>
  );
}

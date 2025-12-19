import { useState } from "react";
import { Heart, Copy, Check, CreditCard, Smartphone, Building2, Gift } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const donationAmounts = [50, 100, 250, 500, 1000, 2500];

const bankAccounts = [
  {
    bank: "Commercial Bank of Ethiopia (CBE)",
    accountName: "HUMSJ Charity Sector",
    accountNumber: "1000614307599",
    icon: Building2,
  },
  {
    bank: "Telebirr / E-Birr",
    accountName: "HUMSJ Charity Sector",
    accountNumber: "+251 985 736 451",
    icon: Smartphone,
  },
];

const Donate = () => {
  const { toast } = useToast();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text.replace(/\s/g, ""));
    setCopiedField(field);
    toast({
      title: "Copied!",
      description: "Account number copied to clipboard.",
    });
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  };

  const handleCustomAmount = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(null);
  };

  const getFinalAmount = () => {
    if (customAmount) return parseInt(customAmount) || 0;
    return selectedAmount || 0;
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-[#239e99] to-[#29b6b0] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Cpath d='M20 18v-8h-2v8h-8v2h8v8h2v-8h8v-2h-8z'/%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6 animate-fade-in-up">
              Support Our <span className="text-[#d4af37]">Mission</span>
            </h1>
            <p className="text-lg text-white/90 animate-fade-in-up delay-100">
              Your generous donation helps us continue our work in Quranic education, 
              community welfare, and supporting those in need.
            </p>
          </div>
        </div>
      </section>

      {/* Donation Section */}
      <section className="py-16 bg-[#f8fafc]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Left: Amount Selection */}
              <div>
                <Card variant="white" className="shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[#1f2937]">
                      <Gift className="w-5 h-5 text-[#29b6b0]" />
                      Select Donation Amount
                    </CardTitle>
                    <CardDescription>
                      Choose a preset amount or enter a custom amount in ETB
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Preset Amounts */}
                    <div className="grid grid-cols-3 gap-3">
                      {donationAmounts.map((amount) => (
                        <button
                          key={amount}
                          onClick={() => handleAmountSelect(amount)}
                          className={`p-4 rounded-xl border-2 text-center transition-all ${
                            selectedAmount === amount
                              ? "border-[#29b6b0] bg-[#e6f7f6] text-[#29b6b0]"
                              : "border-[#e5e7eb] hover:border-[#29b6b0]/50 text-[#374151]"
                          }`}
                        >
                          <span className="text-lg font-bold">{amount}</span>
                          <span className="text-xs block text-[#6b7280]">ETB</span>
                        </button>
                      ))}
                    </div>

                    {/* Custom Amount */}
                    <div>
                      <label className="text-sm font-medium text-[#374151] mb-2 block">
                        Or enter custom amount (ETB)
                      </label>
                      <Input
                        type="number"
                        placeholder="Enter amount"
                        value={customAmount}
                        onChange={(e) => handleCustomAmount(e.target.value)}
                        className="text-lg"
                      />
                    </div>

                    {/* Donor Info (Optional) */}
                    <div className="space-y-3 pt-4 border-t border-[#e5e7eb]">
                      <p className="text-sm text-[#6b7280]">Optional: Leave your details</p>
                      <Input
                        placeholder="Your name"
                        value={donorName}
                        onChange={(e) => setDonorName(e.target.value)}
                      />
                      <Input
                        type="email"
                        placeholder="Your email"
                        value={donorEmail}
                        onChange={(e) => setDonorEmail(e.target.value)}
                      />
                    </div>

                    {/* Selected Amount Display */}
                    {getFinalAmount() > 0 && (
                      <div className="bg-[#e6f7f6] rounded-xl p-4 text-center">
                        <p className="text-sm text-[#374151]">Your donation</p>
                        <p className="text-3xl font-bold text-[#29b6b0]">
                          {getFinalAmount().toLocaleString()} ETB
                        </p>
                        <Button 
                          variant="gold"
                          className="mt-4 w-full"
                          onClick={() => {
                            const paymentSection = document.getElementById('payment-methods');
                            paymentSection?.scrollIntoView({ behavior: 'smooth' });
                            toast({
                              title: "Amount Selected!",
                              description: `Please transfer ${getFinalAmount().toLocaleString()} ETB using one of the payment methods below.`,
                            });
                          }}
                        >
                          <Heart className="w-4 h-4 mr-2" />
                          Proceed to Payment
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right: Payment Methods */}
              <div id="payment-methods" className="space-y-6">
                <Card variant="white" className="shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[#1f2937]">
                      <CreditCard className="w-5 h-5 text-[#29b6b0]" />
                      Payment Methods
                    </CardTitle>
                    <CardDescription>
                      Transfer your donation using any of these methods
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {bankAccounts.map((account, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-xl border border-[#e5e7eb] hover:border-[#29b6b0]/30 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[#e6f7f6] flex items-center justify-center flex-shrink-0">
                            <account.icon className="w-5 h-5 text-[#29b6b0]" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-[#1f2937]">{account.bank}</p>
                            <p className="text-sm text-[#6b7280]">{account.accountName}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <code className="bg-[#f3f4f6] px-3 py-1 rounded text-[#29b6b0] font-mono text-sm">
                                {account.accountNumber}
                              </code>
                              <button
                                onClick={() => copyToClipboard(account.accountNumber, `account-${index}`)}
                                className="p-1.5 hover:bg-[#f3f4f6] rounded transition-colors"
                              >
                                {copiedField === `account-${index}` ? (
                                  <Check size={16} className="text-[#29b6b0]" />
                                ) : (
                                  <Copy size={16} className="text-[#6b7280]" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Instructions */}
                <Card variant="white" className="shadow-md">
                  <CardHeader>
                    <CardTitle className="text-lg text-[#1f2937]">How to Donate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ol className="space-y-3 text-sm text-[#374151]">
                      <li className="flex gap-3">
                        <span className="w-6 h-6 rounded-full bg-[#29b6b0] text-white flex items-center justify-center text-xs flex-shrink-0">1</span>
                        <span>Select or enter your donation amount above</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="w-6 h-6 rounded-full bg-[#29b6b0] text-white flex items-center justify-center text-xs flex-shrink-0">2</span>
                        <span>Copy the account number of your preferred payment method</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="w-6 h-6 rounded-full bg-[#29b6b0] text-white flex items-center justify-center text-xs flex-shrink-0">3</span>
                        <span>Transfer the amount using your bank app or Telebirr</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="w-6 h-6 rounded-full bg-[#29b6b0] text-white flex items-center justify-center text-xs flex-shrink-0">4</span>
                        <span>Send screenshot to our Telegram for confirmation (optional)</span>
                      </li>
                    </ol>
                  </CardContent>
                </Card>

                {/* Contact for Confirmation */}
                <div className="text-center p-4 bg-[#fef9c3] rounded-xl border border-[#d4af37]/30">
                  <p className="text-sm text-[#374151] mb-2">
                    For donation confirmation or questions:
                  </p>
                  <a
                    href="https://t.me/humsjofficialchannel"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[#29b6b0] font-medium hover:underline"
                  >
                    Contact us on Telegram →
                  </a>
                </div>
              </div>
            </div>

            {/* Impact Section */}
            <div className="mt-16">
              <h2 className="text-2xl font-serif font-bold text-center text-[#1f2937] mb-8">
                Your Donation Makes a Difference
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { amount: "100 ETB", impact: "Provides Iftar meal for 2 students" },
                  { amount: "500 ETB", impact: "Supports a student's monthly Quran classes" },
                  { amount: "1000 ETB", impact: "Helps an orphan with school supplies" },
                ].map((item, index) => (
                  <Card key={index} variant="default" className="text-center">
                    <CardContent className="pt-6">
                      <p className="text-2xl font-bold text-[#29b6b0] mb-2">{item.amount}</p>
                      <p className="text-[#4b5563] text-sm">{item.impact}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Donate;

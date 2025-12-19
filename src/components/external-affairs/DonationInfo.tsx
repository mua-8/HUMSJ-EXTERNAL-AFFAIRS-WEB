import { Copy, Phone, CreditCard, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface DonationMethod {
  icon: React.ElementType;
  title: string;
  details: { label: string; value: string; copyable?: boolean }[];
  link?: { url: string; label: string };
}

const donationMethods: DonationMethod[] = [
  {
    icon: CreditCard,
    title: "Commercial Bank of Ethiopia (CBE)",
    details: [
      { label: "Account Name", value: "HUMSJ Charity Sector" },
      { label: "Account Number", value: "1000614307599", copyable: true },
    ],
  },
  {
    icon: Phone,
    title: "E-Birr Mobile Money",
    details: [
      { label: "Account Name", value: "HUMSJ Charity Sector" },
      { label: "Phone Number", value: "+251 985 736 451", copyable: true },
    ],
  },
  {
    icon: Send,
    title: "Telegram Channel",
    details: [
      { label: "Join our community", value: "@HUMSJCharity" },
    ],
    link: { url: "https://t.me/+IsiTW8Qgz_ZlODA0", label: "Join Telegram" },
  },
];

const DonationInfo = () => {
  const { toast } = useToast();

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text.replace(/\s/g, ""));
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard.`,
    });
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
            Donation Information
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Your generous contributions help us serve those in need. Choose your preferred donation method below.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {donationMethods.map((method, index) => (
            <Card
              key={method.title}
              variant="elevated"
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <method.icon className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-lg">{method.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {method.details.map((detail) => (
                  <div key={detail.label} className="text-center">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      {detail.label}
                    </p>
                    <div className="flex items-center justify-center gap-2">
                      <p className="font-semibold text-foreground">{detail.value}</p>
                      {detail.copyable && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => copyToClipboard(detail.value, detail.label)}
                        >
                          <Copy size={14} />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                {method.link && (
                  <a
                    href={method.link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mt-4"
                  >
                    <Button variant="hero" className="w-full">
                      <Send size={16} />
                      {method.link.label}
                    </Button>
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DonationInfo;

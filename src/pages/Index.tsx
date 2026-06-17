import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Home, DollarSign, Heart, Building2, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Home,
      title: "Real Estate & Housing",
      description: "Subscription eligibility/points, sale & lease contracts, HUG guarantees",
    },
    {
      icon: DollarSign,
      title: "Financial Support & Tax",
      description: "Policy-backed loans, childbirth/marriage subsidies, tax benefits",
    },
    {
      icon: Heart,
      title: "Family & Welfare Programs",
      description: "Parental leave, medical expense support, counseling",
    },
    {
      icon: Building2,
      title: "Private Sector Benefits",
      description: "Wedding mileage, honeymoon perks, partner discounts",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-12 md:pt-16 lg:pt-24 ">
        <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8">
          <div className="inline-flex items-center gap-2 bg-card px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow-soft border border-border animate-fade-in">
            <Sparkles className="h-3 w-3 md:h-4 md:w-4 text-primary" />
            <span className="text-xs md:text-sm font-medium text-foreground">AI-Powered Personalized Policy Recommendations</span>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight animate-fade-in px-4">
            Smart Policy Counseling
            <br />
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              for Newlyweds
            </span>
          </h1>

          <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in px-4">
            Real estate, finance, welfare, and corporate benefits — scattered info, all in one place.
            <br />
            Our AI finds the policies that fit your situation.
          </p>

          <Button
            onClick={() => navigate("/chat")}
            size="lg"
            className="bg-[var(--button-bg)] hover:opacity-90 transition-opacity text-white rounded-full px-6 py-5 md:px-8 md:py-6 text-base md:text-lg shadow-soft animate-fade-in"
          >
            <MessageCircle className="mr-2 h-4 w-4 md:h-5 md:w-5" />
            Start Consultation
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 pt-12 md:pt-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 md:mb-4">
              What We Offer
            </h2>
            <p className="text-sm md:text-base text-muted-foreground">
              Every support policy newlyweds need, at a glance
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-border shadow-card hover:shadow-soft transition-shadow duration-300 animate-fade-in bg-card"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-4 md:p-6 text-center space-y-3 md:space-y-4">
                  <div className="w-12 h-12 md:w-16 md:h-16 mx-auto rounded-2xl bg-[var(--card-icon)] flex items-center justify-center shadow-soft">
                    <feature.icon className="h-6 w-6 md:h-8 md:w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-base md:text-lg text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <Card className="border-border shadow-card bg-card overflow-hidden">
            <CardContent className="p-6 md:p-8 lg:p-12">
              <div className="flex items-center gap-3 mb-6 md:mb-8">
                <Heart className="h-6 w-6 md:h-8 md:w-8 text-primary animate-float" />
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
                  How It Works
                </h2>
              </div>

              <div className="space-y-5 md:space-y-6">
                <div className="flex gap-3 md:gap-4">
                  <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold shadow-soft text-sm md:text-base">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1 md:mb-2 text-sm md:text-base">
                      Tell us your situation
                    </h3>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      Enter basic info such as income, residence area, and family plans
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 md:gap-4">
                  <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold shadow-soft text-sm md:text-base">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1 md:mb-2 text-sm md:text-base">
                      AI analyzes for you
                    </h3>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      Real-time search across hundreds of policies to find the right match
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 md:gap-4">
                  <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold shadow-soft text-sm md:text-base">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1 md:mb-2 text-sm md:text-base">
                      Get personalized recommendations
                    </h3>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      Detailed guidance on how to apply, required documents, and sources
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => navigate("/chat")}
                className="w-full mt-6 md:mt-8 bg-[var(--button-bg)] hover:opacity-90 transition-opacity text-white rounded-full py-5 md:py-6 shadow-soft text-sm md:text-base"
              >
                <MessageCircle className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                Get Started Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-6 md:py-8 text-center">
        <p className="text-xs md:text-sm text-muted-foreground">
          Built on trusted public data · Sources cited · Available 24/7
        </p>
      </footer>
    </div>
  );
};

export default Index;

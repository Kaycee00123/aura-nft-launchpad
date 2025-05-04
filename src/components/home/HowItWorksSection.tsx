
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Wallet, Plus, ArrowRight } from "lucide-react";

const HowItWorksSection = () => {
  const steps = [
    {
      id: 1,
      title: "Connect Wallet",
      description:
        "Connect your Ethereum, Polygon, or Solana wallet to get started. Secure and seamless.",
      icon: <Wallet className="h-8 w-8 text-aura-purple mb-4" />,
    },
    {
      id: 2,
      title: "Create Drop",
      description:
        "Set up your NFT collection with artwork, metadata, pricing, and drop schedule.",
      icon: <Plus className="h-8 w-8 text-aura-purple mb-4" />,
    },
    {
      id: 3,
      title: "Launch & Mint",
      description:
        "Publish your drop and start minting. We handle the smart contracts for you.",
      icon: <ArrowRight className="h-8 w-8 text-aura-purple mb-4" />,
    },
  ];

  return (
    <section className="py-16 md:py-24 px-4 bg-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Launch your NFT collection in minutes with our simple three-step process. No coding required.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {steps.map((step) => (
            <div
              key={step.id}
              className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="text-center">
                {step.icon}
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
              
              {/* Step connector for desktop view*/}
              {step.id < steps.length && (
                <div className="hidden md:block absolute right-[-30px] top-1/2 transform -translate-y-1/2">
                  <svg width="60" height="16" viewBox="0 0 60 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 8H52" stroke="#D6BCFA" strokeWidth="2"/>
                    <path d="M52 1L59 8L52 15" stroke="#D6BCFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/dashboard/create">
            <Button className="bg-aura-purple hover:bg-aura-purple-dark text-white px-8 py-6 text-lg rounded-lg">
              Start Creating
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;

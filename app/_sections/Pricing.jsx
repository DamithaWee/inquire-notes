import React from "react";
import PricingCard, { List } from "../_components/PricingCard";
import Pill from "../_components/Pill";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";

const PLANS = [
  {
    title: "Free",
    type: "FREE",
    price: "$0",
    description: "Perfect for getting started and exploring the basics.",
    features: ["5 maximum PDFs", "Unlimited Q&A", "Unlimited Notes"],
  },
  {
    title: "Monthly",
    type: "MONTHLY",
    price: "$10",
    subscription: "month",
    description: "Perfect for continuous access and ongoing updates.",
    features: ["Unlimited PDFs", "Unlimited Q&A", "Unlimited Notes"],
  },
  {
    title: "Lifetime",
    type: "ONE_TIME",
    price: "$89",
    description: "Best for those who prefer a one-off investment.",
    features: ["Unlimited PDFs", "Unlimited Q&A", "Unlimited Notes"],
  },
];

const Pricing = ({ theme }) => {
  return (
    <div className="container mx-auto mt-32">
      <div className="flex flex-col items-center justify-center">
        <Pill text="Why Use Inquire Notes?" />
        <h2 className="text-3xl md:text-5xl font-bold text-center mt-10">
          <span className="text-primaryLight dark:text-primaryDark">
            Flexible {""}
          </span>
          Pricing to Suit Every Need
        </h2>
      </div>

      <div className="flex items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 px-25 lg:px-20 xl:px-0 mt-20 ">
          {PLANS.map((plan, index) => (
            <HoverBorderGradient
              containerClassName="rounded-xl"
              as="pricing-card"
              className={"bg-bgLight dark:bg-bgDark"}
              theme={theme}
              key={index}
            >
              <PricingCard
                title={plan.title}
                price={plan.price}
                subscription={plan.subscription}
                description={plan.description}
              >
                <div className="flex flex-col gap-2 -mb-16">
                  {plan.features.map((feature, index) => (
                    <List key={index}>{feature}</List>
                  ))}
                </div>
              </PricingCard>
            </HoverBorderGradient>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;

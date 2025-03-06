import PricingCard from "@/app/_components/PricingCard";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { useTheme } from "@/configs/ThemeContext";
import React, { useState } from "react";
import { api } from "@/convex/_generated/api";
import { action } from "@/convex/_generated/server";
import { userUpgradePlan } from "@/convex/user";
import { useUser } from "@clerk/nextjs";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useMutation } from "convex/react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

const PricingCards = () => {
  const { theme } = useTheme();
  const  {user} = useUser();
  const [open, setOpen] = useState(false)
  const upgradeUserPlan = useMutation(api.user.userUpgradePlan);

  const onPaymentSuccess = async () => {
    const result = await upgradeUserPlan({
      userEmail: user?.primaryEmailAddress?.emailAddress,
    });

    toast("Plan Upgraded Successfully");
    setOpen(false);
  };
  return (
    <div className="container mt-10">
      <div className="flex flex-col lg:flex-row items-center justify-center gap-10">
        <HoverBorderGradient
          containerClassName="rounded-xl"
          as="pricing-card"
          className={"bg-bgLight dark:bg-bgDark"}
          theme={theme}
        >
          <PricingCard
            title="Monthly"
            price="$10"
            subscription="Month"
            description="Perfect for continuous access and ongoing updates."
          >
            <Dialog className="flex items-center justify-center" open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <button className="bg-zinc-800/80 hover:bg-zinc-800 scale-100 hover:scale-[99%] transition duration-300 -mb-[20px] flex items-center justify-center py-3 rounded-lg" onClick={() => setOpen(true)}>
                  Upgrade
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    <span className="text-primaryLight dark:text-primaryDark text-2xl flex items-center justify-center capitalize mb-3 font-semibold">
                      UPGRAGE PLAN
                    </span>
                    <hr />
                  </DialogTitle>
                </DialogHeader>
                <div className="max-h-[300px] md:max-h-[500px] overflow-y-scroll">
                  <PayPalButtons
                    onCancel={() => colsole.log("cancel")}
                    onApprove={() => onPaymentSuccess()}
                    createOrder={(data, actions) => {
                      return actions?.order?.create({
                        purchase_units: [
                          {
                            amount: {
                              value: 10,
                              currency_code: "USD",
                            },
                          },
                        ],
                      });
                    }}
                  />
                </div>
              </DialogContent>
            </Dialog>
          </PricingCard>
        </HoverBorderGradient>

        <HoverBorderGradient
          containerClassName="rounded-xl"
          as="pricing-card"
          className={"bg-bgLight dark:bg-bgDark"}
          theme={theme}
        >
          <PricingCard
            title="Onetime"
            price="$139"
            description="Best for those who prefer a one-off investment."
          >
            <Dialog className="flex items-center justify-center">
              <DialogTrigger asChild>
                <Button className="bg-zinc-800/80 hover:bg-zinc-800 scale-100 hover:scale-[99%] transition duration-300 -mb-[20px]">
                  Upgrade
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    <span className="text-primaryLight dark:text-primaryDark text-2xl flex items-center justify-center capitalize mb-3 font-semibold">
                      UPGRAGE PLAN
                    </span>
                    <hr />
                  </DialogTitle>
                </DialogHeader>
                <div className="max-h-[300px] md:max-h-[500px]  overflow-y-scroll">
                  <PayPalButtons
                    onCancel={() => colsole.log("cancel")}
                    onApprove={() => onPaymentSuccess()}
                    createOrder={(data, actions) => {
                      return actions?.order?.create({
                        purchase_units: [
                          {
                            amount: {
                              value: 139.99,
                              currency_code: "USD",
                            },
                          },
                        ],
                      });
                    }}
                  />
                </div>
              </DialogContent>
            </Dialog>
          </PricingCard>
        </HoverBorderGradient>

        {/* <PayPalButtons
          onCancel={() => colsole.log("cancel")}
          onApprove={() => onPaymentSuccess()}
          createOrder={(data, actions) => {
            return actions?.order?.create({
              purchase_units: [
                {
                  amount: {
                    value: 9.99,
                    currency_code: "USD",
                  },
                },
              ],
            });
          }}
        /> */}
      </div>
    </div>
  );
};

export default PricingCards;

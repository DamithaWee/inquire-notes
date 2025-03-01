import React from 'react'
import Pill from '../_components/Pill'
import { Accordion } from "radix-ui";
import classNames from "classnames";
import { ChevronDownIcon } from "@radix-ui/react-icons";


const QUESTIONS = [
  {
    question: "How secure is my data?",
    answer:
      "Your data is our priority. All PDFs and notes are encrypted and securely stored, ensuring complete confidentiality.",
  },

  {
    question: "Can I access my data from multiple devices?",
    answer:
      "Absolutely! You can access your data from any device with an internet connection. We use advanced encryption to ensure secure access, even if you're working from different locations.",
  },

  {
    question: "What makes Inquire Notes unique?",
    answer:
      "Our platform not only provides accurate AI-driven answers to your questions but also lets you create contextual notes directly on your PDFs for a richer learning experience.",
  },

  {
    question: "Can I switch between pricing options?",
    answer:
      "Absolutely. Choose the payment model that best fits your needs, whether it's a short-term weekly subscription, a monthly plan, or a one-time lifetime payment.",
  },
];

const FAQSection = () => {
  return (
    <div className="py-20 md:py-30">
      <div className="container">
        <div className="flex flex-col items-center">
          <Pill text="Questions? We Have Answers" />
          <h2 className="text-3xl md:text-5xl font-bold text-center mt-10">
            Frequently Asked{" "}
            <span className="text-primaryLight dark:text-primaryDark">
              Questions
            </span>{" "}
          </h2>
          <p className="dark:text-zinc-300 text-zinc-400 text-xs lg:text-sm text-center mt-10">
            Find quick answers to some of the most common questions about
            Increasy.
          </p>
        </div>

        <div className='mt-16 flex items-center justify-center px-36'>
          <Accordion.Root
            className="w-full rounded-md bg-bgLight dark:bg-bgDark shadow-[0_2px_10px] shadow-black/5 border border-zinc-400"
            type="single"
            defaultValue="item-1"
            orientation='horizontal'
            collapsible
          >
            {QUESTIONS.map((question, index) => (
              <AccordionItem
                className="border border-zinc-300 dark:border-zinc-500"
                key={index}
                value={`item-${index + 1}`}
              >
                <AccordionTrigger>{question.question}</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm">{question.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion.Root>
        </div>
      </div>
    </div>
  );
}

const AccordionItem = React.forwardRef(
  ({ children, className, ...props }, forwardedRef) => (
    <Accordion.Item
      className={classNames(
        "mt-px overflow-hidden first:mt-0 first:rounded-t last:rounded-b focus-within:relative focus-within:z-10 focus-within:shadow-[0_0_0_2px] focus-within:shadow-mauve12",
        className
      )}
      {...props}
      ref={forwardedRef}
    >
      {children}
    </Accordion.Item>
  )
);

const AccordionTrigger = React.forwardRef(
  ({ children, className, ...props }, forwardedRef) => (
    <Accordion.Header className="flex">
      <Accordion.Trigger
        className={classNames(
          "group flex h-[45px] flex-1 cursor-default items-center justify-between bg-bgLight dark:bg-bgDark px-5 text-[15px] leading-none text-semibold text-primaryLight dark:text-primaryDark shadow-[0_1px_0]  outline-none ",
          className
        )}
        {...props}
        ref={forwardedRef}
      >
        {children}
        <ChevronDownIcon
          className="text-primaryLight dark:text-primaryDark text-semibold transition-transform duration-300 ease-[cubic-bezier(0.87,_0,_0.13,_1)] group-data-[state=open]:rotate-180"
          aria-hidden
        />
      </Accordion.Trigger>
    </Accordion.Header>
  )
);

const AccordionContent = React.forwardRef(
  ({ children, className, ...props }, forwardedRef) => (
    <Accordion.Content
      className={classNames(
        "overflow-hidden bg-bgLight dark:bg-bgDark text-[15px] text-zinc-500 data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown",
        className
      )}
      {...props}
      ref={forwardedRef}
    >
      <div className="px-5 py-[15px]">{children}</div>
    </Accordion.Content>
  )
);


export default FAQSection
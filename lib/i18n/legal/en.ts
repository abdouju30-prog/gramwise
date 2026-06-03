import type { Messages } from "../types";

export const legalEn: Messages["legal"] = {
  footerNavLabel: "Legal",
  footerPrivacy: "Privacy",
  footerTerms: "Terms of use",
  footerContact: "Contact",
  footerCopy: "© GramWise — pastry costing calculator.",
  backHome: "Home",
  disclaimer:
    "Informational text — have it reviewed by qualified counsel in your country before large-scale sales.",
  privacy: {
    eyebrow: "Legal",
    title: "Privacy policy",
    updated: "Last updated: May 2026",
    intro:
      "GramWise is a web calculator. We limit data collection to what is necessary.",
    sections: [
      {
        title: "Controller",
        paragraphs: [
          "GramWise is operated by its founder. Questions: contact email in the footer (when set) or via Gumroad after purchase.",
        ],
      },
      {
        title: "Data we process",
        paragraphs: [
          "Calculator inputs (charges, recipes, prices): stored locally in your browser (sessionStorage / localStorage). Not sent to our servers until a cloud account exists.",
          "Preferences: language and display currency (localStorage).",
          "Payments: processed by Gumroad (card, PayPal). We do not store card details.",
        ],
      },
      {
        title: "Purposes",
        paragraphs: [
          "Provide the calculator, remember your session on device, improve the product from voluntary feedback (beta).",
        ],
      },
      {
        title: "Retention & deletion",
        paragraphs: [
          "Local data: until you clear browser storage or site data.",
        ],
      },
      {
        title: "Your rights (GDPR & similar)",
        paragraphs: [
          "Access, correction, erasure: for local data, use your browser settings. For Gumroad purchases, contact Gumroad as seller of record.",
        ],
      },
      {
        title: "Transfers",
        paragraphs: [
          "Hosting on Vercel (US/EU by region). Gumroad (US) for checkout. See their policies.",
        ],
      },
    ],
  },
  terms: {
    eyebrow: "Legal",
    title: "Terms of use",
    updated: "Last updated: May 2026",
    intro: "By using GramWise you accept these terms.",
    sections: [
      {
        title: "Service",
        paragraphs: [
          "GramWise estimates costs and selling prices for artisans (pastry in v1). Results depend on your inputs; not accounting, tax, or legal advice.",
        ],
      },
      {
        title: "Accuracy",
        paragraphs: [
          "We aim for a tested, transparent engine without warranty of completeness (VAT, payroll, etc.). Verify figures before pricing.",
        ],
      },
      {
        title: "Payment",
        paragraphs: [
          "Purchases via Gumroad (seller of record) at displayed prices (e.g. €29 lifetime). Refunds per Gumroad policy.",
        ],
      },
      {
        title: "Intellectual property",
        paragraphs: [
          "GramWise code, brand, and copy remain the publisher’s property. Your recipes and inputs remain yours.",
        ],
      },
      {
        title: "Liability",
        paragraphs: [
          "To the extent permitted by law, GramWise is not liable for losses from pricing decisions or input errors.",
        ],
      },
      {
        title: "Changes",
        paragraphs: ["We may update the service or these terms; date at top will change."],
      },
    ],
  },
};

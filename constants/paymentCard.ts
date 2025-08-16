const paymentCardDetails = [
  {
    label: "Card Payment",
    logo: "/visa-master.png",
    countries: ["united-states-of-america", "all", "philippines", "malaysia"],
  },

  { label: "G Cash", logo: "/g-cash.svg", countries: ["all", "philippines"] },

  {
    label: "Instant Transfer",
    logo: "/instant-transfer.svg",
    countries: ["united-states-of-america", "all", "malaysia"],
  },

  { label: "Maya", logo: "/pay-maya.svg", countries: ["all", "philippines"] },

  {
    label: "Google Pay",
    logo: "/google-pay.svg",
    countries: ["united-states-of-america", "all"],
  },

  { label: "BPI", logo: "/bpi.svg", countries: ["all", "philippines"] },

  {
    label: "Wire",
    logo: "/wire-transfer.svg",
    countries: ["united-states-of-america", "malaysia", "all"],
  },

  {
    label: "Union Bank",
    logo: "/union-bank.svg",
    countries: ["all", "philippines"],
  },

  { label: "IMSP", logo: "/imsp.svg", countries: ["all"] },

  {
    label: "Grab Pay",
    logo: "/grab-pay.svg",
    countries: ["all", "philippines"],
  },

  {
    label: "ShopeePay",
    logo: "/shopee-pay.svg",
    countries: ["all", "philippines"],
  },
];

export const countryData = [
  { label: "All Country", value: "all" },

  { label: "Malaysia", value: "malaysia" },

  { label: "Philippines", value: "philippines" },

  { label: "United States of America", value: "united-states-of-america" },
];

export default paymentCardDetails;

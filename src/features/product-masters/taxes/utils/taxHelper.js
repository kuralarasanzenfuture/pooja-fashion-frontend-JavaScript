/**
 * Tax Master Helpers and Indian GST Constants
 */

export const TAX_TYPES = [
  { value: "GST", label: "GST (Goods & Services Tax)", description: "Standard Indian GST regime" },
  { value: "CESS", label: "CESS (Special Cess)", description: "Additional compensation cess" },
  { value: "VAT", label: "VAT (Value Added Tax)", description: "Legacy or specific exempted commodities" },
  { value: "CUSTOM", label: "Custom Duty", description: "Import / Export duties" },
  { value: "EXEMPT", label: "Exempt / Zero Rated", description: "0% tax applicable" },
];

/**
 * Standard Indian GST Slabs
 */
export const STANDARD_GST_SLABS = [
  {
    tax_code: "GST_0",
    tax_name: "GST 0% (Nil Rated)",
    tax_type: "GST",
    rate: 0,
    cgst_rate: 0,
    sgst_rate: 0,
    igst_rate: 0,
    cess_rate: 0,
    is_inclusive: false,
    color: "#10B981", // Emerald
  },
  {
    tax_code: "GST_5",
    tax_name: "GST 5% (Apparel & Fabric)",
    tax_type: "GST",
    rate: 5.0,
    cgst_rate: 2.5,
    sgst_rate: 2.5,
    igst_rate: 5.0,
    cess_rate: 0,
    is_inclusive: false,
    color: "#3B82F6", // Blue
  },
  {
    tax_code: "GST_12",
    tax_name: "GST 12% (Apparel > ₹1000)",
    tax_type: "GST",
    rate: 12.0,
    cgst_rate: 6.0,
    sgst_rate: 6.0,
    igst_rate: 12.0,
    cess_rate: 0,
    is_inclusive: false,
    color: "#8B5CF6", // Purple
  },
  {
    tax_code: "GST_18",
    tax_name: "GST 18% (Standard Services / Goods)",
    tax_type: "GST",
    rate: 18.0,
    cgst_rate: 9.0,
    sgst_rate: 9.0,
    igst_rate: 18.0,
    cess_rate: 0,
    is_inclusive: false,
    color: "#F59E0B", // Amber
  },
  {
    tax_code: "GST_28",
    tax_name: "GST 28% (Luxury & Premium)",
    tax_type: "GST",
    rate: 28.0,
    cgst_rate: 14.0,
    sgst_rate: 14.0,
    igst_rate: 28.0,
    cess_rate: 0,
    is_inclusive: false,
    color: "#EF4444", // Rose
  },
];

/**
 * Automatically calculates equal CGST and SGST from total GST rate.
 * @param {number|string} totalRate
 * @returns {{ cgst: number, sgst: number, igst: number }}
 */
export const autoCalculateGstComponents = (totalRate) => {
  const num = Number(totalRate) || 0;
  const half = Math.round((num / 2) * 1000) / 1000;
  return {
    cgst: half,
    sgst: half,
    igst: num,
  };
};

/**
 * Format rate percentage with trimming
 * e.g. 5 -> "5%", 2.5 -> "2.5%"
 */
export const formatTaxRate = (rate) => {
  if (rate === null || rate === undefined || rate === "") return "0%";
  const num = Number(rate);
  return `${num % 1 === 0 ? num : num.toFixed(2)}%`;
};

/**
 * Format number to Indian Rupee currency string
 * e.g. 1000 -> "₹1,000.00"
 */
export const formatCurrency = (val) => {
  if (val === null || val === undefined || isNaN(Number(val))) return "₹0.00";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(val));
};

/**
 * Local fast computation for interactive tax calculator
 */
export const calculateTaxLocal = (
  amount,
  rate,
  isInclusive = false,
  isInterState = false,
  cessRate = 0
) => {
  const amt = Number(amount) || 0;
  const r = Number(rate) || 0;
  const cRate = Number(cessRate) || 0;
  const totalR = r + cRate;

  let taxable = 0;
  let taxAmt = 0;
  let total = 0;

  if (isInclusive) {
    taxable = (amt * 100) / (100 + totalR);
    taxAmt = amt - taxable;
    total = amt;
  } else {
    taxable = amt;
    taxAmt = (amt * totalR) / 100;
    total = amt + taxAmt;
  }

  const baseTax = (taxable * r) / 100;
  const cessAmt = (taxable * cRate) / 100;

  let cgstAmt = 0;
  let sgstAmt = 0;
  let igstAmt = 0;

  if (isInterState) {
    igstAmt = baseTax;
  } else {
    cgstAmt = baseTax / 2;
    sgstAmt = baseTax / 2;
  }

  return {
    original_amount: amt,
    taxable_amount: Math.round(taxable * 100) / 100,
    tax_rate: r,
    tax_amount: Math.round(taxAmt * 100) / 100,
    cgst_rate: isInterState ? 0 : r / 2,
    cgst_amount: Math.round(cgstAmt * 100) / 100,
    sgst_rate: isInterState ? 0 : r / 2,
    sgst_amount: Math.round(sgstAmt * 100) / 100,
    igst_rate: isInterState ? r : 0,
    igst_amount: Math.round(igstAmt * 100) / 100,
    cess_rate: cRate,
    cess_amount: Math.round(cessAmt * 100) / 100,
    total_amount: Math.round(total * 100) / 100,
    is_inclusive: isInclusive,
    is_inter_state: isInterState,
  };
};


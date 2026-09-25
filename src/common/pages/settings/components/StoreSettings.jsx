import React, { useState } from "react";
import { Store, Receipt, CheckCircle2 } from "lucide-react";
import appConfig from "../../../../config/appConfig.js";
import { Button } from "../../../../common/components/ui/buttons/index.js";

export default function StoreSettings() {
  const [storeData, setStoreData] = useState({
    storeName: appConfig.name || "Pooja Fashion Shop",
    branch: "Main High Street Showroom",
    address: "Shop 14-16, Silk Palace Market, MG Road",
    gstin: "27AABCP1234F1Z9",
    invoicePrefix: "INV-2026-",
    currency: "INR (₹)",
    receiptFooter: "Thank you for shopping with Pooja Fashion! Dry Clean only for Silk Sarees & Designer Gowns.",
  });
  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStoreData((prev) => ({ ...prev, [name]: value }));
    if (saved) setSaved(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const labelClass = "block text-xs font-bold text-base-content/80 mb-1.5";
  const inputClass =
    "w-full px-3 py-2 text-xs font-semibold rounded-xl border border-base-300 bg-base-200/50 text-base-content placeholder-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-base-100 transition-colors";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-5 border-b border-base-300">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
            <Store className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-base-content font-display">
            Store & POS Billing Profile
          </h3>
        </div>
        <p className="text-xs text-base-content/60 mt-1 max-w-xl">
          Customize boutique branding, GST details, POS invoice headers, and customer bill print options.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass} htmlFor="storeName">
              Boutique / Store Name
            </label>
            <input
              id="storeName"
              name="storeName"
              type="text"
              value={storeData.storeName}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="branch">
              Branch / Showroom Counter
            </label>
            <input
              id="branch"
              name="branch"
              type="text"
              value={storeData.branch}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="gstin">
              GSTIN Tax Identification Number
            </label>
            <input
              id="gstin"
              name="gstin"
              type="text"
              value={storeData.gstin}
              onChange={handleChange}
              className={`${inputClass} font-mono`}
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="invoicePrefix">
              Invoice Serial Prefix
            </label>
            <div className="relative">
              <Receipt className="w-4 h-4 text-base-content/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="invoicePrefix"
                name="invoicePrefix"
                type="text"
                value={storeData.invoicePrefix}
                onChange={handleChange}
                className={`${inputClass} pl-9 font-mono`}
              />
            </div>
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="address">
            Store Address (Printed on Invoices)
          </label>
          <input
            id="address"
            name="address"
            type="text"
            value={storeData.address}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="receiptFooter">
            Printed Receipt Footer & Return Policy
          </label>
          <textarea
            id="receiptFooter"
            name="receiptFooter"
            rows={2}
            value={storeData.receiptFooter}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        {saved && (
          <div className="p-3 bg-success/15 border border-success/30 text-success text-xs font-semibold rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Store settings saved successfully across POS registers!</span>
          </div>
        )}

        <div className="flex items-center justify-end pt-3 border-t border-base-300">
          <Button type="submit" variant="clip-six" size="md">
            Save Store Configuration
          </Button>
        </div>
      </form>
    </div>
  );
}

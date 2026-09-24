import { useState } from "react";
import { Store, Receipt, CheckCircle2 } from "lucide-react";
import appConfig from "../../../../config/appConfig.js";

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-5 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#f0f4fc] text-[#1e3a8a] flex items-center justify-center border border-[#c7d2fe]">
            <Store className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-slate-900 font-display">
            Store & POS Billing Profile
          </h3>
        </div>
        <p className="text-xs text-slate-500 mt-1 max-w-xl">
          Customize boutique branding, GST details, POS invoice headers, and customer bill print options.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="storeName">
              Boutique / Store Name
            </label>
            <input
              id="storeName"
              name="storeName"
              type="text"
              value={storeData.storeName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 text-xs font-semibold text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="branch">
              Branch / Showroom Counter
            </label>
            <input
              id="branch"
              name="branch"
              type="text"
              value={storeData.branch}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 text-xs font-semibold text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="gstin">
              GSTIN Tax Identification Number
            </label>
            <input
              id="gstin"
              name="gstin"
              type="text"
              value={storeData.gstin}
              onChange={handleChange}
              className="w-full px-3 py-2 text-xs font-mono font-semibold text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="invoicePrefix">
              Invoice Serial Prefix
            </label>
            <div className="relative">
              <Receipt className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="invoicePrefix"
                name="invoicePrefix"
                type="text"
                value={storeData.invoicePrefix}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2 text-xs font-mono font-semibold text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a]"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="address">
            Store Address (Printed on Invoices)
          </label>
          <input
            id="address"
            name="address"
            type="text"
            value={storeData.address}
            onChange={handleChange}
            className="w-full px-3 py-2 text-xs font-semibold text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="receiptFooter">
            Printed Receipt Footer & Return Policy
          </label>
          <textarea
            id="receiptFooter"
            name="receiptFooter"
            rows={2}
            value={storeData.receiptFooter}
            onChange={handleChange}
            className="w-full px-3 py-2 text-xs font-medium text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a]"
          />
        </div>

        {saved && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Store settings saved successfully!</span>
          </div>
        )}

        <div className="flex items-center justify-end pt-3">
          <button
            type="submit"
            className="px-4 py-2 bg-[#0f1c3f] hover:bg-[#1e3a8a] text-white text-xs font-bold rounded-xl transition-colors shadow-xs cursor-pointer"
          >
            Save Store Configuration
          </button>
        </div>
      </form>
    </div>
  );
}

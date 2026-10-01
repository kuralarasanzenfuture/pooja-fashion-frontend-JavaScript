import React, { useState, useMemo, useEffect, useRef } from "react";
import { X, Search, Check, Plus, AlertCircle, Landmark } from "lucide-react";
import BankLogo from "./BankLogo.jsx";
import { useModalAnimation } from "../../../common/hooks/useModalAnimation.js";

// Core Popular Banks curated to match standard Indian commercial banking
export const POPULAR_BANKS = [
  {
    bankCode: "BOB",
    bankName: "Bank of Baroda",
    legalName: "Bank of Baroda Ltd.",
    bankType: "commercial",
    ifscPrefix: "BARB",
  },
  {
    bankCode: "HDFC",
    bankName: "HDFC Bank",
    legalName: "HDFC Bank Limited",
    bankType: "commercial",
    ifscPrefix: "HDFC",
  },
  {
    bankCode: "ICICI",
    bankName: "ICICI Bank",
    legalName: "ICICI Bank Limited",
    bankType: "commercial",
    ifscPrefix: "ICIC",
  },
  {
    bankCode: "SBI",
    bankName: "State Bank of India",
    legalName: "State Bank of India",
    bankType: "commercial",
    ifscPrefix: "SBIN",
  },
  {
    bankCode: "AXIS",
    bankName: "Axis Bank",
    legalName: "Axis Bank Limited",
    bankType: "commercial",
    ifscPrefix: "UTIB",
  },
  {
    bankCode: "CANARA",
    bankName: "Canara Bank",
    legalName: "Canara Bank",
    bankType: "commercial",
    ifscPrefix: "CNRB",
  },
  {
    bankCode: "KOTAK",
    bankName: "Kotak Mahindra Bank",
    legalName: "Kotak Mahindra Bank Ltd.",
    bankType: "commercial",
    ifscPrefix: "KKBK",
  },
  {
    bankCode: "PNB",
    bankName: "Punjab National Bank",
    legalName: "Punjab National Bank",
    bankType: "commercial",
    ifscPrefix: "PUNB",
  },
  {
    bankCode: "BKID",
    bankName: "Bank of India",
    legalName: "Bank of India",
    bankType: "commercial",
    ifscPrefix: "BKID",
  },
  {
    bankCode: "IDIB",
    bankName: "Indian Bank",
    legalName: "Indian Bank",
    bankType: "commercial",
    ifscPrefix: "IDIB",
  },
  {
    bankCode: "CBIN",
    bankName: "Central Bank of India",
    legalName: "Central Bank of India",
    bankType: "commercial",
    ifscPrefix: "CBIN",
  },
  {
    bankCode: "UNION",
    bankName: "Union Bank of India",
    legalName: "Union Bank of India",
    bankType: "commercial",
    ifscPrefix: "UBIN",
  },
];

/**
 * BankSelectModal Component
 * Implements pixel-perfect "Select your bank" dialog matching the user's design.
 * Features:
 * - Search bar with instant real-time filtering
 * - "Popular banks" section with authentic logos & blue checkmark selection
 * - "All banks" section with alphabetical bank listing
 * - "Can't find your bank? Add it manually" footer button
 */
export default function BankSelectModal({
  isOpen = false,
  onClose,
  selectedBankId = null,
  selectedBank = null,
  banks = [],
  isLoading = false,
  onSelectBank,
  onAddManual,
}) {
  const { isRendered, handleClose, backdropClasses, cardClasses } = useModalAnimation(isOpen, onClose);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef(null);

  // Auto-focus search input when opened
  useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Merge directory banks with popular presets so popular banks always link to database records if matched
  const resolvedPopularBanks = useMemo(() => {
    return POPULAR_BANKS.map((pop) => {
      const matchInDb = banks.find((b) => {
        const bCode = (b.bankCode || b.bank_code || "").toUpperCase();
        const bName = (b.bankName || b.bank_name || "").toUpperCase();
        return (
          bCode === pop.bankCode ||
          bName.includes(pop.bankName.toUpperCase()) ||
          pop.bankName.toUpperCase().includes(bName)
        );
      });

      return matchInDb ? { ...pop, ...matchInDb } : pop;
    });
  }, [banks]);

  // All banks sorted alphabetically
  const allBanksSorted = useMemo(() => {
    const list = [...banks];
    // If database banks is empty or sparse, supplement with the popular presets
    if (list.length === 0) {
      return POPULAR_BANKS;
    }
    return list.sort((a, b) => {
      const nameA = (a.bankName || a.bank_name || "").toLowerCase();
      const nameB = (b.bankName || b.bank_name || "").toLowerCase();
      return nameA.localeCompare(nameB);
    });
  }, [banks]);

  // Filter based on search query
  const query = searchQuery.trim().toLowerCase();

  const filteredPopular = useMemo(() => {
    if (!query) return resolvedPopularBanks;
    return resolvedPopularBanks.filter((b) => {
      const name = (b.bankName || b.bank_name || "").toLowerCase();
      const code = (b.bankCode || b.bank_code || "").toLowerCase();
      return name.includes(query) || code.includes(query);
    });
  }, [resolvedPopularBanks, query]);

  const filteredAll = useMemo(() => {
    if (!query) return allBanksSorted;
    return allBanksSorted.filter((b) => {
      const name = (b.bankName || b.bank_name || "").toLowerCase();
      const code = (b.bankCode || b.bank_code || "").toLowerCase();
      const legal = (b.legalName || b.legal_name || "").toLowerCase();
      return name.includes(query) || code.includes(query) || legal.includes(query);
    });
  }, [allBanksSorted, query]);

  if (!isOpen) return null;

  // Determine if a bank item is currently selected
  const isBankSelected = (b) => {
    const bId = b.id ? String(b.id) : null;
    const bCode = (b.bankCode || b.bank_code || "").toUpperCase();
    const bName = (b.bankName || b.bank_name || "").toUpperCase();

    if (selectedBankId && bId && String(selectedBankId) === bId) return true;
    if (selectedBank) {
      const selCode = (selectedBank.bankCode || selectedBank.bank_code || "").toUpperCase();
      const selName = (selectedBank.bankName || selectedBank.bank_name || "").toUpperCase();
      if (selCode && bCode && selCode === bCode) return true;
      if (selName && bName && selName === bName) return true;
    }
    return false;
  };

  const handleBankClick = (bankItem) => {
    onSelectBank(bankItem);
    handleClose();
  };

  if (!isRendered) return null;

  return (
    <div className={backdropClasses} onClick={handleClose} role="dialog" aria-modal="true">
      <div
        className={`relative w-full max-w-[460px] bg-base-100 rounded-3xl shadow-2xl border border-base-300 overflow-hidden flex flex-col max-h-[88vh] ${cardClasses}`}
        onClick={(e) => e.stopPropagation()}
        aria-labelledby="select-bank-title"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-base-300 bg-base-100 shrink-0">
          <h2 id="select-bank-title" className="text-base sm:text-lg font-bold text-base-content tracking-tight">
            Select your bank
          </h2>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close dialog"
            className="p-1 rounded-xl text-base-content/50 hover:text-base-content hover:bg-base-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-5 py-3 border-b border-base-200/70 bg-base-100 shrink-0">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 absolute left-3.5 text-base-content/40 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your bank (e.g. HDFC, SBI)"
              className="w-full pl-10 pr-9 py-2.5 text-sm rounded-xl border border-base-300 bg-base-200/40 focus:bg-base-100 placeholder:text-base-content/40 text-base-content focus:border-primary focus:ring-1 focus:ring-primary/20 outline-hidden transition-all font-medium"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 p-1 rounded-md text-base-content/40 hover:text-base-content cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Bank List Body */}
        <div className="flex-1 overflow-y-auto divide-y divide-base-200/60 overscroll-contain">
          {isLoading ? (
            <div className="py-16 flex flex-col items-center justify-center space-y-3">
              <span className="loading loading-spinner loading-md text-primary"></span>
              <p className="text-xs text-base-content/60 font-medium">Loading official banking directory...</p>
            </div>
          ) : (
            <>
              {/* Popular Banks Section (only show when not searching deeply or if results exist) */}
              {filteredPopular.length > 0 && (
                <div className="py-2">
                  <div className="px-5 py-1.5">
                    <span className="text-xs font-semibold text-base-content/55 uppercase tracking-wider">
                      Popular banks
                    </span>
                  </div>
                  <div className="mt-0.5">
                    {filteredPopular.map((b) => {
                      const selected = isBankSelected(b);
                      const bankName = b.bankName || b.bank_name;
                      const bankCode = b.bankCode || b.bank_code;

                      return (
                        <button
                          key={`pop_${b.id || bankCode}`}
                          type="button"
                          onClick={() => handleBankClick(b)}
                          className={`w-full flex items-center justify-between px-5 py-3 text-left transition-colors cursor-pointer group ${
                            selected
                              ? "bg-primary/5 text-primary"
                              : "hover:bg-base-200/60 text-base-content"
                          }`}
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            <BankLogo bank={b} size="sm" />
                            <div className="min-w-0">
                              <span className={`text-sm block truncate font-medium ${selected ? "font-semibold text-primary" : "text-base-content"}`}>
                                {bankName}
                              </span>
                            </div>
                          </div>

                          {/* Selected Checkmark (Blue checkmark as in user reference image) */}
                          {selected && (
                            <div className="text-primary shrink-0 pl-3">
                              <Check className="w-5 h-5 stroke-[2.5]" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* All Banks Section */}
              {filteredAll.length > 0 && (
                <div className="py-2">
                  <div className="px-5 py-1.5 flex items-center justify-between">
                    <span className="text-xs font-semibold text-base-content/55 uppercase tracking-wider">
                      All banks
                    </span>
                    <span className="text-[11px] font-medium text-base-content/40">
                      {filteredAll.length} {filteredAll.length === 1 ? "bank" : "banks"}
                    </span>
                  </div>
                  <div className="mt-0.5">
                    {filteredAll.map((b) => {
                      const selected = isBankSelected(b);
                      const bankName = b.bankName || b.bank_name;
                      const bankCode = b.bankCode || b.bank_code;

                      return (
                        <button
                          key={`all_${b.id || bankCode}_${bankName}`}
                          type="button"
                          onClick={() => handleBankClick(b)}
                          className={`w-full flex items-center justify-between px-5 py-3 text-left transition-colors cursor-pointer group ${
                            selected
                              ? "bg-primary/5 text-primary"
                              : "hover:bg-base-200/60 text-base-content"
                          }`}
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            <BankLogo bank={b} size="sm" />
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className={`text-sm block truncate font-medium ${selected ? "font-semibold text-primary" : "text-base-content"}`}>
                                  {bankName}
                                </span>
                                {bankCode && (
                                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20">
                                    {bankCode}
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-base-content/50 block truncate mt-0.5">
                                {b.legalName || bankName}
                              </span>
                            </div>
                          </div>

                          {/* Selected Checkmark */}
                          {selected && (
                            <div className="text-primary shrink-0 pl-3">
                              <Check className="w-5 h-5 stroke-[2.5]" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Empty state when no matches */}
              {filteredPopular.length === 0 && filteredAll.length === 0 && (
                <div className="py-12 px-6 text-center">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-base-200 flex items-center justify-center text-base-content/40 mb-3">
                    <Landmark className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-base-content">
                    No banks found matching "{searchQuery}"
                  </p>
                  <p className="text-xs text-base-content/60 mt-1 max-w-xs mx-auto">
                    You can register this bank into the master directory directly.
                  </p>
                  {onAddManual && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onAddManual(searchQuery);
                      }}
                      className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-content hover:bg-primary/90 transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4" /> Add "{searchQuery}" Manually
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer: "Can't find your bank? Add it manually" */}
        <div className="px-5 py-3.5 border-t border-base-200 bg-base-100 flex items-center justify-between text-xs sm:text-sm shrink-0">
          <span className="text-base-content/70 font-normal">
            Can't find your bank?
          </span>
          {onAddManual && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onAddManual(searchQuery);
              }}
              className="text-primary hover:text-primary/80 font-semibold hover:underline cursor-pointer transition-colors"
            >
              Add it manually
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  loginUser,
  loginWithDemo,
  clearAuthError,
} from "../../../redux/auth/authSlice.js";
import {
  selectAuthError,
  selectAuthLoading,
} from "../../../redux/selectors/authSelectors.js";
import { ROUTES } from "../../../constants/routes.js";
import appConfig from "../../../config/appConfig.js";
import {
  Sparkles,
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Receipt,
  Shirt,
  Tag,
  Scissors,
  ScanBarcode,
} from "lucide-react";
import FontSwitcher from "../../../common/components/FontSwitcher.jsx";
import storeShowcaseImage from "../../../assets/images/pooja-fashion-showcase.jpg";
import "../styles/LoginPage.css";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector(selectAuthLoading);
  const authError = useSelector(selectAuthError);

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");

  const handleIdentifierChange = (e) => {
    setIdentifier(e.target.value);
    if (localError) setLocalError("");
    if (authError) dispatch(clearAuthError());
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (localError) setLocalError("");
    if (authError) dispatch(clearAuthError());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedId = identifier.trim();
    if (!trimmedId) {
      setLocalError("Please enter your username, email, or phone number.");
      return;
    }
    if (!password) {
      setLocalError("Please enter your password.");
      return;
    }

    try {
      await dispatch(
        loginUser({ identifier: trimmedId, password })
      ).unwrap();
      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch {
      // Handled via Redux state authError
    }
  };

  const handleDemoLogin = async () => {
    if (authError) dispatch(clearAuthError());
    setLocalError("");
    try {
      await dispatch(loginWithDemo("admin")).unwrap();
      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch {
      // Handled
    }
  };

  const handleFillCredentials = () => {
    setIdentifier("admin@poojafashion.com");
    setPassword("fashion@2026");
    if (localError) setLocalError("");
    if (authError) dispatch(clearAuthError());
  };

  const displayedError = localError || authError;

  return (
    <div className="pooja-auth">
      {/* ---------- Left: Form panel (Crisp White & Navy) ---------- */}
      <div className="pooja-auth__form-panel">
        <div className="pooja-auth__form-inner">
          {/* Mobile-only Dress Boutique Preview Banner */}
          <div className="pooja-auth__mobile-banner" aria-hidden="true">
            <img
              src={storeShowcaseImage}
              alt="Pooja Fashion Boutique"
              className="pooja-auth__mobile-banner-img"
            />
            <div className="pooja-auth__mobile-banner-overlay">
              <span className="pooja-auth__mobile-banner-tag">
                <Sparkles className="w-3 h-3 text-sky-300" /> Boutique Dresses & Fast POS
              </span>
            </div>
          </div>

          <div className="pooja-auth__brand">
            <div className="flex items-center gap-3">
              <div className="pooja-auth__brand-mark">
                <Shirt className="w-5 h-5 text-white" />
              </div>
              <div className="pooja-auth__brand-text">
                <span className="pooja-auth__brand-name">{appConfig.name}</span>
                <span className="pooja-auth__brand-tag">Dresses & POS Billing</span>
              </div>
            </div>
            <FontSwitcher variant="compact" />
          </div>

          <h1 className="pooja-auth__title">Sign In to Store</h1>
          <p className="pooja-auth__subtitle">
            Manage designer dresses, fabric metre cutting, instant GST billing, and showroom sales.
          </p>

          <form className="pooja-auth__form" onSubmit={handleSubmit} noValidate>
            <div className="pooja-auth__field">
              <label className="pooja-auth__label" htmlFor="identifier">
                Username, Email, or Phone
              </label>
              <div className="pooja-auth__input-wrapper">
                <User className="pooja-auth__input-icon" />
                <input
                  id="identifier"
                  type="text"
                  className="pooja-auth__input"
                  placeholder="e.g. pooja.admin or admin@poojafashion.com"
                  value={identifier}
                  onChange={handleIdentifierChange}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div className="pooja-auth__field">
              <div className="pooja-auth__label-row">
                <label className="pooja-auth__label" htmlFor="password">
                  Password
                </label>
                <span className="pooja-auth__forgot">Forgot password?</span>
              </div>
              <div className="pooja-auth__input-wrapper">
                <Lock className="pooja-auth__input-icon" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="pooja-auth__input pooja-auth__input--password"
                  placeholder="Enter your account password"
                  value={password}
                  onChange={handlePasswordChange}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="pooja-auth__password-toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {displayedError ? (
              <div className="pooja-auth__error" role="alert">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{displayedError}</span>
              </div>
            ) : null}

            <button
              type="submit"
              className="pooja-auth__submit"
              disabled={loading}
            >
              {loading ? (
                <span className="pooja-auth__loading">
                  <span className="pooja-auth__spinner"></span>
                  Signing into POS...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Sign In to POS Dashboard <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </button>
          </form>

          {/* Quick Demo Access Bar */}
          <div className="pooja-auth__demo-box">
            <div className="pooja-auth__demo-header">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#0f1c3f]">
                <Receipt className="w-3.5 h-3.5 text-[#1e3a8a]" />
                <span>Quick Access & Evaluation</span>
              </div>
              <button
                type="button"
                onClick={handleFillCredentials}
                className="text-[11px] text-[#1e3a8a] hover:text-[#0f1c3f] underline font-medium cursor-pointer"
              >
                Auto-fill credentials
              </button>
            </div>
            <p className="text-[11px] text-slate-600 mt-1">
              Backend not connected? Jump straight into the store billing & dress inventory:
            </p>
            <button
              type="button"
              onClick={handleDemoLogin}
              className="pooja-auth__demo-button"
            >
              <span>Instant Demo Login (Store Manager)</span>
            </button>
          </div>

          <div className="pooja-auth__footer">
            <span>Pooja Fashion & Dress Boutique • v{appConfig.version}</span>
          </div>
        </div>
      </div>

      {/* ---------- Right: Dress & Billing Visual Panel (Deep Navy Blue) ---------- */}
      <div className="pooja-auth__visual-panel">
        <img
          src={storeShowcaseImage}
          alt=""
          aria-hidden="true"
          className="pooja-auth__visual-photo"
        />
        <div className="pooja-auth__visual-overlay" aria-hidden="true" />

        <div className="pooja-auth__visual-content">
          <div className="pooja-auth__badge">
            <Sparkles className="w-3.5 h-3.5 text-sky-300" />
            <span>Designer Dresses, Sarees & Fast Billing</span>
          </div>

          <h2 className="pooja-auth__visual-heading">
            From Designer Hangers to Printed Invoices.
          </h2>
          <p className="pooja-auth__visual-subtext">
            Specialized boutique billing for ready-to-wear gowns, bridal lehengas, silk sarees, and custom metre fabric tailoring.
          </p>

          {/* Dress Categories Showcase */}
          <div className="pooja-auth__dress-chips" aria-hidden="true">
            <span className="pooja-auth__dress-chip">
              <Shirt className="w-3.5 h-3.5" /> Bridal Lehengas
            </span>
            <span className="pooja-auth__dress-chip">
              <Tag className="w-3.5 h-3.5" /> Silk Sarees
            </span>
            <span className="pooja-auth__dress-chip">
              <Scissors className="w-3.5 h-3.5" /> Custom Cuts
            </span>
          </div>

          {/* Realistic Dress POS Billing Invoice */}
          <div className="pooja-auth__billing-invoice">
            {/* Invoice Top Strip */}
            <div className="pooja-auth__billing-top">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></div>
                <div>
                  <p className="font-bold text-xs text-slate-900 tracking-wider font-mono">
                    POOJA FASHION & BOUTIQUE
                  </p>
                  <p className="text-[10px] text-slate-500">
                    TAX INVOICE • POS COUNTER #01
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono text-xs font-bold text-slate-800">
                  #INV-2026-9810
                </span>
                <p className="text-[10px] text-slate-400">GSTIN: 27AABCP1234F1Z9</p>
              </div>
            </div>

            {/* Invoice Line Items */}
            <div className="pooja-auth__billing-items">
              <div className="pooja-auth__billing-row">
                <div className="flex-1 pr-2">
                  <span className="font-semibold text-slate-900 block">
                    Royal Navy Bridal Silk Saree
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Pure Zari Border • HSN: 5007 • 1 Pc
                  </span>
                </div>
                <span className="font-mono font-bold text-slate-900">
                  ₹18,500.00
                </span>
              </div>

              <div className="pooja-auth__billing-row">
                <div className="flex-1 pr-2">
                  <span className="font-semibold text-slate-900 block">
                    Designer Anarkali Gown with Dupatta
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Midnight Blue & Gold • Ready to Wear
                  </span>
                </div>
                <span className="font-mono font-bold text-slate-900">
                  ₹12,400.00
                </span>
              </div>
            </div>

            {/* Calculations and Total */}
            <div className="pooja-auth__billing-footer">
              <div className="pooja-auth__billing-subrow">
                <span>Subtotal (2 Items)</span>
                <span className="font-mono">₹30,900.00</span>
              </div>
              <div className="pooja-auth__billing-subrow">
                <span>GST (2.5% CGST + 2.5% SGST)</span>
                <span className="font-mono">₹1,545.00</span>
              </div>
              <div className="pooja-auth__billing-total">
                <div>
                  <span className="text-xs uppercase font-bold text-slate-900 block">
                    Grand Total
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Paid via UPI / QR
                  </span>
                </div>
                <span className="font-mono text-base font-extrabold text-[#0f1c3f]">
                  ₹32,445.00
                </span>
              </div>

              {/* Barcode & Print Simulation */}
              <div className="pooja-auth__barcode-strip">
                <ScanBarcode className="w-5 h-5 text-slate-400" />
                <div className="pooja-auth__barcode-lines" aria-hidden="true" />
                <span className="font-mono text-[10px] text-slate-400 tracking-widest">
                  PF-POS-READY
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
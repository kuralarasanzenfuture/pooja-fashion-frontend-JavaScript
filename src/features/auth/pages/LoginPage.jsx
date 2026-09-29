import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  loginUser,
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

  const REMEMBER_KEY = "pooja_fashion_remembered_credentials";

  // Load last saved credentials from localStorage if rememberMe was active
  const [identifier, setIdentifier] = useState(() => {
    try {
      const saved = localStorage.getItem(REMEMBER_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.identifier || "";
      }
    } catch {
      // Fallback
    }
    return "";
  });

  const [password, setPassword] = useState(() => {
    try {
      const saved = localStorage.getItem(REMEMBER_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.password || "";
      }
    } catch {
      // Fallback
    }
    return "";
  });

  const [rememberMe, setRememberMe] = useState(() => {
    try {
      const saved = localStorage.getItem(REMEMBER_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return Boolean(parsed.rememberMe);
      }
    } catch {
      // Fallback
    }
    return false;
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validate = (field, value) => {
    if (field === "identifier") {
      const val = value ? value.trim() : "";
      if (!val) {
        return "Username, email, or phone number is required";
      }
      if (val.length < 3) {
        return "Identifier must be at least 3 characters";
      }
      return "";
    }
    if (field === "password") {
      if (!value) {
        return "Password is required";
      }
      if (value.length < 4) {
        return "Password must be at least 4 characters";
      }
      return "";
    }
    return "";
  };

  const handleIdentifierChange = (e) => {
    const val = e.target.value;
    setIdentifier(val);
    if (authError) dispatch(clearAuthError());
    if (touched.identifier) {
      setErrors((prev) => ({
        ...prev,
        identifier: validate("identifier", val),
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    if (authError) dispatch(clearAuthError());
    if (touched.password) {
      setErrors((prev) => ({
        ...prev,
        password: validate("password", val),
      }));
    }
  };

  const handleBlur = (field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const val = field === "identifier" ? identifier : password;
    setErrors((prev) => ({
      ...prev,
      [field]: validate(field, val),
    }));
  };

  const handleRememberMeChange = (e) => {
    const isChecked = e.target.checked;
    setRememberMe(isChecked);
    if (!isChecked) {
      localStorage.removeItem(REMEMBER_KEY);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const idErr = validate("identifier", identifier);
    const passErr = validate("password", password);

    setTouched({ identifier: true, password: true });
    setErrors({ identifier: idErr, password: passErr });

    if (idErr || passErr) {
      return;
    }

    try {
      await dispatch(
        loginUser({ identifier: identifier.trim(), password })
      ).unwrap();

      // If "Remember login credentials" is checked, store credentials for auto-fill on logout
      if (rememberMe) {
        localStorage.setItem(
          REMEMBER_KEY,
          JSON.stringify({
            identifier: identifier.trim(),
            password,
            rememberMe: true,
          })
        );
      } else {
        localStorage.removeItem(REMEMBER_KEY);
      }

      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch {
      // Handled via Redux state authError
    }
  };

  const hasIdentifierError = Boolean(touched.identifier && errors.identifier);
  const hasPasswordError = Boolean(touched.password && errors.password);

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
                  className={`pooja-auth__input ${hasIdentifierError ? "pooja-auth__input--error" : ""
                    }`}
                  placeholder="e.g. admin or admin@poojafashion.com"
                  value={identifier}
                  onChange={handleIdentifierChange}
                  onBlur={handleBlur("identifier")}
                  autoComplete="username"
                  disabled={loading}
                  aria-invalid={hasIdentifierError}
                  aria-describedby={hasIdentifierError ? "identifier-error" : undefined}
                  required
                />
              </div>
              {hasIdentifierError && (
                <div id="identifier-error" className="pooja-auth__field-error" role="alert">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.identifier}</span>
                </div>
              )}
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
                  className={`pooja-auth__input pooja-auth__input--password ${hasPasswordError ? "pooja-auth__input--error" : ""
                    }`}
                  placeholder="Enter your account password"
                  value={password}
                  onChange={handlePasswordChange}
                  onBlur={handleBlur("password")}
                  autoComplete="current-password"
                  disabled={loading}
                  aria-invalid={hasPasswordError}
                  aria-describedby={hasPasswordError ? "password-error" : undefined}
                  required
                />
                <button
                  type="button"
                  className="pooja-auth__password-toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {hasPasswordError && (
                <div id="password-error" className="pooja-auth__field-error" role="alert">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.password}</span>
                </div>
              )}
            </div>

            {/* Remember Login Credentials Checkbox */}
            <div className="pooja-auth__remember-row">
              <label className="pooja-auth__remember-label" htmlFor="remember-me">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={handleRememberMeChange}
                  className="pooja-auth__checkbox"
                  disabled={loading}
                />
                <span>Remember login credentials</span>
              </label>
            </div>

            {authError ? (
              <div className="pooja-auth__error" role="alert">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
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
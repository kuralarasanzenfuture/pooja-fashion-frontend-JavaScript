import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export default function PageHeader({
  title,
  subtitle,
  description,
  actions,
  action,
  breadcrumbs,
  children,
  className = "",
}) {
  const desc = subtitle || description;
  const actionItems = actions || action || children;

  return (
    <div className={`mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between ${className}`}>
      <div>
        {breadcrumbs && (
          <div className="text-xs text-base-content/60 font-medium mb-1.5">
            {Array.isArray(breadcrumbs) ? (
              <nav className="flex flex-wrap items-center gap-1.5" aria-label="Breadcrumb">
                {breadcrumbs.map((item, idx) => {
                  const isLast = idx === breadcrumbs.length - 1;
                  const label = typeof item === "string" ? item : item?.label || "";
                  const href = typeof item === "object" ? item?.href : null;

                  return (
                    <React.Fragment key={idx}>
                      {idx > 0 && (
                        <ChevronRight className="size-3 text-base-content/40 shrink-0" />
                      )}
                      {href && !isLast ? (
                        <Link
                          to={href}
                          className="hover:text-primary transition-colors truncate max-w-[160px]"
                        >
                          {label}
                        </Link>
                      ) : (
                        <span
                          className={`truncate max-w-[200px] ${
                            isLast ? "text-base-content font-semibold" : ""
                          }`}
                        >
                          {label}
                        </span>
                      )}
                    </React.Fragment>
                  );
                })}
              </nav>
            ) : (
              breadcrumbs
            )}
          </div>
        )}
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-base-content font-display">
          {title}
        </h1>
        {desc && (
          <p className="mt-1 text-xs sm:text-sm text-base-content/60 font-medium max-w-2xl">{desc}</p>
        )}
      </div>
      {actionItems && (
        <div className="flex flex-wrap items-center gap-2.5">{actionItems}</div>
      )}
    </div>
  );
}

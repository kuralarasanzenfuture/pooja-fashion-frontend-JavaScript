import React from "react";

export default function PageHeader({
  title,
  subtitle,
  description,
  actions,
  breadcrumbs,
  className = "",
}) {
  const desc = subtitle || description;
  return (
    <div className={`mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between ${className}`}>
      <div>
        {breadcrumbs && (
          <div className="text-xs text-base-content/60 font-medium mb-1">
            {breadcrumbs}
          </div>
        )}
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-base-content font-display">
          {title}
        </h1>
        {desc && (
          <p className="mt-1 text-xs sm:text-sm text-base-content/60 font-medium max-w-2xl">{desc}</p>
        )}
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-2.5">{actions}</div>
      )}
    </div>
  );
}

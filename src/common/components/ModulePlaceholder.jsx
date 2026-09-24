import React from "react";
import PageHeader from "./PageHeader.jsx";
import Button from "./Button.jsx";
import { Plus, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes.js";

export default function ModulePlaceholder({ title, description, moduleName }) {
  return (
    <div className="space-y-6">
      <PageHeader
        title={title}
        subtitle={description}
        actions={
          <Button variant="primary" icon={Plus}>
            Add New {moduleName}
          </Button>
        }
      />

      <div className="bg-white rounded-xl border border-stone-200/90 p-12 text-center shadow-xs">
        <div className="w-16 h-16 mx-auto rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 text-2xl font-bold mb-4 font-display">
          {moduleName.charAt(0)}
        </div>
        <h2 className="text-xl font-bold text-stone-900 font-display">
          {title} Module Ready
        </h2>
        <p className="mt-2 text-sm text-stone-500 max-w-md mx-auto">
          The {moduleName.toLowerCase()} service and state architecture are configured.
          You can manage records, export GST reports, and filter by bolt/batch here.
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <Link to={ROUTES.DASHBOARD}>
            <Button variant="outline" icon={ArrowLeft}>
              Back to Dashboard
            </Button>
          </Link>
          <Button variant="primary" icon={Plus}>
            Create First {moduleName}
          </Button>
        </div>
      </div>
    </div>
  );
}

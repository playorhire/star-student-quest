import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Checkbox } from "@/components/ui/checkbox";
import { ErrorState } from "@/components/ErrorState";
import { notifyError, describeSupabaseError } from "@/lib/handle-error";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";
import {
  FEATURES,
  FEATURE_SECTIONS,
  ROLES,
  type TenantRole,
} from "@/lib/permissions";

export const Route = createFileRoute("/_authenticated/super-admin/roles")({
  component: RolesMatrixPage,
});

type Matrix = Record<string, boolean>; // key: `${role}:${feature_key}`

const cellKey = (role: TenantRole, feat: string) => `${role}:${feat}`;

function RolesMatrixPage() {
  const [initial, setInitial] = useState<Matrix>({});
  const [matrix, setMatrix] = useState<Matrix>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from("role_permissions" as never)
        .select("role, feature_key, allowed");
      if (err) throw err;
      const next: Matrix = {};
      for (const role of ROLES.map((r) => r.key)) {
        for (const f of FEATURES) next[cellKey(role, f.key)] = false;
      }
      for (const row of (data ?? []) as Array<{
        role: TenantRole;
        feature_key: string;
        allowed: boolean;
      }>) {
        next[cellKey(row.role, row.feature_key)] = row.allowed;
      }
      setInitial(next);
      setMatrix(next);
    } catch (err) {
      setError(describeSupabaseError(err));
      notifyError("Failed to load permissions", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const dirty = useMemo(
    () => Object.keys(matrix).some((k) => matrix[k] !== initial[k]),
    [matrix, initial]
  );

  const toggleCell = (role: TenantRole, feat: string) => {
    setMatrix((m) => ({ ...m, [cellKey(role, feat)]: !m[cellKey(role, feat)] }));
  };

  const toggleRow = (feat: string, value: boolean) => {
    setMatrix((m) => {
      const next = { ...m };
      for (const r of ROLES) next[cellKey(r.key, feat)] = value;
      return next;
    });
  };

  const toggleCol = (role: TenantRole, value: boolean) => {
    setMatrix((m) => {
      const next = { ...m };
      for (const f of FEATURES) next[cellKey(role, f.key)] = value;
      return next;
    });
  };

  const save = async () => {
    setSaving(true);
    try {
      const changed = Object.keys(matrix).filter((k) => matrix[k] !== initial[k]);
      const rows = changed.map((k) => {
        const [role, feature_key] = k.split(":") as [TenantRole, string];
        return { role, feature_key, allowed: matrix[k] };
      });
      if (rows.length === 0) return;
      const { error: err } = await supabase
        .from("role_permissions" as never)
        .upsert(rows as never, { onConflict: "role,feature_key" });
      if (err) throw err;
      setInitial(matrix);
      toast.success("Permissions saved", {
        description: `${rows.length} change${rows.length === 1 ? "" : "s"} applied`,
      });
    } catch (err) {
      notifyError("Failed to save permissions", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading permissions…
      </div>
    );
  }

  if (error) {
    return <ErrorState title="Couldn't load permissions" message={error} onRetry={load} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-foreground">Roles & Permissions</h1>
          <p className="text-sm text-muted-foreground">
            Set which features each user group can access.
          </p>
        </div>
        <button
          onClick={save}
          disabled={!dirty || saving}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow disabled:opacity-40"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save
        </button>
      </div>

      <div className="rounded-2xl border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-muted/50 sticky top-0 z-10">
              <tr>
                <th className="sticky left-0 z-20 bg-muted/50 text-left px-3 py-2 min-w-[200px] font-semibold">
                  Feature
                </th>
                {ROLES.map((r) => {
                  const allChecked = FEATURES.every((f) => matrix[cellKey(r.key, f.key)]);
                  return (
                    <th key={r.key} className="px-2 py-2 font-semibold text-center min-w-[96px]">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-xs">{r.label}</span>
                        <Checkbox
                          checked={allChecked}
                          onCheckedChange={(v) => toggleCol(r.key, Boolean(v))}
                          aria-label={`Toggle all for ${r.label}`}
                        />
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {FEATURE_SECTIONS.map((section) => (
                <ExpandSection
                  key={section}
                  section={section}
                  matrix={matrix}
                  toggleCell={toggleCell}
                  toggleRow={toggleRow}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {dirty && (
        <p className="text-xs text-muted-foreground">
          You have unsaved changes. Click Save to apply.
        </p>
      )}
    </div>
  );
}

function ExpandSection({
  section,
  matrix,
  toggleCell,
  toggleRow,
}: {
  section: string;
  matrix: Matrix;
  toggleCell: (role: TenantRole, feat: string) => void;
  toggleRow: (feat: string, value: boolean) => void;
}) {
  const feats = FEATURES.filter((f) => f.section === section);
  return (
    <>
      <tr className="bg-muted/30">
        <td
          colSpan={ROLES.length + 1}
          className="sticky left-0 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground"
        >
          {section}
        </td>
      </tr>
      {feats.map((f) => {
        const rowAll = ROLES.every((r) => matrix[cellKey(r.key, f.key)]);
        return (
          <tr key={f.key} className="border-t hover:bg-muted/20">
            <td className="sticky left-0 z-10 bg-card px-3 py-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={rowAll}
                  onCheckedChange={(v) => toggleRow(f.key, Boolean(v))}
                  aria-label={`Toggle all roles for ${f.label}`}
                />
                <div>
                  <div className="font-medium text-foreground">{f.label}</div>
                  <div className="text-[10px] text-muted-foreground font-mono">{f.key}</div>
                </div>
              </div>
            </td>
            {ROLES.map((r) => (
              <td key={r.key} className="px-2 py-2 text-center">
                <Checkbox
                  checked={Boolean(matrix[cellKey(r.key, f.key)])}
                  onCheckedChange={() => toggleCell(r.key, f.key)}
                  aria-label={`${r.label} — ${f.label}`}
                />
              </td>
            ))}
          </tr>
        );
      })}
    </>
  );
}
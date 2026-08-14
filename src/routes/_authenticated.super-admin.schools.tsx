import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "../lib/auth-context";
import { useEffect, useState, type ChangeEvent } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Building2, Plus, Trash2, Pencil, Upload, Loader2, Search, X } from "lucide-react";
import { toast } from "sonner";
import Papa from "papaparse";

export const Route = createFileRoute("/_authenticated/super-admin/schools")({
  component: SchoolsManagement,
});

function splitCommaSeparatedNames(rawValue: string) {
  return rawValue
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

function SchoolsManagement() {
  const { user } = useAuth();
  const [schools, setSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formName, setFormName] = useState("");
  const [formAddress, setFormAddress] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [importing, setImporting] = useState(false);
  const [importSummary, setImportSummary] = useState<string | null>(null);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadSchools(searchQuery);
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [searchQuery]);

  async function loadSchools(searchTerm = searchQuery) {
    setLoading(true);
    const query = (supabase as any)
      .from("schools")
      .select("*, branches(id, name)")
      .order("created_at", { ascending: false });
    const { data, error } = searchTerm.trim()
      ? await query.ilike("name", `%${searchTerm.trim()}%`)
      : await query;
    if (error) toast.error(error.message);
    else setSchools(data || []);
    setLoading(false);
  }

  async function handleSave() {
    if (!formName.trim()) { toast.error("Name is required"); return; }
    const payload = { name: formName.trim(), address: formAddress.trim() || null };

    if (isEditing && isEditing !== "new") {
      const { error } = await (supabase as any).from("schools").update(payload).eq("id", isEditing);
      if (error) toast.error(error.message);
      else toast.success("School updated");
    } else {
      const { error } = await (supabase as any).from("schools").insert(payload);
      if (error) toast.error(error.message);
      else toast.success("School created");
    }

    setIsEditing(null);
    setFormName("");
    setFormAddress("");
    loadSchools();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this school and all its branches?")) return;
    const { error } = await (supabase as any).from("schools").delete().eq("id", id);
    if (error) toast.error(error.message);
    else toast.success("School deleted");
    loadSchools();
  }

  async function handleBulkImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setImportSummary(null);

    try {
      const text = await file.text();
      const parsed = Papa.parse<Record<string, string>>(text, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim().toLowerCase(),
      });

      const rows = parsed.data.filter((row) => row && Object.values(row).some((value) => String(value || "").trim()));
      if (!rows.length) {
        toast.error("The selected file did not contain any usable rows.");
        setImporting(false);
        event.target.value = "";
        return;
      }

      let createdSchools = 0;
      let createdBranches = 0;
      let createdClasses = 0;
      let duplicates = 0;
      const skipped: string[] = [];

      for (const row of rows) {
        const schoolName = (row.school_name || row.school || "").trim();
        const schoolAddress = (row.school_address || row.address || "").trim();
        const branchName = (row.branch_name || row.branch || "").trim();
        const classNames = splitCommaSeparatedNames(row.class_name || row.class || "");

        if (!schoolName) {
          skipped.push("Missing school name");
          continue;
        }

        const { data: existingSchool, error: schoolLookupError } = await (supabase as any)
          .from("schools")
          .select("id")
          .eq("name", schoolName)
          .maybeSingle();

        if (schoolLookupError) throw schoolLookupError;

        let schoolId: string;
        if (existingSchool) {
          schoolId = existingSchool.id;
          duplicates += 1;
        } else {
          const { data: insertedSchool, error: schoolInsertError } = await (supabase as any)
            .from("schools")
            .insert({ name: schoolName, address: schoolAddress || null })
            .select("id")
            .single();

          if (schoolInsertError) throw schoolInsertError;
          schoolId = insertedSchool.id;
          createdSchools += 1;
        }

        if (branchName) {
          const { data: existingBranch, error: branchLookupError } = await (supabase as any)
            .from("branches")
            .select("id")
            .eq("school_id", schoolId)
            .ilike("name", branchName)
            .maybeSingle();

          if (branchLookupError) throw branchLookupError;

          let branchId: string;
          if (existingBranch) {
            branchId = existingBranch.id;
            duplicates += 1;
          } else {
            const { data: insertedBranch, error: branchInsertError } = await (supabase as any)
              .from("branches")
              .insert({ name: branchName, school_id: schoolId })
              .select("id")
              .single();

            if (branchInsertError) throw branchInsertError;
            branchId = insertedBranch.id;
            createdBranches += 1;
          }

          for (const className of classNames) {
            const { data: existingClass, error: classLookupError } = await (supabase as any)
              .from("classes")
              .select("id")
              .eq("school_id", schoolId)
              .eq("branch_id", branchId)
              .ilike("name", className)
              .maybeSingle();

            if (classLookupError) throw classLookupError;

            if (existingClass) {
              duplicates += 1;
            } else {
              const { error: classInsertError } = await (supabase as any)
                .from("classes")
                .insert({ name: className, school_id: schoolId, branch_id: branchId });

              if (classInsertError) throw classInsertError;
              createdClasses += 1;
            }
          }
        } else {
          for (const className of classNames) {
            const { data: existingClass, error: classLookupError } = await (supabase as any)
              .from("classes")
              .select("id")
              .eq("school_id", schoolId)
              .is("branch_id", null)
              .ilike("name", className)
              .maybeSingle();

            if (classLookupError) throw classLookupError;

            if (existingClass) {
              duplicates += 1;
            } else {
              const { error: classInsertError } = await (supabase as any)
                .from("classes")
                .insert({ name: className, school_id: schoolId, branch_id: null });

              if (classInsertError) throw classInsertError;
              createdClasses += 1;
            }
          }
        }
      }

      const summary = [
        `${createdSchools} school${createdSchools === 1 ? "" : "s"} created`,
        `${createdBranches} branch${createdBranches === 1 ? "" : "es"} created`,
        `${createdClasses} class${createdClasses === 1 ? "" : "es"} created`,
        `${duplicates} duplicate${duplicates === 1 ? "" : "s"} skipped`,
      ].join(" • ");
      setImportSummary(summary);
      toast.success("Bulk import completed");
      await loadSchools();
    } catch (error: any) {
      toast.error(error?.message || "Bulk import failed");
    } finally {
      setImporting(false);
      event.target.value = "";
    }
  }

  if (user?.role !== "super_admin") {
    return <div className="text-center py-20"><h1 className="text-xl font-bold">Access Denied</h1></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">Schools</h1>
          <p className="text-sm text-muted-foreground">Manage all schools in the system</p>
        </div>
        <Button onClick={() => { setIsEditing("new"); setFormName(""); setFormAddress(""); }}>
          <Plus className="h-4 w-4 mr-1" /> Add School
        </Button>
      </div>

      {isEditing === "new" && (
        <Card>
          <CardContent className="p-4 space-y-3">
            <Input placeholder="School Name" value={formName} onChange={e => setFormName(e.target.value)} />
            <Input placeholder="Address (optional)" value={formAddress} onChange={e => setFormAddress(e.target.value)} />
            <div className="flex gap-2">
              <Button onClick={handleSave}>Save</Button>
              <Button variant="outline" onClick={() => setIsEditing(null)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-semibold">Bulk import schools, branches, and classes</h2>
              <p className="text-sm text-muted-foreground">Upload a CSV with columns: school_name, school_address, branch_name, class_name. You can enter multiple classes in one row separated by commas, like “Grade 1, Grade 2, Grade 3”.</p>
            </div>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium hover:bg-accent">
              <Upload className="h-4 w-4" />
              {importing ? "Importing..." : "Upload CSV"}
              <input type="file" accept=".csv" className="hidden" onChange={handleBulkImport} />
            </label>
          </div>
          {importing ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing your import...
            </div>
          ) : null}
          {importSummary ? (
            <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">
              {importSummary}
            </div>
          ) : null}
        </CardContent>
      </Card>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          aria-label="Search schools"
          className="pl-9 pr-9"
          placeholder="Search by school name"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
        />
        {searchQuery && (
          <Button
            aria-label="Clear school search"
            className="absolute right-1 top-1/2 -translate-y-1/2"
            onClick={() => setSearchQuery("")}
            size="icon"
            type="button"
            variant="ghost"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : schools.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          {searchQuery.trim() ? "No schools match your search" : "No schools yet"}
        </div>
      ) : (
        <div className="space-y-3">
          {schools.map(school => (
            <Card key={school.id}>
              <CardContent className="p-4">
                {isEditing === school.id ? (
                  <div className="space-y-3">
                    <Input value={formName} onChange={e => setFormName(e.target.value)} />
                    <Input value={formAddress} onChange={e => setFormAddress(e.target.value)} />
                    <div className="flex gap-2">
                      <Button onClick={handleSave}>Save</Button>
                      <Button variant="outline" onClick={() => setIsEditing(null)}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-bold">{school.name}</div>
                        {school.address && <div className="text-sm text-muted-foreground">{school.address}</div>}
                        <div className="text-xs text-muted-foreground mt-1">
                          {school.branches?.length || 0} branches
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost" size="sm"
                        onClick={() => { setIsEditing(school.id); setFormName(school.name); setFormAddress(school.address || ""); }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(school.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

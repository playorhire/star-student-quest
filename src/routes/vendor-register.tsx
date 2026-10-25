import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, CheckCircle2, Store } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/vendor-register")({ component: VendorRegister });

function VendorRegister() {
  const [form, setForm] = useState({ shop_name: "", owner_name: "", email: "", phone: "", address: "", city: "", description: "" });
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const { error } = await (supabase as any).from("vendor_applications").insert(form);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    setSubmitted(true);
  }

  return <main className="min-h-screen bg-gradient-to-br from-[#f3faff] via-white to-[#f4efff] px-4 py-8 text-[#073d7a]">
    <div className="mx-auto max-w-xl">
      <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-blue-700"><ArrowLeft className="h-4 w-4" /> Back to StarPoints</Link>
      <div className="mt-8 rounded-3xl border border-blue-100 bg-white p-6 shadow-xl shadow-blue-900/5 sm:p-9">
        {submitted ? <div className="py-8 text-center"><CheckCircle2 className="mx-auto h-14 w-14 text-emerald-500" /><h1 className="mt-4 text-2xl font-black">Application received</h1><p className="mt-2 text-sm leading-6 text-slate-600">Thanks for your interest. Our team will review your shop and contact you about next steps.</p><Link to="/" className="mt-6 inline-block"><Button className="rounded-xl">Back to home</Button></Link></div> : <>
          <div className="mb-6 flex items-center gap-3"><div className="grid h-12 w-12 place-items-center rounded-2xl bg-violet-100 text-violet-700"><Store /></div><div><p className="text-xs font-black uppercase tracking-wide text-violet-600">Reward partners</p><h1 className="text-2xl font-black">Become a vendor</h1></div></div>
          <p className="mb-6 text-sm leading-6 text-slate-600">Tell us about your business. After approval, we’ll set up your vendor access and assign the schools where your items can be listed.</p>
          <form onSubmit={submit} className="space-y-4">
            <Field label="Shop or business name" required><Input required value={form.shop_name} onChange={(e) => update("shop_name", e.target.value)} /></Field>
            <Field label="Owner / contact name" required><Input required value={form.owner_name} onChange={(e) => update("owner_name", e.target.value)} /></Field>
            <Field label="Business email" required><Input required type="email" value={form.email} onChange={(e) => update("email", e.target.value)} /></Field>
            <div className="grid gap-4 sm:grid-cols-2"><Field label="Phone" required><Input required type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} /></Field><Field label="City" required><Input required value={form.city} onChange={(e) => update("city", e.target.value)} /></Field></div>
            <Field label="Business address" required><Input required value={form.address} onChange={(e) => update("address", e.target.value)} /></Field>
            <Field label="What would you like to offer? (optional)"><Textarea rows={3} value={form.description} onChange={(e) => update("description", e.target.value)} /></Field>
            <Button disabled={saving} className="h-11 w-full rounded-xl bg-[#0874db]">{saving ? "Submitting..." : "Submit vendor application"}</Button>
          </form>
        </>}
      </div>
    </div>
  </main>;
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label>{label}{required ? " *" : ""}</Label>{children}</div>;
}

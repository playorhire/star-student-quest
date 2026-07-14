import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Ticket, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/vendor/redeemed")({
  component: VendorRedeemed,
});

function VendorRedeemed() {
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  async function collect() {
    const c = code.trim().toUpperCase();
    if (c.length !== 10) { toast.error("Voucher must be 10 characters"); return; }
    setBusy(true);
    setResult(null);
    const { data, error } = await (supabase as any).rpc("collect_voucher", { p_code: c });
    setBusy(false);
    if (error) { setResult({ ok: false, message: error.message }); return; }
    const parsed = typeof data === "string" ? JSON.parse(data) : data;
    if (parsed.success) {
      toast.success("Voucher collected");
      setResult({ ok: true, message: "Voucher successfully collected" });
      setCode("");
    } else {
      setResult({ ok: false, message: parsed.message || "Failed" });
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-black text-foreground">Redeem Voucher</h1>
        <p className="text-sm text-muted-foreground">Enter a customer's 10-character voucher code</p>
      </div>
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-2 text-primary">
            <Ticket className="h-5 w-5" />
            <span className="text-sm font-bold">Voucher</span>
          </div>
          <div>
            <Label className="text-xs">Voucher code</Label>
            <Input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} maxLength={10} placeholder="SPX82M4AZ1" className="rounded-xl font-mono tracking-widest text-center text-lg" />
          </div>
          <Button className="w-full rounded-xl" disabled={busy} onClick={collect}>
            {busy ? "Verifying..." : (<><CheckCircle2 className="h-4 w-4 mr-1" /> Verify & Collect</>)}
          </Button>
          {result && (
            <div className={`p-3 rounded-xl text-sm ${result.ok ? "bg-emerald-500/10 text-emerald-700" : "bg-red-500/10 text-red-700"}`}>
              {result.message}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
import { createFileRoute } from "@tanstack/react-router";
import { students } from "../lib/mock-data";
import { Card, CardContent } from "../components/ui/card";
import { QRCodeSVG } from "qrcode.react";

export const Route = createFileRoute("/_authenticated/_student/qr")({
  component: StudentQR,
});

function StudentQR() {
  const student = students[0];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-black text-foreground">My QR Card</h1>
        <p className="text-sm text-muted-foreground">Show this to your teacher</p>
      </div>

      <Card className="border-2 border-primary/20 overflow-hidden">
        <div className="bg-gradient-to-br from-primary to-accent p-6 text-center">
          <div className="text-5xl mb-2">{student.avatarEmoji}</div>
          <h2 className="text-xl font-black text-primary-foreground">{student.name}</h2>
          <p className="text-sm text-primary-foreground/80">
            Class {student.className} • Roll #{student.rollNumber}
          </p>
        </div>
        <CardContent className="flex flex-col items-center p-8">
          <div className="bg-card p-4 rounded-2xl shadow-lg">
            <QRCodeSVG
              value={student.qrCode}
              size={200}
              bgColor="transparent"
              fgColor="currentColor"
              className="text-foreground"
              level="H"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-4 font-mono">{student.qrCode}</p>
        </CardContent>
      </Card>

      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
          <span className="text-lg">⭐</span>
          <span className="font-bold text-primary">{student.totalPoints} points</span>
        </div>
      </div>
    </div>
  );
}

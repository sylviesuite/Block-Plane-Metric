import React from "react";
import { Button, Card, CardHeader, CardTitle, CardContent } from "./ui";

interface BannerPanelProps {
  baselineName?: string | null;
}

export default function BannerPanel({ baselineName }: BannerPanelProps) {
  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    } catch (e) {
      console.error("Copy failed", e);
      alert("Copy failed");
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Quick actions</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-2">
        <Button variant="secondary" onClick={copyShareLink}>
          Copy share link
        </Button>
        <Button variant="primary" onClick={() => window.print()}>
          Print / Save PDF
        </Button>
      </CardContent>
    </Card>
  );
}

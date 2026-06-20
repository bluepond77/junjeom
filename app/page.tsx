import { AppShell } from "@/components/app-shell";

export default function Home() {
  return (
    <AppShell>
      <h1 className="text-2xl font-bold text-foreground">홈</h1>
      <p className="mt-2 text-muted-foreground">대시보드는 곧 만나요.</p>
    </AppShell>
  );
}

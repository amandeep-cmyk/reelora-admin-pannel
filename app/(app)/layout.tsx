import { CrmProvider } from "@/components/providers/crm-provider"
import { AppShell } from "@/components/shell/app-shell"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <CrmProvider>
      <AppShell>{children}</AppShell>
    </CrmProvider>
  )
}

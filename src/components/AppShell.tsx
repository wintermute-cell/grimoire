import { AppShell as MantineAppShell } from '@mantine/core';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <MantineAppShell>
      {children}
    </MantineAppShell>
  );
}


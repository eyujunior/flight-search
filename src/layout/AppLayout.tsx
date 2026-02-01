import { Container } from "@mui/material";
import type { ReactNode } from "react";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {children}
    </Container>
  );
}

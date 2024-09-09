import "@repo/ui/globals.css";

import { CommandDialogMenu } from "@/components/cmd-menu";
import { CommandMenuProvider } from "@/components/cmd-provider";
import { QueryProvider } from "@/components/query-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@ui/tooltip";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Assistant",
  description: "A personal AI assistant",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={GeistSans.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <CommandMenuProvider>
              <TooltipProvider>
                <CommandDialogMenu />
                {children}
              </TooltipProvider>
            </CommandMenuProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

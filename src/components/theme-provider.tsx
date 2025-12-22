import { ThemeProvider as NextThemesProvider, ThemeProviderProps as NextThemesOriginalProps } from "next-themes";
import * as React from "react";

type ThemeProviderProps = NextThemesOriginalProps & {
  children: React.ReactNode;
};

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

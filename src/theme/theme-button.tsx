import { MoonIcon, SunIcon } from "lucide-react";
import { useCallback } from "react";

import IconButton from "~/ui/icon-button";

import { useTheme } from "./theme";

//------------------------------------------------------------------------------
// Theme Button
//------------------------------------------------------------------------------

export default function ThemeButton() {
  const [theme, setTheme] = useTheme();

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, [setTheme]);

  return (
    <IconButton
      Icon={theme === "dark" ? MoonIcon : SunIcon}
      aria-label="Toggle theme"
      onClick={toggleTheme}
      size="sm"
      variant="subtle"
    />
  );
}

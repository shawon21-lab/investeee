import { create } from "zustand";

interface ThemeProps {
  mode: "light" | "dark";
  onDarkMode: () => void;
  onLightMode: () => void;
  onInitialMode: () => void;
}

const getCurrentThemMode = (): "light" | "dark" => {
  const themeMode = localStorage.getItem("theme-mode");
  if (!themeMode || themeMode === "light") return "light";
  return "dark";
};

const onDarkModeHandler = (): { mode: "dark" } => {
  localStorage.setItem("theme-mode", "dark");
  return { mode: "dark" };
};

const onLightModeHandler = (): { mode: "light" } => {
  localStorage.setItem("theme-mode", "light");
  return { mode: "light" };
};

const useTheme = create<ThemeProps>((set) => ({
  mode: "light",
  onDarkMode: () => set(onDarkModeHandler),
  onLightMode: () => set(onLightModeHandler),
  onInitialMode: () => set({ mode: getCurrentThemMode() }),
}));

export default useTheme;

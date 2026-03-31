import { Suspense } from "react";
import ColorGeneratorPage from "../components/color-generator/ColorGeneratorPage";

export const metadata = {
  title: "Color Generator",
  description:
    "Generate color palettes and export Tailwind, CSS, inline styles",
};

export default function Page() {
  return (
    <Suspense>
      <ColorGeneratorPage />
    </Suspense>
  );
}

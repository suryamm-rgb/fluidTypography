import { Suspense } from "react";
import "../../styles/app.css";
import FluidTypographyGenerator from "../../components/FluidTypographyGenerator";
import GeneratorSkeleton from "../../components/GeneratorSkeleton";

export const metadata = {
  title: "Fluid Typography Generator",
  description:
    "Generate CSS clamp() values for fluid font sizes. Live preview, type scale and export to CSS, JSON and Tailwind.",
};

export default function FluidTypographyPage() {
  return (
    <Suspense fallback={<GeneratorSkeleton />}>
      <FluidTypographyGenerator />
    </Suspense>
  );
}

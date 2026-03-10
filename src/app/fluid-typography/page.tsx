import { Suspense } from "react";
import FluidTypographyGenerator from "../../components/FluidTypographyGenerator";

export const metadata = {
  title: "Fluid Typography Generator",
  description: "Generate CSS clamp() formulas for fluid typography",
};

export default function FluidTypographyPage() {
  return (
    <Suspense>
      <FluidTypographyGenerator />
    </Suspense>
  );
}

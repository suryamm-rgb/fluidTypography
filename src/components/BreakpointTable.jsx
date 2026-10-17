"use client";
import { useMemo } from "react";
import Card from "./Card";
import { generateBreakpointTable } from "./CalculateClamp";

const DEVICES = {
  320: "iPhone SE",
  375: "iPhone 14",
  480: "Small mobile",
  640: "Large mobile",
  768: "iPad",
  1024: "iPad Pro",
  1280: "Desktop",
  1440: "Large desktop",
  1920: "Wide screen",
};
const ZONE_LABEL = { min: "min", fluid: "fluid", max: "max" };

export default function BreakpointTable({ minFont, maxFont, minScreen, maxScreen }) {
  const rows = useMemo(
    () => generateBreakpointTable(minFont, maxFont, minScreen, maxScreen),
    [minFont, maxFont, minScreen, maxScreen],
  );
  const lo = Math.min(minFont, maxFont);
  const hi = Math.max(minFont, maxFont);

  return (
    <Card id="breakpoints" title="Breakpoint table" subtitle="The font size you get at common screen widths.">
      <div className="table-wrap">
        <table className="bp-table">
          <thead>
            <tr>
              <th scope="col">Screen</th>
              <th scope="col">Device</th>
              <th scope="col">Font size</th>
              <th scope="col">Zone</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ screen, size, zone }) => {
              const pct = hi !== lo ? Math.max(0, Math.min(100, ((size - lo) / (hi - lo)) * 100)) : 100;
              return (
                <tr key={screen}>
                  <td data-label="Screen" className="num">
                    {screen}px
                  </td>
                  <td data-label="Device" className={DEVICES[screen] ? undefined : "no-device"}>
                    {DEVICES[screen] ?? ""}
                  </td>
                  <td data-label="Font size" className="num">
                    <span>
                      {size}px
                      <span className="bp-bar" aria-hidden="true">
                        <i style={{ width: `${pct}%` }} />
                      </span>
                    </span>
                  </td>
                  <td data-label="Zone">
                    <span className={`badge${zone === "fluid" ? " badge--fluid" : ""}`}>{ZONE_LABEL[zone]}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

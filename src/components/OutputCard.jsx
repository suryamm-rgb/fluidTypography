"use client";
import { useId, useMemo, useState } from "react";
import Card from "./Card";
import Tabs, { panelId, tabId } from "./Tabs";
import CodeBlock from "./CodeBlock";
import CopyButton from "./CopyButton";
import { getClampValue } from "./CalculateClamp";
import { buildSingle, FORMATS, FORMAT_META } from "../lib/exporters";

const UNITS = [
  { id: "rem", label: "rem" },
  { id: "px", label: "px" },
  { id: "em", label: "em" },
];
const FORMAT_TABS = FORMATS.map((f) => ({ id: f, label: f }));

export default function OutputCard({
  result,
  minFont,
  maxFont,
  minScreen,
  maxScreen,
  unit,
  setUnit,
  format,
  setFormat,
}) {
  const uid = useId();
  const [name, setName] = useState("text-base");
  const cleanName = name.replace(/^-+/, "").trim() || "text-base";

  const value = getClampValue(result, unit);
  const code = useMemo(
    () => buildSingle(format, { result, unit, name: cleanName, minFont, maxFont, minScreen, maxScreen }),
    [format, result, unit, cleanName, minFont, maxFont, minScreen, maxScreen],
  );

  const stats = [
    { label: "min", value: `${result.minRem}rem`, sub: `${Math.min(minFont, maxFont)}px` },
    { label: "preferred", value: `${result.interceptRem}rem + ${result.vwFixed}vw`, sub: "fluid part" },
    { label: "max", value: `${result.maxRem}rem`, sub: `${Math.max(minFont, maxFont)}px` },
  ];

  return (
    <Card
      id="output"
      title="Your clamp()"
      subtitle="Paste it into your CSS. Pick the unit and format you need."
      actions={<Tabs items={UNITS} value={unit} onChange={setUnit} prefix={`${uid}-unit`} label="Unit" className="tabs--inline tabs--mono" />}
    >
      <div role="tabpanel" id={panelId(`${uid}-unit`, unit)} aria-labelledby={tabId(`${uid}-unit`, unit)}>
        <CodeBlock code={value} label={`clamp value in ${unit}`} wrap large />
      </div>
      <div className="output-actions">
        <CopyButton text={value} label="Copy clamp()" variant="primary" toast="clamp() copied!" />
      </div>

      <hr className="divider" />

      <div className="output-bar">
        <Tabs items={FORMAT_TABS} value={format} onChange={setFormat} prefix={`${uid}-fmt`} label="Export format" className="tabs--inline" />
        <label className="name-field">
          Name
          <input
            className="input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            aria-label="Variable name"
          />
        </label>
      </div>
      <div role="tabpanel" id={panelId(`${uid}-fmt`, format)} aria-labelledby={tabId(`${uid}-fmt`, format)}>
        <CodeBlock code={code} label={`${format} output`} />
      </div>
      <div className="output-actions">
        <CopyButton text={code} label={`Copy ${format}`} toast={`${format} copied!`} />
        <a
          className="btn"
          href={`data:${FORMAT_META[format].mime};charset=utf-8,${encodeURIComponent(code)}`}
          download={`fluid-text.${FORMAT_META[format].ext}`}
        >
          Download .{FORMAT_META[format].ext}
        </a>
      </div>

      <dl className="stats">
        {stats.map((s) => (
          <div className="stat" key={s.label}>
            <dt>{s.label}</dt>
            <dd>
              {s.value}
              <small>{s.sub}</small>
            </dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}

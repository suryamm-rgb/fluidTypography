"use client";
import { useId, useMemo } from "react";
import Card from "./Card";
import Tabs, { panelId, tabId } from "./Tabs";
import CodeBlock from "./CodeBlock";
import CopyButton from "./CopyButton";
import { DownloadIcon } from "./Icons";
import { buildScale, FORMATS, FORMAT_META } from "../lib/exporters";
import { downloadText } from "../lib/download";

const FORMAT_TABS = FORMATS.map((f) => ({ id: f, label: f }));

export default function ExportPanel({ result, scale, unit, minFont, maxFont, minScreen, maxScreen, format, setFormat }) {
  const uid = useId();
  const code = useMemo(
    () => buildScale(format, { result, scale, unit, minFont, maxFont, minScreen, maxScreen }),
    [format, result, scale, unit, minFont, maxFont, minScreen, maxScreen],
  );
  const meta = FORMAT_META[format];

  return (
    <Card
      id="export"
      title="Export"
      subtitle={`${minFont}px → ${maxFont}px · ${minScreen}px → ${maxScreen}px · ${unit}`}
      actions={<Tabs items={FORMAT_TABS} value={format} onChange={setFormat} prefix={`${uid}-fmt`} label="Export format" className="tabs--inline" />}
    >
      <div role="tabpanel" id={panelId(`${uid}-fmt`, format)} aria-labelledby={tabId(`${uid}-fmt`, format)}>
        <CodeBlock code={code} label={`${format} export`} />
      </div>
      <div className="output-actions">
        <CopyButton text={code} label={`Copy ${format}`} variant="primary" toast={`${format} copied!`} />
        <button type="button" className="btn" onClick={() => downloadText(code, `fluid-typography.${meta.ext}`, meta.mime)}>
          <DownloadIcon size={16} />
          Download .{meta.ext}
        </button>
      </div>
    </Card>
  );
}

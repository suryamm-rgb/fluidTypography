"use client";
import { useId, useMemo, useRef, useState } from "react";
import Card from "./Card";
import Tabs, { panelId, tabId } from "./Tabs";
import CodeBlock from "./CodeBlock";
import CopyButton from "./CopyButton";
import EmptyState from "./EmptyState";
import { TrashIcon, DownloadIcon } from "./Icons";
import { calculateClamp } from "./CalculateClamp";
import { buildSaved, FORMATS, FORMAT_META } from "../lib/exporters";
import { downloadText } from "../lib/download";

const FORMAT_TABS = FORMATS.map((f) => ({ id: f, label: f }));
let nextId = 1;

export default function SavedConfigs({ current, unit }) {
  const uid = useId();
  const [configs, setConfigs] = useState([]);
  const [format, setFormat] = useState("CSS");
  const [naming, setNaming] = useState(false);
  const [name, setName] = useState("");
  const nameRef = useRef(null);

  const alreadySaved = configs.some(
    (c) =>
      c.minFont === current.minFont &&
      c.maxFont === current.maxFont &&
      c.minScreen === current.minScreen &&
      c.maxScreen === current.maxScreen &&
      c.rootSize === current.rootSize,
  );

  const save = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    setConfigs((prev) => [...prev, { id: nextId++, name: trimmed, ...current }]);
    setName("");
    setNaming(false);
  };

  const code = useMemo(() => buildSaved(format, configs, unit, calculateClamp), [format, configs, unit]);
  const meta = FORMAT_META[format];

  return (
    <Card
      id="saved"
      title="Saved configurations"
      subtitle={configs.length ? `${configs.length} saved this session` : "Save the current settings to compare or export them together."}
      actions={
        !naming && (
          <button
            type="button"
            className="btn"
            disabled={alreadySaved}
            onClick={() => {
              setNaming(true);
              setTimeout(() => nameRef.current?.focus(), 0);
            }}
          >
            {alreadySaved ? "Already saved" : "Save current"}
          </button>
        )
      }
    >
      {naming && (
        <form className="inline-form" onSubmit={save}>
          <label className="sr-only" htmlFor={`${uid}-name`}>
            Name for this configuration
          </label>
          <input
            id={`${uid}-name`}
            ref={nameRef}
            className="input"
            value={name}
            placeholder="e.g. Hero title"
            maxLength={40}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && setNaming(false)}
          />
          <button className="btn btn--primary" type="submit" disabled={!name.trim()}>
            Save
          </button>
          <button className="btn" type="button" onClick={() => setNaming(false)}>
            Cancel
          </button>
        </form>
      )}

      {configs.length === 0 ? (
        <EmptyState small title="Nothing saved yet">
          Press “Save current” to keep these settings for this session.
        </EmptyState>
      ) : (
        <>
          <ul className="saved-list">
            {configs.map((c) => (
              <li className="saved-item" key={c.id}>
                <div className="saved-item__main">
                  <p className="saved-item__name">{c.name}</p>
                  <p className="saved-item__meta">
                    {c.minFont}→{c.maxFont}px · {c.minScreen}→{c.maxScreen}px · root {c.rootSize}px
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={() => setConfigs((prev) => prev.filter((x) => x.id !== c.id))}
                  aria-label={`Delete ${c.name}`}
                >
                  <TrashIcon size={16} />
                  Delete
                </button>
              </li>
            ))}
          </ul>
          <hr className="divider" />
          <div className="output-bar">
            <Tabs items={FORMAT_TABS} value={format} onChange={setFormat} prefix={`${uid}-fmt`} label="Saved export format" className="tabs--inline" />
          </div>
          <div role="tabpanel" id={panelId(`${uid}-fmt`, format)} aria-labelledby={tabId(`${uid}-fmt`, format)}>
            <CodeBlock code={code} label={`Saved configurations as ${format}`} />
          </div>
          <div className="output-actions">
            <CopyButton text={code} label={`Copy ${format}`} variant="primary" toast={`${format} copied!`} />
            <button type="button" className="btn" onClick={() => downloadText(code, `fluid-configs.${meta.ext}`, meta.mime)}>
              <DownloadIcon size={16} />
              Download .{meta.ext}
            </button>
          </div>
        </>
      )}
    </Card>
  );
}

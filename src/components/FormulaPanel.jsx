"use client";
import { getFormulaSteps } from "./CalculateClamp";
import { ChevronIcon } from "./Icons";

export default function FormulaPanel({ minFont, maxFont, minScreen, maxScreen, rootSize }) {
  const s = getFormulaSteps(minFont, maxFont, minScreen, maxScreen, rootSize);
  const final = `clamp(${s.minRem}rem, ${s.interceptRem}rem + ${s.vwResult}vw, ${s.maxRem}rem)`;

  const steps = [
    {
      title: "Slope: how much the font grows per px of screen",
      calc: s.slopeCalc,
      result: s.slopeResult,
      note: "Font change divided by screen change.",
    },
    {
      title: "Convert the slope to vw",
      calc: s.vwCalc,
      result: `${s.vwResult}vw`,
      note: "1vw is 1% of the screen width, so multiply by 100.",
    },
    {
      title: "Intercept: where the line starts",
      calc: s.interceptCalc,
      result: `${s.interceptPx}px = ${s.interceptRemCalc} = ${s.interceptRem}rem`,
      note: "This anchors the line to your min screen. Divide by the root size to get rem.",
    },
    {
      title: "Min and max in rem",
      calc: `${s.minRemCalc} | ${s.maxRemCalc}`,
      result: `${s.minRem}rem → ${s.maxRem}rem`,
      note: "rem follows the user's browser font setting. px does not.",
    },
  ];

  return (
    <details className="card disclosure">
      <summary>
        <span>
          <span className="card__title" style={{ display: "block" }}>
            How it was calculated
          </span>
          <span className="card__sub" style={{ display: "block" }}>
            {s.vwResult}vw and {s.interceptRem}rem, step by step
          </span>
        </span>
        <ChevronIcon className="chev" />
      </summary>
      <ol className="steps">
        {steps.map((st, i) => (
          <li className="step" key={st.title}>
            <span className="step__n" aria-hidden="true">
              {i + 1}
            </span>
            <div>
              <h4>{st.title}</h4>
              <code>
                {st.calc} = <b>{st.result}</b>
              </code>
              <p>{st.note}</p>
            </div>
          </li>
        ))}
      </ol>
      <hr className="divider" />
      <p className="eyebrow">Final</p>
      <code className="mono" style={{ display: "block", marginTop: "var(--space-2)", overflowWrap: "anywhere", color: "var(--accent-text)" }}>
        {final}
      </code>
    </details>
  );
}

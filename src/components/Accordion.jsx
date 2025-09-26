import { useState, useRef, useEffect } from "react";

export default function Accordion({ title, subtitle, children }) {
  const [open, setOpen] = useState(false);
  const [height, setHeight] = useState("0px");
  const contentRef = useRef(null);

  useEffect(() => {
    setHeight(open ? `${contentRef.current.scrollHeight}px` : "0px");
  }, [open]);

  return (
    <div className="acc">
      <button className="acc-header" onClick={() => setOpen(!open)}>
        <span className={`acc-arrow ${open ? "open" : ""}`}>▶</span>
        <div>
          <div className="acc-title">{title}</div>
          {subtitle && <div className="acc-sub">{subtitle}</div>}
        </div>
      </button>
      <div
        ref={contentRef}
        style={{ maxHeight: height }}
        className="acc-body-wrapper"
      >
        <div className="acc-body">{children}</div>
      </div>
    </div>
  );
}

import React, { useState, useRef, useEffect, memo } from "react";

function AccordionComponent({ title, children }) { // Removed subtitle as it's unused
  const [open, setOpen] = useState(false);
  const [height, setHeight] = useState("0px");
  const contentRef = useRef(null);

  useEffect(() => {
    // Recalculate height whenever content changes or accordion opens/closes
    setHeight(open ? `${contentRef.current.scrollHeight}px` : "0px");
  }, [open, children]); // Added children dependency

  return (
    <div className={`acc ${open ? 'acc-open' : ''}`}>
      <button type="button" className="acc-header" onClick={() => setOpen(!open)}>
        <span className={`acc-arrow ${open ? "open" : ""}`}>▶</span>
        <div>
          <div className="acc-title">{title}</div>
          {/* Removed subtitle display */}
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

export default memo(AccordionComponent);
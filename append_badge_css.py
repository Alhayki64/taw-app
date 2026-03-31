import sys

css = """
/* ===== DYNAMIC EVENT BADGES ===== */

.dynamic-event-badge {
  position: absolute;
  top: var(--sp-3);
  right: var(--sp-3); /* User requested top-right position overlapping the image */
  font-family: inherit;
  font-size: 0.75rem;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: var(--round-full);
  z-index: 10;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1);
  display: inline-flex;
  align-items: center;
  gap: 4px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  backdrop-filter: blur(4px);
}

body.rtl .dynamic-event-badge {
  right: auto;
  left: var(--sp-3);
}

.badge-amber {
  background-color: rgba(251, 191, 36, 0.9); /* amber-400 */
  color: #78350f; /* amber-900 */
  border: 1px solid rgba(251, 191, 36, 1);
}

.badge-red {
  background-color: rgba(239, 68, 68, 0.9); /* red-500 */
  color: white;
  border: 1px solid rgba(239, 68, 68, 1);
}

.badge-green {
  background-color: rgba(16, 185, 129, 0.9); /* emerald-500 */
  color: white;
  border: 1px solid rgba(16, 185, 129, 1);
}
"""

with open("index.css", "a", encoding="utf-8") as f:
    f.write(css)

print("CSS appended to index.css")

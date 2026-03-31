import sys

css = """
/* ===== DISCOVER REDESIGN ===== */

.discover-redesign-content {
  padding-top: var(--sp-4);
  padding-bottom: calc(var(--bottom-nav-height) + var(--sp-6));
  display: flex;
  flex-direction: column;
  gap: var(--sp-6);
}

/* --- Hero Banner --- */
.discover-weave-hero {
  position: relative;
  overflow: hidden;
  border-radius: 2rem;
  background-color: #1d4a3e;
  box-shadow: var(--shadow-xl);
  cursor: pointer;
  min-height: 380px;
  display: flex;
  flex-direction: column;
}

.weave-hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 50%;
  opacity: 0.4;
}

.weave-hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.weave-hero-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent, #1d4a3e);
}

.weave-hero-content {
  position: relative;
  z-index: 10;
  padding: var(--sp-6) var(--sp-5);
  padding-top: var(--sp-20);
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.weave-hero-text {
  margin-bottom: auto;
}

.weave-hero-title {
  font-family: var(--font-headline);
  font-weight: 800;
  font-size: 2.25rem;
  color: white;
  line-height: 1.1;
  margin-bottom: var(--sp-3);
  letter-spacing: -0.025em;
}

.weave-hero-desc {
  color: var(--primary-fixed-dim);
  font-weight: 500;
  font-size: 1.125rem;
  opacity: 0.9;
  max-width: 280px;
}

.weave-hero-btn {
  background-color: var(--secondary-container);
  color: var(--on-secondary-container);
  font-weight: 700;
  padding: var(--sp-4) var(--sp-6);
  border-radius: 9999px;
  text-align: center;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--sp-2);
  margin-top: var(--sp-8);
  font-family: inherit;
  border: none;
  cursor: pointer;
  width: 100%;
}

.weave-hero-btn:hover { opacity: 0.9; }
.weave-hero-btn:active { transform: scale(0.98); }

/* --- Sections --- */
.discover-mosaic-section,
.discover-bento-section {
  display: flex;
  flex-direction: column;
  gap: var(--sp-4);
}

.discover-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-inline: var(--sp-1);
}

.discover-section-title {
  font-family: var(--font-headline);
  font-weight: 700;
  font-size: 1.125rem;
  color: var(--on-surface);
  letter-spacing: -0.025em;
}

.see-all {
  color: var(--primary);
  font-weight: 700;
  font-size: 0.875rem;
  background: transparent;
  border: none;
  cursor: pointer;
}
.see-all:hover { text-decoration: underline; }

/* --- Mosaic Scroll --- */
.discover-mosaic-scroll {
  display: flex;
  overflow-x: auto;
  margin-inline: calc(var(--sp-4) * -1);
  padding-inline: var(--sp-4);
  padding-bottom: var(--sp-4);
  gap: var(--sp-3);
  scroll-behavior: smooth;
}

.discover-mosaic-scroll.no-scrollbar::-webkit-scrollbar { display: none; }
.discover-mosaic-scroll.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

.discover-mosaic-btn {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sp-2);
  padding: var(--sp-4) var(--sp-5);
  background-color: var(--surface-container);
  border-radius: 1.5rem;
  border: 1px solid rgba(var(--outline-variant-rgb), 0.1);
  min-width: 100px;
  cursor: pointer;
  transition: background-color 0.2s;
  font-family: inherit;
}

.discover-mosaic-btn:hover {
  background-color: rgba(132, 214, 185, 0.2); /* primary-fixed-dim / 20 */
}

.mosaic-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.env-icon { background-color: rgba(0, 84, 64, 0.1); color: var(--primary); }
.elderly-icon { background-color: rgba(254, 216, 138, 0.3); color: var(--secondary); }
.edu-icon { background-color: rgba(66, 104, 95, 0.2); color: var(--tertiary); }
.health-icon { background-color: rgba(255, 218, 214, 0.3); color: var(--error); }
.community-icon { background-color: rgba(132, 214, 185, 0.3); color: var(--primary-container); }

.mosaic-label {
  font-size: 13px;
  font-weight: 700;
  color: var(--on-surface-variant);
}

/* --- Bento Grid --- */
.pulse-anim {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: .5; }
}

.high-priority-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  background-color: var(--error-container);
  color: var(--error);
  padding: 4px 12px;
  border-radius: 9999px;
}

.high-priority-badge .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--error);
}

.high-priority-badge .badge-text {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.discover-bento-grid {
  display: flex;
  flex-direction: column;
  gap: var(--sp-4);
}

.bento-card-large {
  background-color: var(--surface-container-low);
  border-radius: 1.5rem;
  padding: var(--sp-5);
  display: flex;
  flex-direction: column;
  gap: var(--sp-4);
  border: 1px solid rgba(190, 201, 195, 0.2);
  box-shadow: var(--shadow-sm);
  cursor: pointer;
}

.bento-card-large:hover .bento-img {
  transform: scale(1.05);
}

.bento-large-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.bento-org-info {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
}

.bento-org-logo {
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-sm);
}

.bento-org-logo img {
  width: 2.5rem;
  height: 2.5rem;
  object-fit: contain;
}

.bento-title {
  font-weight: 700;
  color: var(--on-surface);
  line-height: 1.25;
}

.bento-subtitle {
  font-size: 0.875rem;
  color: var(--on-surface-variant);
}

.bento-date-badge {
  background-color: rgba(0, 84, 64, 0.1);
  color: var(--primary);
  font-size: 10px;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 0.375rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.bento-image-wrap {
  position: relative;
  height: 12rem;
  border-radius: 0.75rem;
  overflow: hidden;
}

.bento-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.bento-tags {
  position: absolute;
  bottom: 0.75rem;
  left: 0.75rem;
  display: flex;
  gap: var(--sp-2);
}

.bento-tag {
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  color: white;
  padding: 6px 12px;
  border-radius: 9999px;
  font-size: 11px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
}

.bento-tag .material-icons-round {
  font-size: 14px;
}

.bento-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--sp-4);
}

.bento-card-small {
  background-color: var(--surface-container-high);
  border-radius: 1.5rem;
  padding: var(--sp-4);
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
  cursor: pointer;
  border: 1px solid transparent;
  transition: border-color 0.2s;
}

.bento-card-small:hover {
  border-color: rgba(var(--outline-variant-rgb), 0.2);
}

.bento-small-meta {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
}

.bento-small-meta .material-icons-round {
  font-size: 20px;
}

.text-secondary { color: var(--secondary); }
.text-tertiary { color: var(--tertiary); }
.text-primary { color: var(--primary); }

.bento-small-label {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.bento-small-title {
  font-weight: 700;
  font-size: 0.875rem;
  color: var(--on-surface);
}

.bento-small-footer {
  margin-top: auto;
  padding-top: var(--sp-2);
  border-top: 1px solid rgba(190, 201, 195, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.bento-small-time {
  font-size: 11px;
  font-weight: 500;
  color: var(--on-surface-variant);
}

.bento-small-footer .material-icons-round {
  font-size: 18px;
}

/* --- Impact Highlight --- */
.discover-impact-highlight {
  background-color: var(--primary);
  color: var(--on-primary);
  border-radius: 2rem;
  padding: var(--sp-6);
  display: flex;
  align-items: center;
  gap: var(--sp-4);
  cursor: pointer;
}

.impact-hl-text {
  flex: 1;
}

.impact-hl-label {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--primary-fixed-dim);
  margin-bottom: 4px;
}

.impact-hl-title {
  font-family: var(--font-headline);
  font-weight: 700;
  font-size: 1.125rem;
  margin-bottom: 4px;
}

.impact-hl-bar-bg {
  width: 100%;
  height: 6px;
  background-color: var(--primary-container);
  border-radius: 9999px;
  overflow: hidden;
  margin-top: var(--sp-3);
}

.impact-hl-bar-fill {
  height: 100%;
  background-color: var(--primary-fixed-dim);
  border-radius: 9999px;
  transition: width 1s ease-out;
}

.impact-hl-stats {
  text-align: center;
  background-color: rgba(15, 110, 86, 0.3);
  padding: 12px;
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.impact-hl-number {
  font-size: 1.5rem;
  font-weight: 900;
  line-height: 1.25;
}

.impact-hl-unit {
  font-size: 10px;
  text-transform: uppercase;
  font-weight: 700;
  color: var(--primary-fixed-dim);
}

/* --- Arabic Display Alignments --- */
body.rtl .weave-hero-text, body.rtl .weave-hero-btn { text-align: right; }
body.rtl .weave-hero-btn .material-icons-round { transform: rotate(180deg); }
body.rtl .bento-tags { left: auto; right: 0.75rem; }
body.rtl .bento-small-footer .material-icons-round { transform: rotate(180deg); }
"""

with open("index.css", "a", encoding="utf-8") as f:
    f.write(css)

print("CSS appended to index.css")

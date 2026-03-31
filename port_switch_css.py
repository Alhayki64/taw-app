import sys

css = """
/* ===== SUN/MOON DYNAMIC SWITCH (Ported from React) ===== */
.switch-container {
  position: relative;
  display: inline-block;
  width: 3.5em;
  height: 2em;
}

.switch-checkbox {
  opacity: 0;
  width: 0;
  height: 0;
}

.switch-slider {
  position: absolute;
  inset: 0;
  cursor: pointer;
  border-radius: 30px;
  transition: 0.5s;
  background-color: #e5e7eb; /* bg-gray-200 */
}

body.dark-mode .switch-slider {
  background-color: #0a1a44; /* dark:bg-[#0a1a44] */
}

/* Slider circle / Sun-Moon body */
.switch-slider::before {
  content: "";
  position: absolute;
  height: 1.4em;
  width: 1.4em;
  border-radius: 50%;
  left: 10%;
  bottom: 15%;
  background-color: #e5e7eb; /* bg-gray-200 */
  box-shadow: inset 8px -4px 0px 0px #fff000;
  transition: 0.5s;
}

/* Dark mode version of circle */
body.dark-mode .switch-slider::before {
  background-color: #0a1a44; /* dark:before:bg-[#0a1a44] */
}

/* Checked state transitions */
.switch-checkbox:checked + .switch-slider {
  background-color: #9ca3af; /* peer-checked:bg-gray-400 */
}

body.dark-mode .switch-checkbox:checked + .switch-slider {
  background-color: #102b6a; /* dark:peer-checked:bg-[#102b6a] */
}

.switch-checkbox:checked + .switch-slider::before {
  transform: translateX(100%);
  box-shadow: inset 15px -4px 0px 15px #fff000; /* peer-checked:before:shadow... */
}

/* Adjustments for Taw's RTL support */
body.rtl .switch-checkbox:checked + .switch-slider::before {
  transform: translateX(-100%);
}
"""

with open("index.css", "a", encoding="utf-8") as f:
    f.write(css)

print("Appended dynamic switcher CSS to index.css")

import sys
css = """
/* ===== OPPORTUNITY BADGE ANIMATION ===== */
@keyframes badge-pulse-once {
  0% { transform: scale(1); filter: brightness(1); }
  50% { transform: scale(1.1); filter: brightness(1.2); }
  100% { transform: scale(1); filter: brightness(1); }
}

.pulse-anim-once {
  animation: badge-pulse-once 1s ease-out 1;
}
"""

with open("index.css", "a", encoding="utf-8") as f:
    f.write(css)

print("Appended pulse-anim-once to index.css")

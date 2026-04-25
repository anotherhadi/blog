// oneko.js — navbar wanderer (based on https://github.com/adryd325/oneko.js)

(function oneko() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const SIZE = 32;
  const SPEED = 10;

  const spriteSets = {
    idle: [[-3, -3]],
    alert: [[-7, -3]],
    scratchSelf: [
      [-5, 0],
      [-6, 0],
      [-7, 0],
    ],
    scratchWallE: [
      [-2, -2],
      [-2, -3],
    ],
    scratchWallW: [
      [-4, 0],
      [-4, -1],
    ],
    tired: [[-3, -2]],
    sleeping: [
      [-2, 0],
      [-2, -1],
    ],
    E: [
      [-3, 0],
      [-3, -1],
    ],
    W: [
      [-4, -2],
      [-4, -3],
    ],
  };

  const track = document.getElementById("oneko-track");
  if (!track) return;

  const el = document.createElement("div");
  el.id = "oneko";
  el.ariaHidden = "true";
  el.style.width = `${SIZE}px`;
  el.style.height = `${SIZE}px`;
  el.style.position = "absolute";
  el.style.bottom = "0";
  el.style.pointerEvents = "none";
  el.style.imageRendering = "pixelated";
  el.style.zIndex = "2147483647";
  el.style.backgroundImage = "url(/oneko.gif)";
  track.appendChild(el);

  function maxX() {
    return track.offsetWidth - SIZE;
  }
  function clamp(v, lo, hi) {
    return Math.max(lo, Math.min(hi, v));
  }
  function randomTarget() {
    return Math.random() * maxX();
  }

  function setSprite(name, frame) {
    const s = spriteSets[name][frame % spriteSets[name].length];
    el.style.backgroundPosition = `${s[0] * SIZE}px ${s[1] * SIZE}px`;
  }

  let posX = randomTarget();
  let targetX = posX;
  el.style.left = `${posX}px`;

  let frameCount = 0;
  let idleTime = 0;
  let idleAnim = null;
  let idleAnimFrame = 0;
  let lastTs = null;

  function resetIdle() {
    idleAnim = null;
    idleAnimFrame = 0;
  }

  function idle() {
    idleTime++;

    if (idleTime > 40 && Math.floor(Math.random() * 120) === 0) {
      targetX = randomTarget();
      idleTime = 0;
      resetIdle();
      return;
    }

    if (
      idleTime > 15 &&
      idleAnim == null &&
      Math.floor(Math.random() * 180) === 0
    ) {
      const opts = ["sleeping", "scratchSelf"];
      if (posX <= SIZE) opts.push("scratchWallW");
      if (posX >= maxX() - SIZE) opts.push("scratchWallE");
      idleAnim = opts[Math.floor(Math.random() * opts.length)];
    }

    switch (idleAnim) {
      case "sleeping":
        if (idleAnimFrame < 8) {
          setSprite("tired", 0);
          break;
        }
        setSprite("sleeping", Math.floor(idleAnimFrame / 4));
        if (idleAnimFrame > 192) resetIdle();
        break;
      case "scratchWallE":
      case "scratchWallW":
      case "scratchSelf":
        setSprite(idleAnim, idleAnimFrame);
        if (idleAnimFrame > 9) resetIdle();
        break;
      default:
        setSprite("idle", 0);
        return;
    }
    idleAnimFrame++;
  }

  function frame() {
    frameCount++;
    const diff = targetX - posX;
    const dist = Math.abs(diff);

    if (dist < SPEED) {
      posX = targetX;
      idle();
      return;
    }

    resetIdle();

    if (idleTime > 5) {
      setSprite("alert", 0);
      idleTime = Math.min(idleTime, 7) - 1;
      return;
    }
    idleTime = 0;

    setSprite(diff > 0 ? "E" : "W", frameCount);
    posX = clamp(posX + (diff > 0 ? SPEED : -SPEED), 0, maxX());
    el.style.left = `${posX}px`;
  }

  function loop(ts) {
    if (!el.isConnected) return;
    if (!lastTs) lastTs = ts;
    if (ts - lastTs > 100) {
      lastTs = ts;
      frame();
    }
    window.requestAnimationFrame(loop);
  }

  let lastTrackWidth = track.offsetWidth;
  window.addEventListener("resize", () => {
    const newWidth = track.offsetWidth;
    if (lastTrackWidth > 0) {
      const ratio = newWidth / lastTrackWidth;
      posX = clamp(posX * ratio, 0, maxX());
      targetX = clamp(targetX * ratio, 0, maxX());
      el.style.left = `${posX}px`;
    }
    lastTrackWidth = newWidth;
  });

  setTimeout(
    () => {
      targetX = randomTarget();
    },
    800 + Math.random() * 1500,
  );

  window.requestAnimationFrame(loop);
})();

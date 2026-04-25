const PRIMARY = "oklch(71% 0.0863 296.59)";

type GNode = {
  id: string;
  title: string;
  current: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
};
type GEdge = { from: string; to: string };

let stopGraph: (() => void) | null = null;

function startGraph(): (() => void) | null {
  const w = window as typeof window & {
    __graphNodes?: { id: string; title: string; current: boolean }[];
    __graphEdges?: GEdge[];
  };
  const graphNodes = w.__graphNodes ?? [];
  const graphEdges: GEdge[] = w.__graphEdges ?? [];
  const canvas = document.getElementById(
    "note-graph",
  ) as HTMLCanvasElement | null;
  if (!canvas || graphNodes.length === 0) return null;

  const W = (canvas.width = canvas.offsetWidth);
  const H = (canvas.height = 190);
  const ctx = canvas.getContext("2d")!;

  const nodes: GNode[] = graphNodes.map((n) => ({
    ...n,
    x: n.current ? W / 2 : W / 2 + (Math.random() - 0.5) * 80,
    y: n.current ? H / 2 : H / 2 + (Math.random() - 0.5) * 80,
    vx: 0,
    vy: 0,
  }));

  let dragging: GNode | null = null;
  let hovered: GNode | null = null;

  function nodeAt(x: number, y: number): GNode | null {
    return (
      nodes.find((n) => {
        const dx = n.x - x,
          dy = n.y - y;
        return Math.sqrt(dx * dx + dy * dy) < (n.current ? 10 : 8);
      }) ?? null
    );
  }

  function tick() {
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i],
          b = nodes[j];
        const dx = b.x - a.x,
          dy = b.y - a.y;
        const d = Math.sqrt(dx * dx + dy * dy) || 1;
        const f = 900 / (d * d);
        a.vx -= (dx / d) * f;
        a.vy -= (dy / d) * f;
        b.vx += (dx / d) * f;
        b.vy += (dy / d) * f;
      }
    }
    for (const e of graphEdges) {
      const a = nodes.find((n: GNode) => n.id === e.from);
      const b = nodes.find((n: GNode) => n.id === e.to);
      if (!a || !b) continue;
      const dx = b.x - a.x,
        dy = b.y - a.y;
      const d = Math.sqrt(dx * dx + dy * dy) || 1;
      const f = (d - 75) * 0.04;
      a.vx += (dx / d) * f;
      a.vy += (dy / d) * f;
      b.vx -= (dx / d) * f;
      b.vy -= (dy / d) * f;
    }
    for (const n of nodes) {
      n.vx += (W / 2 - n.x) * 0.025;
      n.vy += (H / 2 - n.y) * 0.025;
    }
    for (const n of nodes) {
      if (n === dragging) continue;
      n.vx *= 0.78;
      n.vy *= 0.78;
      n.x = Math.max(16, Math.min(W - 16, n.x + n.vx));
      n.y = Math.max(16, Math.min(H - 16, n.y + n.vy));
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "oklch(2% 0 0)";
    ctx.fillRect(0, 0, W, H);

    const connected = new Set<string>();
    if (hovered) {
      for (const e of graphEdges) {
        if (e.from === hovered.id) connected.add(e.to);
        if (e.to === hovered.id) connected.add(e.from);
      }
    }

    for (const e of graphEdges) {
      const a = nodes.find((n: GNode) => n.id === e.from);
      const b = nodes.find((n: GNode) => n.id === e.to);
      if (!a || !b) continue;
      const lit = hovered && (e.from === hovered.id || e.to === hovered.id);
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = lit ? "oklch(55% 0 0)" : "oklch(27% 0 0)";
      ctx.lineWidth = lit ? 1.5 : 1;
      ctx.stroke();
    }

    for (const n of nodes) {
      const isHov = hovered?.id === n.id;
      const isCon = connected.has(n.id);
      const r = n.current ? 7 : isHov ? 6 : 4.5;

      if (isHov && !n.current) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, r + 5, 0, Math.PI * 2);
        ctx.fillStyle = "oklch(71% 0.0863 296.59 / 0.15)";
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
      ctx.fillStyle = n.current
        ? PRIMARY
        : isHov
          ? "oklch(78% 0.05 296.59)"
          : isCon
            ? "oklch(58% 0.03 296.59)"
            : "oklch(40% 0 0)";
      ctx.fill();

      if (n.current || isHov || isCon) {
        ctx.font = `${n.current ? "10px" : "9px"} monospace`;
        ctx.textAlign = "center";
        ctx.fillStyle = n.current ? "oklch(87% 0 0)" : "oklch(62% 0 0)";
        const label =
          n.title.length > 14 ? n.title.slice(0, 13) + "…" : n.title;
        ctx.fillText(label, n.x, n.y + r + 9);
      }
    }
  }

  let animId: number;
  function loop() {
    tick();
    draw();
    animId = requestAnimationFrame(loop);
  }
  animId = requestAnimationFrame(loop);

  canvas.addEventListener("mousedown", (e) => {
    const r = canvas.getBoundingClientRect();
    const sx = W / canvas.offsetWidth;
    dragging = nodeAt(
      (e.clientX - r.left) * sx,
      (e.clientY - r.top) * (H / canvas.offsetHeight),
    );
  });
  canvas.addEventListener("mousemove", (e) => {
    const r = canvas.getBoundingClientRect();
    const sx = W / canvas.offsetWidth;
    const x = (e.clientX - r.left) * sx;
    const y = (e.clientY - r.top) * (H / canvas.offsetHeight);
    if (dragging) {
      dragging.x = x;
      dragging.y = y;
      dragging.vx = 0;
      dragging.vy = 0;
    }
    hovered = nodeAt(x, y);
    canvas.style.cursor =
      hovered && !hovered.current ? "pointer" : "default";
  });
  canvas.addEventListener("mouseup", () => {
    dragging = null;
  });
  canvas.addEventListener("mouseleave", () => {
    dragging = null;
    hovered = null;
  });
  canvas.addEventListener("click", (e) => {
    const r = canvas.getBoundingClientRect();
    const sx = W / canvas.offsetWidth;
    const n = nodeAt(
      (e.clientX - r.left) * sx,
      (e.clientY - r.top) * (H / canvas.offsetHeight),
    );
    if (n && !n.current) window.location.href = `/notes/${n.id}`;
  });

  return () => cancelAnimationFrame(animId);
}

function injectHeadingAnchors() {
  if (!document.getElementById("heading-anchor-styles")) {
    const s = document.createElement("style");
    s.id = "heading-anchor-styles";
    s.textContent = `
      .note-content h2, .note-content h3, .note-content h4 {
        display: flex !important;
        align-items: center;
        flex-wrap: wrap;
        gap: 0;
      }
      .heading-anchor {
        display: inline-flex;
        align-items: center;
        flex-shrink: 0;
        margin-left: 0.4em;
        color: oklch(38% 0 0);
        opacity: 0;
        transition: opacity 120ms, color 120ms;
        text-decoration: none;
      }
      .note-content h2:hover .heading-anchor,
      .note-content h3:hover .heading-anchor,
      .note-content h4:hover .heading-anchor { opacity: 1; }
      .heading-anchor:hover, .heading-anchor.copied { color: oklch(71% 0.0863 296.59); opacity: 1; }
    `;
    document.head.appendChild(s);
  }

  document
    .querySelectorAll(".note-content h2, .note-content h3, .note-content h4")
    .forEach((heading) => {
      if (!heading.id || heading.querySelector(".heading-anchor")) return;
      const anchor = document.createElement("a");
      anchor.href = `#${heading.id}`;
      anchor.className = "heading-anchor";
      anchor.setAttribute("aria-label", "Copy link to section");
      anchor.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`;
      anchor.addEventListener("click", (e) => {
        e.preventDefault();
        const url = `${location.origin}${location.pathname}#${heading.id}`;
        navigator.clipboard.writeText(url).then(() => {
          anchor.classList.add("copied");
          setTimeout(() => anchor.classList.remove("copied"), 1800);
        });
        history.pushState(null, "", `#${heading.id}`);
      });
      heading.appendChild(anchor);
    });
}

function initSearch() {
  const navItems = document.querySelectorAll<HTMLElement>(".nav-item");
  document
    .querySelectorAll<HTMLInputElement>("[data-search]")
    .forEach((input) => {
      input.addEventListener("input", (e) => {
        const target = e.target as HTMLInputElement;
        const raw = target.value.toLowerCase().trim();
        document
          .querySelectorAll<HTMLInputElement>("[data-search]")
          .forEach((o) => {
            if (o !== target) o.value = target.value;
          });
        const isTag = raw.startsWith("#");
        const search = isTag ? raw.slice(1) : raw;
        navItems.forEach((item) => {
          const title = item.dataset.title ?? "";
          const tags = item.dataset.tags ? item.dataset.tags.split(",") : [];
          const match =
            !search ||
            (isTag
              ? tags.some((t) => t.includes(search))
              : title.includes(search) || tags.join(",").includes(search));
          item.style.display = match ? "" : "none";
        });
      });
    });
}

function init() {
  if (stopGraph) {
    stopGraph();
    stopGraph = null;
  }

  const graphDrawer = document.getElementById(
    "graph-drawer",
  ) as HTMLInputElement | null;
  if (!graphDrawer) return;

  function onGraphDrawerChange() {
    if (graphDrawer!.checked) {
      requestAnimationFrame(() => {
        stopGraph = startGraph() ?? null;
      });
    } else {
      if (stopGraph) {
        stopGraph();
        stopGraph = null;
      }
    }
  }
  graphDrawer.addEventListener("change", onGraphDrawerChange);

  const outerDrawer = graphDrawer.closest<HTMLElement>(".drawer.drawer-end");
  const xlQuery = window.matchMedia("(min-width: 1280px)");

  function setXlSidebar(open: boolean) {
    if (!outerDrawer) return;
    if (open) {
      outerDrawer.classList.add("xl:drawer-open");
      requestAnimationFrame(() => {
        stopGraph = startGraph() ?? null;
      });
    } else {
      outerDrawer.classList.remove("xl:drawer-open");
      if (stopGraph) {
        stopGraph();
        stopGraph = null;
      }
    }
  }

  const graphToggle = document.getElementById("graph-toggle");
  graphToggle?.addEventListener("click", (e) => {
    if (!xlQuery.matches) return;
    e.preventDefault();
    setXlSidebar(!outerDrawer?.classList.contains("xl:drawer-open"));
  });

  if (xlQuery.matches) {
    outerDrawer?.classList.add("xl:drawer-open");
    requestAnimationFrame(() => {
      stopGraph = startGraph() ?? null;
    });
  }
  xlQuery.addEventListener("change", (e) => {
    if (!e.matches) setXlSidebar(false);
  });

  injectHeadingAnchors();
  initSearch();
}

document.addEventListener("astro:page-load", init);
document.addEventListener("astro:before-preparation", () => {
  if (stopGraph) {
    stopGraph();
    stopGraph = null;
  }
});

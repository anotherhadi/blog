<script lang="ts">
  import { onMount } from "svelte";

  interface GNode {
    id: string;
    title: string;
    current: boolean;
  }
  interface GEdge {
    from: string;
    to: string;
  }
  interface Props {
    nodes?: GNode[];
    edges?: GEdge[];
  }

  const { nodes = [], edges = [] }: Props = $props();

  const PRIMARY = "oklch(71% 0.0863 296.59)";

  let canvas: HTMLCanvasElement;

  function startAnimation(): () => void {
    if (!canvas || nodes.length === 0) return () => {};

    const W = (canvas.width = canvas.offsetWidth);
    const H = (canvas.height = 190);
    const ctx = canvas.getContext("2d")!;

    type SimNode = GNode & { x: number; y: number; vx: number; vy: number };

    const simNodes: SimNode[] = nodes.map((n) => ({
      ...n,
      x: n.current ? W / 2 : W / 2 + (Math.random() - 0.5) * 80,
      y: n.current ? H / 2 : H / 2 + (Math.random() - 0.5) * 80,
      vx: 0,
      vy: 0,
    }));

    let dragging: SimNode | null = null;
    let hovered: SimNode | null = null;

    function nodeAt(x: number, y: number): SimNode | null {
      return (
        simNodes.find((n) => {
          const dx = n.x - x,
            dy = n.y - y;
          return Math.sqrt(dx * dx + dy * dy) < (n.current ? 10 : 8);
        }) ?? null
      );
    }

    function tick() {
      for (let i = 0; i < simNodes.length; i++) {
        for (let j = i + 1; j < simNodes.length; j++) {
          const a = simNodes[i],
            b = simNodes[j];
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
      for (const e of edges) {
        const a = simNodes.find((n) => n.id === e.from);
        const b = simNodes.find((n) => n.id === e.to);
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
      for (const n of simNodes) {
        n.vx += (W / 2 - n.x) * 0.025;
        n.vy += (H / 2 - n.y) * 0.025;
      }
      for (const n of simNodes) {
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
        for (const e of edges) {
          if (e.from === hovered.id) connected.add(e.to);
          if (e.to === hovered.id) connected.add(e.from);
        }
      }

      for (const e of edges) {
        const a = simNodes.find((n) => n.id === e.from);
        const b = simNodes.find((n) => n.id === e.to);
        if (!a || !b) continue;
        const lit =
          hovered && (e.from === hovered.id || e.to === hovered.id);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = lit ? "oklch(55% 0 0)" : "oklch(27% 0 0)";
        ctx.lineWidth = lit ? 1.5 : 1;
        ctx.stroke();
      }

      for (const n of simNodes) {
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

    const onMousedown = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      const sx = W / canvas.offsetWidth;
      dragging = nodeAt(
        (e.clientX - r.left) * sx,
        (e.clientY - r.top) * (H / canvas.offsetHeight),
      );
    };
    const onMousemove = (e: MouseEvent) => {
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
    };
    const onMouseup = () => {
      dragging = null;
    };
    const onMouseleave = () => {
      dragging = null;
      hovered = null;
    };
    const onClick = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      const sx = W / canvas.offsetWidth;
      const n = nodeAt(
        (e.clientX - r.left) * sx,
        (e.clientY - r.top) * (H / canvas.offsetHeight),
      );
      if (n && !n.current) window.location.href = `/notes/${n.id}`;
    };

    canvas.addEventListener("mousedown", onMousedown);
    canvas.addEventListener("mousemove", onMousemove);
    canvas.addEventListener("mouseup", onMouseup);
    canvas.addEventListener("mouseleave", onMouseleave);
    canvas.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener("mousedown", onMousedown);
      canvas.removeEventListener("mousemove", onMousemove);
      canvas.removeEventListener("mouseup", onMouseup);
      canvas.removeEventListener("mouseleave", onMouseleave);
      canvas.removeEventListener("click", onClick);
    };
  }

  onMount(() => {
    const drawer = document.getElementById(
      "graph-drawer",
    ) as HTMLInputElement | null;
    const outerDrawer =
      drawer?.closest<HTMLElement>(".drawer.drawer-end") ?? null;

    let stopFn: (() => void) | null = null;

    function isVisible() {
      return (
        (drawer?.checked ?? false) ||
        (outerDrawer?.classList.contains("xl:drawer-open") ?? false)
      );
    }

    function start() {
      if (stopFn) return;
      stopFn = startAnimation();
    }

    function stop() {
      stopFn?.();
      stopFn = null;
    }

    if (isVisible()) start();

    const onDrawerChange = () => {
      isVisible() ? start() : stop();
    };
    drawer?.addEventListener("change", onDrawerChange);

    // Watch for xl:drawer-open class toggled by the graph button script
    const observer = new MutationObserver(() => {
      isVisible() ? start() : stop();
    });
    if (outerDrawer) {
      observer.observe(outerDrawer, {
        attributes: true,
        attributeFilter: ["class"],
      });
    }

    return () => {
      stop();
      drawer?.removeEventListener("change", onDrawerChange);
      observer.disconnect();
    };
  });
</script>

<canvas
  bind:this={canvas}
  height="190"
  role="img"
  aria-label="Graph of linked notes"
  style="width:100%; display:block; background: oklch(2% 0 0); cursor:default;"
></canvas>

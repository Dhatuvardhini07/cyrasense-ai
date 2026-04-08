import { j as jsxRuntimeExports, c as cn, S as Skeleton } from "./index-DNVH2Qkg.js";
import { L as Layout } from "./Layout-D3T6SkdV.js";
import { B as Badge } from "./badge-BhejcKYO.js";
import { e as useCurrentPrediction, y as useSelfCare, C as Card, a as CardContent, i as getPhaseLabel, j as getPhaseColorClass } from "./createLucideIcon-BASLoXwI.js";
const CATEGORY_LABELS = {
  exercise: "Exercise",
  nutrition: "Nutrition",
  hygiene: "Hygiene",
  mindfulness: "Mindfulness",
  tip: "Tip"
};
const CATEGORY_COLORS = {
  exercise: "bg-primary/10 text-primary border-primary/20",
  nutrition: "bg-cycle-fertile/10 text-cycle-fertile border-cycle-fertile/20",
  hygiene: "bg-secondary text-secondary-foreground border-border",
  mindfulness: "bg-cycle-ovulation/10 text-cycle-ovulation border-cycle-ovulation/20",
  tip: "bg-accent/10 text-accent border-accent/20"
};
function SelfCare() {
  const { data: prediction, isLoading: predLoading } = useCurrentPrediction();
  const phase = (prediction == null ? void 0 : prediction.currentPhase) ?? null;
  const { data: items, isLoading: itemsLoading } = useSelfCare(phase);
  const isLoading = predLoading || itemsLoading;
  const phaseLabel = phase ? getPhaseLabel(phase) : null;
  const phaseColor = phase ? getPhaseColorClass(phase) : "text-muted-foreground";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto px-4 pt-6 pb-4 space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-semibold text-foreground", children: "Self-Care" }),
      phaseLabel && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: cn("text-base font-body mt-1", phaseColor), children: [
        "Personalized for your ",
        phaseLabel.toLowerCase()
      ] })
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: ["sk1", "sk2", "sk3", "sk4"].map((id) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 w-full rounded-2xl" }, id)) }) : items && items.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 flex gap-3 items-start", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl shrink-0 mt-0.5", children: item.icon ?? "✨" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-display font-semibold text-foreground", children: item.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              variant: "outline",
              className: cn(
                "text-[10px] shrink-0",
                CATEGORY_COLORS[item.category] ?? ""
              ),
              children: CATEGORY_LABELS[item.category] ?? item.category
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground font-body leading-relaxed", children: item.description })
      ] })
    ] }) }, item.id)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-dashed border-primary/30 bg-primary/5 shadow-none", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-5 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground font-body", children: "Start tracking your cycle to receive personalized self-care recommendations." }) }) })
  ] }) });
}
export {
  SelfCare as default
};

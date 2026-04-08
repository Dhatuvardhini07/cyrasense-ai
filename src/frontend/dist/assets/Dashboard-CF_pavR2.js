import { j as jsxRuntimeExports, S as Skeleton, L as Link } from "./index-DNVH2Qkg.js";
import { L as Layout, C as CalendarDays, a as ClipboardList } from "./Layout-D3T6SkdV.js";
import { B as Badge } from "./badge-BhejcKYO.js";
import { B as Button } from "./button-CrkwacFM.js";
import { c as createLucideIcon, d as useProfile, e as useCurrentPrediction, t as todayISO, g as formatDate, h as getDailyMessage, C as Card, a as CardContent, i as getPhaseLabel, j as getPhaseColorClass } from "./createLucideIcon-BASLoXwI.js";
import { H as Heart } from "./heart-D-6YFsHb.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",
      key: "4pj2yx"
    }
  ],
  ["path", { d: "M20 3v4", key: "1olli1" }],
  ["path", { d: "M22 5h-4", key: "1gvqau" }],
  ["path", { d: "M4 17v2", key: "vumght" }],
  ["path", { d: "M5 18H3", key: "zchphs" }]
];
const Sparkles = createLucideIcon("sparkles", __iconNode);
function Dashboard() {
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: prediction, isLoading: predLoading } = useCurrentPrediction();
  const today = todayISO();
  const formattedDate = formatDate(today);
  const phase = (prediction == null ? void 0 : prediction.currentPhase) ?? null;
  const phaseLabel = phase ? getPhaseLabel(phase) : null;
  const phaseColor = phase ? getPhaseColorClass(phase) : "text-muted-foreground";
  const phaseDesc = phase ? getPhaseDescriptionLocal(phase) : null;
  const dailyMessage = profile && phase ? getDailyMessage(phase, profile.name) : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto px-4 pt-6 pb-4 space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-body uppercase tracking-wide", children: "Today" }),
        profileLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-48 mt-1" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-display font-semibold text-foreground leading-tight", children: formattedDate })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: profile && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm font-body", children: profile.name.charAt(0).toUpperCase() }) })
    ] }),
    dailyMessage && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-primary/10 border-primary/20 shadow-none", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 flex gap-3 items-start", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Heart,
        {
          className: "w-4 h-4 text-primary mt-0.5 shrink-0",
          strokeWidth: 2
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-body text-foreground leading-relaxed", children: dailyMessage })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-body uppercase tracking-wide mb-1", children: "Cycle phase insight" }),
        predLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-7 w-40 mb-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full" })
        ] }) : phase ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "h2",
            {
              className: `text-2xl font-display font-semibold mb-1 ${phaseColor}`,
              children: phaseLabel
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground font-body leading-relaxed", children: phaseDesc }),
          prediction && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground font-body mt-2", children: [
            "Day ",
            prediction.currentCycleDay,
            " of ~",
            prediction.estimatedCycleLength,
            "-day cycle"
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-body text-muted-foreground", children: "No cycle data yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Start tracking by selecting your first day in the Calendar." })
        ] })
      ] }),
      phase && /* @__PURE__ */ jsxRuntimeExports.jsx(
        Badge,
        {
          variant: "secondary",
          className: "shrink-0 capitalize font-body text-xs",
          children: phase
        }
      )
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/calendar", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border shadow-sm hover:shadow-md transition-smooth cursor-pointer hover:border-primary/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 flex flex-col gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          CalendarDays,
          {
            className: "w-5 h-5 text-primary",
            strokeWidth: 1.8
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-display font-semibold text-foreground", children: "Smart Calendar" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-body", children: "Track & predict your cycle" })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/log", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border shadow-sm hover:shadow-md transition-smooth cursor-pointer hover:border-primary/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 flex flex-col gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ClipboardList,
          {
            className: "w-5 h-5 text-primary",
            strokeWidth: 1.8
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-display font-semibold text-foreground", children: "Daily Log" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-body", children: "Mood, pain & symptoms" })
      ] }) }) })
    ] }),
    prediction && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-5 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-body uppercase tracking-wide", children: "Upcoming predictions" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-body text-foreground", children: "Next period" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold font-body text-cycle-period", children: formatDate(prediction.nextPeriodStart) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-body text-foreground", children: "Ovulation" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold font-body text-cycle-ovulation", children: formatDate(prediction.ovulationDate) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-body text-foreground", children: "Fertile window" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold font-body text-cycle-fertile", children: formatDate(prediction.fertileWindowStart) })
        ] })
      ] })
    ] }) }),
    !predLoading && !prediction && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-dashed border-primary/30 bg-primary/5 shadow-none", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-5 text-center space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Sparkles,
        {
          className: "w-8 h-8 text-primary mx-auto",
          strokeWidth: 1.5
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-display font-semibold text-foreground", children: "Start your cycle journey" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground font-body", children: "Tap the Calendar to mark your first period day and unlock personalized insights." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/calendar", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "mt-1", "data-ocid": "cta-start-tracking", children: "Start Tracking" }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-xs text-muted-foreground font-body pb-2", children: [
      "© ",
      (/* @__PURE__ */ new Date()).getFullYear(),
      ". Built with love using",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "underline underline-offset-2 hover:text-foreground transition-colors",
          children: "caffeine.ai"
        }
      )
    ] })
  ] }) });
}
function getPhaseDescriptionLocal(phase) {
  const map = {
    menstrual: "Your body is shedding the uterine lining. Rest is important during this time.",
    follicular: "Follicles in your ovaries are maturing. Energy levels improve as estrogen rises.",
    ovulation: "An egg is released. This is your most fertile time and energy is at its peak.",
    luteal: "Progesterone rises to prepare the uterus. A time for introspection and nourishment."
  };
  return map[phase] ?? "";
}
export {
  Dashboard as default
};

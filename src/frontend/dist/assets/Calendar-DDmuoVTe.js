import { j as jsxRuntimeExports, c as cn, r as reactExports, S as Skeleton } from "./index-DNVH2Qkg.js";
import { L as Layout } from "./Layout-D3T6SkdV.js";
import { B as Button } from "./button-CrkwacFM.js";
import { c as createLucideIcon, e as useCurrentPrediction, k as useCycleHistory, l as useAddCycleRecord, C as Card, m as CardHeader, n as CardTitle, a as CardContent, t as todayISO, o as addDays } from "./createLucideIcon-BASLoXwI.js";
import { R as Root, C as Content, a as Close, T as Title, P as Portal, O as Overlay } from "./index-ebBrmsI9.js";
import { I as Input } from "./input-7Yzeg1-J.js";
import { L as Label } from "./label-DEKBdpsS.js";
import { u as ue } from "./index-CkPABtMy.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }]];
const ChevronLeft = createLucideIcon("chevron-left", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]];
const ChevronRight = createLucideIcon("chevron-right", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
];
const X = createLucideIcon("x", __iconNode);
function Dialog({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root, { "data-slot": "dialog", ...props });
}
function DialogPortal({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, { "data-slot": "dialog-portal", ...props });
}
function DialogOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Overlay,
    {
      "data-slot": "dialog-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      ),
      ...props
    }
  );
}
function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogPortal, { "data-slot": "dialog-portal", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogOverlay, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Content,
      {
        "data-slot": "dialog-content",
        className: cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        ),
        ...props,
        children: [
          children,
          showCloseButton && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Close,
            {
              "data-slot": "dialog-close",
              className: "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(X, {}),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Close" })
              ]
            }
          )
        ]
      }
    )
  ] });
}
function DialogHeader({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "dialog-header",
      className: cn("flex flex-col gap-2 text-center sm:text-left", className),
      ...props
    }
  );
}
function DialogTitle({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Title,
    {
      "data-slot": "dialog-title",
      className: cn("text-lg leading-none font-semibold", className),
      ...props
    }
  );
}
function buildCalendar(year, month, prediction) {
  const firstDay = new Date(year, month, 1);
  const startDow = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = todayISO();
  const periodDates = /* @__PURE__ */ new Set();
  const ovulationDates = /* @__PURE__ */ new Set();
  const fertileDates = /* @__PURE__ */ new Set();
  if (prediction) {
    let d = prediction.nextPeriodStart;
    for (let i = 0; i < 5; i++) {
      periodDates.add(addDays(d, i));
    }
    ovulationDates.add(prediction.ovulationDate);
    let fd = prediction.fertileWindowStart;
    const fe = prediction.fertileWindowEnd;
    while (fd <= fe) {
      fertileDates.add(fd);
      fd = addDays(fd, 1);
    }
  }
  const days = [];
  for (let i = 0; i < startDow; i++) {
    const prevDate = new Date(year, month, -startDow + i + 1);
    days.push({
      date: prevDate.toISOString().split("T")[0],
      day: prevDate.getDate(),
      inMonth: false,
      types: []
    });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const types = [];
    if (dateStr === today) types.push("today");
    if (periodDates.has(dateStr)) types.push("period");
    else if (ovulationDates.has(dateStr)) types.push("ovulation");
    else if (fertileDates.has(dateStr)) types.push("fertile");
    days.push({ date: dateStr, day: d, inMonth: true, types });
  }
  return days;
}
function Calendar() {
  const today = /* @__PURE__ */ new Date();
  const [viewMonth, setViewMonth] = reactExports.useState(today.getMonth());
  const [viewYear, setViewYear] = reactExports.useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = reactExports.useState(null);
  const [showDialog, setShowDialog] = reactExports.useState(false);
  const [periodDays, setPeriodDays] = reactExports.useState("5");
  const { data: prediction, isLoading } = useCurrentPrediction();
  const { data: cycleHistory } = useCycleHistory();
  const addCycle = useAddCycleRecord();
  const days = reactExports.useMemo(
    () => buildCalendar(viewYear, viewMonth, prediction),
    [viewYear, viewMonth, prediction]
  );
  const monthLabel = new Date(viewYear, viewMonth).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric"
  });
  function prevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  }
  function handleDayClick(date, inMonth) {
    if (!inMonth) return;
    setSelectedDate(date);
    setShowDialog(true);
  }
  async function handleMarkPeriod() {
    if (!selectedDate) return;
    const days2 = Number.parseInt(periodDays, 10);
    if (!Number.isFinite(days2) || days2 < 1 || days2 > 10) {
      ue.error("Please enter a valid duration (1–10 days)");
      return;
    }
    await addCycle.mutateAsync({
      startDate: selectedDate,
      periodDurationDays: days2
    });
    ue.success("Period start date marked!");
    setShowDialog(false);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto px-4 pt-6 pb-4 space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-semibold text-foreground", children: "Smart Calendar" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-4 flex-wrap", children: [
        { label: "Period", cls: "bg-[oklch(0.5_0.25_25)]" },
        { label: "Ovulation", cls: "bg-[oklch(0.65_0.15_310)]" },
        { label: "Fertile", cls: "bg-[oklch(0.6_0.18_145)]" }
      ].map(({ label, cls }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("w-3 h-3 rounded-full", cls) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-body text-muted-foreground", children: label })
      ] }, label)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base font-display", children: monthLabel }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                onClick: prevMonth,
                className: "h-8 w-8",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-4 h-4" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                onClick: nextMonth,
                className: "h-8 w-8",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4" })
              }
            )
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-7 gap-1", children: [
          "s0",
          "s1",
          "s2",
          "s3",
          "s4",
          "s5",
          "s6",
          "s7",
          "s8",
          "s9",
          "s10",
          "s11",
          "s12",
          "s13",
          "s14",
          "s15",
          "s16",
          "s17",
          "s18",
          "s19",
          "s20",
          "s21",
          "s22",
          "s23",
          "s24",
          "s25",
          "s26",
          "s27",
          "s28",
          "s29",
          "s30",
          "s31",
          "s32",
          "s33",
          "s34"
        ].map((id) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-9 w-full rounded-lg" }, id)) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-7 gap-1 mb-2", children: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
            (d) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "text-center text-xs font-body text-muted-foreground py-1",
                children: d
              },
              d
            )
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-7 gap-1", children: days.map((d) => {
            const isPeriod = d.types.includes("period");
            const isOvulation = d.types.includes("ovulation");
            const isFertile = d.types.includes("fertile");
            const isToday = d.types.includes("today");
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": d.inMonth ? `cal-day-${d.date}` : void 0,
                onClick: () => handleDayClick(d.date, d.inMonth),
                disabled: !d.inMonth,
                className: cn(
                  "h-9 w-full rounded-lg text-sm font-body font-medium transition-smooth relative",
                  !d.inMonth && "opacity-30 cursor-default",
                  d.inMonth && !isPeriod && !isOvulation && !isFertile && "hover:bg-muted",
                  isPeriod && "cycle-period text-white",
                  isOvulation && "cycle-ovulation text-white",
                  isFertile && "cycle-fertile text-white",
                  isToday && !isPeriod && !isOvulation && !isFertile && "ring-2 ring-primary bg-primary/10 text-primary"
                ),
                children: d.day
              },
              d.date
            );
          }) })
        ] }) })
      ] }),
      !isLoading && !prediction && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-dashed border-primary/30 bg-primary/5 shadow-none", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-5 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-body text-muted-foreground", children: "Start tracking by selecting your first period day on the calendar above." }) }) }),
      cycleHistory && cycleHistory.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-display", children: "Recent Cycles" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-2", children: cycleHistory.slice(0, 3).map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex justify-between items-center text-sm font-body",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: new Date(c.startDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric"
              }) }),
              c.cycleLength && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
                c.cycleLength,
                " day cycle"
              ] })
            ]
          },
          c.id
        )) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showDialog, onOpenChange: setShowDialog, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: "Mark Period Start" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 pt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-body text-muted-foreground", children: [
          "You selected ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: selectedDate }),
          " as Day 1 of your cycle."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "period-days", className: "font-body text-sm", children: "How many days does your period usually last?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "period-days",
              type: "number",
              min: 1,
              max: 10,
              value: periodDays,
              onChange: (e) => setPeriodDays(e.target.value),
              "data-ocid": "input-period-duration",
              className: "font-body"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 justify-end", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setShowDialog(false), children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: handleMarkPeriod,
              disabled: addCycle.isPending,
              "data-ocid": "btn-confirm-period",
              children: addCycle.isPending ? "Saving…" : "Confirm"
            }
          )
        ] })
      ] })
    ] }) })
  ] });
}
export {
  Calendar as default
};

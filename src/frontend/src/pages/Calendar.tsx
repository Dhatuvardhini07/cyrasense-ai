import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAddCycleRecord,
  useCurrentPrediction,
  useCycleHistory,
} from "@/hooks/use-health-data";
import { addDays, todayISO } from "@/lib/cycle-utils";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

type DayType = "period" | "ovulation" | "fertile" | "today" | "normal";

interface CalendarDay {
  date: string;
  day: number;
  inMonth: boolean;
  types: DayType[];
}

function buildCalendar(
  year: number,
  month: number,
  prediction: ReturnType<typeof useCurrentPrediction>["data"],
): CalendarDay[] {
  const firstDay = new Date(year, month, 1);
  const startDow = firstDay.getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = todayISO();

  const periodDates = new Set<string>();
  const ovulationDates = new Set<string>();
  const fertileDates = new Set<string>();

  if (prediction) {
    // Period window
    let d = prediction.nextPeriodStart;
    for (let i = 0; i < 5; i++) {
      periodDates.add(addDays(d, i));
    }
    // Ovulation
    ovulationDates.add(prediction.ovulationDate);
    // Fertile window
    let fd = prediction.fertileWindowStart;
    const fe = prediction.fertileWindowEnd;
    while (fd <= fe) {
      fertileDates.add(fd);
      fd = addDays(fd, 1);
    }
  }

  const days: CalendarDay[] = [];
  // Leading empty cells
  for (let i = 0; i < startDow; i++) {
    const prevDate = new Date(year, month, -startDow + i + 1);
    days.push({
      date: prevDate.toISOString().split("T")[0],
      day: prevDate.getDate(),
      inMonth: false,
      types: [],
    });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const types: DayType[] = [];
    if (dateStr === today) types.push("today");
    if (periodDates.has(dateStr)) types.push("period");
    else if (ovulationDates.has(dateStr)) types.push("ovulation");
    else if (fertileDates.has(dateStr)) types.push("fertile");
    days.push({ date: dateStr, day: d, inMonth: true, types });
  }
  return days;
}

export default function Calendar() {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [periodDays, setPeriodDays] = useState("5");

  const { data: prediction, isLoading } = useCurrentPrediction();
  const { data: cycleHistory } = useCycleHistory();
  const addCycle = useAddCycleRecord();

  const days = useMemo(
    () => buildCalendar(viewYear, viewMonth, prediction),
    [viewYear, viewMonth, prediction],
  );

  const monthLabel = new Date(viewYear, viewMonth).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
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

  function handleDayClick(date: string, inMonth: boolean) {
    if (!inMonth) return;
    setSelectedDate(date);
    setShowDialog(true);
  }

  async function handleMarkPeriod() {
    if (!selectedDate) return;
    const days = Number.parseInt(periodDays, 10);
    if (!Number.isFinite(days) || days < 1 || days > 10) {
      toast.error("Please enter a valid duration (1–10 days)");
      return;
    }
    await addCycle.mutateAsync({
      startDate: selectedDate,
      periodDurationDays: days,
    });
    toast.success("Period start date marked!");
    setShowDialog(false);
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 pt-6 pb-4 space-y-5">
        <h1 className="text-2xl font-display font-semibold text-foreground">
          Smart Calendar
        </h1>

        {/* Legend */}
        <div className="flex items-center gap-4 flex-wrap">
          {[
            { label: "Period", cls: "bg-[oklch(0.5_0.25_25)]" },
            { label: "Ovulation", cls: "bg-[oklch(0.65_0.15_310)]" },
            { label: "Fertile", cls: "bg-[oklch(0.6_0.18_145)]" },
          ].map(({ label, cls }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className={cn("w-3 h-3 rounded-full", cls)} />
              <span className="text-xs font-body text-muted-foreground">
                {label}
              </span>
            </div>
          ))}
        </div>

        <Card className="border-border shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-display">
                {monthLabel}
              </CardTitle>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={prevMonth}
                  className="h-8 w-8"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={nextMonth}
                  className="h-8 w-8"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="grid grid-cols-7 gap-1">
                {(
                  [
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
                    "s34",
                  ] as const
                ).map((id) => (
                  <Skeleton key={id} className="h-9 w-full rounded-lg" />
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (d) => (
                      <div
                        key={d}
                        className="text-center text-xs font-body text-muted-foreground py-1"
                      >
                        {d}
                      </div>
                    ),
                  )}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {days.map((d) => {
                    const isPeriod = d.types.includes("period");
                    const isOvulation = d.types.includes("ovulation");
                    const isFertile = d.types.includes("fertile");
                    const isToday = d.types.includes("today");

                    return (
                      <button
                        type="button"
                        key={d.date}
                        data-ocid={d.inMonth ? `cal-day-${d.date}` : undefined}
                        onClick={() => handleDayClick(d.date, d.inMonth)}
                        disabled={!d.inMonth}
                        className={cn(
                          "h-9 w-full rounded-lg text-sm font-body font-medium transition-smooth relative",
                          !d.inMonth && "opacity-30 cursor-default",
                          d.inMonth &&
                            !isPeriod &&
                            !isOvulation &&
                            !isFertile &&
                            "hover:bg-muted",
                          isPeriod && "cycle-period text-white",
                          isOvulation && "cycle-ovulation text-white",
                          isFertile && "cycle-fertile text-white",
                          isToday &&
                            !isPeriod &&
                            !isOvulation &&
                            !isFertile &&
                            "ring-2 ring-primary bg-primary/10 text-primary",
                        )}
                      >
                        {d.day}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* No cycle data message */}
        {!isLoading && !prediction && (
          <Card className="border-dashed border-primary/30 bg-primary/5 shadow-none">
            <CardContent className="p-5 text-center">
              <p className="text-sm font-body text-muted-foreground">
                Start tracking by selecting your first period day on the
                calendar above.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Recent cycles */}
        {cycleHistory && cycleHistory.length > 0 && (
          <Card className="border-border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-display">
                Recent Cycles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {cycleHistory.slice(0, 3).map((c) => (
                <div
                  key={c.id}
                  className="flex justify-between items-center text-sm font-body"
                >
                  <span className="text-foreground">
                    {new Date(c.startDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  {c.cycleLength && (
                    <span className="text-muted-foreground">
                      {c.cycleLength} day cycle
                    </span>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Mark period dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">
              Mark Period Start
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <p className="text-sm font-body text-muted-foreground">
              You selected <strong>{selectedDate}</strong> as Day 1 of your
              cycle.
            </p>
            <div className="space-y-2">
              <Label htmlFor="period-days" className="font-body text-sm">
                How many days does your period usually last?
              </Label>
              <Input
                id="period-days"
                type="number"
                min={1}
                max={10}
                value={periodDays}
                onChange={(e) => setPeriodDays(e.target.value)}
                data-ocid="input-period-duration"
                className="font-body"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleMarkPeriod}
                disabled={addCycle.isPending}
                data-ocid="btn-confirm-period"
              >
                {addCycle.isPending ? "Saving…" : "Confirm"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}

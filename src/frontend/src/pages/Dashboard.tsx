import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentPrediction, useProfile } from "@/hooks/use-health-data";
import {
  formatDate,
  getDailyMessage,
  getPhaseColorClass,
  getPhaseLabel,
  todayISO,
} from "@/lib/cycle-utils";
import { Link } from "@tanstack/react-router";
import { CalendarDays, ClipboardList, Heart, Sparkles } from "lucide-react";

export default function Dashboard() {
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: prediction, isLoading: predLoading } = useCurrentPrediction();
  const today = todayISO();
  const formattedDate = formatDate(today);

  const phase = prediction?.currentPhase ?? null;
  const phaseLabel = phase ? getPhaseLabel(phase) : null;
  const phaseColor = phase
    ? getPhaseColorClass(phase)
    : "text-muted-foreground";
  const phaseDesc = phase ? getPhaseDescriptionLocal(phase) : null;
  const dailyMessage =
    profile && phase ? getDailyMessage(phase, profile.name) : null;

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 pt-6 pb-4 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-body uppercase tracking-wide">
              Today
            </p>
            {profileLoading ? (
              <Skeleton className="h-6 w-48 mt-1" />
            ) : (
              <h1 className="text-xl font-display font-semibold text-foreground leading-tight">
                {formattedDate}
              </h1>
            )}
          </div>
          <div className="flex items-center gap-2">
            {profile && (
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm font-body">
                {profile.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>

        {/* Daily message */}
        {dailyMessage && (
          <Card className="bg-primary/10 border-primary/20 shadow-none">
            <CardContent className="p-4 flex gap-3 items-start">
              <Heart
                className="w-4 h-4 text-primary mt-0.5 shrink-0"
                strokeWidth={2}
              />
              <p className="text-sm font-body text-foreground leading-relaxed">
                {dailyMessage}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Cycle phase card */}
        <Card className="border-border shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground font-body uppercase tracking-wide mb-1">
                  Cycle phase insight
                </p>
                {predLoading ? (
                  <>
                    <Skeleton className="h-7 w-40 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </>
                ) : phase ? (
                  <>
                    <h2
                      className={`text-2xl font-display font-semibold mb-1 ${phaseColor}`}
                    >
                      {phaseLabel}
                    </h2>
                    <p className="text-sm text-muted-foreground font-body leading-relaxed">
                      {phaseDesc}
                    </p>
                    {prediction && (
                      <p className="text-xs text-muted-foreground font-body mt-2">
                        Day {prediction.currentCycleDay} of ~
                        {prediction.estimatedCycleLength}-day cycle
                      </p>
                    )}
                  </>
                ) : (
                  <div className="space-y-1">
                    <p className="text-base font-body text-muted-foreground">
                      No cycle data yet
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Start tracking by selecting your first day in the
                      Calendar.
                    </p>
                  </div>
                )}
              </div>
              {phase && (
                <Badge
                  variant="secondary"
                  className="shrink-0 capitalize font-body text-xs"
                >
                  {phase}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link to="/calendar">
            <Card className="border-border shadow-sm hover:shadow-md transition-smooth cursor-pointer hover:border-primary/30">
              <CardContent className="p-4 flex flex-col gap-2">
                <CalendarDays
                  className="w-5 h-5 text-primary"
                  strokeWidth={1.8}
                />
                <p className="text-sm font-display font-semibold text-foreground">
                  Smart Calendar
                </p>
                <p className="text-xs text-muted-foreground font-body">
                  Track & predict your cycle
                </p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/log">
            <Card className="border-border shadow-sm hover:shadow-md transition-smooth cursor-pointer hover:border-primary/30">
              <CardContent className="p-4 flex flex-col gap-2">
                <ClipboardList
                  className="w-5 h-5 text-primary"
                  strokeWidth={1.8}
                />
                <p className="text-sm font-display font-semibold text-foreground">
                  Daily Log
                </p>
                <p className="text-xs text-muted-foreground font-body">
                  Mood, pain & symptoms
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Next period prediction */}
        {prediction && (
          <Card className="border-border shadow-sm">
            <CardContent className="p-5 space-y-3">
              <p className="text-xs text-muted-foreground font-body uppercase tracking-wide">
                Upcoming predictions
              </p>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-body text-foreground">
                    Next period
                  </span>
                  <span className="text-sm font-semibold font-body text-cycle-period">
                    {formatDate(prediction.nextPeriodStart)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-body text-foreground">
                    Ovulation
                  </span>
                  <span className="text-sm font-semibold font-body text-cycle-ovulation">
                    {formatDate(prediction.ovulationDate)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-body text-foreground">
                    Fertile window
                  </span>
                  <span className="text-sm font-semibold font-body text-cycle-fertile">
                    {formatDate(prediction.fertileWindowStart)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* CTA if no cycles */}
        {!predLoading && !prediction && (
          <Card className="border-dashed border-primary/30 bg-primary/5 shadow-none">
            <CardContent className="p-5 text-center space-y-3">
              <Sparkles
                className="w-8 h-8 text-primary mx-auto"
                strokeWidth={1.5}
              />
              <p className="text-base font-display font-semibold text-foreground">
                Start your cycle journey
              </p>
              <p className="text-sm text-muted-foreground font-body">
                Tap the Calendar to mark your first period day and unlock
                personalized insights.
              </p>
              <Link to="/calendar">
                <Button className="mt-1" data-ocid="cta-start-tracking">
                  Start Tracking
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Footer branding */}
        <p className="text-center text-xs text-muted-foreground font-body pb-2">
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </Layout>
  );
}

function getPhaseDescriptionLocal(phase: string): string {
  const map: Record<string, string> = {
    menstrual:
      "Your body is shedding the uterine lining. Rest is important during this time.",
    follicular:
      "Follicles in your ovaries are maturing. Energy levels improve as estrogen rises.",
    ovulation:
      "An egg is released. This is your most fertile time and energy is at its peak.",
    luteal:
      "Progesterone rises to prepare the uterus. A time for introspection and nourishment.",
  };
  return map[phase] ?? "";
}

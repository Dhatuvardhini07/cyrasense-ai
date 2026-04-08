import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAnalysis,
  useAverageCycleLength,
  useCycleHistory,
  useMonthlyReport,
} from "@/hooks/use-health-data";
import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle, Info, TrendingUp } from "lucide-react";

export default function Insights() {
  const { data: analysis, isLoading: analysisLoading } = useAnalysis();
  const { data: report, isLoading: reportLoading } = useMonthlyReport();
  const { data: cycles } = useCycleHistory();
  const { data: avgLength } = useAverageCycleLength();

  const recoBadgeVariant = (rec: string) => {
    if (rec.includes("professional")) return "destructive";
    if (rec.includes("lifestyle")) return "secondary";
    return "outline";
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 pt-6 pb-4 space-y-5">
        <h1 className="text-2xl font-display font-semibold text-foreground">
          Health Insights
        </h1>

        {/* Is This Normal? */}
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-display flex items-center gap-2">
              <Info className="w-4 h-4 text-primary" />
              Is This Normal?
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analysisLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ) : analysis ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  {analysis.isNormal ? (
                    <CheckCircle className="w-5 h-5 text-cycle-fertile shrink-0" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-cycle-period shrink-0" />
                  )}
                  <p className="font-body text-sm font-semibold text-foreground">
                    {analysis.summary}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground font-body leading-relaxed">
                  {analysis.explanation}
                </p>
                {analysis.details.map((d, i) => (
                  <p
                    key={`detail-${d.slice(0, 10)}-${i}`}
                    className="text-xs text-muted-foreground font-body italic"
                  >
                    • {d}
                  </p>
                ))}
                <div className="pt-1">
                  <Badge
                    variant={recoBadgeVariant(analysis.recommendation)}
                    className="font-body text-xs"
                  >
                    {analysis.recommendation}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground font-body mt-2 italic">
                  This is not medical advice. Always consult a qualified
                  healthcare professional for medical guidance.
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground font-body">
                No analysis available yet. Start tracking your cycle to receive
                insights.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Cycle stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="border-border shadow-sm">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground font-body uppercase tracking-wide">
                Avg Cycle
              </p>
              <p className="text-2xl font-display font-bold text-primary mt-1">
                {avgLength ?? 28}
                <span className="text-sm font-normal text-muted-foreground ml-1">
                  days
                </span>
              </p>
            </CardContent>
          </Card>
          <Card className="border-border shadow-sm">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground font-body uppercase tracking-wide">
                Cycles Tracked
              </p>
              <p className="text-2xl font-display font-bold text-primary mt-1">
                {cycles?.length ?? 0}
                <span className="text-sm font-normal text-muted-foreground ml-1">
                  total
                </span>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Monthly report */}
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-display flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Monthly Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            {reportLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ) : report ? (
              <div className="space-y-3">
                <div className="flex justify-between text-sm font-body">
                  <span className="text-muted-foreground">Cycle length</span>
                  <span className="font-semibold text-foreground">
                    {report.cycleLength} days
                  </span>
                </div>
                {report.averagePainLevel > 0 && (
                  <div className="flex justify-between text-sm font-body">
                    <span className="text-muted-foreground">
                      Avg pain level
                    </span>
                    <span
                      className={cn(
                        "font-semibold",
                        report.averagePainLevel > 6
                          ? "text-cycle-period"
                          : report.averagePainLevel > 3
                            ? "text-yellow-600"
                            : "text-cycle-fertile",
                      )}
                    >
                      {report.averagePainLevel}/10
                    </span>
                  </div>
                )}
                {report.patternInsights.map((insight) => (
                  <p
                    key={insight}
                    className="text-sm text-muted-foreground font-body"
                  >
                    • {insight}
                  </p>
                ))}
                {report.suggestedNextSteps.map((step) => (
                  <p
                    key={step}
                    className="text-xs text-muted-foreground font-body italic"
                  >
                    → {step}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground font-body">
                Track your cycle for monthly summaries and pattern insights.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Nearby healthcare */}
        <Card className="border-dashed border-primary/30 bg-primary/5 shadow-none">
          <CardContent className="p-5 space-y-2">
            <p className="text-sm font-display font-semibold text-foreground">
              📍 Healthcare Near You
            </p>
            <p className="text-sm text-muted-foreground font-body">
              Search for gynecologists and women's health specialists in your
              area.
            </p>
            <a
              href="https://www.google.com/search?q=gynecologist+near+me"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-sm font-body text-primary underline underline-offset-2 hover:opacity-80 transition-opacity"
              data-ocid="link-find-gynecologist"
            >
              Search gynecologists near you →
            </a>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

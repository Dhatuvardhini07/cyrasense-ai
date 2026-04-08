import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentPrediction } from "@/hooks/use-health-data";
import { useSelfCare } from "@/hooks/use-health-data";
import { getPhaseColorClass, getPhaseLabel } from "@/lib/cycle-utils";
import { cn } from "@/lib/utils";
import type { CyclePhase } from "@/types";

const CATEGORY_LABELS: Record<string, string> = {
  exercise: "Exercise",
  nutrition: "Nutrition",
  hygiene: "Hygiene",
  mindfulness: "Mindfulness",
  tip: "Tip",
};

const CATEGORY_COLORS: Record<string, string> = {
  exercise: "bg-primary/10 text-primary border-primary/20",
  nutrition: "bg-cycle-fertile/10 text-cycle-fertile border-cycle-fertile/20",
  hygiene: "bg-secondary text-secondary-foreground border-border",
  mindfulness:
    "bg-cycle-ovulation/10 text-cycle-ovulation border-cycle-ovulation/20",
  tip: "bg-accent/10 text-accent border-accent/20",
};

export default function SelfCare() {
  const { data: prediction, isLoading: predLoading } = useCurrentPrediction();
  const phase = (prediction?.currentPhase ?? null) as CyclePhase | null;
  const { data: items, isLoading: itemsLoading } = useSelfCare(phase);

  const isLoading = predLoading || itemsLoading;
  const phaseLabel = phase ? getPhaseLabel(phase) : null;
  const phaseColor = phase
    ? getPhaseColorClass(phase)
    : "text-muted-foreground";

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 pt-6 pb-4 space-y-5">
        <div>
          <h1 className="text-2xl font-display font-semibold text-foreground">
            Self-Care
          </h1>
          {phaseLabel && (
            <p className={cn("text-base font-body mt-1", phaseColor)}>
              Personalized for your {phaseLabel.toLowerCase()}
            </p>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {(["sk1", "sk2", "sk3", "sk4"] as const).map((id) => (
              <Skeleton key={id} className="h-24 w-full rounded-2xl" />
            ))}
          </div>
        ) : items && items.length > 0 ? (
          <div className="space-y-3">
            {items.map((item) => (
              <Card key={item.id} className="border-border shadow-sm">
                <CardContent className="p-4 flex gap-3 items-start">
                  <span className="text-2xl shrink-0 mt-0.5">
                    {item.icon ?? "✨"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-display font-semibold text-foreground">
                        {item.title}
                      </p>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px] shrink-0",
                          CATEGORY_COLORS[item.category] ?? "",
                        )}
                      >
                        {CATEGORY_LABELS[item.category] ?? item.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground font-body leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-dashed border-primary/30 bg-primary/5 shadow-none">
            <CardContent className="p-5 text-center">
              <p className="text-sm text-muted-foreground font-body">
                Start tracking your cycle to receive personalized self-care
                recommendations.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}

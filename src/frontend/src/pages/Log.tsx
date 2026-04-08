import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import {
  useCurrentPrediction,
  useLogForDate,
  useSaveDailyLog,
} from "@/hooks/use-health-data";
import { formatDate, todayISO } from "@/lib/cycle-utils";
import { useState } from "react";
import { toast } from "sonner";

const MOOD_OPTIONS = [
  "😊 Happy",
  "😌 Calm",
  "😔 Sad",
  "😤 Irritable",
  "😴 Tired",
  "🥰 Loving",
  "😰 Anxious",
  "💪 Energized",
];
const SYMPTOM_OPTIONS = [
  "Cramps",
  "Bloating",
  "Headache",
  "Breast tenderness",
  "Back pain",
  "Nausea",
  "Acne",
  "Food cravings",
  "Fatigue",
  "Spotting",
  "Heavy flow",
  "Light flow",
];

export default function Log() {
  const today = todayISO();
  const { data: existing, isLoading } = useLogForDate(today);
  const { data: prediction } = useCurrentPrediction();
  const saveLog = useSaveDailyLog();

  const [painLevel, setPainLevel] = useState<number>(existing?.painLevel ?? 0);
  const [painSet, setPainSet] = useState<boolean>(
    existing?.painLevel !== undefined,
  );
  const [mood, setMood] = useState<string>(existing?.mood ?? "");
  const [symptoms, setSymptoms] = useState<string[]>(existing?.symptoms ?? []);
  const [notes, setNotes] = useState<string>(existing?.notes ?? "");

  const phase = prediction?.currentPhase;

  function toggleSymptom(s: string) {
    setSymptoms((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );
  }

  async function handleSave() {
    if (!painSet && !mood && symptoms.length === 0 && !notes.trim()) {
      toast.error("Please add at least one input before saving.");
      return;
    }
    await saveLog.mutateAsync({
      date: today,
      painLevel: painSet ? painLevel : undefined,
      mood: mood || undefined,
      symptoms,
      notes: notes.trim() || undefined,
    });
    toast.success("Today's log saved!");
  }

  const painColor =
    painLevel === 0
      ? "text-muted-foreground"
      : painLevel <= 3
        ? "text-cycle-fertile"
        : painLevel <= 6
          ? "text-yellow-600"
          : "text-cycle-period";

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 pt-6 pb-4 space-y-5">
        <div>
          <h1 className="text-2xl font-display font-semibold text-foreground">
            Daily Log
          </h1>
          <p className="text-sm text-muted-foreground font-body mt-1">
            {formatDate(today)}
          </p>
          {phase && (
            <Badge
              variant="secondary"
              className="mt-2 capitalize font-body text-xs"
            >
              {phase} phase
            </Badge>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-32 w-full rounded-2xl" />
            <Skeleton className="h-48 w-full rounded-2xl" />
          </div>
        ) : (
          <>
            {/* Pain level */}
            <Card className="border-border shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-display flex items-center justify-between">
                  Pain Level
                  <span className={`text-lg font-bold ${painColor}`}>
                    {painLevel === 0 ? "None" : painLevel}
                    {painLevel > 0 && (
                      <span className="text-xs font-normal ml-1">/10</span>
                    )}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-5">
                <Slider
                  min={0}
                  max={10}
                  step={1}
                  value={[painLevel]}
                  onValueChange={([v]) => {
                    setPainLevel(v);
                    setPainSet(true);
                  }}
                  data-ocid="slider-pain-level"
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground font-body mt-2">
                  <span>No pain</span>
                  <span>Severe</span>
                </div>
              </CardContent>
            </Card>

            {/* Mood */}
            <Card className="border-border shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-display">
                  How are you feeling?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {MOOD_OPTIONS.map((m) => (
                    <button
                      type="button"
                      key={m}
                      data-ocid={`mood-${m.split(" ")[1]?.toLowerCase()}`}
                      onClick={() => setMood(mood === m ? "" : m)}
                      className={`px-3 py-1.5 rounded-full text-sm font-body border transition-smooth ${
                        mood === m
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card border-border text-foreground hover:border-primary/40"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Symptoms */}
            <Card className="border-border shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-display">Symptoms</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {SYMPTOM_OPTIONS.map((s) => (
                    <div key={s} className="flex items-center gap-2">
                      <Checkbox
                        id={`symptom-${s}`}
                        checked={symptoms.includes(s)}
                        onCheckedChange={() => toggleSymptom(s)}
                        data-ocid={`symptom-${s.toLowerCase().replace(/\s/g, "-")}`}
                      />
                      <Label
                        htmlFor={`symptom-${s}`}
                        className="text-sm font-body cursor-pointer"
                      >
                        {s}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card className="border-border shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-display">
                  Notes (optional)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="How are you doing today? Any observations…"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="font-body text-sm min-h-[80px] resize-none"
                  data-ocid="input-daily-notes"
                />
              </CardContent>
            </Card>

            <Button
              className="w-full"
              onClick={handleSave}
              disabled={saveLog.isPending}
              data-ocid="btn-save-log"
            >
              {saveLog.isPending
                ? "Saving…"
                : existing
                  ? "Update Today's Log"
                  : "Save Today's Log"}
            </Button>
          </>
        )}
      </div>
    </Layout>
  );
}

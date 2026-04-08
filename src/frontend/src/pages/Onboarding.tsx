import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSaveProfile } from "@/hooks/use-health-data";
import { ftInToCm, validateAge, validateHeightWeight } from "@/lib/cycle-utils";
import { cn } from "@/lib/utils";
import type { LifeStage } from "@/types";
import { useRouter } from "@tanstack/react-router";
import { AlertCircle, Heart } from "lucide-react";
import { useState } from "react";

const LIFE_STAGES: LifeStage[] = [
  "Regular Cycle Tracking",
  "Trying to Conceive",
  "Irregular Cycles",
  "General Awareness",
];

interface FormState {
  name: string;
  age: string;
  heightUnit: "cm" | "ft";
  heightCm: string;
  heightFt: string;
  heightIn: string;
  weightKg: string;
  city: string;
  lifeStage: LifeStage | "";
}

interface FormErrors {
  name?: string;
  age?: string;
  height?: string;
  weight?: string;
  heightWeight?: string;
  city?: string;
  lifeStage?: string;
}

export default function Onboarding() {
  const saveProfile = useSaveProfile();
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState<FormState>({
    name: "",
    age: "",
    heightUnit: "cm",
    heightCm: "",
    heightFt: "",
    heightIn: "0",
    weightKg: "",
    city: "",
    lifeStage: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  function update(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next: FormErrors = {};
      for (const k of Object.keys(prev) as (keyof FormErrors)[]) {
        if (k !== field && k !== "heightWeight") next[k] = prev[k];
      }
      return next;
    });
  }

  function validateStep1(): boolean {
    const newErrors: FormErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Please enter your name.";
    }
    if (!form.age.trim()) {
      newErrors.age = "Please enter your age.";
    } else {
      const ageNum = Number.parseInt(form.age, 10);
      if (!Number.isFinite(ageNum)) {
        newErrors.age = "Please enter a valid age.";
      } else {
        const ageCheck = validateAge(ageNum);
        if (!ageCheck.valid) newErrors.age = ageCheck.message;
      }
    }

    const heightCmNum =
      form.heightUnit === "cm"
        ? Number.parseFloat(form.heightCm)
        : ftInToCm(
            Number.parseFloat(form.heightFt) || 0,
            Number.parseFloat(form.heightIn) || 0,
          );

    if (form.heightUnit === "cm" && !form.heightCm) {
      newErrors.height = "Please enter your height.";
    } else if (form.heightUnit === "ft" && !form.heightFt) {
      newErrors.height = "Please enter your height.";
    } else if (
      !Number.isFinite(heightCmNum) ||
      heightCmNum < 100 ||
      heightCmNum > 250
    ) {
      newErrors.height = "Please enter a height between 100–250 cm.";
    }

    if (!form.weightKg.trim()) {
      newErrors.weight = "Please enter your weight.";
    } else {
      const weightNum = Number.parseFloat(form.weightKg);
      if (!Number.isFinite(weightNum)) {
        newErrors.weight = "Please enter a valid weight.";
      } else if (!newErrors.height) {
        const hwCheck = validateHeightWeight(heightCmNum, weightNum);
        if (!hwCheck.valid) newErrors.heightWeight = hwCheck.message;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function validateStep2(): boolean {
    const newErrors: FormErrors = {};
    if (!form.city.trim()) newErrors.city = "Please enter your city.";
    if (!form.lifeStage) newErrors.lifeStage = "Please select your life stage.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleFinish() {
    if (!validateStep2()) return;

    const heightCmNum =
      form.heightUnit === "cm"
        ? Number.parseFloat(form.heightCm)
        : ftInToCm(
            Number.parseFloat(form.heightFt) || 0,
            Number.parseFloat(form.heightIn) || 0,
          );

    await saveProfile.mutateAsync({
      name: form.name.trim(),
      age: Number.parseInt(form.age, 10),
      heightCm: heightCmNum,
      weightKg: Number.parseFloat(form.weightKg),
      city: form.city.trim(),
      lifeStage: form.lifeStage as LifeStage,
    });

    router.navigate({ to: "/dashboard" });
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8"
      style={{
        background:
          "linear-gradient(160deg, oklch(0.97 0.012 75) 0%, oklch(0.94 0.022 55) 50%, oklch(0.96 0.018 30) 100%)",
      }}
    >
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto shadow-lg">
            <Heart
              className="w-7 h-7 text-primary-foreground"
              strokeWidth={2}
            />
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground">
            CyraSense AI
          </h1>
          <p className="text-sm text-muted-foreground font-body">
            Your intelligent women's health companion
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={cn(
                "h-1.5 rounded-full transition-smooth",
                s === step
                  ? "w-8 bg-primary"
                  : s < step
                    ? "w-4 bg-primary/40"
                    : "w-4 bg-muted",
              )}
            />
          ))}
        </div>

        <Card className="shadow-lg border-border">
          <CardContent className="p-6 space-y-5">
            {step === 1 ? (
              <>
                <div className="space-y-1">
                  <h2 className="text-lg font-display font-semibold text-foreground">
                    Tell us about you
                  </h2>
                  <p className="text-sm text-muted-foreground font-body">
                    We use this to personalize your experience.
                  </p>
                </div>

                {/* Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="font-body text-sm">
                    Your name
                  </Label>
                  <Input
                    id="name"
                    placeholder="e.g. Priya"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    className={cn(
                      "font-body",
                      errors.name && "border-destructive",
                    )}
                    data-ocid="input-name"
                  />
                  {errors.name && <FieldError message={errors.name} />}
                </div>

                {/* Age */}
                <div className="space-y-1.5">
                  <Label htmlFor="age" className="font-body text-sm">
                    Age
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="e.g. 26"
                    min={10}
                    max={60}
                    value={form.age}
                    onChange={(e) => update("age", e.target.value)}
                    className={cn(
                      "font-body",
                      errors.age && "border-destructive",
                    )}
                    data-ocid="input-age"
                  />
                  {errors.age && <FieldError message={errors.age} />}
                </div>

                {/* Height */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="font-body text-sm">Height</Label>
                    <div className="flex gap-1">
                      {(["cm", "ft"] as const).map((u) => (
                        <button
                          type="button"
                          key={u}
                          onClick={() => update("heightUnit", u)}
                          className={cn(
                            "text-xs px-2.5 py-1 rounded-full font-body transition-smooth border",
                            form.heightUnit === u
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-card text-muted-foreground border-border hover:border-primary/40",
                          )}
                        >
                          {u}
                        </button>
                      ))}
                    </div>
                  </div>
                  {form.heightUnit === "cm" ? (
                    <Input
                      type="number"
                      placeholder="e.g. 163"
                      value={form.heightCm}
                      onChange={(e) => update("heightCm", e.target.value)}
                      className={cn(
                        "font-body",
                        errors.height && "border-destructive",
                      )}
                      data-ocid="input-height-cm"
                    />
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="ft"
                        value={form.heightFt}
                        onChange={(e) => update("heightFt", e.target.value)}
                        className={cn(
                          "font-body w-20",
                          errors.height && "border-destructive",
                        )}
                        data-ocid="input-height-ft"
                      />
                      <Input
                        type="number"
                        placeholder="in"
                        value={form.heightIn}
                        onChange={(e) => update("heightIn", e.target.value)}
                        className="font-body w-20"
                        data-ocid="input-height-in"
                      />
                    </div>
                  )}
                  {errors.height && <FieldError message={errors.height} />}
                </div>

                {/* Weight */}
                <div className="space-y-1.5">
                  <Label htmlFor="weight" className="font-body text-sm">
                    Weight (kg)
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="e.g. 58"
                    value={form.weightKg}
                    onChange={(e) => update("weightKg", e.target.value)}
                    className={cn(
                      "font-body",
                      errors.weight && "border-destructive",
                    )}
                    data-ocid="input-weight"
                  />
                  {errors.weight && <FieldError message={errors.weight} />}
                </div>

                {/* Combined height/weight error */}
                {errors.heightWeight && (
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-destructive/5 border border-destructive/20">
                    <AlertCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                    <p className="text-sm font-body text-destructive">
                      {errors.heightWeight}
                    </p>
                  </div>
                )}

                <Button
                  className="w-full"
                  onClick={() => {
                    if (validateStep1()) setStep(2);
                  }}
                  data-ocid="btn-next-step"
                >
                  Continue →
                </Button>
              </>
            ) : (
              <>
                <div className="space-y-1">
                  <h2 className="text-lg font-display font-semibold text-foreground">
                    One more thing
                  </h2>
                  <p className="text-sm text-muted-foreground font-body">
                    Help us personalize your guidance.
                  </p>
                </div>

                {/* City */}
                <div className="space-y-1.5">
                  <Label htmlFor="city" className="font-body text-sm">
                    City
                  </Label>
                  <Input
                    id="city"
                    placeholder="e.g. Mumbai"
                    value={form.city}
                    onChange={(e) => update("city", e.target.value)}
                    className={cn(
                      "font-body",
                      errors.city && "border-destructive",
                    )}
                    data-ocid="input-city"
                  />
                  {errors.city && <FieldError message={errors.city} />}
                  <p className="text-xs text-muted-foreground font-body">
                    Used to suggest local healthcare resources.
                  </p>
                </div>

                {/* Life stage */}
                <div className="space-y-1.5">
                  <Label className="font-body text-sm">
                    I am tracking for…
                  </Label>
                  <div className="space-y-2">
                    {LIFE_STAGES.map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => update("lifeStage", s)}
                        data-ocid={`life-stage-${s.toLowerCase().replace(/\s/g, "-")}`}
                        className={cn(
                          "w-full text-left px-4 py-3 rounded-xl border text-sm font-body transition-smooth",
                          form.lifeStage === s
                            ? "bg-primary/10 border-primary text-foreground"
                            : "bg-card border-border text-foreground hover:border-primary/40",
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  {errors.lifeStage && (
                    <FieldError message={errors.lifeStage} />
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleFinish}
                    disabled={saveProfile.isPending}
                    className="flex-1"
                    data-ocid="btn-complete-onboarding"
                  >
                    {saveProfile.isPending ? "Setting up…" : "Begin Journey ✨"}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground font-body">
          CyraSense AI is not a medical device. Always consult your healthcare
          provider for medical advice.
        </p>
      </div>
    </div>
  );
}

function FieldError({ message }: { message: string }) {
  return (
    <p className="text-xs text-destructive font-body flex items-center gap-1">
      <AlertCircle className="w-3 h-3" />
      {message}
    </p>
  );
}

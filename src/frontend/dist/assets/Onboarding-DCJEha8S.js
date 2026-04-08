import { u as useRouter, r as reactExports, j as jsxRuntimeExports, c as cn } from "./index-DNVH2Qkg.js";
import { B as Button } from "./button-CrkwacFM.js";
import { c as createLucideIcon, u as useSaveProfile, C as Card, a as CardContent, f as ftInToCm, v as validateAge, b as validateHeightWeight } from "./createLucideIcon-BASLoXwI.js";
import { I as Input } from "./input-7Yzeg1-J.js";
import { L as Label } from "./label-DEKBdpsS.js";
import { H as Heart } from "./heart-D-6YFsHb.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
];
const CircleAlert = createLucideIcon("circle-alert", __iconNode);
const LIFE_STAGES = [
  "Regular Cycle Tracking",
  "Trying to Conceive",
  "Irregular Cycles",
  "General Awareness"
];
function Onboarding() {
  const saveProfile = useSaveProfile();
  const router = useRouter();
  const [step, setStep] = reactExports.useState(1);
  const [form, setForm] = reactExports.useState({
    name: "",
    age: "",
    heightUnit: "cm",
    heightCm: "",
    heightFt: "",
    heightIn: "0",
    weightKg: "",
    city: "",
    lifeStage: ""
  });
  const [errors, setErrors] = reactExports.useState({});
  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = {};
      for (const k of Object.keys(prev)) {
        if (k !== field && k !== "heightWeight") next[k] = prev[k];
      }
      return next;
    });
  }
  function validateStep1() {
    const newErrors = {};
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
    const heightCmNum = form.heightUnit === "cm" ? Number.parseFloat(form.heightCm) : ftInToCm(
      Number.parseFloat(form.heightFt) || 0,
      Number.parseFloat(form.heightIn) || 0
    );
    if (form.heightUnit === "cm" && !form.heightCm) {
      newErrors.height = "Please enter your height.";
    } else if (form.heightUnit === "ft" && !form.heightFt) {
      newErrors.height = "Please enter your height.";
    } else if (!Number.isFinite(heightCmNum) || heightCmNum < 100 || heightCmNum > 250) {
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
  function validateStep2() {
    const newErrors = {};
    if (!form.city.trim()) newErrors.city = "Please enter your city.";
    if (!form.lifeStage) newErrors.lifeStage = "Please select your life stage.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }
  async function handleFinish() {
    if (!validateStep2()) return;
    const heightCmNum = form.heightUnit === "cm" ? Number.parseFloat(form.heightCm) : ftInToCm(
      Number.parseFloat(form.heightFt) || 0,
      Number.parseFloat(form.heightIn) || 0
    );
    await saveProfile.mutateAsync({
      name: form.name.trim(),
      age: Number.parseInt(form.age, 10),
      heightCm: heightCmNum,
      weightKg: Number.parseFloat(form.weightKg),
      city: form.city.trim(),
      lifeStage: form.lifeStage
    });
    router.navigate({ to: "/dashboard" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "min-h-screen flex flex-col items-center justify-center px-4 py-8",
      style: {
        background: "linear-gradient(160deg, oklch(0.97 0.012 75) 0%, oklch(0.94 0.022 55) 50%, oklch(0.96 0.018 30) 100%)"
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Heart,
            {
              className: "w-7 h-7 text-primary-foreground",
              strokeWidth: 2
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-display font-bold text-foreground", children: "CyraSense AI" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground font-body", children: "Your intelligent women's health companion" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center gap-2", children: [1, 2].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: cn(
              "h-1.5 rounded-full transition-smooth",
              s === step ? "w-8 bg-primary" : s < step ? "w-4 bg-primary/40" : "w-4 bg-muted"
            )
          },
          s
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "shadow-lg border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-6 space-y-5", children: step === 1 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-display font-semibold text-foreground", children: "Tell us about you" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground font-body", children: "We use this to personalize your experience." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "name", className: "font-body text-sm", children: "Your name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "name",
                placeholder: "e.g. Priya",
                value: form.name,
                onChange: (e) => update("name", e.target.value),
                className: cn(
                  "font-body",
                  errors.name && "border-destructive"
                ),
                "data-ocid": "input-name"
              }
            ),
            errors.name && /* @__PURE__ */ jsxRuntimeExports.jsx(FieldError, { message: errors.name })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "age", className: "font-body text-sm", children: "Age" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "age",
                type: "number",
                placeholder: "e.g. 26",
                min: 10,
                max: 60,
                value: form.age,
                onChange: (e) => update("age", e.target.value),
                className: cn(
                  "font-body",
                  errors.age && "border-destructive"
                ),
                "data-ocid": "input-age"
              }
            ),
            errors.age && /* @__PURE__ */ jsxRuntimeExports.jsx(FieldError, { message: errors.age })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "font-body text-sm", children: "Height" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1", children: ["cm", "ft"].map((u) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => update("heightUnit", u),
                  className: cn(
                    "text-xs px-2.5 py-1 rounded-full font-body transition-smooth border",
                    form.heightUnit === u ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border hover:border-primary/40"
                  ),
                  children: u
                },
                u
              )) })
            ] }),
            form.heightUnit === "cm" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "number",
                placeholder: "e.g. 163",
                value: form.heightCm,
                onChange: (e) => update("heightCm", e.target.value),
                className: cn(
                  "font-body",
                  errors.height && "border-destructive"
                ),
                "data-ocid": "input-height-cm"
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  placeholder: "ft",
                  value: form.heightFt,
                  onChange: (e) => update("heightFt", e.target.value),
                  className: cn(
                    "font-body w-20",
                    errors.height && "border-destructive"
                  ),
                  "data-ocid": "input-height-ft"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  placeholder: "in",
                  value: form.heightIn,
                  onChange: (e) => update("heightIn", e.target.value),
                  className: "font-body w-20",
                  "data-ocid": "input-height-in"
                }
              )
            ] }),
            errors.height && /* @__PURE__ */ jsxRuntimeExports.jsx(FieldError, { message: errors.height })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "weight", className: "font-body text-sm", children: "Weight (kg)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "weight",
                type: "number",
                placeholder: "e.g. 58",
                value: form.weightKg,
                onChange: (e) => update("weightKg", e.target.value),
                className: cn(
                  "font-body",
                  errors.weight && "border-destructive"
                ),
                "data-ocid": "input-weight"
              }
            ),
            errors.weight && /* @__PURE__ */ jsxRuntimeExports.jsx(FieldError, { message: errors.weight })
          ] }),
          errors.heightWeight && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 p-3 rounded-xl bg-destructive/5 border border-destructive/20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-4 h-4 text-destructive mt-0.5 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-body text-destructive", children: errors.heightWeight })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              className: "w-full",
              onClick: () => {
                if (validateStep1()) setStep(2);
              },
              "data-ocid": "btn-next-step",
              children: "Continue →"
            }
          )
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-display font-semibold text-foreground", children: "One more thing" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground font-body", children: "Help us personalize your guidance." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "city", className: "font-body text-sm", children: "City" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "city",
                placeholder: "e.g. Mumbai",
                value: form.city,
                onChange: (e) => update("city", e.target.value),
                className: cn(
                  "font-body",
                  errors.city && "border-destructive"
                ),
                "data-ocid": "input-city"
              }
            ),
            errors.city && /* @__PURE__ */ jsxRuntimeExports.jsx(FieldError, { message: errors.city }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-body", children: "Used to suggest local healthcare resources." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "font-body text-sm", children: "I am tracking for…" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: LIFE_STAGES.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => update("lifeStage", s),
                "data-ocid": `life-stage-${s.toLowerCase().replace(/\s/g, "-")}`,
                className: cn(
                  "w-full text-left px-4 py-3 rounded-xl border text-sm font-body transition-smooth",
                  form.lifeStage === s ? "bg-primary/10 border-primary text-foreground" : "bg-card border-border text-foreground hover:border-primary/40"
                ),
                children: s
              },
              s
            )) }),
            errors.lifeStage && /* @__PURE__ */ jsxRuntimeExports.jsx(FieldError, { message: errors.lifeStage })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                onClick: () => setStep(1),
                className: "flex-1",
                children: "Back"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: handleFinish,
                disabled: saveProfile.isPending,
                className: "flex-1",
                "data-ocid": "btn-complete-onboarding",
                children: saveProfile.isPending ? "Setting up…" : "Begin Journey ✨"
              }
            )
          ] })
        ] }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-xs text-muted-foreground font-body", children: "CyraSense AI is not a medical device. Always consult your healthcare provider for medical advice." })
      ] })
    }
  );
}
function FieldError({ message }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-destructive font-body flex items-center gap-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-3 h-3" }),
    message
  ] });
}
export {
  Onboarding as default
};

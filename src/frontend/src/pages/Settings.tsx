import { Layout } from "@/components/Layout";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useProfile, useUpdateProfile } from "@/hooks/use-health-data";
import type { LifeStage } from "@/types";
import { useRouter } from "@tanstack/react-router";
import { LogOut, MapPin, Shield, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const LIFE_STAGES: LifeStage[] = [
  "Regular Cycle Tracking",
  "Trying to Conceive",
  "Irregular Cycles",
  "General Awareness",
];

export default function Settings() {
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const router = useRouter();

  const [editName, setEditName] = useState("");
  const [editCity, setEditCity] = useState("");
  const [editLifeStage, setEditLifeStage] = useState<LifeStage | "">("");
  const [isEditing, setIsEditing] = useState(false);

  function startEdit() {
    setEditName(profile?.name ?? "");
    setEditCity(profile?.city ?? "");
    setEditLifeStage(profile?.lifeStage ?? "");
    setIsEditing(true);
  }

  async function saveEdit() {
    await updateProfile.mutateAsync({
      name: editName.trim() || undefined,
      city: editCity.trim() || undefined,
      lifeStage: (editLifeStage || undefined) as LifeStage | undefined,
    });
    toast.success("Profile updated!");
    setIsEditing(false);
  }

  function handleLogout() {
    localStorage.clear();
    router.navigate({ to: "/onboarding" });
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 pt-6 pb-4 space-y-5">
        <h1 className="text-2xl font-display font-semibold text-foreground">
          Settings
        </h1>

        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-32 w-full rounded-2xl" />
            <Skeleton className="h-24 w-full rounded-2xl" />
          </div>
        ) : (
          <>
            {/* Profile */}
            <Card className="border-border shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-display flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div className="space-y-1">
                      <Label htmlFor="edit-name" className="font-body text-sm">
                        Name
                      </Label>
                      <Input
                        id="edit-name"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="font-body text-sm"
                        data-ocid="input-edit-name"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="edit-city" className="font-body text-sm">
                        City
                      </Label>
                      <Input
                        id="edit-city"
                        value={editCity}
                        onChange={(e) => setEditCity(e.target.value)}
                        className="font-body text-sm"
                        data-ocid="input-edit-city"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="font-body text-sm">Life Stage</Label>
                      <Select
                        value={editLifeStage}
                        onValueChange={(v) => setEditLifeStage(v as LifeStage)}
                      >
                        <SelectTrigger
                          className="font-body text-sm"
                          data-ocid="select-edit-life-stage"
                        >
                          <SelectValue placeholder="Select life stage" />
                        </SelectTrigger>
                        <SelectContent>
                          {LIFE_STAGES.map((s) => (
                            <SelectItem
                              key={s}
                              value={s}
                              className="font-body text-sm"
                            >
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={saveEdit}
                        disabled={updateProfile.isPending}
                        className="flex-1"
                        data-ocid="btn-save-profile"
                      >
                        {updateProfile.isPending ? "Saving…" : "Save Changes"}
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-lg font-semibold font-display">
                        {profile?.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-display font-semibold text-foreground">
                          {profile?.name}
                        </p>
                        <p className="text-sm text-muted-foreground font-body">
                          Age {profile?.age} · {profile?.city}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground font-body">
                          Life stage
                        </p>
                        <Badge
                          variant="secondary"
                          className="mt-1 font-body text-xs"
                        >
                          {profile?.lifeStage}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground font-body">
                          BMI
                        </p>
                        <p className="text-sm font-semibold font-body text-foreground mt-0.5">
                          {profile
                            ? (
                                profile.weightKg /
                                (profile.heightCm / 100) ** 2
                              ).toFixed(1)
                            : "—"}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={startEdit}
                      className="w-full"
                      data-ocid="btn-edit-profile"
                    >
                      Edit Profile
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Privacy */}
            <Card className="border-border shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-display flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  Privacy & Data
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground font-body leading-relaxed">
                  Your health data is stored securely on your device and never
                  shared with third parties. CyraSense AI is not a medical
                  device and does not provide medical diagnoses.
                </p>
              </CardContent>
            </Card>

            {/* Location */}
            <Card className="border-border shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-display flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-body text-foreground">
                  {profile?.city ?? "Not set"}
                </p>
                <p className="text-xs text-muted-foreground font-body mt-1">
                  Used to suggest nearby healthcare resources.
                </p>
              </CardContent>
            </Card>

            {/* Logout */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full border-destructive/30 text-destructive hover:bg-destructive/5"
                  data-ocid="btn-logout"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Log Out & Clear Data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="font-display">
                    Clear all data?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="font-body">
                    This will remove your profile and all health tracking data
                    from this device. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="font-body">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleLogout}
                    className="bg-destructive hover:bg-destructive/90 font-body"
                    data-ocid="btn-confirm-logout"
                  >
                    Clear & Log Out
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

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
          </>
        )}
      </div>
    </Layout>
  );
}

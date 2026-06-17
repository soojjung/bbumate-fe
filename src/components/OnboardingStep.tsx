import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Home } from "lucide-react";

interface OnboardingStepProps {
  onComplete: (region: string, housing: string) => void;
}

// `value` is the Korean code sent to the Korean-language backend RAG/API.
// `label` is the English label shown in the UI.
const regions: { value: string; label: string }[] = [
  { value: "서울", label: "Seoul" },
  { value: "경기", label: "Gyeonggi" },
  { value: "인천", label: "Incheon" },
  { value: "부산", label: "Busan" },
  { value: "대구", label: "Daegu" },
  { value: "광주", label: "Gwangju" },
  { value: "대전", label: "Daejeon" },
  { value: "울산", label: "Ulsan" },
  { value: "세종", label: "Sejong" },
  { value: "강원", label: "Gangwon" },
  { value: "충북", label: "Chungbuk" },
  { value: "충남", label: "Chungnam" },
  { value: "전북", label: "Jeonbuk" },
  { value: "전남", label: "Jeonnam" },
  { value: "경북", label: "Gyeongbuk" },
  { value: "경남", label: "Gyeongnam" },
  { value: "제주", label: "Jeju" },
];

const housingOptions = [
  { value: "none", label: "No home" },
  { value: "jeonse", label: "Jeonse (lump-sum deposit)" },
  { value: "wolse", label: "Monthly rent" },
  { value: "self", label: "Homeowner" },
  { value: "etc", label: "Other" },
];

// Skip sentinel — kept as the Korean string the backend already understands.
export const SKIPPED = "미응답";

export const OnboardingStep = ({ onComplete }: OnboardingStepProps) => {
  const [step, setStep] = useState(1);
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [selectedHousing, setSelectedHousing] = useState<string>("");

  const handleNext = () => {
    if (step === 1 && selectedRegion) {
      setStep(2);
    } else if (step === 2 && selectedHousing) {
      onComplete(selectedRegion, selectedHousing);
    }
  };

  const handleSkip = () => {
    if (step === 1) {
      setSelectedRegion(SKIPPED);
      setStep(2);
    } else {
      onComplete(selectedRegion || SKIPPED, SKIPPED);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[100dvh] overflow-hidden bg-gradient-hero p-4">
      <Card className="w-full max-w-lg shadow-card border-border animate-fade-in">
        <CardContent className="p-6 md:p-8">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              {step === 1 ? (
                <MapPin className="h-6 w-6 text-primary" />
              ) : (
                <Home className="h-6 w-6 text-primary" />
              )}
              <h2 className="text-xl md:text-2xl font-bold text-foreground">
                {step === 1
                  ? "Select your region"
                  : "What's your housing situation?"}
              </h2>
            </div>
            <p className="text-sm text-muted-foreground">
              {step === 1
                ? "We'll surface policies tailored to your region"
                : "We'll find support programs that fit your housing type"}
            </p>
          </div>

          {step === 1 ? (
            <div className="grid grid-cols-3 gap-2 mb-6">
              {regions.map((region) => (
                <Button
                  key={region.value}
                  variant={selectedRegion === region.value ? "default" : "outline"}
                  onClick={() => setSelectedRegion(region.value)}
                  className={`h-12 ${
                    selectedRegion === region.value
                      ? "bg-gradient-primary text-white hover:opacity-90"
                      : "hover:bg-secondary"
                  }`}
                >
                  {region.label}
                </Button>
              ))}
            </div>
          ) : (
            <div className="space-y-2 mb-6">
              {housingOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={
                    selectedHousing === option.value ? "default" : "outline"
                  }
                  onClick={() => setSelectedHousing(option.value)}
                  className={`w-full h-14 justify-start text-left ${
                    selectedHousing === option.value
                      ? "bg-gradient-primary text-white hover:opacity-90"
                      : "hover:bg-secondary"
                  }`}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSkip} className="flex-1">
              Skip
            </Button>
            <Button
              onClick={handleNext}
              disabled={step === 1 ? !selectedRegion : !selectedHousing}
              className="flex-1 bg-[var(--button-bg)] hover:bg-[var(--button-bg)] hover:opacity-90 text-white"
            >
              {step === 1 ? "Next" : "Get Started"}
            </Button>
          </div>

          <div className="flex justify-center gap-2 mt-6">
            <div
              className={`h-2 w-2 rounded-full ${
                step === 1 ? "bg-primary" : "bg-muted"
              }`}
            />
            <div
              className={`h-2 w-2 rounded-full ${
                step === 2 ? "bg-primary" : "bg-muted"
              }`}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const REGION_LABELS: Record<string, string> = Object.fromEntries(
  regions.map((r) => [r.value, r.label])
);

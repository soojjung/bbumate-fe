import { useEffect, useRef, useState } from "react";
import { queryRag } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ChatMessage } from "@/components/ChatMessage";
import { OnboardingStep, REGION_LABELS, SKIPPED } from "@/components/OnboardingStep";

const HOUSING_LABELS: Record<string, string> = {
  none: "No home",
  jeonse: "Jeonse",
  wolse: "Monthly rent",
  self: "Homeowner",
  etc: "Other",
};

// API expects the original Korean labels.
const HOUSING_API_LABELS: Record<string, string> = {
  none: "무주택",
  jeonse: "전세",
  wolse: "월세",
  self: "자가",
  etc: "기타",
};

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string; // may contain HTML for assistant
  timestamp: Date;
  format?: "html" | "md" | "text";
  isComplete?: boolean;
  sources?: Array<{
    title: string;
    url: string | null;
  }>;
}

interface UserContext {
  region: string;
  housing: string;
}

const Chat = () => {
  const navigate = useNavigate();
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [userContext, setUserContext] = useState<UserContext | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const typingTimerRef = useRef<number | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    return () => {
      if (typingTimerRef.current) {
        clearInterval(typingTimerRef.current);
        typingTimerRef.current = null;
      }
    };
  }, []);

  const streamAssistantMessage = (messageId: string, fullText: string) => {
    const WORDS_PER_TICK = 1;
    const INTERVAL_MS = 40;
    const tokens = fullText.match(/\S+\s*/g) || [fullText];
    let index = 0;
    if (typingTimerRef.current) {
      clearInterval(typingTimerRef.current);
      typingTimerRef.current = null;
    }
    typingTimerRef.current = window.setInterval(() => {
      index = Math.min(index + WORDS_PER_TICK, tokens.length);
      const nextSlice = tokens.slice(0, index).join("");
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, content: nextSlice } : m))
      );
      if (index >= tokens.length && typingTimerRef.current) {
        clearInterval(typingTimerRef.current);
        typingTimerRef.current = null;
        // mark complete
        setMessages((prev) =>
          prev.map((m) => (m.id === messageId ? { ...m, isComplete: true } : m))
        );
      }
    }, INTERVAL_MS);
  };

  const handleOnboardingComplete = (region: string, housing: string) => {
    setUserContext({ region, housing });
    setShowOnboarding(false);
    try {
      // Persist the raw codes (Korean region key, housing code) so the
      // normalize helpers below produce the right API payload on rehydration.
      localStorage.setItem("region", region === SKIPPED ? "" : region);
      localStorage.setItem("housing_type", housing === SKIPPED ? "" : housing);
    } catch {}

    const welcomeMessage: Message = {
      id: "1",
      role: "assistant",
      content: `Hi! I'm the Newlywed Policy Counseling Chatbot.\n\n📍 Region: ${getRegionLabel(
        region
      )}\n🏠 Housing: ${getHousingLabel(
        housing
      )}\n\nBased on this, I'll guide you to policies that fit your situation. Feel free to ask anything.\n\nExamples:\n• What counts as a newlywed couple?\n• What subsidies are available when a first child is born?\n• What support is available for single mothers?\n• What department-store benefits are available to newlyweds?`,
      timestamp: new Date(),
    };

    setMessages([welcomeMessage]);
  };

  // English display label for the housing code (or skip sentinel).
  const getHousingLabel = (value: string) => {
    if (!value || value === SKIPPED) return "Not specified";
    return HOUSING_LABELS[value] || value;
  };

  // English display label for the region code (Korean key like "서울") or skip sentinel.
  const getRegionLabel = (value: string) => {
    if (!value || value === SKIPPED) return "Not specified";
    return REGION_LABELS[value] || value;
  };

  // For API: region is already a Korean string (e.g. "서울"); pass through, empty on skip.
  const normalizeRegion = (value: string | undefined) => {
    if (!value || value === SKIPPED) return "";
    return value;
  };

  // For API: convert housing code to Korean label, empty on skip.
  const normalizeHousingType = (value: string | undefined) => {
    if (!value || value === SKIPPED) return "";
    return HOUSING_API_LABELS[value] || "";
  };

  const handleSend = async () => {
    if (isLoading) return;
    const trimmed = input.trim();
    if (trimmed.length === 0) {
      toast({
        title: "Please enter a question",
        description: "Your question can't be empty. Up to 500 characters.",
        variant: "destructive",
      });
      return;
    }
    if (trimmed.length > 500) {
      toast({
        title: "Question is too long",
        description: `${trimmed.length} characters entered. Please keep it under 500.`,
        variant: "destructive",
      });
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      let storedRegion = "";
      let storedHousingType = "";
      try {
        storedRegion = localStorage.getItem("region") || "";
        storedHousingType = localStorage.getItem("housing_type") || "";
      } catch {}

      const regionToSend = normalizeRegion(userContext?.region ?? storedRegion);
      const housingToSend = normalizeHousingType(
        userContext?.housing ?? storedHousingType
      );

      const data = await queryRag({
        question: userMessage.content,
        region: regionToSend,
        housing_type: housingToSend,
        lang: "en",
      });
      const finalContent =
        data.answer_md || data.answer_html || data.answer || "";
      const finalFormat: Message["format"] =
        (data.answer_md && "md") || (data.answer_html && "html") || "text";

      const placeholder: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: finalFormat === "html" ? finalContent : "",
        format: finalFormat,
        isComplete: finalFormat === "html", // html is rendered at once
        sources: data.sources || [],
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, placeholder]);
      if (finalFormat !== "html" && finalContent) {
        streamAssistantMessage(placeholder.id, finalContent);
      }
    } catch (error) {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Something went wrong while processing your request. Please try again in a moment.",
        format: "text",
        isComplete: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (showOnboarding) {
    return <OnboardingStep onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-[100dvh] bg-gradient-hero flex flex-col overflow-x-hidden">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-3 md:py-4 flex items-center gap-3 shadow-card">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/")}
          className="rounded-full hover:bg-secondary flex-shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
            <Heart className="h-4 w-4 md:h-5 md:w-5 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="font-semibold text-foreground text-sm md:text-base truncate">
              Newlywed Policy Counseling Chatbot
            </h1>
            <p className="text-xs text-muted-foreground truncate">
              {getRegionLabel(userContext?.region || "")} ·{" "}
              {getHousingLabel(userContext?.housing || "")}
            </p>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 md:py-6 space-y-3 md:space-y-4 max-w-4xl mx-auto w-full">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isLoading && (
          <div className="flex items-start gap-2">
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-full overflow-hidden flex-shrink-0">
              <img
                src="/bt21.jpg"
                alt="Chatbot avatar"
                className="w-full h-full object-cover scale-110"
              />
            </div>
            <div className="bg-card rounded-2xl px-4 py-3 shadow-card border border-border">
              <div className="flex gap-1">
                <div
                  className="w-2 h-2 rounded-full bg-primary animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <div
                  className="w-2 h-2 rounded-full bg-primary animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <div
                  className="w-2 h-2 rounded-full bg-primary animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-card border-t border-border px-4 py-3 md:py-4 shadow-card">
        <div className="flex gap-2 max-w-4xl mx-auto">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your question..."
            className="flex-1 rounded-full border-border focus:ring-primary focus-visible:ring-1 focus-visible:ring-offset-0 text-base placeholder:text-base sm:text-sm sm:placeholder:text-sm"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            size="icon"
            className="rounded-full bg-gradient-primary hover:opacity-90 transition-opacity shadow-soft flex-shrink-0"
          >
            <Send className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chat;

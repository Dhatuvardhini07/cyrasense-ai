import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useChatHistory, useSendChatMessage } from "@/hooks/use-health-data";
import { cn } from "@/lib/utils";
import { Bot, Send, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const SUGGESTIONS = [
  "What causes period cramps?",
  "When am I most fertile?",
  "How does stress affect my cycle?",
  "What foods help with PMS?",
];

export default function Chat() {
  const { data: history, isLoading } = useChatHistory();
  const send = useSendChatMessage();
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const historyLen = history?.length ?? 0;
  // Scroll to bottom when new messages arrive
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional — only scroll when count changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [historyLen]);

  async function handleSend(text?: string) {
    const message = (text ?? input).trim();
    if (!message) return;
    setInput("");
    await send.mutateAsync(message);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 pt-6 pb-4 flex flex-col h-[calc(100vh-5rem)]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0">
            <Bot className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-display font-semibold text-foreground">
              CyraSense AI
            </h1>
            <p className="text-xs text-muted-foreground font-body">
              Women's health companion
            </p>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto space-y-3 pb-4 min-h-0">
          {isLoading ? (
            <div className="space-y-3">
              {(["sk1", "sk2", "sk3"] as const).map((id) => (
                <Skeleton key={id} className="h-12 w-3/4 rounded-2xl" />
              ))}
            </div>
          ) : !history || history.length === 0 ? (
            <div className="flex flex-col gap-4 pt-4">
              <Card className="bg-primary/5 border-primary/20 shadow-none">
                <CardContent className="p-4">
                  <p className="text-sm font-body text-foreground leading-relaxed">
                    Hello! I'm your CyraSense AI health companion. I'm here to
                    answer your questions about women's health, menstrual
                    cycles, fertility, and wellness. How can I help you today?
                  </p>
                </CardContent>
              </Card>
              <p className="text-xs text-muted-foreground font-body text-center">
                Suggested questions
              </p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => handleSend(s)}
                    data-ocid="chat-suggestion"
                    className="text-xs font-body px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 transition-smooth"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {history.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex gap-2 items-end",
                    msg.role === "user" ? "flex-row-reverse" : "flex-row",
                  )}
                >
                  <div
                    className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center shrink-0 mb-1",
                      msg.role === "user" ? "bg-primary" : "bg-secondary",
                    )}
                  >
                    {msg.role === "user" ? (
                      <User className="w-3.5 h-3.5 text-primary-foreground" />
                    ) : (
                      <Bot className="w-3.5 h-3.5 text-secondary-foreground" />
                    )}
                  </div>
                  <div
                    data-ocid={`chat-message-${msg.role}`}
                    className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm font-body leading-relaxed",
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-card border border-border text-foreground rounded-bl-sm",
                    )}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {send.isPending && (
                <div className="flex gap-2 items-end">
                  <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center">
                    <Bot className="w-3.5 h-3.5 text-secondary-foreground" />
                  </div>
                  <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-2.5">
                    <span className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <span
                          key={`dot-${i}`}
                          className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                    </span>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </>
          )}
        </div>

        {/* Input */}
        <div className="flex gap-2 pt-2 border-t border-border">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your health…"
            className="flex-1 font-body text-sm"
            data-ocid="input-chat-message"
          />
          <Button
            onClick={() => handleSend()}
            disabled={!input.trim() || send.isPending}
            size="icon"
            aria-label="Send message"
            data-ocid="btn-send-chat"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Layout>
  );
}

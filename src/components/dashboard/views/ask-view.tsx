import React, { useRef, useState } from "react";
import { Loader2, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAsk } from "@/lib/api/hooks";

/**
 * Ask questions about the family's own documents.
 *
 * Answers come only from confirmed documents, and the server drops any citation
 * the model invents, so a document id shown here is always one the asker may see.
 */

interface Turn {
  question: string;
  answer: string;
  citations: { document_id: string; title: string }[];
}

const SUGGESTIONS = [
  "When does my passport expire?",
  "LIC policy ka premium kab due hai?",
  "What is my PAN number?",
  "Which documents are expiring this year?",
];

export function AskView({ onOpenDocument }: { onOpenDocument?: (documentId: string) => void }) {
  const ask = useAsk();
  const [question, setQuestion] = useState("");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  async function submit(text: string) {
    const trimmed = text.trim();
    if (!trimmed || ask.isPending) return;
    setError(null);
    setQuestion("");
    try {
      const result = await ask.mutateAsync(trimmed);
      setTurns((prev) => [
        ...prev,
        { question: trimmed, answer: result.answer, citations: result.citations ?? [] },
      ]);
      requestAnimationFrame(() => endRef.current?.scrollIntoView({ behavior: "smooth" }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not answer that");
    }
  }

  return (
    <div className="mx-auto flex h-full max-w-2xl flex-col">
      <header className="mb-6">
        <h2 className="text-xl font-semibold tracking-tight">Ask about your documents</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Answers come only from what your family has uploaded and confirmed.
        </p>
      </header>

      <div className="flex-1 space-y-6 overflow-y-auto pb-4">
        {turns.length === 0 && (
          <div className="rounded-xl border border-dashed border-border p-6">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Sparkles className="h-4 w-4 text-amber-500" />
              Try asking
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => void submit(s)}
                  className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {turns.map((turn, i) => (
          <div key={i} className="space-y-3">
            <p className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-2 text-sm text-primary-foreground">
              {turn.question}
            </p>
            <div className="w-fit max-w-[85%] rounded-2xl rounded-bl-sm bg-muted px-4 py-3 text-sm">
              <p className="whitespace-pre-wrap">{turn.answer}</p>
              {turn.citations.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2 border-t border-border/60 pt-3">
                  {turn.citations.map((c) => (
                    <button
                      key={c.document_id}
                      type="button"
                      onClick={() => onOpenDocument?.(c.document_id)}
                      className="rounded-full bg-background px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {c.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {ask.isPending && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Looking through your documents…
          </div>
        )}
        {error && <p className="text-sm text-destructive">{error}</p>}
        <div ref={endRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void submit(question);
        }}
        className="flex gap-2 border-t border-border pt-4"
      >
        <Input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask anything about your documents…"
          disabled={ask.isPending}
        />
        <Button type="submit" size="icon" disabled={ask.isPending || !question.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}

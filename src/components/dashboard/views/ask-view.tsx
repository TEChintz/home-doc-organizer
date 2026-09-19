import React, { useRef, useState, useEffect } from "react";
import { Loader2, Send, FileText, ArrowUp } from "lucide-react";
import { useAsk } from "@/lib/api/hooks";
import { DocketLogo } from "@/components/ui/docket-logo";

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

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [turns, ask.isPending]);

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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not answer that");
    }
  }

  return (
    <div className="flex h-full w-full flex-col relative">
      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 pb-36 pt-6 space-y-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="mx-auto w-full max-w-3xl flex-1 flex flex-col min-h-full">
          {turns.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center px-4 pb-12">
              <div className="mb-6 grid size-12 place-items-center rounded-2xl bg-white text-docket-blue border border-zinc-200/60 shadow-sm">
                <DocketLogo className="size-6" />
              </div>
              <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">How can I help you today?</h2>
              <p className="mt-2.5 text-sm text-zinc-500 max-w-sm mb-12">
                Ask questions about your uploaded documents, and I'll find the answers for you instantly.
              </p>

              <div className="flex flex-col gap-3 w-full max-w-lg mx-auto">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => void submit(s)}
                    className="flex w-full items-center justify-between text-left rounded-xl bg-white border border-zinc-200/80 px-5 py-4 text-sm font-medium text-zinc-700 shadow-sm transition-all hover:bg-zinc-50 hover:border-zinc-300 group cursor-pointer"
                  >
                    <span className="pr-4 leading-relaxed">{s}</span>
                    <div className="grid size-7 place-items-center rounded-full bg-zinc-50 text-zinc-400 transition-colors group-hover:bg-zinc-200 group-hover:text-zinc-600 shrink-0">
                      <ArrowUp className="size-3.5 rotate-45" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {turns.map((turn, i) => (
            <div key={i} className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {/* User Message */}
              <div className="flex justify-end w-full">
                <div className="max-w-[85%] sm:max-w-[75%] rounded-3xl rounded-tr-md bg-zinc-200/70 px-5 py-3.5 text-[15px] leading-relaxed text-zinc-900">
                  {turn.question}
                </div>
              </div>

              {/* AI Message */}
              <div className="flex gap-4 w-full">
                <div className="shrink-0 mt-0.5">
                  <div className="grid size-8 place-items-center rounded-full border border-zinc-200 shadow-sm text-docket-blue bg-white">
                    <DocketLogo className="size-4" />
                  </div>
                </div>
                <div className="flex flex-col space-y-4 max-w-[90%] sm:max-w-[85%]">
                  <div className="text-[15px] leading-relaxed text-zinc-800 pt-1">
                    <p className="whitespace-pre-wrap">{turn.answer}</p>
                  </div>
                  
                  {turn.citations.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {turn.citations.map((c) => (
                        <button
                          key={c.document_id}
                          type="button"
                          onClick={() => onOpenDocument?.(c.document_id)}
                          className="inline-flex items-center gap-1.5 rounded-full bg-white border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow hover:border-zinc-300 hover:text-zinc-900 cursor-pointer"
                        >
                          <FileText className="size-3.5" />
                          <span className="truncate max-w-[200px]">{c.title}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {ask.isPending && (
            <div className="flex gap-4 w-full animate-in fade-in">
              <div className="shrink-0 mt-0.5">
                <div className="grid size-8 place-items-center rounded-full border border-zinc-200 shadow-sm text-docket-blue bg-white">
                  <DocketLogo className="size-4" />
                </div>
              </div>
              <div className="flex items-center text-[15px] text-zinc-500 pt-2 gap-2">
                <Loader2 className="size-4 animate-spin" />
                Analyzing documents...
              </div>
            </div>
          )}
          
          {error && (
            <div className="mx-auto w-fit rounded-xl bg-red-50 px-4 py-2 text-sm font-medium text-red-600 border border-red-100">
              {error}
            </div>
          )}
          
          <div ref={endRef} className="h-4" />
        </div>
      </div>

      {/* Floating Input Area */}
      <div className="absolute bottom-0 left-0 right-0 px-4 pb-6 pt-12 bg-gradient-to-t from-zinc-50 via-zinc-50/95 to-transparent pointer-events-none">
        <div className="mx-auto max-w-3xl pointer-events-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void submit(question);
            }}
            className="flex items-end gap-2 rounded-2xl bg-white p-2 border border-zinc-200/80 focus-within:ring-2 focus-within:ring-zinc-200 focus-within:border-zinc-300 transition-all shadow-sm"
          >
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  void submit(question);
                }
              }}
              placeholder="Ask anything about your documents…"
              disabled={ask.isPending}
              rows={1}
              className="flex-1 max-h-32 min-h-[44px] resize-none bg-transparent py-3 pl-4 text-[15px] outline-none placeholder:text-zinc-500 disabled:opacity-50"
            />
            <button 
              type="submit" 
              disabled={ask.isPending || !question.trim()}
              className="grid size-11 place-items-center rounded-xl bg-zinc-900 text-white shadow-sm transition-all hover:bg-zinc-800 disabled:opacity-50 disabled:hover:bg-zinc-900 cursor-pointer shrink-0 mb-0.5 mr-0.5"
            >
              <ArrowUp className="size-5" />
            </button>
          </form>
          <div className="text-center mt-3">
            <span className="text-[11px] text-zinc-400 font-medium tracking-wide">
              AI CAN MAKE MISTAKES. VERIFY IMPORTANT INFO.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

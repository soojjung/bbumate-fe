import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  format?: "html" | "md" | "text";
  isComplete?: boolean;
  sources?: Array<{
    title: string;
    url: string | null;
  }>;
}

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex ${
        isUser ? "justify-end" : "justify-start"
      } animate-fade-in`}
    >
      {isUser ? (
        <div className="max-w-[85%] md:max-w-[75%] rounded-2xl px-3 py-2 md:px-4 md:py-3 shadow-card bg-[var(--chat-user-bg)] text-white">
          <p className="whitespace-pre-wrap text-sm md:text-base leading-relaxed break-words">
            {message.content}
          </p>
          <p className="text-xs mt-1 text-white/70">
            {message.timestamp.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-start gap-2">
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-full overflow-hidden flex-shrink-0">
            <img
              src="/bt21.jpg"
              alt="Chatbot avatar"
              className="w-full h-full object-cover scale-110"
            />
          </div>
          <div className="max-w-[85%] md:max-w-[75%] rounded-2xl px-3 py-2 md:px-4 md:py-3 shadow-card bg-card text-foreground border border-border">
            {message.format === "md" ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                className="prose prose-sm md:prose-base max-w-none break-words"
              >
                {message.content}
              </ReactMarkdown>
            ) : message.format === "html" ? (
              <div
                className="prose prose-sm md:prose-base max-w-none break-words"
                dangerouslySetInnerHTML={{ __html: message.content }}
              />
            ) : (
              <p className="whitespace-pre-wrap text-sm md:text-base leading-relaxed break-words">
                {message.content}
              </p>
            )}

            {message.isComplete &&
              message.format !== "html" &&
              message.sources &&
              message.sources.length > 0 && (
                <div className="mt-2 border-t border-border pt-2">
                  <p className="text-xs text-muted-foreground mb-1">Sources</p>
                  <ul className="space-y-1">
                    {message.sources.map((s, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-muted-foreground break-all"
                      >
                        {s.url ? (
                          <a
                            href={s.url}
                            target="_blank"
                            rel="noreferrer"
                            className="underline hover:opacity-80"
                          >
                            {s.title || s.url}
                          </a>
                        ) : (
                          s.title || ""
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            {message.isComplete && (
              <p className="text-xs mt-1 text-muted-foreground">
                {message.timestamp.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

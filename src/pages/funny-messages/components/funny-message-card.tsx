import type { IFunnyMessage } from "../../../types/funny-message";

interface IFunyMessageProps {
  msg: IFunnyMessage;
}

const FunnyMessageCard = ({ msg }: IFunyMessageProps) => {
  return (
    <article
      key={msg._id}
      className="rounded-lg bg-card border border-border shadow-sm"
      style={{ color: "var(--color-card-foreground)" }}
      aria-label={`Wiadomość: ${msg.title}`}
    >
      <header className="flex justify-between items-center px-6 py-3 border-b border-border">
        <h2 className="text-base font-semibold tracking-wide">{msg.title}</h2>
        <time
          dateTime={msg.createdAt}
          className="text-xs text-muted-foreground"
          title={new Date(msg.createdAt).toLocaleString()}
        >
          {new Date(msg.createdAt).toLocaleDateString()}
        </time>
      </header>

      <div className="px-5 py-4 space-y-4">
        {msg.type === "single" && msg.entries[0] && (
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{msg.entries[0].content}</p>
        )}

        {msg.type === "dialog" && (
          <div className="flex flex-col space-y-2">
            {msg.entries.map((entry, idx) => {
              const isEmployee = entry.author.toLowerCase() === "pracownik";

              return (
                <div key={idx} className="flex items-center space-x-1.5 py-1">
                  {/* ----- Letter sign ----- */}
                  <div
                    className="flex items-center justify-center min-w-[24px]"
                    aria-label={isEmployee ? "Pracownik" : "Klient"}
                    title={isEmployee ? "Pracownik" : "Klient"}
                    style={{
                      color: "var(--color-muted-foreground)",
                      fontWeight: 700,
                      fontSize: "0.875rem",
                      userSelect: "none",
                      lineHeight: 1,
                      height: "24px",
                    }}
                  >
                    {isEmployee ? "P" : "K"}
                  </div>

                  {/*--------- arrow mark ------- */}
                  <span
                    aria-hidden="true"
                    style={{
                      width: 0,
                      height: 0,
                      borderTop: "6px solid transparent",
                      borderBottom: "6px solid transparent",
                      borderLeft: `8px solid ${isEmployee ? "var(--color-primary)" : "var(--color-muted-foreground)"}`,
                    }}
                  />

                  {/* --------- msg content ----- */}
                  <div className="whitespace-pre-wrap flex-1 text-sm leading-relaxed text-muted-foreground my-auto">
                    {entry.content}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </article>
  );
};

export default FunnyMessageCard;

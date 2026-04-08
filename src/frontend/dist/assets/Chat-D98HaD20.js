import { r as reactExports, j as jsxRuntimeExports, S as Skeleton, c as cn } from "./index-DNVH2Qkg.js";
import { L as Layout } from "./Layout-D3T6SkdV.js";
import { B as Button } from "./button-CrkwacFM.js";
import { c as createLucideIcon, z as useChatHistory, A as useSendChatMessage, C as Card, a as CardContent } from "./createLucideIcon-BASLoXwI.js";
import { I as Input } from "./input-7Yzeg1-J.js";
import { U as User } from "./user-DjR_bZo3.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M12 8V4H8", key: "hb8ula" }],
  ["rect", { width: "16", height: "12", x: "4", y: "8", rx: "2", key: "enze0r" }],
  ["path", { d: "M2 14h2", key: "vft8re" }],
  ["path", { d: "M20 14h2", key: "4cs60a" }],
  ["path", { d: "M15 13v2", key: "1xurst" }],
  ["path", { d: "M9 13v2", key: "rq6x2g" }]
];
const Bot = createLucideIcon("bot", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",
      key: "1ffxy3"
    }
  ],
  ["path", { d: "m21.854 2.147-10.94 10.939", key: "12cjpa" }]
];
const Send = createLucideIcon("send", __iconNode);
const SUGGESTIONS = [
  "What causes period cramps?",
  "When am I most fertile?",
  "How does stress affect my cycle?",
  "What foods help with PMS?"
];
function Chat() {
  const { data: history, isLoading } = useChatHistory();
  const send = useSendChatMessage();
  const [input, setInput] = reactExports.useState("");
  const bottomRef = reactExports.useRef(null);
  const historyLen = (history == null ? void 0 : history.length) ?? 0;
  reactExports.useEffect(() => {
    var _a;
    (_a = bottomRef.current) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
  }, [historyLen]);
  async function handleSend(text) {
    const message = (text ?? input).trim();
    if (!message) return;
    setInput("");
    await send.mutateAsync(message);
  }
  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto px-4 pt-6 pb-4 flex flex-col h-[calc(100vh-5rem)]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bot, { className: "w-5 h-5 text-primary-foreground" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-lg font-display font-semibold text-foreground", children: "CyraSense AI" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-body", children: "Women's health companion" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto space-y-3 pb-4 min-h-0", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: ["sk1", "sk2", "sk3"].map((id) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-3/4 rounded-2xl" }, id)) }) : !history || history.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 pt-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-primary/5 border-primary/20 shadow-none", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-body text-foreground leading-relaxed", children: "Hello! I'm your CyraSense AI health companion. I'm here to answer your questions about women's health, menstrual cycles, fertility, and wellness. How can I help you today?" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-body text-center", children: "Suggested questions" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: SUGGESTIONS.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => handleSend(s),
          "data-ocid": "chat-suggestion",
          className: "text-xs font-body px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 transition-smooth",
          children: s
        },
        s
      )) })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      history.map((msg) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: cn(
            "flex gap-2 items-end",
            msg.role === "user" ? "flex-row-reverse" : "flex-row"
          ),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: cn(
                  "w-7 h-7 rounded-full flex items-center justify-center shrink-0 mb-1",
                  msg.role === "user" ? "bg-primary" : "bg-secondary"
                ),
                children: msg.role === "user" ? /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-3.5 h-3.5 text-primary-foreground" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Bot, { className: "w-3.5 h-3.5 text-secondary-foreground" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                "data-ocid": `chat-message-${msg.role}`,
                className: cn(
                  "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm font-body leading-relaxed",
                  msg.role === "user" ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-card border border-border text-foreground rounded-bl-sm"
                ),
                children: msg.content
              }
            )
          ]
        },
        msg.id
      )),
      send.isPending && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 items-end", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-full bg-secondary flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bot, { className: "w-3.5 h-3.5 text-secondary-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex gap-1", children: [0, 1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce",
            style: { animationDelay: `${i * 0.15}s` }
          },
          `dot-${i}`
        )) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: bottomRef })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-2 border-t border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          value: input,
          onChange: (e) => setInput(e.target.value),
          onKeyDown: handleKeyDown,
          placeholder: "Ask about your health…",
          className: "flex-1 font-body text-sm",
          "data-ocid": "input-chat-message"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: () => handleSend(),
          disabled: !input.trim() || send.isPending,
          size: "icon",
          "aria-label": "Send message",
          "data-ocid": "btn-send-chat",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "w-4 h-4" })
        }
      )
    ] })
  ] }) });
}
export {
  Chat as default
};

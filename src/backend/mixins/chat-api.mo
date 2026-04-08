import ChatLib "../lib/chat";
import ChatTypes "../types/chat";

mixin (chats : ChatLib.State) {
  public shared ({ caller }) func sendChatMessage(message : Text) : async Text {
    await* ChatLib.sendChatMessage(chats, caller, message);
  };

  public shared query ({ caller }) func getChatHistory() : async [ChatTypes.ChatMessage] {
    ChatLib.getChatHistory(chats, caller);
  };
};

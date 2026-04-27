type ChatMessage = 
| {
  type: "text";
  user_name?: string;
  avatar?: string;
  timestamp: string;
  message: string;
}
| {
  type: "sticker";
  user_name?: string;
  avatar?: string;
  timestamp: string;
  stickerId: string;
  stickerUrl: string;
};

export type { ChatMessage };
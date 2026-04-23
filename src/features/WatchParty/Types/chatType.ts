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
  sticker_id: string;
  sticker_url: string;
};

export type { ChatMessage };
import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X, Smile } from "lucide-react";
import EmojiPicker from "emoji-picker-react";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [filePreview, setFilePreview] = useState(null); // To store file info
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Handle image files
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      // Handle non-image files (PDF, DOCX, etc.)
      setFilePreview({
        file: file,
        fileName: file.name,
        fileUrl: URL.createObjectURL(file), // This creates a temporary URL for the file
      });
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = () => {
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleEmojiClick = (emojiData) => {
    setText((prev) => prev + emojiData.emoji);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview && !filePreview) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
        file: filePreview ? filePreview.fileUrl : null,
        fileName: filePreview ? filePreview.fileName : null,
      });

      // Clear form
      setText("");
      setImagePreview(null);
      setFilePreview(null);
      setShowEmojiPicker(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      {filePreview && (
        <div className="mb-3 flex items-center gap-2 p-2 bg-base-200 rounded-md mt-2">
          <div className="flex items-center gap-2">
            <span>{filePreview.fileName}</span>
            <button
              onClick={() => handleFileDownload(filePreview.fileUrl, filePreview.fileName)}
              className="btn btn-xs btn-outline"
            >
              Download
            </button>
          </div>
        </div>
      )}

      {showEmojiPicker && (
        <div className="mb-3">
          <EmojiPicker onEmojiClick={handleEmojiClick} theme="dark" />
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <button
            type="button"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            className="btn btn-circle text-yellow-400 hidden sm:flex"
          >
            <Smile size={20} />
          </button>

          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <input
            type="file"
            accept="image/*,.pdf,.docx,.txt"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />

          <button
            type="button"
            className={`hidden sm:flex btn btn-circle ${
              imagePreview || filePreview ? "text-emerald-500" : "text-zinc-400"
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>

        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !imagePreview && !filePreview}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};

const handleFileDownload = async (fileUrl, fileName = "download") => {
  try {
    const response = await fetch(fileUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Download error", err);
  }
};

export default MessageInput;

"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { BsEmojiSmile } from "react-icons/bs";

import { Button } from "../shadcn/button";

const EmojiPickerReact = dynamic(() => import("emoji-picker-react"), { ssr: false });

interface EmojiPickerProps {
  onEmojiSelect: (emojiObject: any) => void;
}

export const EmojiPicker = ({ onEmojiSelect }: EmojiPickerProps) => {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        className="px-2"
        onClick={(e) => {
          e.preventDefault();
          setShowPicker((prev) => !prev);
        }}
      >
        <BsEmojiSmile />
      </Button>
      {showPicker && (
        <div className="absolute bottom-10 left-0 bg-white shadow-md rounded-md z-50">
          <EmojiPickerReact
            onEmojiClick={(emojiObject) => {
              onEmojiSelect(emojiObject);
              setShowPicker(false); // Hide picker after selecting
            }}
          />
        </div>
      )}
    </div>
  );
};

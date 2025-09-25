"use client";

import clsx from "clsx";
import { Fragment, useState } from "react";
import { BiSolidCommentDetail } from "react-icons/bi";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcn/tabs";

import { Button } from "../shadcn/button";
import { DynamicFieldRenderer, DynamicFieldType } from "./dynamic-field-renderer";
import { EmojiPicker } from "./emoji-picker";

interface IProps {
  onSubmit: (values: any) => void;
  nameField?: DynamicFieldType;
  imageField?: DynamicFieldType;
  tabs?: Array<{ value: string; label: string; icon?: React.ReactNode; content?: React.ReactNode }>;
  actions?: Array<React.ReactNode>;
  disabled: boolean;
  icon?: React.ReactNode;
  title?: string;
}

export function ObjectView({
  onSubmit,
  nameField,
  imageField,
  tabs = [],
  actions = [],
  disabled,
  icon,
  title,
}: IProps) {
  // const [showCommentBox, setShowCommentBox] = useState(false);
  // const [comment, setComment] = useState("");

  // const handleSendComment = () => {
  //   if (comment.trim()) {
  //     console.log("Sending comment:", comment);
  //     setComment("");
  //   }
  // };

  // const addEmoji = (emojiObject: any) => {
  //   setComment((prev) => prev + emojiObject.emoji);
  // };

  return (
    <ObjectViewForm onSubmit={onSubmit}>
      {/* Header */}
      <ObjectViewSection className="p-5 pb-2 col-span-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex gap-2 flex-1">
            {icon}
            <div className="flex flex-col items-start justify-center">
              <p className="text-muted-foreground">{title}</p>
              {nameField && (
                <DynamicFieldRenderer
                  disabled={disabled}
                  field={nameField}
                  className="md:text-2xl md:placeholder:text-2xl border-transparent font-normal"
                />
              )}
            </div>
          </div>
          <div className="flex items-start gap-2">
            {actions.map((action, index) => (
              <Fragment key={index}>{action}</Fragment>
            ))}
          </div>
        </div>
      </ObjectViewSection>

      {/* Main Card */}
      <ObjectViewSection className="col-span-3">
        <div className="px-0">
          <div className="flex items-center justify-between gap-5">
            <div className="flex-1"></div>
          </div>
        </div>
        <div className="px-2 pt-1">
          {tabs.length > 0 && (
            <Tabs defaultValue={tabs[0].value} className="w-full">
              <TabsList className="flex justify-start items-center gap-2">
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="flex items-center justify-center gap-1 max-w-fit font-semibold"
                  >
                    {tab.icon}
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              {tabs.map((tab) => (
                <TabsContent
                  key={tab.value}
                  value={tab.value}
                  className="animate-fade-in px-3 py-5"
                >
                  {tab.content}
                </TabsContent>
              ))}
            </Tabs>
          )}
        </div>
      </ObjectViewSection>

      {/* Feed */}
      {/*
      <ObjectViewSection size={1} className="p-5">
        <div className="space-y-2">
          <div className="flex gap-1">
            <Button
              className="px-2"
              onClick={(e) => {
                e.preventDefault();
                setShowCommentBox((prev) => !prev);
              }}
            >
              <BiSolidCommentDetail /> Comment
            </Button>
          </div>

          {showCommentBox && (
            <div className="border rounded p-2 flex flex-col gap-2 w-full relative">
              <textarea
                className="border p-2 rounded w-full"
                rows={3}
                placeholder="Write a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <div className="flex justify-between items-center relative">
                <EmojiPicker onEmojiSelect={addEmoji} />
                <Button onClick={handleSendComment} disabled={!comment.trim()}>
                  Send
                </Button>
              </div>
            </div>
          )}
        </div>
      </ObjectViewSection>
      */}
    </ObjectViewForm>
  );
}

export const ObjectViewForm = ({
  onSubmit,
  children,
}: {
  onSubmit: (values: any) => void;
  children: React.ReactNode;
}) => {
  return (
    <form
      className="w-full pb-8 grid grid-cols-1 2xl:grid-cols-3 gap-5 gap-y-3"
      onSubmit={onSubmit}
    >
      {children}
    </form>
  );
};

export const ObjectViewSection = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={clsx(`bg-background border rounded-[4px]`, className)}>{children}</div>;
};

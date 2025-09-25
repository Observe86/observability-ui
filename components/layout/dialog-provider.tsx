"use client";

import { createContext, ReactNode, useContext, useState } from "react";

interface DialogContextType {
  dialogs: DialogState[];
  openGlobalDialog: (options: DialogOptions) => void;
  closeDialog: (id: number) => void;
}

interface DialogState {
  id: number;
  title: ReactNode;
  description: ReactNode;
  content: ReactNode;
  actions: DialogAction[];
  showCloseButton?: boolean;
}

interface DialogAction {
  label: string;
  type?: "primary" | "destructive" | "secondary";
  onClick: () => void;
}

interface DialogOptions {
  title?: ReactNode;
  description?: ReactNode;
  content?: ReactNode;
  actions?: DialogAction[];
  showCloseButton?: boolean;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const DialogProvider = ({ children }: { children: ReactNode }) => {
  const [dialogs, setDialogs] = useState<DialogState[]>([]);
  const dialogIdCounter = useState(0)[0]; // Counter to generate unique IDs for dialogs

  const openGlobalDialog = ({
    title,
    description,
    content,
    actions,
    showCloseButton = true,
  }: DialogOptions) => {
    const newDialog: DialogState = {
      id: dialogIdCounter + dialogs.length + 1,
      title: title,
      description: description,
      content: content || "",
      actions: actions || [],
      showCloseButton,
    };

    setDialogs((prev) => [...prev, newDialog]);
  };

  const closeDialog = (id: number) => {
    setDialogs((prev) => prev.filter((dialog) => dialog.id !== id));
  };

  return (
    <DialogContext.Provider value={{ dialogs, openGlobalDialog, closeDialog }}>
      {children}
    </DialogContext.Provider>
  );
};

export const useGlobalDialog = (): DialogContextType => {
  const context = useContext(DialogContext);
  if (!context) throw new Error("useGlobalDialog must be used within a DialogProvider");
  return context;
};

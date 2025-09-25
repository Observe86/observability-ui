"use client";

import { AlertDialogDescription } from "@radix-ui/react-alert-dialog";
import { X } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/shadcn/alert-dialog";

import { Button } from "../shadcn/button";
import { useGlobalDialog } from "./dialog-provider";
import { useDictionary } from "./dictionary-provider";

export const GlobalDialog = () => {
  const { dialogs, closeDialog } = useGlobalDialog();
  const { dict } = useDictionary();

  return (
    <>
      {dialogs.map((dialog) => (
        <AlertDialog key={dialog.id} open={true} onOpenChange={() => closeDialog(dialog.id)}>
          <AlertDialogContent className="w-full max-w-max">
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-4 end-4"
              onClick={() => closeDialog(dialog.id)}
            >
              <X size={20} />
            </Button>

            <AlertDialogHeader>
              <AlertDialogTitle>{dialog.title}</AlertDialogTitle>
              <AlertDialogDescription>{dialog.description}</AlertDialogDescription>
            </AlertDialogHeader>

            {dialog.content}

            {dialog.actions.length > 0 || dialog.showCloseButton ? (
              <AlertDialogFooter>
                {dialog.showCloseButton && (
                  <AlertDialogCancel onClick={() => closeDialog(dialog.id)}>
                    {dict?.Shared?.Close}
                  </AlertDialogCancel>
                )}

                {dialog.actions.map((action, index) => (
                  <AlertDialogAction
                    key={index}
                    className={
                      action.type === "destructive"
                        ? "bg-destructive hover:bg-destructive"
                        : action.type === "primary"
                        ? "bg-primary"
                        : "bg-secondary"
                    }
                    onClick={() => {
                      action.onClick();
                      closeDialog(dialog.id);
                    }}
                  >
                    {action.label}
                  </AlertDialogAction>
                ))}
              </AlertDialogFooter>
            ) : null}
          </AlertDialogContent>
        </AlertDialog>
      ))}
    </>
  );
};

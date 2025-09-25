"use client";

import { useIsFetching, useIsMutating } from "@tanstack/react-query";

import { Spinner } from "../common/spinner";

export const LoadingOverlay = () => {
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();

  const isLoading = isFetching > 0 || isMutating > 0;

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Spinner />
    </div>
  );
};

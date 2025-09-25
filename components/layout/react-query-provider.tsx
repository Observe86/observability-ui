"use client";

import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

import { toast } from "@/hooks/use-toast";

import { useDictionary } from "./dictionary-provider";
import { LoadingOverlay } from "./loading-overlay";

export const ReactQueryProvider = ({ children }: { children: React.ReactNode }) => {
  const { lang, dict } = useDictionary();
  const router = useRouter();

  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        console.error("QueryCache error: ", error);
        if (error instanceof AxiosError) {
          if (error.code === "ERR_NETWORK" || error.code === "ERR_CONNECTION_REFUSED") {
            toast({
              description: dict?.Network?.NetworkConnectionError,
              variant: "destructive",
            });
          } else if (error.response?.status === 403) {
            toast({
              description: dict?.Network?.ForbiddenQueryError,
              variant: "destructive",
            });
            router.push(`/${lang}/403-forbidden`);
          } else {
            error.response?.data?.errorMessages?.forEach((errorMessage: string) => {
              toast({
                description: errorMessage,
                variant: "destructive",
              });
            });
          }
        } else {
          toast({
            description: error.message,
            variant: "destructive",
          });
        }
      },
    }),
    mutationCache: new MutationCache({
      onSuccess: (data) => {
        // toast({
        //   description: dict?.Network?.OperationSuccessful,
        //   variant: "success",
        // });
      },
      onError: (error) => {
        console.error("MutnCache error: ", error);
        console.log("hello");

        if (error instanceof AxiosError) {
          if (error.code === "ERR_NETWORK" || error.code === "ERR_CONNECTION_REFUSED") {
            toast({
              description: dict?.Network?.NetworkConnectionError,
              variant: "destructive",
            });
          } else if (error.response?.status === 403) {
            toast({
              description: dict?.Network?.ForbiddenMutationError,
              variant: "destructive",
            });
          } else {
            console.log("hello");

            toast({
              description: error.response?.data?.message,
              variant: "destructive",
            });
          }
        } else {
          toast({
            description: error.message,
            variant: "destructive",
          });
        }
      },
    }),
  });

  return (
    <QueryClientProvider client={queryClient}>
      {/* <LoadingOverlay /> */}
      {children}
    </QueryClientProvider>
  );
};

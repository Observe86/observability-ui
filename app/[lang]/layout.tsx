import { AxiosProvider } from "@/components/layout/axios-provider";
import { DialogProvider } from "@/components/layout/dialog-provider";
import { DictionaryProvider } from "@/components/layout/dictionary-provider";
import { GlobalDialog } from "@/components/layout/global-dialog";
import { GlobalStoreProvider } from "@/components/layout/global-store-provider";
import { NetworkStatusProvider } from "@/components/layout/network-status-provider";
import { ReactQueryProvider } from "@/components/layout/react-query-provider";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { Toaster } from "@/components/shadcn/toaster";
import { SupportedLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

interface IProps {
  children: React.ReactNode;
  params: Promise<{ lang: SupportedLocale }>;
}

export default async function Layout({ children, params }: IProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <DictionaryProvider lang={lang} dict={dict}>
      <ReactQueryProvider>
        <NetworkStatusProvider>
          <GlobalStoreProvider>
            <AxiosProvider>
              <DialogProvider>
                <ThemeProvider
                  attribute="class"
                  defaultTheme="system"
                  enableSystem
                  disableTransitionOnChange
                >
                  {children}
                  <Toaster />
                  <GlobalDialog />
                </ThemeProvider>
              </DialogProvider>
            </AxiosProvider>
          </GlobalStoreProvider>
        </NetworkStatusProvider>
      </ReactQueryProvider>
    </DictionaryProvider>
  );
}

/* eslint-disable @next/next/no-img-element */
"use client";

import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import { useFormik } from "formik";
import { jwtDecode } from "jwt-decode";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { BsSnow2 } from "react-icons/bs";
import * as Yup from "yup";

import { apiClient } from "@/api";
import { login } from "@/api/auth";
import { Spinner } from "@/components/common/spinner";
import { useDictionary } from "@/components/layout/dictionary-provider";
import { useGlobalStore } from "@/components/layout/global-store-provider";
import { Button } from "@/components/shadcn/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/card";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import { cn } from "@/utils/shadcn";
import { storeAccessToken } from "@/utils/token";

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const { setCompany, setUser } = useGlobalStore();
  const { lang, dict } = useDictionary();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const mutation = useMutation({
    mutationFn: async (values: { username: string; password: string }) => {
      const token = await login(values);

      storeAccessToken(token);

      const decoded = jwtDecode(token) as any;

      setCompany({
        id: decoded.companyId,
        name: decoded.companyName,
      });

      setUser({
        id: decoded.userId,
        firstName: decoded.firstName,
        lastName: decoded.lastName,
        name: decoded.firstName + " " + decoded.lastName,
        email: decoded.email,
        username: decoded.username,
        role: decoded.role,
      });

      apiClient.defaults.headers["Authorization"] = `Bearer ${token}`;

      router.push(`/${lang}/application/home`);
    },
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required(dict?.Shared?.FieldRequired),
      password: Yup.string().required(dict?.Shared?.FieldRequired),
    }),
    onSubmit: (values) => {
      mutation.mutate(values);
    },
  });

  const { theme, setTheme } = useTheme();
  const [previousTheme, setPreviousTheme] = useState(theme);
  useEffect(() => {
    setPreviousTheme(theme);
    setTheme("light");
    return () => {
      setTheme(previousTheme || "light");
    };
  }, [setTheme]);

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="text-2xl flex items-center gap-x-1 text-primary mx-auto">
              <BsSnow2 className="text-primary" />
              {dict?.Shared?.Observe86}
            </div>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <div className={cn("flex flex-col gap-1 max-w-md", className)} {...props}>
              <Card className="border-none shadow-none">
                <CardHeader className="text-center">
                  {/* <div className="flex justify-end mb-10">
            <ThemeSwitch />
          </div> */}
                  <CardTitle className="text-xl">{dict?.Login?.Title}</CardTitle>
                  <CardDescription>{dict?.Login?.Subtitle}</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={formik.handleSubmit}>
                    <div className="grid gap-6">
                      <div className="grid gap-2">
                        <div className="grid gap-2 mb-4">
                          <Label htmlFor="username">{dict?.Login?.Username}</Label>
                          <Input
                            id="username"
                            name="username"
                            type="text"
                            value={formik.values.username}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="px-0"
                          />
                          {formik.touched.username && formik.errors.username && (
                            <p className="text-sm text-destructive">{formik.errors.username}</p>
                          )}
                        </div>
                        <div className="grid gap-2 mb-4">
                          <div className="flex items-center">
                            <Label htmlFor="password">{dict?.Login?.Password}</Label>
                            {/* 
                            // TODO: Implement forgot password functionality
                            */}
                            {/* <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
                              {dict?.Login?.ForgotPassword}
                            </a> */}
                          </div>
                          <div className="relative">
                            <Input
                              id="password"
                              name="password"
                              type={showPassword ? "text" : "password"}
                              value={formik.values.password}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              className={clsx("text-lg px-0", !showPassword && "font-mono ")}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition"
                              aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                          {formik.touched.password && formik.errors.password && (
                            <p className="text-sm text-destructive">{formik.errors.password}</p>
                          )}
                        </div>

                        <Button type="submit" className="w-full" disabled={mutation.isPending}>
                          {mutation.isPending ? <Spinner /> : dict?.Login?.SignIn}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => router.push(`/${lang}/register`)}
                          className="w-full"
                        >
                          {dict?.Login?.RegisterYourCompany}
                        </Button>
                      </div>
                      <div className="text-center text-sm">
                        {/* {dict?.Login?.New}{" "} */}
                        {/* <a href="#" className="underline underline-offset-4">
                          {dict?.Login?.RegisterYourCompany}
                        </a> */}
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
              {/* <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4">
        <Link href={`/${lang}/terms-and-conditions`}>{dict?.TermsAndConditions?.Title}</Link> |{" "}
        <Link href={`/${lang}/privacy-policy`}>{dict?.PrivacyPolicy?.Title}</Link>
      </div> */}
            </div>
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="/placeholder.svg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}

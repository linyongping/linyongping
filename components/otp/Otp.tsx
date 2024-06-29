"use client";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useEffect, useRef, useState } from "react";
import { useToast } from "../ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";

type OtpProps = {
  onSuccess: (otp?: string) => void;
  onFail?: () => void;
};

export const Otp = (props: OtpProps) => {
  const { onSuccess, onFail } = props;
  const firstOtpInputRef = useRef<HTMLInputElement>(null);
  const [otp, setOtp] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    firstOtpInputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (otp.length < 6) return;

    fetch("/api/validate?otp=" + otp)
      .then((res) => {
        console.log("res", res);
        if (res.ok) {
          return res.text();
        }
        throw new Error("Invalid code");
      })
      .then((txt) => {
        console.log("txt", txt);
        onSuccess(otp);
      })
      .catch(() => {
        toast({
          title: "Invalid code",
          description: "the code is invalid please use correct code",
        });
        onFail?.();
      })
      .finally(() => {
        setOtp("");
        firstOtpInputRef.current?.focus();
      });
  }, [otp, toast, onFail, onSuccess]);

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Enter OTP</CardTitle>
          <CardDescription>
            Enter the 6 digit OTP where you know the secret
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InputOTP maxLength={6} onChange={setOtp} value={otp}>
            <InputOTPGroup>
              <InputOTPSlot index={0} ref={firstOtpInputRef} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </div>
  );
};

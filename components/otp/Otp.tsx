"use client";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useEffect, useState } from "react";
import { useToast } from "../ui/use-toast";

export const Otp = () => {
  const [otp, setOtp] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (otp.length < 6) return;

    fetch("/api/validate?otp=" + otp)
      .then((res) => res.json())
      .then((res) => {
        console.log("res", res);
      })
      .catch(() => {
        toast({
          title: "Invalid code",
          description: "the code is invalid please use correct code",
        });
      });
  }, [otp, toast]);

  return (
    <div className="flex justify-center items-center h-screen">
      <InputOTP maxLength={6} onChange={setOtp}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
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
    </div>
  );
};

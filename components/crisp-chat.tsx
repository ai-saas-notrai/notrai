"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

export const CrispChat = () => {
  useEffect(() => {
    Crisp.configure("86a57d15-100d-4f40-b137-142f30f8dbfc");
  }, []);

  return null;
};

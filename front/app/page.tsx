'use client'

import * as React from "react";
import {NextUIProvider} from "@nextui-org/react";
import {useRouter} from 'next/navigation'
import Login from '@/pages/login'

export default function Home() {
  const router = useRouter()

  return (
    <NextUIProvider>
      <Login />
    </NextUIProvider>
  );
}

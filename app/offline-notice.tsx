"use client";

import { useEffect, useRef, useState } from "react";


function getLocaleFromCookie(): "sr" | "en" {
  if (typeof document !== "undefined") {
    const match = document.cookie.match(/locale=(sr|en)/)
    if (match) return match[1] as "sr" | "en"
  }
  return "sr"
}

export function OfflineNotice() {
  const [isOffline, setIsOffline] = useState(false);
  const [showOnline, setShowOnline] = useState(false);
  const onlineTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const handleOffline = () => {
      setIsOffline(true);
      setShowOnline(false);
      if (onlineTimerRef.current) {
        window.clearTimeout(onlineTimerRef.current);
        onlineTimerRef.current = null;
      }
    };

    const handleOnline = () => {
      setIsOffline(false);
      setShowOnline(true);

      if (onlineTimerRef.current) {
        window.clearTimeout(onlineTimerRef.current);
      }

      onlineTimerRef.current = window.setTimeout(() => {
        setShowOnline(false);
      }, 3000);
    };

    if (!navigator.onLine) {
      setIsOffline(true);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      if (onlineTimerRef.current) {
        window.clearTimeout(onlineTimerRef.current);
      }
    };
  }, []);

  const [locale, setLocale] = useState<"sr" | "en">(getLocaleFromCookie())

  useEffect(() => {
    const interval = setInterval(() => {
      setLocale(getLocaleFromCookie())
    }, 500)
    return () => clearInterval(interval)
  }, [])

  if (!isOffline && !showOnline) return null;

  const t = locale === "en"
    ? {
      offline: "No internet connection. Offline content is shown where available.",
      online: "You are back online."
    }
    : {
      offline: "Nema internet konekcije. Prikazuje se offline sadržaj gdje je dostupan.",
      online: "Ponovo ste online."
    }

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[10000] px-3 py-2 text-center text-sm font-medium text-white shadow-md ${
        isOffline ? "bg-red-600" : "bg-emerald-600"
      }`}
    >
      {isOffline ? t.offline : t.online}
    </div>
  )
}

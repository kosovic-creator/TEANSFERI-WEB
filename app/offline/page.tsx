"use client"
import { useState, useEffect } from "react"
import { setLocaleCookie, deleteExtraLocaleCookies } from "@/lib/locale-cookie-utils"
import { translations } from "@/lib/transferi-i18n"

type Locale = "sr" | "en"
function LanguageSwitcher({ current, onChange }: { current: Locale, onChange: (lang: Locale) => void }) {
  return (
    <div className="mb-4 flex gap-2 items-center">
      {current !== "sr" && (
        <button
          className="text-2xl cursor-pointer bg-transparent border-none p-0"
          onClick={() => onChange("sr")}
          title="Montenegrin"
          type="button"
        >
          <span role="img" aria-label="Montenegrin">🇲🇪</span>
        </button>
      )}
      {current !== "en" && (
        <button
          className="text-2xl cursor-pointer bg-transparent border-none p-0"
          onClick={() => onChange("en")}
          title="English"
          type="button"
        >
          <span role="img" aria-label="English">🇬🇧</span>
        </button>
      )}
    </div>
  )
}

export default function OfflinePage() {
  const [locale, setLocale] = useState<Locale>(() => {
    if (typeof window !== "undefined") {
      const cookie = document.cookie.match(/locale=(sr|en)/)
      if (cookie) return cookie[1] as Locale
    }
    return "sr"
  })

  useEffect(() => {
    setLocaleCookie(locale)
    deleteExtraLocaleCookies()
  }, [locale])

  const t = locale === "en" ? {
    offlineTitle: "No internet connection",
    offlineDesc: "You appear to be offline. As soon as the connection is restored, the page will reload fresh data."
  } : {
    offlineTitle: "Nema interneta",
    offlineDesc: "Izgleda da ste trenutno offline. Čim se konekcija vrati, stranica će ponovo učitati svježe podatke."
  }

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center gap-4 px-6 text-center">
      <LanguageSwitcher current={locale} onChange={setLocale} />
      <h1 className="text-3xl font-semibold tracking-tight">{t.offlineTitle}</h1>
      <p className="text-muted-foreground">
        {t.offlineDesc}
      </p>
    </main>
  );
}

import { HeroUIProvider, ToastProvider } from '@heroui/react'
import { ThemeProvider as NextThemesProvider } from "next-themes";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <ToastProvider placement='top-center' toastOffset={36} />
      <NextThemesProvider attribute="class" defaultTheme="light">
        <div>
          {children}
        </div>
      </NextThemesProvider>
    </HeroUIProvider >
  )
}
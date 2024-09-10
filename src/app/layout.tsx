import './globals.css';
import { CssVarsProvider } from '@mui/joy';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import 'react-photo-view/dist/react-photo-view.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html >
        <body>
          <CssVarsProvider defaultMode="dark">
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <Toaster />
              {children}
            
            </ThemeProvider>
          </CssVarsProvider>
        </body>
      </html>
    </>
  );
}

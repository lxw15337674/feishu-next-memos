import './globals.css';
import 'react-photo-view/dist/react-photo-view.css';
import { Metadata, Viewport } from 'next';
import { ThemeProvider } from 'next-themes';

const APP_NAME = "Fmemos";
const APP_DEFAULT_TITLE = "Fmemos";
const APP_TITLE_TEMPLATE = "%s - Fmemos";
const APP_DESCRIPTION = "Quick notes, powered by lark";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html suppressHydrationWarning>
        <body>
          <ThemeProvider attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
            >{children}</ThemeProvider>
        </body>
      </html>
    </>
  );
}

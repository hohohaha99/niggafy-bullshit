import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "CrowdCast - Smart Crowd Management",
    description: "AI-powered real-time crowd monitoring and smart gate redirection system",
    keywords: ["crowd management", "smart gates", "AI monitoring", "real-time tracking"],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.Node;
}>) {
    return (
        <html lang="en">
            <body className="antialiased bg-gray-50">
                {children}
            </body>
        </html>
    );
}

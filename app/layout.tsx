import './globals.css';

export const metadata = {
  title: 'VanPro Thailand - Charter Trip Planner',
  description: 'ระบบจัดการทริปและบริการการเดินทาง',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen overflow-x-hidden antialiased selection:bg-sky-500 selection:text-slate-950 flex flex-col">
        <div className="flex-1 flex flex-col w-full">
          {children}
        </div>
      </body>
    </html>
  );
}
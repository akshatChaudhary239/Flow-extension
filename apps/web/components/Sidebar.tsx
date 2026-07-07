"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function LayoutDashboard(props: any) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>;
}

function Cable(props: any) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M17 21v-2a4 4 0 0 1-4-4v-6a4 4 0 0 0-4-4H7"/><path d="M7 5H3"/><path d="M21 19h-4"/><path d="M17 19v2"/><path d="M7 3v4"/></svg>;
}

function ArrowRightLeft(props: any) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m16 3 4 4-4 4"/><path d="M20 7H4"/><path d="m8 21-4-4 4-4"/><path d="M4 17h16"/></svg>;
}

function ScrollText(props: any) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v3h4"/><path d="M19 17V5a2 2 0 0 0-2-2H4"/><path d="M15 8h-5"/><path d="M15 12h-5"/></svg>;
}

const navItems = [
  { name: "Overview", href: "/", icon: LayoutDashboard },
  { name: "Integrations", href: "/integrations", icon: Cable },
  { name: "Routing Rules", href: "/routing", icon: ArrowRightLeft },
  { name: "Action Logs", href: "/logs", icon: ScrollText },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 border-r border-border bg-background flex flex-col h-full">
      <div className="p-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <span className="text-white font-black text-xl leading-none">F</span>
          </div>
          Flow
        </h1>
        <p className="text-sm text-foreground/50 mt-1">Command Center</p>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href} className="block relative group">
              {isActive && (
                <div className="absolute inset-0 bg-accent/10 border border-accent/20 rounded-lg pointer-events-none" />
              )}
              <div
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "text-accent"
                    : "text-foreground/70 group-hover:text-foreground group-hover:bg-white/5"
                }`}
              >
                <item.icon className={`w-4 h-4 ${isActive ? "text-accent" : "text-foreground/50 group-hover:text-foreground"}`} />
                {item.name}
              </div>
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-lg cursor-pointer transition-colors">
          <div className="w-8 h-8 rounded-full bg-border flex items-center justify-center text-xs font-bold text-foreground">
            U
          </div>
          <div className="text-sm font-medium text-foreground">User</div>
        </div>
      </div>
    </div>
  );
}

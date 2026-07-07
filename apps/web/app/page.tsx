"use client";

import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

function ExternalLink(props: any) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>;
}

function CheckCircle2(props: any) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>;
}

function Zap(props: any) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
}

export default function OverviewPage() {
  return (
    <div className="max-w-5xl mx-auto p-8 lg:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-white mb-4">
          Command Center
        </h1>
        <p className="text-lg text-foreground/60 max-w-2xl">
          Welcome to Flow. Connect your favorite tools and let our intelligence routing layer handle the rest.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Notion Card */}
        <div>
          <Card glowOnHover className="h-full flex flex-col">
            <div className="flex items-start justify-between mb-6">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <img src="https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png" alt="Notion" className="w-6 h-6 object-contain" />
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-white/5 text-foreground/70 border border-white/10">
                Not Connected
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Notion</h3>
            <p className="text-sm text-foreground/60 mb-8 flex-1">
              Sync your tasks, notes, and bookmarks directly to your Notion workspace databases.
            </p>
            <Button
              variant="outline"
              className="w-full justify-between group"
              onClick={() => window.location.href = "/api/auth/providers/notion/connect"}
            >
              Connect Notion
              <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
            </Button>
          </Card>
        </div>

        {/* Google Tasks Card */}
        <div>
          <Card glowOnHover className="h-full flex flex-col">
            <div className="flex items-start justify-between mb-6">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center p-2.5">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M7.5 12L10.5 15L16.5 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-white/5 text-foreground/70 border border-white/10">
                Not Connected
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Google Tasks</h3>
            <p className="text-sm text-foreground/60 mb-8 flex-1">
              Send your quick reminders and tasks straight to your Google Tasks lists.
            </p>
            <Button
              variant="outline"
              className="w-full justify-between group"
              onClick={() => window.location.href = "/api/auth/providers/google_tasks/connect"}
            >
              Connect Google
              <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
            </Button>
          </Card>
        </div>

        {/* Flow Local Status */}
        <div>
          <Card className="h-full flex flex-col border-accent/20 bg-accent/5">
            <div className="flex items-start justify-between mb-6">
              <div className="w-12 h-12 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center text-accent">
                <Zap className="w-6 h-6" />
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-accent/20 text-accent border border-accent/30">
                <CheckCircle2 className="w-3 h-3" />
                Active
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Flow Local</h3>
            <p className="text-sm text-foreground/60 mb-8 flex-1">
              Your default fallback provider. Any un-routed data is safely stored locally in your Flow account.
            </p>
            <Button
              variant="secondary"
              className="w-full pointer-events-none opacity-50 bg-white/5 border border-white/10 text-white"
            >
              System Default
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

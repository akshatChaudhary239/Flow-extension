"use client";

import { Card } from "../../components/ui/Card";

function CheckCircle2(props: any) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>; }
function XCircle(props: any) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>; }
function Clock(props: any) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>; }
function ExternalLink(props: any) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>; }

export default function ActionLogsPage() {
  const logs = [
    { id: "log1", action: "CREATE_TASK", provider: "Notion", status: "synced", time: "2 mins ago", details: "Project Alpha Launch" },
    { id: "log2", action: "CREATE_NOTE", provider: "Notion", status: "synced", time: "1 hour ago", details: "Meeting Notes with Sarah" },
    { id: "log3", action: "CREATE_TASK", provider: "Google Tasks", status: "failed", time: "3 hours ago", details: "Buy groceries (Token Expired)" },
    { id: "log4", action: "CREATE_BOOKMARK", provider: "Flow Local", status: "synced", time: "1 day ago", details: "https://github.com" }
  ];

  return (
    <div className="max-w-5xl mx-auto p-8 lg:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-12 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-4">Action Logs</h1>
          <p className="text-lg text-foreground/60">A real-time timeline of exactly what Flow is doing in the background.</p>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-foreground/50 uppercase bg-white/5 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Action Type</th>
                <th className="px-6 py-4 font-medium">Provider</th>
                <th className="px-6 py-4 font-medium">Details</th>
                <th className="px-6 py-4 font-medium">Time</th>
                <th className="px-6 py-4 font-medium text-right">Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    {log.status === "synced" ? (
                      <div className="flex items-center gap-1.5 text-emerald-400 font-medium"><CheckCircle2 className="w-4 h-4" /> Synced</div>
                    ) : log.status === "failed" ? (
                      <div className="flex items-center gap-1.5 text-red-400 font-medium"><XCircle className="w-4 h-4" /> Failed</div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-amber-400 font-medium"><Clock className="w-4 h-4" /> Pending</div>
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium text-white">{log.action}</td>
                  <td className="px-6 py-4 text-foreground/80">{log.provider}</td>
                  <td className="px-6 py-4 text-foreground/60 truncate max-w-[200px]">{log.details}</td>
                  <td className="px-6 py-4 text-foreground/50">{log.time}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-foreground/40 hover:text-accent transition-colors"><ExternalLink className="w-4 h-4 inline-block" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

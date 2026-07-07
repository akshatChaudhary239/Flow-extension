"use client";

import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";

function CheckSquare(props: any) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>; }
function StickyNote(props: any) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/><path d="M14 3v5h5"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>; }
function Bookmark(props: any) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>; }
function Bell(props: any) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>; }
function ArrowRight(props: any) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>; }

export default function RoutingRulesPage() {
  const rules = [
    { id: 1, capability: "Tasks", icon: CheckSquare, currentDestination: "Google Tasks", status: "active" },
    { id: 2, capability: "Notes", icon: StickyNote, currentDestination: "Notion", status: "active" },
    { id: 3, capability: "Bookmarks", icon: Bookmark, currentDestination: "Flow Local", status: "fallback" },
    { id: 4, capability: "Reminders", icon: Bell, currentDestination: "Flow Local", status: "fallback" }
  ];

  return (
    <div className="max-w-4xl mx-auto p-8 lg:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-12 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-4">Routing Rules</h1>
          <p className="text-lg text-foreground/60">Configure exactly where each type of action should be sent.</p>
        </div>
        <Button variant="primary">Save Changes</Button>
      </div>

      <div className="space-y-4">
        {rules.map((rule) => (
          <div key={rule.id}>
            <Card className="flex items-center justify-between p-4 group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-foreground/70">
                  <rule.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-white">When I create {rule.capability}</h4>
                  <p className="text-sm text-foreground/50">Via Cmd+K Extension</p>
                </div>
              </div>

              <ArrowRight className="w-5 h-5 text-foreground/20 group-hover:text-accent transition-colors" />

              <div className="flex items-center gap-4 w-64">
                <select 
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent transition-colors appearance-none"
                  defaultValue={rule.currentDestination}
                >
                  <option value="Google Tasks">Google Tasks</option>
                  <option value="Notion">Notion</option>
                  <option value="Flow Local">Flow Local (Fallback)</option>
                </select>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}

import React from "react";
import { Link } from "@tanstack/react-router";
import {
  LayoutGrid,
  CheckSquare,
  Calendar,
  BarChart2,
  Users2,
  Settings,
  HelpCircle,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Folder,
  ArrowDownToLine,
  Sparkles,
  MessageCircle,
  Inbox,
  MessagesSquare,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DocketLogo } from "@/components/ui/docket-logo";

interface DashboardSidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenAddMember: () => void;
  onCloseMobile?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  /** Documents waiting for a human check; shown as a badge on Review. */
  pendingCount?: number;
  onSignOut?: () => void;
}

export function DashboardSidebar({
  activeTab,
  onSelectTab,
  onOpenAddMember,
  onCloseMobile,
  pendingCount = 0,
  onSignOut,
  isCollapsed = false,
  onToggleCollapse,
}: DashboardSidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutGrid },
    { id: "tasks", label: "Documents", icon: CheckSquare },
    {
      id: "review",
      label: "Needs check",
      icon: Inbox,
      badge: pendingCount > 0 ? String(pendingCount) : undefined,
    },
    { id: "calendar", label: "Renewals", icon: Calendar },
    { id: "ask", label: "Ask", icon: MessagesSquare },
    { id: "whatsapp", label: "WhatsApp", icon: MessageCircle },
    { id: "analytics", label: "Goals", icon: BarChart2 },
    { id: "team", label: "Family Team", icon: Users2 },
  ];

  const generalItems = [
    { id: "settings", label: "Settings", icon: Settings },
    { id: "help", label: "Help", icon: HelpCircle },
    { id: "logout", label: "Logout", icon: LogOut },
  ];

  const handleItemClick = (id: string) => {
    if (id === "logout") {
      onSignOut?.();
      return;
    }
    onSelectTab(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <TooltipProvider delayDuration={100}>
      <aside
        className={`flex h-full flex-col justify-between bg-white border-r border-black/[0.06] select-none overflow-y-auto transition-all duration-300 ${
          isCollapsed ? "w-[72px] p-3 items-center" : "w-full md:w-60 xl:w-64 p-4 md:p-5"
        }`}
      >
        <div className="space-y-7 w-full">
          {/* Logo & Brand matching Donezo */}
          <div
            className={`flex items-center pb-1 w-full ${
              isCollapsed ? "justify-center" : "justify-between"
            }`}
          >
            <Link to="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-85">
              <DocketLogo className="size-8 text-docket-blue" />
              {!isCollapsed && (
                <span className="text-xl font-extrabold tracking-tight text-zinc-900">Docket</span>
              )}
            </Link>

            {onToggleCollapse && !isCollapsed && (
              <button
                type="button"
                onClick={onToggleCollapse}
                className="grid size-7 place-items-center rounded-lg text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 transition-colors cursor-pointer"
                title="Collapse sidebar"
              >
                <PanelLeftClose className="size-4" />
              </button>
            )}
          </div>

          {/* Collapsed Expand Quick Button */}
          {onToggleCollapse && isCollapsed && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={onToggleCollapse}
                  className="grid size-8 place-items-center rounded-xl text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 transition-colors cursor-pointer mx-auto"
                >
                  <PanelLeftOpen className="size-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Expand sidebar</TooltipContent>
            </Tooltip>
          )}

          {/* MENU Group */}
          <div className="space-y-1.5 w-full">
            {!isCollapsed ? (
              <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                MENU
              </p>
            ) : (
              <div className="h-px w-6 bg-zinc-200 my-2 mx-auto" />
            )}

            <div className="space-y-1 w-full">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                if (isCollapsed) {
                  return (
                    <Tooltip key={item.id}>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          onClick={() => handleItemClick(item.id)}
                          className={`grid size-10 place-items-center rounded-xl transition-all cursor-pointer mx-auto ${
                            isActive
                              ? "bg-docket-blue text-white shadow-xs"
                              : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                          }`}
                        >
                          <Icon className="size-4.5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        {item.label} {item.badge && `(${item.badge})`}
                      </TooltipContent>
                    </Tooltip>
                  );
                }

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleItemClick(item.id)}
                    className={`relative flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? "text-zinc-900 font-bold bg-zinc-50"
                        : "text-zinc-500 hover:bg-zinc-50/80 hover:text-zinc-900"
                    }`}
                  >
                    {/* Active Left Indicator Bar matching Donezo */}
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-docket-blue rounded-r-md" />
                    )}

                    <div className="flex items-center gap-3">
                      <Icon
                        className={`size-4.5 ${isActive ? "text-docket-blue" : "text-zinc-400"}`}
                      />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className="rounded-full bg-docket-blue px-2 py-0.5 text-[10px] font-bold text-white">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* GENERAL Group */}
          <div className="space-y-1.5 w-full">
            {!isCollapsed ? (
              <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                GENERAL
              </p>
            ) : (
              <div className="h-px w-6 bg-zinc-200 my-2 mx-auto" />
            )}

            <div className="space-y-1 w-full">
              {generalItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                if (isCollapsed) {
                  return (
                    <Tooltip key={item.id}>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          onClick={() => handleItemClick(item.id)}
                          className="grid size-10 place-items-center rounded-xl text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 transition-all cursor-pointer mx-auto"
                        >
                          <Icon className="size-4.5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="right">{item.label}</TooltipContent>
                    </Tooltip>
                  );
                }

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleItemClick(item.id)}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 transition-all cursor-pointer"
                  >
                    <Icon className="size-4.5 text-zinc-400" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Card matching "Download our Mobile App" in the mockup */}
        {!isCollapsed && (
          <div className="mt-6 rounded-2xl bg-zinc-950 p-4 text-white relative overflow-hidden shadow-sm">
            {/* Subtle SVG wave background */}
            <svg
              className="absolute -right-6 -bottom-6 w-36 h-36 opacity-15 pointer-events-none text-docket-blue/50"
              viewBox="0 0 100 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M0 50 Q 25 20, 50 50 T 100 50" />
              <path d="M0 65 Q 25 35, 50 65 T 100 65" />
              <path d="M0 80 Q 25 50, 50 80 T 100 80" />
            </svg>

            <div className="relative z-10 space-y-2">
              <div className="grid size-7 place-items-center rounded-lg bg-white/10 text-white backdrop-blur-xs">
                <ArrowDownToLine className="size-3.5" />
              </div>

              <div>
                <p className="text-xs font-bold leading-tight">
                  Download our <br />
                  <span className="text-white/90">Mobile App</span>
                </p>
                <p className="text-[10px] text-zinc-400 mt-0.5">Get easy in another way</p>
              </div>

              <button
                type="button"
                onClick={() => alert("Docket Mobile App downloading for iOS & Android...")}
                className="w-full rounded-xl bg-docket-blue hover:bg-docket-blue/90 transition-colors py-1.5 text-center text-xs font-bold text-white shadow-xs cursor-pointer"
              >
                Download
              </button>
            </div>
          </div>
        )}
      </aside>
    </TooltipProvider>
  );
}

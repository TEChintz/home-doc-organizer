import React from "react";
import { Link } from "@tanstack/react-router";
import {
  LayoutGrid,
  CheckSquare,
  Calendar,
  BarChart2,
  Users2,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Folder,
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
                        ? "text-zinc-900 font-bold bg-zinc-100 shadow-sm border border-zinc-200/50"
                        : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`size-4.5 transition-colors ${isActive ? "text-docket-blue" : "text-zinc-400 group-hover:text-zinc-500"}`}
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

      </aside>
    </TooltipProvider>
  );
}

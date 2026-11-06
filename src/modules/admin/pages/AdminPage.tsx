import React from 'react';
import { ModuleHeader } from '@/components/layout/ModuleHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ShieldAlert, Server, Database, Cpu, FileText } from 'lucide-react';
import { logger } from '@/services/logging/logger.service';
import { pluginManager } from '@/plugins/plugin-manager';

export const AdminPage: React.FC = () => {
  const recentLogs = logger.getRecentLogs().slice(-5);
  const plugins = pluginManager.getPlugins();

  return (
    <div className="space-y-6 animate-fadeIn">
      <ModuleHeader
        title="Admin & Diagnostics Console"
        subtitle="Internal diagnostics, active plugin registries, logging inspection, and database metrics."
        icon={ShieldAlert}
        badge="System Staff Only"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              System Core
            </span>
            <Badge variant="green" dot>
              Operational
            </Badge>
          </div>
          <div className="flex items-center gap-2.5">
            <Server className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Node & Vite Engine
            </span>
          </div>
          <p className="text-xs text-slate-500">Latency: 4ms • Memory: Optimal</p>
        </Card>

        <Card className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Data Storage
            </span>
            <Badge variant="green" dot>
              Active
            </Badge>
          </div>
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-indigo-500" />
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Storage Engine & SQL DDL
            </span>
          </div>
          <p className="text-xs text-slate-500">IndexedDB Client Cache & Schema v1.0.0</p>
        </Card>

        <Card className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Extensibility
            </span>
            <Badge variant="purple">Plugin Ready</Badge>
          </div>
          <div className="flex items-center gap-2.5">
            <Cpu className="w-5 h-5 text-purple-500" />
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Plugin Manager
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Registered: {plugins.length} active dynamic hooks
          </p>
        </Card>
      </div>

      {/* Diagnostics / Real-time Logger Log Box */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Recent Application Logs
            </h3>
          </div>
          <Badge variant="neutral" size="sm">
            In-Memory Tail
          </Badge>
        </div>

        <div className="space-y-1.5 font-mono text-xs bg-slate-900 text-slate-200 p-4 rounded-xl max-h-48 overflow-y-auto">
          {recentLogs.length > 0 ? (
            recentLogs.map((l, i) => (
              <div key={i} className="leading-relaxed">
                <span className="text-slate-500">[{l.timestamp.split('T')[1].slice(0, 8)}]</span>{' '}
                <span
                  className={
                    l.level === 'ERROR'
                      ? 'text-rose-400'
                      : l.level === 'WARN'
                      ? 'text-amber-400'
                      : 'text-blue-400'
                  }
                >
                  [{l.level}]
                </span>{' '}
                <span className="text-slate-300">[{l.context}]</span> {l.message}
              </div>
            ))
          ) : (
            <div className="text-slate-500 italic">No errors or warnings recorded.</div>
          )}
        </div>
      </Card>
    </div>
  );
};

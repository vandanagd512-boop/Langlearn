/**
 * Structured Production Logger
 */

export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

export interface LogEntry {
  level: LogLevel;
  context: string;
  message: string;
  data?: unknown;
  timestamp: string;
}

class Logger {
  private inMemoryLogs: LogEntry[] = [];
  private maxLogs = 500;

  private formatMessage(entry: LogEntry): string {
    return `[${entry.timestamp}] [${entry.level}] [${entry.context}]: ${entry.message}`;
  }

  private log(level: LogLevel, context: string, message: string, data?: unknown): void {
    const entry: LogEntry = {
      level,
      context,
      message,
      data,
      timestamp: new Date().toISOString(),
    };

    this.inMemoryLogs.push(entry);
    if (this.inMemoryLogs.length > this.maxLogs) {
      this.inMemoryLogs.shift();
    }

    const formatted = this.formatMessage(entry);
    switch (level) {
      case 'DEBUG':
        if (import.meta.env.DEV) console.debug(formatted, data ?? '');
        break;
      case 'INFO':
        console.info(formatted, data ?? '');
        break;
      case 'WARN':
        console.warn(formatted, data ?? '');
        break;
      case 'ERROR':
        console.error(formatted, data ?? '');
        break;
    }
  }

  public debug(context: string, message: string, data?: unknown): void {
    this.log('DEBUG', context, message, data);
  }

  public info(context: string, message: string, data?: unknown): void {
    this.log('INFO', context, message, data);
  }

  public warn(context: string, message: string, data?: unknown): void {
    this.log('WARN', context, message, data);
  }

  public error(context: string, message: string, data?: unknown): void {
    this.log('ERROR', context, message, data);
  }

  public getRecentLogs(): LogEntry[] {
    return [...this.inMemoryLogs];
  }

  public clearLogs(): void {
    this.inMemoryLogs = [];
  }
}

export const logger = new Logger();

const LOG_PREFIX = '[Matematika]';

export type LogContext = {
  type: string;
  id?: string;
  action: string;
  detail?: string;
};

function formatContext(ctx: LogContext): string {
  const parts = [LOG_PREFIX, ctx.type];
  if (ctx.id) parts.push(`#${ctx.id}`);
  parts.push(ctx.action);
  return parts.join(' ');
}

export const logger = {
  error(ctx: LogContext, error?: unknown) {
    const msg = formatContext(ctx);
    if (error instanceof Error) {
      console.error(msg, error.message, error.stack);
    } else {
      console.error(msg, error ?? ctx.detail ?? '');
    }
  },

  warn(ctx: LogContext, detail?: string) {
    console.warn(formatContext(ctx), detail ?? '');
  },

  info(ctx: LogContext, detail?: string) {
    console.info(formatContext(ctx), detail ?? '');
  },
};

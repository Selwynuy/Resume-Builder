import type { NextRequest } from 'next/server'

export interface RequestLog {
  timestamp: string
  method: string
  url: string
  ip: string
  userAgent: string
  statusCode?: number
  responseTime?: number
  error?: string
}

export interface LoggingConfig {
  enabled: boolean
  logLevel: 'error' | 'warn' | 'info' | 'debug'
  excludePaths: string[]
  includeHeaders: string[]
}

export const DEFAULT_LOGGING_CONFIG: LoggingConfig = {
  enabled: true,
  logLevel: 'info',
  excludePaths: [
    '/_next/static',
    '/_next/image',
    '/favicon.ico',
    '/api/auth/session',
    '/api/auth/_log'
  ],
  includeHeaders: ['user-agent', 'referer', 'origin']
}

export function shouldLogRequest(request: NextRequest, config: LoggingConfig = DEFAULT_LOGGING_CONFIG): boolean {
  if (!config.enabled) return false
  
  const path = request.nextUrl.pathname
  return !config.excludePaths.some(excludePath => path.startsWith(excludePath))
}

export function createRequestLog(request: NextRequest): RequestLog {
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
  const userAgent = request.headers.get('user-agent') || 'unknown'
  
  return {
    timestamp: new Date().toISOString(),
    method: request.method,
    url: request.nextUrl.pathname,
    ip,
    userAgent
  }
}

export function logRequest(log: RequestLog, config: LoggingConfig = DEFAULT_LOGGING_CONFIG): void {
  if (!shouldLogRequest({ nextUrl: { pathname: log.url } } as NextRequest, config)) {
    return
  }

  const logMessage = {
    level: 'info',
    message: `${log.method} ${log.url}`,
    ...log
  }

  // In production, use a proper logging service
  if (process.env.NODE_ENV === 'production') {
    console.log(JSON.stringify(logMessage))
  } else {
    console.log(`[${log.timestamp}] ${log.method} ${log.url} - ${log.ip}`)
  }
}

export function logError(error: Error, request: NextRequest, config: LoggingConfig = DEFAULT_LOGGING_CONFIG): void {
  if (!shouldLogRequest(request, config)) return

  const log: RequestLog = {
    timestamp: new Date().toISOString(),
    method: request.method,
    url: request.nextUrl.pathname,
    ip: request.ip || request.headers.get('x-forwarded-for') || 'unknown',
    userAgent: request.headers.get('user-agent') || 'unknown',
    error: error.message
  }

  const logMessage = {
    level: 'error',
    message: `Error processing ${log.method} ${log.url}`,
    ...log,
    stack: error.stack
  }

  if (process.env.NODE_ENV === 'production') {
    console.error(JSON.stringify(logMessage))
  } else {
    console.error(`[ERROR] ${log.timestamp} ${log.method} ${log.url} - ${error.message}`)
  }
}

export function logResponse(log: RequestLog, statusCode: number, responseTime: number, config: LoggingConfig = DEFAULT_LOGGING_CONFIG): void {
  if (!shouldLogRequest({ nextUrl: { pathname: log.url } } as NextRequest, config)) {
    return
  }

  log.statusCode = statusCode
  log.responseTime = responseTime

  const logMessage = {
    level: statusCode >= 400 ? 'warn' : 'info',
    message: `${log.method} ${log.url} - ${statusCode} (${responseTime}ms)`,
    ...log
  }

  if (process.env.NODE_ENV === 'production') {
    console.log(JSON.stringify(logMessage))
  } else {
    const statusColor = statusCode >= 400 ? '\x1b[31m' : '\x1b[32m' // Red for errors, Green for success
    console.log(`${statusColor}[${log.timestamp}] ${log.method} ${log.url} - ${statusCode} (${responseTime}ms)\x1b[0m`)
  }
} 
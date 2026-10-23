'use client';

import { Perfume, Order, OrderStatus } from '@/types/perfume';
import { INITIAL_PERFUMES, INITIAL_ORDERS } from './initialData';

const PERFUMES_KEY = 'hq_fragrance_catalog_v5';
const ORDERS_KEY = 'hq_fragrance_orders_v5';
const ADMIN_PIN_KEY = 'hq_fragrance_admin_pin';

function normalizePerfume(p: Perfume): Perfume {
  const official = INITIAL_PERFUMES.find(init => init.id === p.id);
  const fixedImage =
    official?.image ||
    (p.image?.startsWith('/images/perfumes/')
      ? p.image.replace(/\.png$/i, '.jpg')
      : p.image);

  return {
    ...(official || {}),
    ...p,
    image: fixedImage,
    rating: p.rating ?? official?.rating ?? 4.9,
    reviewsCount: p.reviewsCount ?? official?.reviewsCount ?? 65,
    originalPrice: p.originalPrice ?? official?.originalPrice ?? 49,
    originalPrice100ml: p.originalPrice100ml ?? official?.originalPrice100ml ?? 85,
  };
}

export function getStoredPerfumes(): Perfume[] {
  if (typeof window === 'undefined') return INITIAL_PERFUMES;
  try {
    const raw = localStorage.getItem(PERFUMES_KEY);
    if (!raw) {
      localStorage.setItem(PERFUMES_KEY, JSON.stringify(INITIAL_PERFUMES));
      return INITIAL_PERFUMES;
    }
    const parsed: Perfume[] = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(PERFUMES_KEY, JSON.stringify(INITIAL_PERFUMES));
      return INITIAL_PERFUMES;
    }
    return parsed.map(normalizePerfume);
  } catch {
    return INITIAL_PERFUMES;
  }
}

export function saveStoredPerfumes(perfumes: Perfume[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PERFUMES_KEY, JSON.stringify(perfumes));
  window.dispatchEvent(new Event('hq-catalog-updated'));
}

export function resetStoredPerfumes(): Perfume[] {
  saveStoredPerfumes(INITIAL_PERFUMES);
  return INITIAL_PERFUMES;
}

export function addStoredPerfume(perfume: Perfume): Perfume[] {
  const current = getStoredPerfumes();
  const updated = [perfume, ...current];
  saveStoredPerfumes(updated);
  return updated;
}

export function updateStoredPerfume(perfume: Perfume): Perfume[] {
  const current = getStoredPerfumes();
  const updated = current.map(p => (p.id === perfume.id ? perfume : p));
  saveStoredPerfumes(updated);
  return updated;
}

export function deleteStoredPerfume(id: string): Perfume[] {
  const current = getStoredPerfumes();
  const updated = current.filter(p => p.id !== id);
  saveStoredPerfumes(updated);
  return updated;
}

export function getStoredOrders(): Order[] {
  if (typeof window === 'undefined') return INITIAL_ORDERS;
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    if (!raw) {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(INITIAL_ORDERS));
      return INITIAL_ORDERS;
    }
    const parsed: Order[] = JSON.parse(raw);
    if (!Array.isArray(parsed)) return INITIAL_ORDERS;
    return parsed.map(o => ({
      ...o,
      items: (o.items || []).map(it => ({
        ...it,
        perfume: normalizePerfume(it.perfume),
      })),
    }));
  } catch {
    return INITIAL_ORDERS;
  }
}

export function saveStoredOrders(orders: Order[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export function addStoredOrder(order: Order): Order[] {
  const current = getStoredOrders();
  const updated = [order, ...current];
  saveStoredOrders(updated);
  return updated;
}

export function updateStoredOrderStatus(
  orderId: string,
  status: OrderStatus,
  trackingNumber?: string
): Order[] {
  const current = getStoredOrders();
  const updated = current.map(o => {
    if (o.id === orderId) {
      return {
        ...o,
        status,
        ...(trackingNumber !== undefined ? { trackingNumber } : {}),
      };
    }
    return o;
  });
  saveStoredOrders(updated);
  return updated;
}

export function getAdminPin(): string {
  if (typeof window === 'undefined') return '1234';
  return localStorage.getItem(ADMIN_PIN_KEY) || '1234';
}

export function setAdminPin(pin: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ADMIN_PIN_KEY, pin);
}

const ADMIN_PHONE_KEY = 'hq_fragrance_admin_phone';
const ADMIN_2FA_ENABLED_KEY = 'hq_fragrance_admin_2fa_enabled';
const ADMIN_FAILED_ATTEMPTS_KEY = 'hq_fragrance_admin_failed_attempts';
const ADMIN_LOCKOUT_UNTIL_KEY = 'hq_fragrance_admin_lockout_until';
const ADMIN_LOGIN_LOGS_KEY = 'hq_fragrance_admin_login_logs';

export function getAdminPhone(): string {
  if (typeof window === 'undefined') return '06 12 34 56 78';
  return localStorage.getItem(ADMIN_PHONE_KEY) || '06 12 34 56 78';
}

export function setAdminPhone(phone: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ADMIN_PHONE_KEY, phone);
}

export function getIs2FAEnabled(): boolean {
  if (typeof window === 'undefined') return true;
  const stored = localStorage.getItem(ADMIN_2FA_ENABLED_KEY);
  return stored === null ? true : stored === 'true';
}

export function setIs2FAEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ADMIN_2FA_ENABLED_KEY, enabled ? 'true' : 'false');
}

export function getFailedAttempts(): number {
  if (typeof window === 'undefined') return 0;
  return Number(localStorage.getItem(ADMIN_FAILED_ATTEMPTS_KEY)) || 0;
}

export function incrementFailedAttempts(): number {
  if (typeof window === 'undefined') return 1;
  const count = getFailedAttempts() + 1;
  localStorage.setItem(ADMIN_FAILED_ATTEMPTS_KEY, count.toString());
  if (count >= 5) {
    // Lock for 15 minutes
    const lockoutUntil = Date.now() + 15 * 60 * 1000;
    localStorage.setItem(ADMIN_LOCKOUT_UNTIL_KEY, lockoutUntil.toString());
  }
  return count;
}

export function resetFailedAttempts(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ADMIN_FAILED_ATTEMPTS_KEY);
  localStorage.removeItem(ADMIN_LOCKOUT_UNTIL_KEY);
}

export function getLockoutUntil(): number | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(ADMIN_LOCKOUT_UNTIL_KEY);
  if (!stored) return null;
  const until = Number(stored);
  if (Date.now() > until) {
    resetFailedAttempts();
    return null;
  }
  return until;
}

export interface LoginLog {
  id: string;
  date: string;
  method: 'PIN + 2FA WhatsApp' | 'PIN + 2FA SMS' | 'PIN Seul';
  success: boolean;
}

export function getLoginLogs(): LoginLog[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(ADMIN_LOGIN_LOGS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addLoginLog(method: LoginLog['method'], success: boolean): void {
  if (typeof window === 'undefined') return;
  const current = getLoginLogs();
  const newLog: LoginLog = {
    id: `log-${Date.now()}`,
    date: new Date().toISOString(),
    method,
    success,
  };
  const updated = [newLog, ...current].slice(0, 10);
  localStorage.setItem(ADMIN_LOGIN_LOGS_KEY, JSON.stringify(updated));
}

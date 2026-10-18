'use client';

import { Perfume, Order, OrderStatus } from '@/types/perfume';
import { INITIAL_PERFUMES, INITIAL_ORDERS } from './initialData';

const PERFUMES_KEY = 'hq_fragrance_catalog_v2';
const ORDERS_KEY = 'hq_fragrance_orders_v2';
const ADMIN_PIN_KEY = 'hq_fragrance_admin_pin';

export function getStoredPerfumes(): Perfume[] {
  if (typeof window === 'undefined') return INITIAL_PERFUMES;
  try {
    const raw = localStorage.getItem(PERFUMES_KEY);
    if (!raw) {
      localStorage.setItem(PERFUMES_KEY, JSON.stringify(INITIAL_PERFUMES));
      return INITIAL_PERFUMES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_PERFUMES;
  }
}

export function saveStoredPerfumes(perfumes: Perfume[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PERFUMES_KEY, JSON.stringify(perfumes));
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
    return JSON.parse(raw);
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

export function updateStoredOrderStatus(orderId: string, status: OrderStatus, trackingNumber?: string): Order[] {
  const current = getStoredOrders();
  const updated = current.map(o => {
    if (o.id === orderId) {
      return {
        ...o,
        status,
        ...(trackingNumber !== undefined ? { trackingNumber } : {})
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

import { describe, it, expect } from 'vitest';
import {
  handleScannedQrPayloadLogic,
  addActivityToStream,
  calculateVirtualWindow,
  calculateExponentialBackoffDelay,
  measurePerformance
} from '../src/utils/crm-utils.js';

describe('Activity Stream & QR Scanner Logic Tests', () => {

  const sampleClients = [
    { id: 202, name: 'Jessica Alba', email: 'jessica@example.com', phone: '555-0199' }
  ];

  const sampleAppointments = [
    { id: 101, client_name: 'David Beckham', service_type: 'Full Sleeve Tattoo', datetime: '2026-08-01T14:00:00Z' }
  ];

  const sampleInventory = [
    { id: 303, name: 'Dynamic Black Ink 8oz', sku: 'INK-DYN-8', quantity: 15 }
  ];

  const initialActivities = [
    { id: 1001, title: 'System Initialization', details: 'CRM Started', timestamp: '2026-07-31T12:00:00Z' }
  ];

  describe('handleScannedQrPayloadLogic() & allActivities state management', () => {
    it('should identify malformed or corrupt QR codes and return error', () => {
      const result = handleScannedQrPayloadLogic('???', { allActivities: initialActivities });
      expect(result.isMalformed).toBe(true);
      expect(result.error).toContain('Malformed');
      expect(result.newActivity).toBeNull();
      expect(result.allActivities).toHaveLength(1);
    });

    it('should handle appointment QR codes and prepend new activity item to allActivities', () => {
      const result = handleScannedQrPayloadLogic('app-101', {
        appointments: sampleAppointments,
        allActivities: initialActivities
      });

      expect(result.isMalformed).toBe(false);
      expect(result.matchedType).toBe('appointment');
      expect(result.newActivity).not.toBeNull();
      expect(result.newActivity.title).toContain('David Beckham');
      expect(result.allActivities).toHaveLength(2);
      expect(result.allActivities[0].id).toBe(result.newActivity.id);
    });

    it('should handle client pass QR codes and update allActivities state', () => {
      const result = handleScannedQrPayloadLogic('client-202', {
        clients: sampleClients,
        allActivities: initialActivities
      });

      expect(result.isMalformed).toBe(false);
      expect(result.matchedType).toBe('client');
      expect(result.newActivity.title).toContain('Jessica Alba');
      expect(result.allActivities[0].category).toBe('client');
    });

    it('should handle inventory SKU codes and update allActivities state', () => {
      const result = handleScannedQrPayloadLogic('inv-303', {
        inventory: sampleInventory,
        allActivities: initialActivities
      });

      expect(result.isMalformed).toBe(false);
      expect(result.matchedType).toBe('inventory');
      expect(result.newActivity.title).toContain('Dynamic Black Ink');
    });
  });

  describe('addActivityToStream() deduplication', () => {
    it('should prepend new activity to stream', () => {
      const newAct = { id: 2001, title: 'New Booking', timestamp: new Date().toISOString() };
      const updated = addActivityToStream(newAct, initialActivities);
      expect(updated).toHaveLength(2);
      expect(updated[0].id).toBe(2001);
    });

    it('should prevent duplicate activity IDs from bloating stream', () => {
      const existingAct = { id: 1001, title: 'System Initialization' };
      const updated = addActivityToStream(existingAct, initialActivities);
      expect(updated).toHaveLength(1);
    });
  });

  describe('Virtual List Window Calculation (renderDrawerFeed)', () => {
    it('should compute visible slice indices and spacer heights accurately', () => {
      const totalItems = 100;
      const itemHeight = 76;
      const containerHeight = 450;
      const scrollTop = 760; // scrolled down 10 items

      const win = calculateVirtualWindow(totalItems, itemHeight, containerHeight, scrollTop, 2);
      expect(win.startIndex).toBe(8); // Math.max(0, 10 - 2)
      expect(win.topSpacerHeight).toBe(8 * 76);
      expect(win.visibleCount).toBe(10); // 6 visible + 4 overscan
      expect(win.bottomSpacerHeight).toBe((100 - (8 + 10)) * 76);
    });

    it('should handle empty activity list without throwing error', () => {
      const win = calculateVirtualWindow(0, 76, 450, 0);
      expect(win.startIndex).toBe(0);
      expect(win.endIndex).toBe(0);
      expect(win.visibleCount).toBe(0);
    });
  });

  describe('Exponential Backoff Retry Strategy (flushPendingLogsQueue)', () => {
    it('should calculate exponential delay progression for network retries', () => {
      expect(calculateExponentialBackoffDelay(1, 500, 10000)).toBe(500);
      expect(calculateExponentialBackoffDelay(2, 500, 10000)).toBe(1000);
      expect(calculateExponentialBackoffDelay(3, 500, 10000)).toBe(2000);
      expect(calculateExponentialBackoffDelay(4, 500, 10000)).toBe(4000);
      expect(calculateExponentialBackoffDelay(5, 500, 10000)).toBe(8000);
    });

    it('should cap exponential backoff delay at maxMs limit', () => {
      expect(calculateExponentialBackoffDelay(6, 500, 10000)).toBe(10000);
      expect(calculateExponentialBackoffDelay(10, 500, 10000)).toBe(10000);
    });
  });

  describe('Performance Monitoring Utility', () => {
    it('should track function execution time and identify threshold budget overruns', () => {
      const fastFn = () => {
        let sum = 0;
        for (let i = 0; i < 100; i++) sum += i;
        return sum;
      };

      const perf = measurePerformance('fastRender', fastFn, 16);
      expect(perf.name).toBe('fastRender');
      expect(perf.result).toBe(4950);
      expect(perf.exceeded).toBe(false);
    });
  });

});

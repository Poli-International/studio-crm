import { describe, it, expect } from 'vitest';
import {
  formatCurrency,
  calculateAppointmentStatus,
  filterAppointmentsByDateRange,
  extractTableDataForExport,
  calculateCoverageMetrics,
  filterInventoryByQuery,
  getTop5UsedInventoryItems
} from '../src/utils/crm-utils.js';

describe('Studio CRM Utility Functions Unit Tests', () => {

  describe('formatCurrency()', () => {
    it('should format numbers correctly to USD currency', () => {
      expect(formatCurrency(1250)).toBe('$1,250.00');
      expect(formatCurrency(0)).toBe('$0.00');
      expect(formatCurrency(99.9)).toBe('$99.90');
      expect(formatCurrency('450.75')).toBe('$450.75');
    });

    it('should handle invalid input gracefully', () => {
      expect(formatCurrency(null)).toBe('$0.00');
      expect(formatCurrency(undefined)).toBe('$0.00');
      expect(formatCurrency('abc')).toBe('$0.00');
    });
  });

  describe('calculateAppointmentStatus()', () => {
    it('should correctly identify Upcoming appointments', () => {
      const futureTime = new Date('2026-08-01T14:00:00Z');
      const refTime = new Date('2026-08-01T10:00:00Z');
      expect(calculateAppointmentStatus(futureTime, 60, refTime)).toBe('Upcoming');
    });

    it('should correctly identify In Progress appointments', () => {
      const startTime = new Date('2026-08-01T10:00:00Z');
      const refTime = new Date('2026-08-01T10:30:00Z');
      expect(calculateAppointmentStatus(startTime, 60, refTime)).toBe('In Progress');
    });

    it('should correctly identify Completed appointments', () => {
      const startTime = new Date('2026-08-01T10:00:00Z');
      const refTime = new Date('2026-08-01T12:00:00Z');
      expect(calculateAppointmentStatus(startTime, 60, refTime)).toBe('Completed');
    });

    it('should handle invalid date string fallback', () => {
      expect(calculateAppointmentStatus('invalid-date')).toBe('Upcoming');
      expect(calculateAppointmentStatus(null)).toBe('Upcoming');
      expect(calculateAppointmentStatus(undefined)).toBe('Upcoming');
      expect(calculateAppointmentStatus('2026-08-01T10:00:00Z', 60, 'invalid-reference-date')).toBe('Upcoming');
    });
  });

  describe('filterAppointmentsByDateRange()', () => {
    const appointments = [
      { id: 1, date: '2026-07-01' },
      { id: 2, date: '2026-07-15' },
      { id: 3, date: '2026-07-31' },
    ];

    it('should filter appointments within start and end range', () => {
      const result = filterAppointmentsByDateRange(appointments, '2026-07-10', '2026-07-20');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(2);
    });

    it('should return all appointments if no range specified', () => {
      const result = filterAppointmentsByDateRange(appointments, null, null);
      expect(result).toHaveLength(3);
    });

    it('should handle empty or non-array inputs safely', () => {
      expect(filterAppointmentsByDateRange(null)).toEqual([]);
    });
  });

  describe('extractTableDataForExport()', () => {
    it('should cleanly parse raw matrix rows into headers and data', () => {
      const rawRows = [
        ['  Time ', ' Client Name  ', ' Status '],
        ['10:00 AM', 'John  Doe', 'Confirmed'],
        ['02:00 PM', 'Sarah Smith', 'Pending']
      ];

      const parsed = extractTableDataForExport(rawRows);
      expect(parsed.headers).toEqual(['Time', 'Client Name', 'Status']);
      expect(parsed.totalRows).toBe(2);
      expect(parsed.data[0]).toEqual(['10:00 AM', 'John Doe', 'Confirmed']);
    });

    it('should handle empty input array', () => {
      const parsed = extractTableDataForExport([]);
      expect(parsed.headers).toEqual([]);
      expect(parsed.data).toEqual([]);
      expect(parsed.totalRows).toBe(0);
    });
  });

  describe('calculateCoverageMetrics()', () => {
    it('should aggregate module stats and calculate overall percentage', () => {
      const moduleStats = {
        Dashboard: { total: 100, covered: 92 },
        Modals: { total: 50, covered: 48 },
        DataExport: { total: 40, covered: 38 }
      };

      const result = calculateCoverageMetrics(moduleStats);
      expect(result.overallCoverage).toBe(93.7);
      expect(result.summary).toHaveLength(3);
      expect(result.summary[0].module).toBe('Dashboard');
      expect(result.summary[0].coverage).toBe(92);
    });

    it('should handle zero or empty metrics safely', () => {
      const result = calculateCoverageMetrics({});
      expect(result.overallCoverage).toBe(0);
      expect(result.summary).toEqual([]);
    });
  });

  describe('filterInventoryByQuery()', () => {
    const inventory = [
      { id: 1, name: 'Dynamic Black Ink 8oz', sku: 'INK-DYN-8', category: 'Supplies' },
      { id: 2, name: 'Kwadron 3RL Needles (Box 20)', sku: 'NDL-KWA-3RL', category: 'Needles' },
      { id: 3, name: 'Green Soap 1 Gallon', sku: 'CLN-GRN-1G', category: 'Hygiene' }
    ];

    it('should filter items matching name or SKU case-insensitively', () => {
      const resName = filterInventoryByQuery(inventory, 'black');
      expect(resName).toHaveLength(1);
      expect(resName[0].sku).toBe('INK-DYN-8');

      const resSku = filterInventoryByQuery(inventory, 'ndl-kwa');
      expect(resSku).toHaveLength(1);
      expect(resSku[0].name).toContain('Kwadron');
    });

    it('should return full inventory list when query is empty', () => {
      expect(filterInventoryByQuery(inventory, '')).toHaveLength(3);
      expect(filterInventoryByQuery(inventory, null)).toHaveLength(3);
    });
  });

  describe('getTop5UsedInventoryItems()', () => {
    const inventory = [
      { id: 1, name: 'Dynamic Black Ink', sku: 'INK-01', quantity: 5 },
      { id: 2, name: 'Kwadron Needles', sku: 'NDL-01', quantity: 12 },
      { id: 3, name: 'Green Soap', sku: 'CLN-01', quantity: 20 },
      { id: 4, name: 'Nitrile Gloves L', sku: 'GLV-01', quantity: 45 },
      { id: 5, name: 'Stencil Stuff', sku: 'STN-01', quantity: 8 },
      { id: 6, name: 'Aftercare Ointment', sku: 'AFT-01', quantity: 30 }
    ];

    const activities = [
      { title: 'Inventory Scan: Dynamic Black Ink', details: 'INK-01' },
      { title: 'Inventory Scan: Dynamic Black Ink', details: 'INK-01' },
      { title: 'Restock Kwadron Needles', details: 'NDL-01' }
    ];

    it('should return top 5 items sorted by log frequency and catalog fallback', () => {
      const top5 = getTop5UsedInventoryItems(activities, inventory);
      expect(top5).toHaveLength(5);
      expect(top5[0].name).toBe('Dynamic Black Ink');
      expect(top5[0].count).toBe(2);
    });
  });

});

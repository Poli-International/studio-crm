import { describe, it, expect } from 'vitest';
import { validateModalState } from '../src/utils/crm-utils.js';

describe('Modal State Management & Stacking Context Tests', () => {

  it('should validate correctly configured modal state', () => {
    const validConfig = {
      id: 'team-messenger-overlay',
      isOpen: true,
      zIndex: 2000000,
      display: 'flex'
    };

    const result = validateModalState(validConfig);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should reject modal configs missing an ID', () => {
    const invalidConfig = {
      isOpen: true,
      zIndex: 2000000,
      display: 'flex'
    };

    const result = validateModalState(invalidConfig);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Modal id is required and must be a string');
  });

  it('should reject low zIndex values that risk visual clipping under sticky headers', () => {
    const lowZIndexConfig = {
      id: 'auto-scheduler-modal-overlay',
      isOpen: true,
      zIndex: 50,
      display: 'flex'
    };

    const result = validateModalState(lowZIndexConfig);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Modal zIndex must be at least 1000 for proper stacking context');
  });

  it('should enforce proper display property for visible modals', () => {
    const hiddenDisplayConfig = {
      id: 'quick-table-export-modal-overlay',
      isOpen: true,
      zIndex: 2000000,
      display: 'none'
    };

    const result = validateModalState(hiddenDisplayConfig);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Open modal must have display property set to flex or block');
  });

});

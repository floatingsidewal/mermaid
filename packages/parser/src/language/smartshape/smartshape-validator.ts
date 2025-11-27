import type { ValidationAcceptor, ValidationChecks } from 'langium';
import type { MermaidAstType, SmartShape } from '../generated/ast.js';
import type { SmartShapeServices } from './module.js';

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: SmartShapeServices) {
  const validator = services.validation.SmartShapeValidator;
  const registry = services.validation.ValidationRegistry;
  if (registry) {
    const checks: ValidationChecks<MermaidAstType> = {
      SmartShape: validator.checkSmartShape.bind(validator),
    };
    registry.register(checks, validator);
  }
}

/**
 * Implementation of custom validations.
 */
export class SmartShapeValidator {
  /**
   * Validates the SmartShape diagram structure.
   */
  checkSmartShape(doc: SmartShape, accept: ValidationAcceptor): void {
    // Validate that at least one item is defined
    const itemRows = doc.rows.filter((row) => row.item !== undefined);
    if (itemRows.length === 0) {
      accept('warning', 'SmartShape diagram should have at least one item.', {
        node: doc,
      });
    }
  }
}

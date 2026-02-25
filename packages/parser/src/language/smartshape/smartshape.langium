/**
 * SmartShape grammar for Langium
 * Implements SmartArt-style diagrams with dynamic layout algorithms
 *
 * Syntax:
 *   smartshape
 *     type: list|process|cycle|hierarchy|relationship|matrix|pyramid
 *     direction: TB|LR|BT|RL
 *     "Item One"
 *       "Sub-item A"
 *       "Sub-item B"
 *     "Item Two"
 */
grammar SmartShape
import "../common/common";

entry SmartShape:
  NEWLINE*
  SMARTSHAPE_KEYWORD
  (
    TitleAndAccessibilities
    | 'type' ':' shapeType=SHAPE_TYPE
    | 'direction' ':' direction=DIRECTION
    | rows+=SmartShapeRow
    | NEWLINE
  )*
;

SmartShapeRow:
  indent=INDENTATION? (item=SmartShapeItem | classDef=ClassDef)
;

ClassDef returns string:
  CLASS_DEF
;

SmartShapeItem:
  text=ITEM_TEXT (STYLE_SEPARATOR classSelector=CLASS_ID)?
;

terminal SMARTSHAPE_KEYWORD: 'smartshape';
terminal SHAPE_TYPE: 'list' | 'process' | 'cycle' | 'hierarchy' | 'relationship' | 'matrix' | 'pyramid';
terminal DIRECTION: 'TB' | 'LR' | 'BT' | 'RL';

terminal CLASS_DEF: /classDef\s+([a-zA-Z_][a-zA-Z0-9_]+)(?:\s+([^;\r\n]*))?(?:;)?/;
terminal STYLE_SEPARATOR: ':::';
terminal CLASS_ID: /[a-zA-Z_][a-zA-Z0-9_]*/;

// Item text: quoted strings only
terminal ITEM_TEXT: /"[^"\r\n]*"|'[^'\r\n]*'/;

// Indentation handling - must be declared before hidden WS
terminal INDENTATION: /[\t ]{1,}(?=["'])/;

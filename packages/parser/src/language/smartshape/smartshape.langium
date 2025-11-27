/**
 * SmartShape grammar for Langium
 * Supports PowerPoint SmartArt-like list diagrams
 *
 * Uses ITEM_LINE to capture entire lines with indentation.
 * The value converter extracts indent and text.
 */
grammar SmartShape

fragment TitleAndAccessibilities:
  ((accDescr=ACC_DESCR | accTitle=ACC_TITLE | title=TITLE))+
;

terminal ACC_DESCR: /[\t ]*accDescr(?:[\t ]*:([^\n\r]*?(?=%%)|[^\n\r]*)|\s*{([^}]*)})/;
terminal ACC_TITLE: /[\t ]*accTitle[\t ]*:(?:[^\n\r]*?(?=%%)|[^\n\r]*)/;
terminal TITLE: /[\t ]*title(?:[\t ][^\n\r]*?(?=%%)|[\t ][^\n\r]*|)/;

entry SmartShape:
  SMARTSHAPE_KEYWORD
  (
    TitleAndAccessibilities
    | TYPE_DECL shapeType=SHAPE_TYPE
    | DIRECTION_DECL direction=DIRECTION
    | rows+=SmartShapeRow
  )*
;

SmartShapeRow:
  line=ITEM_LINE
;

// Terminal definitions - order matters for Chevrotain
terminal SMARTSHAPE_KEYWORD: /smartshape/;
terminal TYPE_DECL: /type[\t ]*:[\t ]*/;
terminal DIRECTION_DECL: /direction[\t ]*:[\t ]*/;
terminal SHAPE_TYPE: /list-[a-z]+/;
terminal DIRECTION: /TB|LR|BT|RL/;

// ITEM_LINE captures an entire line with optional leading whitespace and quoted text
// Pattern: optional whitespace, then quoted string (double or single quotes)
terminal ITEM_LINE: /[ \t]*(?:"[^"]*"|'[^']*')/;

// Note: We intentionally don't use hidden WS because we need to capture leading whitespace
// for indentation. Whitespace between tokens is handled explicitly in patterns.
hidden terminal ML_COMMENT: /%%[^\n]*/;
hidden terminal NL: /\r?\n/;

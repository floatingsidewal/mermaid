grammar FunnelFlow
import "../common/common"

entry FunnelFlow:
  NEWLINE*
  "funnelFlow" showData?="showData"? trueScale?="trueScale"?
  (
    TitleAndAccessibilities
    | chains+=StageChain
    | notes+=NoteStatement
    | styles+=StyleStatement
    | NEWLINE
  )*
;

// Arrow chain: stage1[100] --> stage2[50] --> stage3[25]
StageChain:
  stages+=Stage (FF_ARROW stages+=Stage)* EOL
;

// Stage with optional label: id[value] or id["Label": value]
Stage:
  id=ID FF_OPEN (label=STRING FF_COLON)? value=FF_NUMBER FF_CLOSE
;

// Note by ID: note stage1 "Description"
NoteStatement:
  "note" stageId=ID text=STRING EOL
;

// Style by ID: style stage1 color: "#fff", number: "A"
StyleStatement:
  "style" stageId=ID properties+=StyleProperty (FF_COMMA properties+=StyleProperty)* EOL
;

StyleProperty:
  key=("color" | "number") FF_COLON value=STRING
;

// FunnelFlow-specific terminals (that don't conflict with common terminals)
terminal FF_NUMBER returns number: /[0-9]+(\.[0-9]+)?/;
terminal FF_ARROW: /-->/;
terminal FF_OPEN: /\[/;
terminal FF_CLOSE: /\]/;
terminal FF_COLON: /:/;
terminal FF_COMMA: /,/;

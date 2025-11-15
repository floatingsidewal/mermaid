grammar Funnel
import "../common/common";

entry Funnel:
  NEWLINE*
  "funnel" showData?="showData"?
  (
    TitleAndAccessibilities
    | stageName=StageName
    | sections+=FunnelSection
    | NEWLINE
  )*
;

StageName:
  "stageName" name=STRING
;

FunnelSection:
  label=STRING ":" value=NUMBER_FUNNEL
  (NEWLINE+ descriptionLines+=DescriptionLine)*
  (NEWLINE+ metadata+=SectionMetadata)*
  EOL
;

DescriptionLine:
  "desc" text=STRING
;

SectionMetadata:
  FunnelColor | FunnelCustomNumber
;

FunnelColor:
  "[" "color" ":" colorValue=STRING "]"
;

FunnelCustomNumber:
  "[" "number" ":" numberValue=STRING "]"
;

terminal FLOAT_FUNNEL returns number: /-?[0-9]+\.[0-9]+(?!\.)/;
terminal INT_FUNNEL returns number: /-?(0|[1-9][0-9]*)(?!\.)/;
terminal NUMBER_FUNNEL returns number: FLOAT_FUNNEL | INT_FUNNEL;

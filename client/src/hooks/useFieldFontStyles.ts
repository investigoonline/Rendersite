import type { CSSProperties } from "react";

export interface FieldFontStyle {
  fontSize?: string;
  fontFamily?: string;
  fontWeight?: string;
}

export function getFieldFontStyle(
  content: any,
  fieldName: string
): CSSProperties {
  if (!content || !content._fontStyles || !content._fontStyles[fieldName]) {
    return {};
  }
  const style = content._fontStyles[fieldName] as FieldFontStyle;
  const css: CSSProperties = {};
  if (style.fontSize) {
    css.fontSize = `${style.fontSize}px`;
  }
  if (style.fontFamily) {
    css.fontFamily = style.fontFamily;
  }
  if (style.fontWeight) {
    css.fontWeight = style.fontWeight as any;
  }
  return css;
}

export function mergeFieldFontStyle(
  baseStyle: CSSProperties | undefined,
  content: any,
  fieldName: string
): CSSProperties {
  const fieldStyle = getFieldFontStyle(content, fieldName);
  return { ...(baseStyle || {}), ...fieldStyle };
}

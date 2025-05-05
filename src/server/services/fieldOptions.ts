import type { Prisma } from "@prisma/client";

export type FieldType = 
  | "SINGLE_LINE_TEXT"
  | "MULTI_LINE_TEXT"
  | "NUMBER"

export const defaultFieldOptions: Record<FieldType, Prisma.InputJsonValue> = {
  SINGLE_LINE_TEXT: { maxLength: 255 },
  MULTI_LINE_TEXT:  { maxLength: 2000 },
  NUMBER:           { min: 0, max: 1000, precision: 2 },
};

const fieldTypes: FieldType[] = [
  "SINGLE_LINE_TEXT",
  "MULTI_LINE_TEXT",
  "NUMBER",
];

export function numToType(num: number): FieldType {
  // Ensure index wraps around
  const index = ((num % fieldTypes.length) + fieldTypes.length) % fieldTypes.length;
  return fieldTypes[index]!;
}

export function getDefaultOptions(
  type: FieldType,
): Prisma.InputJsonValue {
  const base = defaultFieldOptions[type] || {};
  return base;
}
  
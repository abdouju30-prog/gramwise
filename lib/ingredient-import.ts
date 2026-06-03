import {
  type IngredientQuantityUnit,
  normalizeIngredientUnit,
} from "@/lib/ingredient-units";

export type ParsedIngredientLine = {
  name: string;
  quantity: string;
  quantityUnit: IngredientQuantityUnit;
  costPerUnit: string;
};

const QTY_UNIT_RE =
  /(\d+(?:[.,]\d+)?)\s*(kg|g|l|L|ml|mL|unités?|units?|pièces?|pieces?|pcs?|u)\b/i;

const LEADING_QTY_RE =
  /^(\d+(?:[.,]\d+)?)\s*(kg|g|l|L|ml|mL|unités?|units?|pièces?|pieces?|pcs?|u)?\s+(.+)$/i;

function normalizeDecimal(value: string): string {
  return value.replace(",", ".").trim();
}

function parseCostToken(token: string): string | null {
  const cleaned = token
    .replace(/[^\d.,]/g, "")
    .replace(/,/g, ".");
  const n = Number.parseFloat(cleaned);
  if (!Number.isFinite(n) || n < 0) return null;
  return String(n);
}

function splitLine(line: string): string[] {
  if (line.includes("\t")) return line.split("\t").map((p) => p.trim());
  if (line.includes(";")) return line.split(";").map((p) => p.trim());
  if (line.includes("|")) return line.split("|").map((p) => p.trim());
  const commaParts = line.split(",").map((p) => p.trim());
  if (commaParts.length >= 3) return commaParts;
  return line.split(/\s{2,}|\s+/).filter(Boolean);
}

function parseStructuredParts(parts: string[]): ParsedIngredientLine | null {
  if (parts.length < 2) return null;

  let name = "";
  let quantity = "";
  let quantityUnit: IngredientQuantityUnit = "kg";
  let costPerUnit = "";

  if (parts.length >= 4) {
    name = parts[0] ?? "";
    quantity = normalizeDecimal(parts[1] ?? "");
    const unit = normalizeIngredientUnit(parts[2]);
    if (unit) quantityUnit = unit;
    costPerUnit = parseCostToken(parts[3] ?? "") ?? "";
  } else if (parts.length === 3) {
    const midUnit = normalizeIngredientUnit(parts[1]);
    if (midUnit) {
      quantity = normalizeDecimal(parts[0] ?? "");
      quantityUnit = midUnit;
      const cost = parseCostToken(parts[2] ?? "");
      if (cost !== null && /^\d/.test(parts[2] ?? "")) {
        costPerUnit = cost;
        name = "";
      } else {
        name = parts[2] ?? "";
      }
    } else {
      name = parts[0] ?? "";
      const embedded = QTY_UNIT_RE.exec(parts[1] ?? "");
      if (embedded) {
        quantity = normalizeDecimal(embedded[1] ?? "");
        const unit = normalizeIngredientUnit(embedded[2]);
        if (unit) quantityUnit = unit;
      } else {
        quantity = normalizeDecimal(parts[1] ?? "");
      }
      costPerUnit = parseCostToken(parts[2] ?? "") ?? "";
    }
  } else {
    const embedded = QTY_UNIT_RE.exec(parts.join(" "));
    if (!embedded) return null;
    quantity = normalizeDecimal(embedded[1] ?? "");
    const unit = normalizeIngredientUnit(embedded[2]);
    if (unit) quantityUnit = unit;
    name = parts[0]?.replace(embedded[0], "").trim() ?? parts[1]?.trim() ?? "";
    if (!name && parts[1]) {
      const lead = LEADING_QTY_RE.exec(parts.join(" "));
      if (lead) name = lead[3]?.trim() ?? "";
    }
  }

  name = name.replace(/^[-–•*]\s*/, "").trim();
  if (!name) return null;
  if (!quantity) return null;

  return { name, quantity, quantityUnit, costPerUnit };
}

function parseFreeformLine(line: string): ParsedIngredientLine | null {
  const trimmed = line.trim();
  if (!trimmed || /^#/.test(trimmed)) return null;

  const lead = LEADING_QTY_RE.exec(trimmed);
  if (lead) {
    const quantity = normalizeDecimal(lead[1] ?? "");
    const quantityUnit =
      normalizeIngredientUnit(lead[2]) ?? ("kg" as IngredientQuantityUnit);
    let rest = lead[3]?.trim() ?? "";
    let costPerUnit = "";
    const costMatch = rest.match(
      /(?:@|à|a|cost|coût|cout|prix)?\s*(\d+(?:[.,]\d+)?)\s*(?:mad|dh|€|eur)?\s*(?:\/|par)?\s*(kg|g|l|L|ml|u)?/i,
    );
    if (costMatch) {
      costPerUnit = parseCostToken(costMatch[1] ?? "") ?? "";
      rest = rest.replace(costMatch[0], "").trim();
    }
    const name = rest.replace(/[,:;–-]\s*$/, "").trim();
    if (name && quantity) {
      return { name, quantity, quantityUnit, costPerUnit };
    }
  }

  const structured = splitLine(trimmed);
  if (structured.length >= 3) {
    const fromParts = parseStructuredParts(structured);
    if (fromParts) return fromParts;
  }

  const embedded = QTY_UNIT_RE.exec(trimmed);
  if (!embedded) return null;

  const quantity = normalizeDecimal(embedded[1] ?? "");
  const quantityUnit =
    normalizeIngredientUnit(embedded[2]) ?? ("kg" as IngredientQuantityUnit);
  const before = trimmed.slice(0, embedded.index).trim();
  const after = trimmed.slice((embedded.index ?? 0) + embedded[0].length).trim();

  let name = before.length >= 2 ? before : after;
  let costPerUnit = "";
  const costInAfter = after.match(
    /(\d+(?:[.,]\d+)?)\s*(?:mad|dh|€|eur)?(?:\s*\/\s*\w+)?/i,
  );
  if (costInAfter && before.length >= 2) {
    costPerUnit = parseCostToken(costInAfter[1] ?? "") ?? "";
    name = before;
  } else if (costInAfter && !before.length) {
    costPerUnit = parseCostToken(costInAfter[1] ?? "") ?? "";
    name = after.replace(costInAfter[0], "").trim();
  }

  name = name.replace(/^[-–•*]\s*/, "").replace(/[,:;]\s*$/, "").trim();
  if (!name) return null;

  return { name, quantity, quantityUnit, costPerUnit };
}

/** Parse pasted text, CSV lines, or OCR output into ingredient rows. */
export function parseIngredientText(text: string): ParsedIngredientLine[] {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const out: ParsedIngredientLine[] = [];
  for (const line of lines) {
    const parsed = parseFreeformLine(line);
    if (parsed) out.push(parsed);
  }
  return out;
}

export async function readIngredientFile(file: File): Promise<string> {
  const isText =
    file.type.startsWith("text/") ||
    /\.(txt|csv|tsv|md)$/i.test(file.name);
  if (isText) return file.text();
  if (file.type.startsWith("image/")) {
    throw new Error("IMAGE_NEEDS_OCR");
  }
  throw new Error("UNSUPPORTED_FILE");
}

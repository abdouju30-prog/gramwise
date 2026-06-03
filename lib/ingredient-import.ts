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

const QTY_UNIT_ONCE =
  /(\d+(?:[.,]\d+)?)\s*(kg|g|l|L|ml|mL|unités?|units?|pièces?|pieces?|pcs?|u)\b/i;

const LEADING_QTY_RE =
  /^(\d+(?:[.,]\d+)?)\s*(kg|g|l|L|ml|mL|unités?|units?|pièces?|pieces?|pcs?|u)?\s+(.+)$/i;

const NAME_QTY_RE =
  /([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ0-9\s'’./-]{1,36}?)\s+(\d+(?:[.,]\d+)?)\s*(kg|g|l|L|ml|mL|unités?|units?|pièces?|pieces?|pcs?|u)?/gi;

const NOISE_RE =
  /ingrédients?|ingredients?|quantités?|quantites?|quantities?|quantité|qty|qté|qte|noms?|names?|coûts?|couts?|costs?|coût|cout|cost|unités?|unites?|units?|unité|unite|unit|montant|total|prix|dh|mad/gi;

function normalizeDecimal(value: string): string {
  return value.replace(",", ".").trim();
}

function parseCostToken(token: string): string | null {
  const cleaned = token.replace(/[^\d.,]/g, "").replace(/,/g, ".");
  const n = Number.parseFloat(cleaned);
  if (!Number.isFinite(n) || n < 0) return null;
  return String(n);
}

function cleanIngredientName(raw: string): string {
  let s = raw.replace(NOISE_RE, " ").replace(/\s+/g, " ").trim();
  s = s.replace(/([a-zà-ÿ])([A-ZÀ-Ÿ])/g, "$1 $2");
  const tokens = s
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 1 && !NOISE_RE.test(t));
  if (!tokens.length) return s.slice(0, 40);
  if (tokens.length === 1) return tokens[0] ?? s;
  const joined = tokens.join(" ");
  if (joined.length <= 40) return joined;
  return tokens[tokens.length - 1] ?? joined.slice(0, 40);
}

function isPlausibleName(name: string): boolean {
  if (!name || name.length < 2 || name.length > 48) return false;
  if (/^[\d.,\s%]+$/.test(name)) return false;
  if (NOISE_RE.test(name) && name.replace(NOISE_RE, "").trim().length < 2)
    return false;
  const letters = name.match(/[a-zA-ZÀ-ÿ]/g)?.length ?? 0;
  return letters >= 2;
}

function splitLine(line: string): string[] {
  if (line.includes("\t")) return line.split("\t").map((p) => p.trim());
  if (line.includes(";")) return line.split(";").map((p) => p.trim());
  if (line.includes("|")) return line.split("|").map((p) => p.trim());
  const commaParts = line.split(",").map((p) => p.trim());
  if (commaParts.length >= 3) return commaParts;
  return line.split(/\s{2,}|\s+/).filter(Boolean);
}

function finalizeRow(
  partial: Omit<ParsedIngredientLine, "name"> & { name: string },
): ParsedIngredientLine | null {
  const name = cleanIngredientName(partial.name);
  if (!isPlausibleName(name)) return null;
  if (!partial.quantity) return null;
  return { ...partial, name };
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
      const embedded = QTY_UNIT_ONCE.exec(parts[1] ?? "");
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
    const embedded = QTY_UNIT_ONCE.exec(parts.join(" "));
    if (!embedded) return null;
    quantity = normalizeDecimal(embedded[1] ?? "");
    const unit = normalizeIngredientUnit(embedded[2]);
    if (unit) quantityUnit = unit;
    name = parts[0]?.replace(embedded[0], "").trim() ?? parts[1]?.trim() ?? "";
  }

  return finalizeRow({
    name: name.replace(/^[-–•*]\s*/, "").trim(),
    quantity,
    quantityUnit,
    costPerUnit,
  });
}

function parseNameQtySegments(line: string): ParsedIngredientLine[] {
  const rows: ParsedIngredientLine[] = [];
  NAME_QTY_RE.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = NAME_QTY_RE.exec(line)) !== null) {
    const tail = line.slice(match.index + match[0].length);
    const trailingCost = parseCostToken(
      tail.match(/^\s*[,:;]?\s*(\d+(?:[.,]\d+)?)/)?.[1] ?? "",
    );
    const row = finalizeRow({
      name: match[1] ?? "",
      quantity: normalizeDecimal(match[2] ?? ""),
      quantityUnit:
        normalizeIngredientUnit(match[3]) ?? ("kg" as IngredientQuantityUnit),
      costPerUnit: trailingCost ?? "",
    });
    if (row) rows.push(row);
  }
  return rows;
}

function parseFreeformLine(line: string): ParsedIngredientLine[] {
  const trimmed = line.trim();
  if (!trimmed || /^#/.test(trimmed)) return [];

  const multi = parseNameQtySegments(trimmed);
  if (multi.length > 0) return multi;

  const lead = LEADING_QTY_RE.exec(trimmed);
  if (lead) {
    const quantity = normalizeDecimal(lead[1] ?? "");
    const quantityUnit =
      normalizeIngredientUnit(lead[2]) ?? ("kg" as IngredientQuantityUnit);
    let rest = lead[3]?.trim() ?? "";
    let costPerUnit = "";
    const costMatch = rest.match(
      /(?:@|à|a|cost|coût|cout|prix)?\s*(\d+(?:[.,]\d+)?)\s*(?:mad|dh|€|eur)?/i,
    );
    if (costMatch) {
      costPerUnit = parseCostToken(costMatch[1] ?? "") ?? "";
      rest = rest.replace(costMatch[0], "").trim();
    }
    const row = finalizeRow({
      name: rest.replace(/[,:;–-]\s*$/, "").trim(),
      quantity,
      quantityUnit,
      costPerUnit,
    });
    return row ? [row] : [];
  }

  const structured = splitLine(trimmed);
  if (structured.length >= 3) {
    const fromParts = parseStructuredParts(structured);
    if (fromParts) return [fromParts];
  }

  const embedded = QTY_UNIT_ONCE.exec(trimmed);
  if (!embedded) return [];

  const quantity = normalizeDecimal(embedded[1] ?? "");
  const quantityUnit =
    normalizeIngredientUnit(embedded[2]) ?? ("kg" as IngredientQuantityUnit);
  const before = trimmed.slice(0, embedded.index).trim();
  const after = trimmed.slice((embedded.index ?? 0) + embedded[0].length).trim();

  let name = before.length >= 2 ? before : after;
  let costPerUnit = "";
  const costInAfter = after.match(/(\d+(?:[.,]\d+)?)/);
  if (costInAfter && before.length >= 2) {
    costPerUnit = parseCostToken(costInAfter[1] ?? "") ?? "";
    name = before;
  } else if (costInAfter) {
    costPerUnit = parseCostToken(costInAfter[1] ?? "") ?? "";
    name = after.replace(costInAfter[0], "").trim();
  }

  const row = finalizeRow({
    name: name.replace(/^[-–•*]\s*/, "").replace(/[,:;]\s*$/, "").trim(),
    quantity,
    quantityUnit,
    costPerUnit,
  });
  return row ? [row] : [];
}

function preprocessText(text: string): string[] {
  const normalized = text
    .replace(/\r\n/g, "\n")
    .replace(/([a-zà-ÿ])([A-ZÀ-Ÿ])/g, "$1 $2")
    .replace(NOISE_RE, " ")
    .replace(/[•·▪]/g, "\n");

  const lines = normalized
    .split(/\n+/)
    .flatMap((line) => {
      const trimmed = line.trim();
      if (!trimmed) return [];
      if (trimmed.length > 120 && NAME_QTY_RE.test(trimmed)) {
        return parseNameQtySegments(trimmed).map(
          (r) =>
            `${r.name} ${r.quantity} ${r.quantityUnit}${r.costPerUnit ? ` ${r.costPerUnit}` : ""}`,
        );
      }
      return [trimmed];
    })
    .filter((l) => l.length > 0);

  return lines;
}

function dedupeRows(rows: ParsedIngredientLine[]): ParsedIngredientLine[] {
  const seen = new Set<string>();
  const out: ParsedIngredientLine[] = [];
  for (const row of rows) {
    const key = `${row.name.toLowerCase()}|${row.quantity}|${row.quantityUnit}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(row);
  }
  return out;
}

/** Parse pasted text, CSV lines, or OCR output into ingredient rows. */
export function parseIngredientText(text: string): ParsedIngredientLine[] {
  const lines = preprocessText(text);
  const out: ParsedIngredientLine[] = [];
  for (const line of lines) {
    out.push(...parseFreeformLine(line));
  }
  return dedupeRows(out);
}

export async function readIngredientFile(file: File): Promise<string> {
  const isText =
    file.type.startsWith("text/") ||
    /\.(txt|csv|tsv|md|json)$/i.test(file.name);
  if (isText) return file.text();
  if (file.type.startsWith("image/")) {
    throw new Error("IMAGE_NEEDS_OCR");
  }
  throw new Error("UNSUPPORTED_FILE");
}

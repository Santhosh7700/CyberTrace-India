import type {
  SyntheticReport,
  IndicatorType,
  MatchedIndicator,
  FraudPattern,
  IntelligenceSummary,
  NetworkGraphData,
  GraphNode,
  GraphEdge,
} from '../types/intelligence';
import type { ScamCategory } from '../types/dashboard';

/**
 * Normalization utilities for fair comparison across unstructured inputs.
 */
export function normalizeIndicator(raw: string, type: IndicatorType): string {
  if (!raw) return '';
  const val = raw.trim();

  switch (type) {
    case 'upi':
      // UPI IDs are case-insensitive and whitespace-free
      return val.toLowerCase().replace(/\s+/g, '');

    case 'phone': {
      // Extract numeric digits, strip leading +91 or 0 for standard 10-digit Indian mobile
      const digits = val.replace(/\D/g, '');
      if (digits.length === 12 && digits.startsWith('91')) {
        return digits.slice(2);
      }
      if (digits.length === 11 && digits.startsWith('0')) {
        return digits.slice(1);
      }
      return digits;
    }

    case 'email':
      return val.toLowerCase().trim();

    case 'url': {
      try {
        let urlStr = val.toLowerCase().trim();
        if (!urlStr.startsWith('http://') && !urlStr.startsWith('https://')) {
          urlStr = 'https://' + urlStr;
        }
        const parsed = new URL(urlStr);
        // Normalize hostname and strip query params/trailing slashes for domain/host comparison
        return parsed.hostname.replace(/^www\./, '');
      } catch {
        return val.toLowerCase().trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
      }
    }
  }
}

/**
 * Mask sensitive values for privacy-respecting investigator view.
 */
export function maskIndicator(raw: string, type: IndicatorType): string {
  if (!raw) return '';
  const val = raw.trim();

  switch (type) {
    case 'upi': {
      const [user, handle] = val.split('@');
      if (!handle) return val;
      if (user.length <= 3) return `${user.slice(0, 1)}***@${handle}`;
      return `${user.slice(0, 3)}***${user.slice(-2)}@${handle}`;
    }

    case 'phone': {
      const digits = val.replace(/\D/g, '');
      if (digits.length >= 10) {
        return `+91 ${digits.slice(-10, -6)}X-XXXX-${digits.slice(-2)}`;
      }
      return val.slice(0, 3) + '****' + val.slice(-2);
    }

    case 'email': {
      const parts = val.split('@');
      if (parts.length !== 2) return val;
      const [u, d] = parts;
      const maskedUser = u.length > 2 ? `${u[0]}***${u[u.length - 1]}` : `${u[0]}*`;
      return `${maskedUser}@${d}`;
    }

    case 'url':
      return val;
  }
}

/**
 * Extracts all indicators from a single synthetic or citizen report.
 * Supports both structured suspectIdentifiers[] array and legacy fallback fields.
 */
function extractIndicatorsFromReport(report: SyntheticReport): { type: IndicatorType; raw: string; normalized: string }[] {
  const result: { type: IndicatorType; raw: string; normalized: string }[] = [];
  const seenKeys = new Set<string>();

  // 1. Process structured suspectIdentifiers array if available
  if (report.suspectIdentifiers && Array.isArray(report.suspectIdentifiers)) {
    report.suspectIdentifiers.forEach((ident) => {
      if (!ident.value || !ident.value.trim()) return;
      const normalized = ident.normalized || normalizeIndicator(ident.value, ident.type);
      const key = `${ident.type}:${normalized}`;
      if (!seenKeys.has(key)) {
        seenKeys.add(key);
        result.push({
          type: ident.type,
          raw: ident.value,
          normalized,
        });
      }
    });
  }

  // 2. Fallbacks for legacy/individual fields
  if (report.suspectUpi) {
    const normalized = normalizeIndicator(report.suspectUpi, 'upi');
    const key = `upi:${normalized}`;
    if (!seenKeys.has(key)) {
      seenKeys.add(key);
      result.push({ type: 'upi', raw: report.suspectUpi, normalized });
    }
  }
  if (report.suspectPhone) {
    const normalized = normalizeIndicator(report.suspectPhone, 'phone');
    const key = `phone:${normalized}`;
    if (!seenKeys.has(key)) {
      seenKeys.add(key);
      result.push({ type: 'phone', raw: report.suspectPhone, normalized });
    }
  }
  if (report.suspectEmail) {
    const normalized = normalizeIndicator(report.suspectEmail, 'email');
    const key = `email:${normalized}`;
    if (!seenKeys.has(key)) {
      seenKeys.add(key);
      result.push({ type: 'email', raw: report.suspectEmail, normalized });
    }
  }
  if (report.suspectUrl) {
    const normalized = normalizeIndicator(report.suspectUrl, 'url');
    const key = `url:${normalized}`;
    if (!seenKeys.has(key)) {
      seenKeys.add(key);
      result.push({ type: 'url', raw: report.suspectUrl, normalized });
    }
  }

  return result;
}

/**
 * Core Matching Engine:
 * Compares reports and identifies exact repeated indicators across reports.
 */
export function analyzeReports(reports: SyntheticReport[]): {
  matchedIndicators: MatchedIndicator[];
  patterns: FraudPattern[];
  summary: IntelligenceSummary;
} {
  // Map key: `${type}:${normalizedValue}`
  const indicatorMap = new Map<
    string,
    {
      type: IndicatorType;
      normalized: string;
      rawSamples: Set<string>;
      reports: SyntheticReport[];
    }
  >();

  // 1. Group reports by each normalized indicator
  reports.forEach((rep) => {
    const extracted = extractIndicatorsFromReport(rep);
    extracted.forEach(({ type, raw, normalized }) => {
      if (!normalized) return;
      const key = `${type}:${normalized}`;
      if (!indicatorMap.has(key)) {
        indicatorMap.set(key, {
          type,
          normalized,
          rawSamples: new Set(),
          reports: [],
        });
      }
      const entry = indicatorMap.get(key)!;
      entry.rawSamples.add(raw);
      if (!entry.reports.some((r) => r.id === rep.id)) {
        entry.reports.push(rep);
      }
    });
  });

  // 2. Build MatchedIndicators
  const matchedIndicators: MatchedIndicator[] = [];

  indicatorMap.forEach((entry) => {
    const count = entry.reports.length;
    const sortedDates = entry.reports.map((r) => r.reportedDate).sort();
    const categories = Array.from(new Set(entry.reports.map((r) => r.category)));
    const sampleRaw = Array.from(entry.rawSamples)[0];

    const status: 'High Match' | 'Medium Match' | 'Isolated' =
      count >= 4 ? 'High Match' : count >= 2 ? 'Medium Match' : 'Isolated';

    matchedIndicators.push({
      type: entry.type,
      value: entry.normalized,
      displayValue: sampleRaw,
      count,
      reportIds: entry.reports.map((r) => r.id),
      reportRefs: entry.reports.map((r) => r.referenceId),
      categories,
      firstReportedDate: sortedDates[0],
      lastReportedDate: sortedDates[sortedDates.length - 1],
      status,
    });
  });

  // Sort matched indicators by frequency descending
  matchedIndicators.sort((a, b) => b.count - a.count);

  // 3. Generate Fraud Patterns for indicators with count >= 2
  const patterns: FraudPattern[] = matchedIndicators
    .filter((ind) => ind.count >= 2)
    .map((ind, index) => {
      const associatedReports = reports.filter((r) => ind.reportIds.includes(r.id));
      const totalFinancialLoss = associatedReports.reduce((sum, r) => sum + r.amountLost, 0);

      const typeLabel =
        ind.type === 'upi'
          ? 'UPI Identifier'
          : ind.type === 'phone'
          ? 'Phone Number'
          : ind.type === 'url'
          ? 'Suspicious Domain'
          : 'Email Address';

      const riskScore: 'High' | 'Medium' | 'Low' =
        ind.count >= 4 || totalFinancialLoss > 100000 ? 'High' : ind.count >= 3 ? 'Medium' : 'Low';

      return {
        id: `pattern-${index + 1}`,
        title: `Repeated ${typeLabel} Syndicate (${ind.displayValue})`,
        type: ind.type,
        indicatorValue: ind.displayValue,
        connectedReportsCount: ind.count,
        reportRefs: ind.reportRefs,
        categories: ind.categories,
        totalFinancialLoss,
        firstReportedDate: ind.firstReportedDate,
        lastReportedDate: ind.lastReportedDate,
        summary: `${ind.count} independent victim reports reference the identical ${typeLabel}. Cross-referencing reveals incidents spanning ${ind.categories.join(
          ', '
        )} with an aggregated loss of ₹${totalFinancialLoss.toLocaleString('en-IN')}.`,
        riskScore,
      };
    });

  // 4. Calculate Summary Statistics
  const uniqueUpis = matchedIndicators.filter((i) => i.type === 'upi').length;
  const repeatedPhones = matchedIndicators.filter((i) => i.type === 'phone' && i.count >= 2).length;
  const suspiciousUrls = matchedIndicators.filter((i) => i.type === 'url').length;

  const summary: IntelligenceSummary = {
    totalReports: reports.length,
    uniqueUpis,
    repeatedPhones,
    suspiciousUrls,
    patternsCount: patterns.length,
    requiresReviewCount: patterns.filter((p) => p.riskScore === 'High' || p.riskScore === 'Medium').length,
  };

  return {
    matchedIndicators,
    patterns,
    summary,
  };
}

/**
 * Graph Generator:
 * Deterministic layered / bipartite layout with complete Category support.
 * Prevents node overlaps and unreadable label collisions.
 */
export function buildNetworkGraph(
  reports: SyntheticReport[],
  matchedIndicators: MatchedIndicator[],
  filterType: 'all' | IndicatorType | 'category' = 'all'
): NetworkGraphData {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];

  // -------------------------------------------------------------
  // MODE 1: CATEGORY CLASSIFICATION GRAPH
  // -------------------------------------------------------------
  if (filterType === 'category') {
    // Unique categories present in reports
    const categoryMap = new Map<string, SyntheticReport[]>();
    reports.forEach((rep) => {
      if (!categoryMap.has(rep.category)) {
        categoryMap.set(rep.category, []);
      }
      categoryMap.get(rep.category)!.push(rep);
    });

    const categories = Array.from(categoryMap.keys());
    const totalReports = reports.length;

    // Center Category nodes on Left Layer (X = 260)
    // Distributed cleanly along Y
    const categoryPositions = new Map<string, { x: number; y: number }>();
    const startY = 80;
    const catSpacing = 480 / Math.max(categories.length - 1, 1);

    categories.forEach((cat, index) => {
      const catReports = categoryMap.get(cat)!;
      const count = catReports.length;
      const percentage = Math.round((count / totalReports) * 100);
      const totalAmount = catReports.reduce((s, r) => s + r.amountLost, 0);
      const associatedRefs = catReports.map((r) => r.referenceId);
      const associatedDates = Array.from(new Set(catReports.map((r) => r.reportedDate))).sort();

      const x = 240;
      const y = startY + index * catSpacing;
      categoryPositions.set(cat, { x, y });

      nodes.push({
        id: `cat-${cat}`,
        label: cat,
        type: 'category',
        data: {
          category: cat as ScamCategory,
          connectedCount: count,
          percentage,
          totalAmount,
          associatedRefs,
          associatedDates,
          rawVal: cat,
        },
        x,
        y,
      });
    });

    // Right Layer: Reports (X = 660), sorted by category so edges don't cross
    let reportY = 60;
    const repSpacing = 520 / Math.max(reports.length - 1, 1);

    categories.forEach((cat) => {
      const catReports = categoryMap.get(cat)!;
      catReports.forEach((rep) => {
        const x = 660;
        const y = reportY;
        reportY += repSpacing;

        nodes.push({
          id: `rep-${rep.id}`,
          label: rep.referenceId,
          type: 'report',
          data: {
            category: rep.category,
            amount: rep.amountLost,
            reportRef: rep.referenceId,
            date: rep.reportedDate,
            associatedSuspects: {
              upi: rep.suspectIdentifiers?.filter((i) => i.type === 'upi').map((i) => i.value) || (rep.suspectUpi ? [rep.suspectUpi] : []),
              phone: rep.suspectIdentifiers?.filter((i) => i.type === 'phone').map((i) => i.value) || (rep.suspectPhone ? [rep.suspectPhone] : []),
              email: rep.suspectIdentifiers?.filter((i) => i.type === 'email').map((i) => i.value) || (rep.suspectEmail ? [rep.suspectEmail] : []),
              url: rep.suspectIdentifiers?.filter((i) => i.type === 'url').map((i) => i.value) || (rep.suspectUrl ? [rep.suspectUrl] : []),
            },
          },
          x,
          y,
        });

        // Edge connecting Report to its Category node
        edges.push({
          id: `edge-cat-${cat}-${rep.id}`,
          source: `rep-${rep.id}`,
          target: `cat-${cat}`,
          type: 'category',
        });
      });
    });

    return { nodes, edges };
  }

  // -------------------------------------------------------------
  // MODE 2: IDENTIFIER-BASED RELATIONSHIP GRAPH
  // (ALL LINKS, UPI, PHONE, URL, EMAIL)
  // Structured Bipartite / Layered Layout to guarantee no overlaps:
  // Left Column (X = 260): Shared Indicator Nodes
  // Right Column (X = 680): Connected Victim Report Nodes
  // -------------------------------------------------------------
  const relevantIndicators = matchedIndicators.filter((ind) => {
    if (filterType !== 'all' && ind.type !== filterType) return false;
    // Show indicators that connect multiple reports OR when filtering specifically
    return ind.count >= 2;
  });

  // Extract set of reports attached to these indicators
  const activeReportIds = new Set<string>();
  relevantIndicators.forEach((ind) => {
    ind.reportIds.forEach((id) => activeReportIds.add(id));
  });

  const activeReports = reports.filter((r) => activeReportIds.has(r.id));

  // 1. Layout Indicator Nodes on Left Column
  const indCount = relevantIndicators.length;
  const indSpacing = 480 / Math.max(indCount, 1);

  relevantIndicators.forEach((ind, i) => {
    const x = 240;
    const y = 80 + i * indSpacing + (indSpacing / 2);

    nodes.push({
      id: `ind-${ind.type}-${ind.value}`,
      label: ind.displayValue,
      type: ind.type,
      data: {
        connectedCount: ind.count,
        rawVal: ind.displayValue,
        category: ind.categories[0],
        associatedRefs: ind.reportRefs,
        associatedDates: [ind.firstReportedDate, ind.lastReportedDate],
      },
      x,
      y,
    });
  });

  // 2. Layout Report Nodes on Right Column
  const repCount = activeReports.length;
  const repSpacing = 500 / Math.max(repCount, 1);

  activeReports.forEach((rep, j) => {
    const x = 680;
    const y = 60 + j * repSpacing + (repSpacing / 2);

    nodes.push({
      id: `rep-${rep.id}`,
      label: rep.referenceId,
      type: 'report',
      data: {
        category: rep.category,
        amount: rep.amountLost,
        reportRef: rep.referenceId,
        date: rep.reportedDate,
        associatedSuspects: {
          upi: rep.suspectIdentifiers?.filter((i) => i.type === 'upi').map((i) => i.value) || (rep.suspectUpi ? [rep.suspectUpi] : []),
          phone: rep.suspectIdentifiers?.filter((i) => i.type === 'phone').map((i) => i.value) || (rep.suspectPhone ? [rep.suspectPhone] : []),
          email: rep.suspectIdentifiers?.filter((i) => i.type === 'email').map((i) => i.value) || (rep.suspectEmail ? [rep.suspectEmail] : []),
          url: rep.suspectIdentifiers?.filter((i) => i.type === 'url').map((i) => i.value) || (rep.suspectUrl ? [rep.suspectUrl] : []),
        },
      },
      x,
      y,
    });
  });

  // 3. Connect Edges between Report and Indicator
  relevantIndicators.forEach((ind) => {
    const indNodeId = `ind-${ind.type}-${ind.value}`;
    ind.reportIds.forEach((repId) => {
      if (activeReportIds.has(repId)) {
        edges.push({
          id: `edge-${indNodeId}-${repId}`,
          source: `rep-${repId}`,
          target: indNodeId,
          type: ind.type,
        });
      }
    });
  });

  return { nodes, edges };
}

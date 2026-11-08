import type { ScamCategory } from './dashboard';

export type IndicatorType = 'upi' | 'phone' | 'email' | 'url';

export interface SuspectIdentifier {
  id?: string;
  type: IndicatorType;
  value: string; // Original value entered by victim/investigator
  normalized: string; // Normalized value used for exact matching
}

export interface SyntheticReport {
  id: string;
  referenceId: string;
  victimName: string;
  category: ScamCategory;
  reportedDate: string;
  amountLost: number;
  suspectIdentifiers: SuspectIdentifier[];
  transactionId?: string;
  suspectUpi?: string;
  suspectPhone?: string;
  suspectEmail?: string;
  suspectUrl?: string;
  platform: string;
  description: string;
}

export interface ExtractedIndicator {
  raw: string;
  normalized: string;
  type: IndicatorType;
}

export interface MatchedIndicator {
  type: IndicatorType;
  value: string; // Normalized value
  displayValue: string; // Formatted/masked representation
  count: number; // Number of distinct reports sharing this indicator
  reportIds: string[];
  reportRefs: string[];
  categories: ScamCategory[];
  firstReportedDate: string;
  lastReportedDate: string;
  status: 'High Match' | 'Medium Match' | 'Isolated';
}

export interface FraudPattern {
  id: string;
  title: string;
  type: IndicatorType;
  indicatorValue: string;
  connectedReportsCount: number;
  reportRefs: string[];
  categories: ScamCategory[];
  totalFinancialLoss: number;
  firstReportedDate: string;
  lastReportedDate: string;
  summary: string;
  riskScore: 'High' | 'Medium' | 'Low';
}

export interface IntelligenceSummary {
  totalReports: number;
  uniqueUpis: number;
  repeatedPhones: number;
  suspiciousUrls: number;
  patternsCount: number;
  requiresReviewCount: number;
}

// Graph interfaces
export type GraphNodeType = 'report' | 'upi' | 'phone' | 'email' | 'url' | 'category';

export interface GraphNode {
  id: string;
  label: string;
  type: GraphNodeType;
  data: {
    category?: ScamCategory;
    amount?: number;
    connectedCount?: number;
    reportRef?: string;
    rawVal?: string;
    date?: string;
    percentage?: number;
    totalAmount?: number;
    associatedRefs?: string[];
    associatedDates?: string[];
    associatedSuspects?: {
      upi?: string[];
      phone?: string[];
      email?: string[];
      url?: string[];
    };
  };
  x: number;
  y: number;
  vx?: number;
  vy?: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: IndicatorType | 'category';
}

export interface NetworkGraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

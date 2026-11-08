import { useState, useMemo } from 'react';
import type { SyntheticReport, MatchedIndicator, IndicatorType, GraphNode } from '../../types/intelligence';
import { buildNetworkGraph } from '../../services/intelligenceEngine';

interface Props {
  reports: SyntheticReport[];
  matchedIndicators: MatchedIndicator[];
  onOpenReportDetails?: (ref: string) => void;
  externalCategoryFilter?: string;
}

export default function InteractiveNetworkGraph({
  reports,
  matchedIndicators,
  onOpenReportDetails,
  externalCategoryFilter,
}: Props) {
  const [filterType, setFilterType] = useState<'all' | IndicatorType | 'category'>(
    externalCategoryFilter ? 'category' : 'all'
  );
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Generate Graph Data with deterministic non-overlapping layout
  const graphData = useMemo(() => {
    return buildNetworkGraph(reports, matchedIndicators, filterType);
  }, [reports, matchedIndicators, filterType]);

  const handleReset = () => {
    setFilterType('all');
    setSelectedNode(null);
    setZoomLevel(1);
    setPan({ x: 0, y: 0 });
  };

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'report':
        return { fill: '#ffffff', stroke: '#2563eb', text: '#1e3a8a' }; // Blue stroke, white fill
      case 'upi':
        return { fill: '#818cf8', stroke: '#4338ca', text: '#312e81' }; // Indigo
      case 'phone':
        return { fill: '#fbbf24', stroke: '#b45309', text: '#78350f' }; // Amber
      case 'url':
        return { fill: '#f87171', stroke: '#b91c1c', text: '#7f1d1d' }; // Red
      case 'email':
        return { fill: '#34d399', stroke: '#047857', text: '#064e3b' }; // Emerald
      case 'category':
        return { fill: '#c084fc', stroke: '#7e22ce', text: '#581c87' }; // Purple Category
      default:
        return { fill: '#94a3b8', stroke: '#475569', text: '#1e293b' };
    }
  };

  // Find connections for the currently selected node
  const activeConnections = useMemo(() => {
    if (!selectedNode) return { edges: [], connectedNodeIds: new Set<string>() };
    const relevantEdges = graphData.edges.filter(
      (e) => e.source === selectedNode.id || e.target === selectedNode.id
    );
    const set = new Set<string>();
    relevantEdges.forEach((e) => {
      set.add(e.source);
      set.add(e.target);
    });
    return { edges: relevantEdges, connectedNodeIds: set };
  }, [selectedNode, graphData.edges]);

  // Pan interaction handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only drag on canvas background
    if ((e.target as HTMLElement).tagName === 'svg' || (e.target as HTMLElement).tagName === 'rect') {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col lg:flex-row min-h-[660px]">
      {/* Left/Main Graph Canvas */}
      <div className="flex-1 flex flex-col relative select-none">
        {/* Graph Header / Toolbars */}
        <div className="p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-950/70 backdrop-blur-xs">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
              {filterType === 'category'
                ? 'Incident Category Classification Topology'
                : 'Fraud Syndicate Shared-Identifier Link Analysis'}
            </h3>
            <p className="text-[11px] text-slate-400">
              {filterType === 'category'
                ? 'Maps registered victim reports directly to their authorized crime categories'
                : 'Maps independent reports connected by identical normalized suspect identifiers'}
            </p>
          </div>

          {/* Type Filter Chips (ALL LINKS | UPI | PHONE | URL | EMAIL | CATEGORY) */}
          <div className="flex items-center space-x-1.5 overflow-x-auto">
            {(['all', 'upi', 'phone', 'url', 'email', 'category'] as const).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setFilterType(t);
                  setSelectedNode(null);
                }}
                className={`px-2.5 py-1 rounded text-xs font-semibold uppercase tracking-wider transition-colors ${
                  filterType === t
                    ? t === 'category'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {t === 'all' ? 'All Links' : t === 'category' ? 'Category' : t}
              </button>
            ))}
          </div>

          {/* Zoom and Reset Controls */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setZoomLevel((z) => Math.min(z + 0.15, 2.0))}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-bold"
              title="Zoom In"
            >
              +
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(z - 0.15, 0.5))}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-bold"
              title="Zoom Out"
            >
              −
            </button>
            <button
              onClick={handleReset}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-semibold"
            >
              Reset View
            </button>
          </div>
        </div>

        {/* SVG Visualization Area */}
        <div
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className="flex-1 relative overflow-hidden bg-radial from-slate-900 to-slate-950 flex items-center justify-center min-h-[500px]"
        >
          <svg
            className={`w-full h-full ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            viewBox="0 0 960 640"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Background grid */}
            <defs>
              <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
                <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#1e293b" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="960" height="640" fill="url(#grid)" />

            <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoomLevel})`}>
              {/* EDGES (Connecting smooth curved bezier paths) */}
              {graphData.edges.map((edge) => {
                const sourceNode = graphData.nodes.find((n) => n.id === edge.source);
                const targetNode = graphData.nodes.find((n) => n.id === edge.target);
                if (!sourceNode || !targetNode) return null;

                const isHighlighted =
                  selectedNode &&
                  (selectedNode.id === sourceNode.id || selectedNode.id === targetNode.id);

                // Smooth curved bezier from Right layer (source: report) to Left layer (target: indicator/category)
                const dx = (targetNode.x - sourceNode.x) * 0.5;
                const pathData = `M ${sourceNode.x} ${sourceNode.y} C ${sourceNode.x + dx} ${sourceNode.y}, ${targetNode.x - dx} ${targetNode.y}, ${targetNode.x} ${targetNode.y}`;

                return (
                  <path
                    key={edge.id}
                    d={pathData}
                    fill="none"
                    stroke={
                      isHighlighted
                        ? edge.type === 'category'
                          ? '#c084fc'
                          : '#60a5fa'
                        : '#64748b'
                    }
                    strokeWidth={isHighlighted ? 2.5 : 2}
                    strokeOpacity={isHighlighted ? 1 : 0.7}
                    strokeDasharray={isHighlighted ? undefined : '5,4'}
                  />
                );
              })}

              {/* NODES */}
              {graphData.nodes.map((node) => {
                const isSelected = selectedNode?.id === node.id;
                const isConnected = activeConnections.connectedNodeIds.has(node.id);
                const colors = getNodeColor(node.type);
                const isReport = node.type === 'report';
                const isCategory = node.type === 'category';
                const radius = isReport ? 15 : isCategory ? 26 : 22;

                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedNode(node);
                    }}
                    className="cursor-pointer"
                  >
                    {/* Selected highlight ring — static, no animation */}
                    {isSelected && (
                      <circle
                        r={radius + 7}
                        fill="none"
                        stroke={isCategory ? '#c084fc' : '#60a5fa'}
                        strokeWidth="2.5"
                        strokeOpacity="0.6"
                      />
                    )}

                    {/* Node Body */}
                    <circle
                      r={radius}
                      fill={colors.fill}
                      stroke={isSelected ? '#60a5fa' : isConnected ? '#93c5fd' : colors.stroke}
                      strokeWidth={isSelected ? 3.5 : 2}
                    />

                    {/* Node Badge Text */}
                    <text
                      textAnchor="middle"
                      dy="4"
                      fontSize={isReport ? '9' : isCategory ? '10' : '10'}
                      fontWeight="bold"
                      fill={colors.text}
                      className="pointer-events-none font-sans"
                    >
                      {isReport ? 'REP' : isCategory ? 'CAT' : node.type.toUpperCase().slice(0, 3)}
                    </text>

                    {/* Node Label Below */}
                    <text
                      textAnchor="middle"
                      dy={radius + 14}
                      fontSize="9"
                      fill={isSelected ? '#93c5fd' : isConnected ? '#f8fafc' : '#94a3b8'}
                      fontWeight={isSelected ? 'bold' : 'normal'}
                      className="pointer-events-none font-mono"
                    >
                      {isReport
                        ? node.label.slice(-8)
                        : node.label.length > 20
                        ? `${node.label.slice(0, 18)}…`
                        : node.label}
                    </text>

                    {/* Count badge for Indicator / Category nodes */}
                    {!isReport && node.data.connectedCount && (
                      <g transform={`translate(${radius - 4}, ${-radius + 4})`}>
                        <circle r="8" fill="#1e293b" stroke="#475569" strokeWidth="1" />
                        <text
                          textAnchor="middle"
                          dy="3"
                          fontSize="8"
                          fontWeight="bold"
                          fill="#ffffff"
                        >
                          {node.data.connectedCount}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </g>
          </svg>

          {/* Bottom Interactive Legend */}
          <div className="absolute bottom-3 left-4 right-4 bg-slate-950/85 backdrop-blur-md rounded-xl p-2.5 border border-slate-800 flex flex-wrap items-center justify-between text-[11px] gap-2">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <span className="flex items-center space-x-1.5 text-slate-300">
                <span className="w-3 h-3 rounded-full bg-white border-2 border-blue-600 inline-block"></span>
                <span>Report Node</span>
              </span>
              <span className="flex items-center space-x-1.5 text-slate-300">
                <span className="w-3 h-3 rounded-full bg-indigo-400 border border-indigo-700 inline-block"></span>
                <span>UPI Node</span>
              </span>
              <span className="flex items-center space-x-1.5 text-slate-300">
                <span className="w-3 h-3 rounded-full bg-amber-400 border border-amber-700 inline-block"></span>
                <span>Phone Node</span>
              </span>
              <span className="flex items-center space-x-1.5 text-slate-300">
                <span className="w-3 h-3 rounded-full bg-rose-400 border border-rose-700 inline-block"></span>
                <span>URL Node</span>
              </span>
              <span className="flex items-center space-x-1.5 text-slate-300">
                <span className="w-3 h-3 rounded-full bg-purple-400 border border-purple-700 inline-block"></span>
                <span>Category Node</span>
              </span>
            </div>
            <span className="text-[10px] text-slate-500 hidden sm:inline">
              Deterministic Bipartite Layout (Non-Overlapping)
            </span>
          </div>
        </div>
      </div>

      {/* Right Details Side Panel (Node Intelligence Dossier) */}
      <div className="w-full lg:w-80 bg-slate-950 border-t lg:border-t-0 lg:border-l border-slate-800 p-5 flex flex-col justify-between text-xs">
        <div>
          <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
            <h4 className="font-bold text-white text-sm">Node Intelligence Dossier</h4>
            {selectedNode && (
              <button
                onClick={() => setSelectedNode(null)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                Clear ✕
              </button>
            )}
          </div>

          {!selectedNode ? (
            <div className="py-14 text-center text-slate-500">
              <div className="w-12 h-12 rounded-full bg-slate-900 mx-auto flex items-center justify-center text-slate-600 mb-3 border border-slate-800">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
              </div>
              <p className="font-medium text-slate-400">No node selected</p>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Click any report, indicator, or category node on the canvas to inspect incident links.
              </p>
            </div>
          ) : (
            <div className="py-4 space-y-4">
              {/* Node Badge */}
              <div className="flex items-center space-x-2">
                <span
                  className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                    selectedNode.type === 'category'
                      ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                      : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                  }`}
                >
                  {selectedNode.type.toUpperCase()} NODE
                </span>
                <span className="text-slate-400 text-[11px] font-mono">
                  {selectedNode.type === 'report'
                    ? 'Victim Complaint'
                    : selectedNode.type === 'category'
                    ? 'Classification Hub'
                    : 'Shared Suspect Value'}
                </span>
              </div>

              {/* Node Label / ID */}
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Identifier / Name</span>
                <p className="font-mono font-bold text-white text-sm break-all mt-0.5">
                  {selectedNode.label}
                </p>
              </div>

              {/* 1. REPORT NODE SPECIFIC DATA */}
              {selectedNode.type === 'report' && (
                <div className="space-y-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-slate-400 text-[10px]">Scam Category</span>
                    <p className="font-semibold text-blue-400">{selectedNode.data.category}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px]">Financial Loss</span>
                    <p className="font-bold text-white text-base">₹{selectedNode.data.amount?.toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px]">Reported Incident Date</span>
                    <p className="text-slate-300 font-mono">{selectedNode.data.date}</p>
                  </div>

                  {/* Associated suspect identifiers */}
                  <div className="pt-2 border-t border-slate-800 space-y-1.5 text-[11px]">
                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">
                      Attached Indicators:
                    </span>
                    {selectedNode.data.associatedSuspects?.upi?.length ? (
                      <p className="font-mono text-slate-300 break-all">
                        <strong className="text-indigo-400">UPI:</strong> {selectedNode.data.associatedSuspects.upi[0]}
                      </p>
                    ) : null}
                    {selectedNode.data.associatedSuspects?.phone?.length ? (
                      <p className="font-mono text-slate-300">
                        <strong className="text-amber-400">Phone:</strong> {selectedNode.data.associatedSuspects.phone[0]}
                      </p>
                    ) : null}
                    {selectedNode.data.associatedSuspects?.url?.length ? (
                      <p className="font-mono text-slate-300 break-all">
                        <strong className="text-rose-400">URL:</strong> {selectedNode.data.associatedSuspects.url[0]}
                      </p>
                    ) : null}
                    {selectedNode.data.associatedSuspects?.email?.length ? (
                      <p className="font-mono text-slate-300 break-all">
                        <strong className="text-emerald-400">Email:</strong> {selectedNode.data.associatedSuspects.email[0]}
                      </p>
                    ) : null}
                  </div>

                  {onOpenReportDetails && selectedNode.data.reportRef && (
                    <button
                      onClick={() => onOpenReportDetails(selectedNode.data.reportRef!)}
                      className="w-full mt-2 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold"
                    >
                      View Full Report Dossier
                    </button>
                  )}
                </div>
              )}

              {/* 2. CATEGORY NODE SPECIFIC DATA (NEW) */}
              {selectedNode.type === 'category' && (
                <div className="space-y-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-slate-400 text-[10px]">Registered CT Reports</span>
                    <p className="text-2xl font-black text-purple-400">
                      {selectedNode.data.connectedCount} Cases{' '}
                      <span className="text-xs text-slate-400 font-normal">({selectedNode.data.percentage}% of all)</span>
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px]">Total Category Financial Loss</span>
                    <p className="text-base font-bold text-white">
                      ₹{selectedNode.data.totalAmount?.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px]">Associated CT Reference IDs</span>
                    <div className="mt-1 flex flex-wrap gap-1 max-h-36 overflow-y-auto">
                      {selectedNode.data.associatedRefs?.map((ref) => (
                        <span
                          key={ref}
                          onClick={() => onOpenReportDetails && onOpenReportDetails(ref)}
                          className="px-2 py-0.5 rounded bg-slate-800 text-purple-300 font-mono text-[10px] hover:bg-purple-900/50 cursor-pointer"
                          title="Click to inspect case"
                        >
                          {ref}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 3. INDICATOR NODE SPECIFIC DATA */}
              {selectedNode.type !== 'report' && selectedNode.type !== 'category' && (
                <div className="space-y-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-slate-400 text-[10px]">Connected Independent Reports</span>
                    <p className="text-2xl font-black text-rose-400">{selectedNode.data.connectedCount} Reports</p>
                  </div>
                  {selectedNode.data.associatedDates?.length ? (
                    <div>
                      <span className="text-slate-400 text-[10px]">Activity Date Span</span>
                      <p className="text-slate-300 font-mono text-[11px]">
                        {selectedNode.data.associatedDates[0]} to{' '}
                        {selectedNode.data.associatedDates[selectedNode.data.associatedDates.length - 1]}
                      </p>
                    </div>
                  ) : null}
                  <div>
                    <span className="text-slate-400 text-[10px]">Connected Case IDs</span>
                    <div className="mt-1 flex flex-wrap gap-1 max-h-36 overflow-y-auto">
                      {selectedNode.data.associatedRefs?.map((ref) => (
                        <span
                          key={ref}
                          onClick={() => onOpenReportDetails && onOpenReportDetails(ref)}
                          className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] hover:bg-blue-900/50 cursor-pointer"
                          title="Click to view dossier"
                        >
                          {ref}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Investigative Lead Footer Note */}
        <div className="pt-3 border-t border-slate-800/80 text-[10px] text-slate-500 leading-relaxed">
          {filterType === 'category'
            ? 'Category relationships represent statutory incident classifications. Indicator relationships denote potential shared-suspect syndicates.'
            : 'Matching indicators denote identical suspect parameters across independent reports. Requires evidentiary verification.'}
        </div>
      </div>
    </div>
  );
}

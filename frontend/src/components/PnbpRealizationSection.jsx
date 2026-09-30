import { useState } from 'react'
import { pnbpRealizationData } from '../data/mock'

export default function PnbpRealizationSection() {
  const [chartType, setChartType] = useState('bar') // 'bar' | 'line' | 'table'
  const [selectedYear, setSelectedYear] = useState(2025)

  const activeYearData =
    pnbpRealizationData.find((d) => d.year === selectedYear) ||
    pnbpRealizationData[pnbpRealizationData.length - 1]

  // Chart dimensions & scaling (tight & compact financial ratio)
  const maxVal = 700
  const chartHeight = 225
  const chartWidth = 800
  const baselineY = 178 // baseline where bars sit

  const getBarHeight = (val) => {
    return Math.round((val / maxVal) * 125)
  }

  const getYCoord = (val) => {
    return baselineY - Math.round((val / maxVal) * 125)
  }

  // Pre-calculate line points
  const pointsTarget = pnbpRealizationData.map((d, i) => {
    const x = 70 + i * ((chartWidth - 140) / (pnbpRealizationData.length - 1))
    const y = getYCoord(d.targetApbn)
    return { x, y, val: d.targetApbn, year: d.year }
  })

  const pointsRealization = pnbpRealizationData.map((d, i) => {
    const x = 70 + i * ((chartWidth - 140) / (pnbpRealizationData.length - 1))
    const y = getYCoord(d.realization)
    return { x, y, val: d.realization, year: d.year, growth: d.growthYoy, pct: d.percentage }
  })

  const pathTarget = pointsTarget.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '')
  const pathRealization = pointsRealization.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '')

  return (
    <section id="realisasi" className="py-8 sm:py-10 bg-slate-50 border-t border-slate-200">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        
        {/* EXECUTIVE HEADER & TOOLBAR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-navy-950 tracking-tight">
              Realisasi PNBP
            </h2>
          </div>

          {/* Controls: Chart View Mode & Quick Year Filter */}
          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            {/* Year Selector Pills */}
            <div className="flex items-center bg-white p-0.5 rounded-lg border border-slate-200 shadow-2xs">
              {pnbpRealizationData.map((d) => (
                <button
                  key={d.year}
                  type="button"
                  onClick={() => setSelectedYear(d.year)}
                  className={`px-2.5 py-1 rounded-md text-xs font-bold transition ${
                    selectedYear === d.year
                      ? 'bg-navy-950 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-navy-950 hover:bg-slate-100'
                  }`}
                >
                  {d.year}
                </button>
              ))}
            </div>

            {/* View Mode Toggle: Bar | Line | Table */}
            <div className="flex items-center bg-white p-0.5 rounded-lg border border-slate-200 shadow-2xs">
              <button
                type="button"
                onClick={() => setChartType('bar')}
                title="Tampilan Grafik Batang"
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold transition ${
                  chartType === 'bar'
                    ? 'bg-navy-950 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-navy-950 hover:bg-slate-100'
                }`}
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 20V10M12 20V4M6 20v-6" />
                </svg>
                <span>Batang</span>
              </button>
              <button
                type="button"
                onClick={() => setChartType('line')}
                title="Tampilan Grafik Garis Tren"
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold transition ${
                  chartType === 'line'
                    ? 'bg-navy-950 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-navy-950 hover:bg-slate-100'
                }`}
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m3 16 6-6 4 4 8-8" />
                </svg>
                <span>Garis</span>
              </button>
              <button
                type="button"
                onClick={() => setChartType('table')}
                title="Tampilan Tabel Data APBN"
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold transition ${
                  chartType === 'table'
                    ? 'bg-navy-950 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-navy-950 hover:bg-slate-100'
                }`}
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 3h18v18H3zM3 9h18M3 15h18M9 3v18M15 3v18" />
                </svg>
                <span>Tabel</span>
              </button>
            </div>
          </div>
        </div>

        {/* MAIN ROW: CHART (KIRI) & FOTO 1 STRUKTUR KONTRIBUSI (KANAN) - SEJAJAR */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch mb-3">
          
          {/* FOTO 2: CHART CONTAINER (KIRI) */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col justify-between">
            {/* Chart Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-5 py-3 border-b border-slate-100 gap-2 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-navy-950">
                  Target APBN vs Realisasi (2021–2025)
                </span>
                <span className="text-[11px] text-slate-500 hidden sm:inline">
                  • Satuan dalam Triliun Rupiah (IDR)
                </span>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-semibold">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-xs bg-[#C58B12] inline-block border border-amber-600"></span>
                  <span className="text-slate-700">Target APBN</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-xs bg-[#1E3A8A] inline-block border border-blue-900"></span>
                  <span className="text-slate-700">Realisasi</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 inline-block"></span>
                  <span className="text-slate-500 text-[11px]">% Capaian</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="inline-block px-1 py-0.2 rounded text-[9.5px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-200">YoY</span>
                  <span className="text-slate-500 text-[11px]">Pertumbuhan</span>
                </div>
              </div>
            </div>

            {/* MAIN VISUAL AREA (Bar / Line / Table) */}
            <div className="p-3 sm:p-5 flex-1 flex flex-col justify-center">
              {/* VIEW 1: BAR CHART */}
              {chartType === 'bar' && (
                <div className="relative w-full overflow-x-auto pb-1">
                  <svg
                    viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                    className="w-full h-auto min-w-[540px]"
                  >
                    {/* Grid Lines */}
                    {[100, 200, 300, 400, 500, 600].map((val) => {
                      const y = getYCoord(val)
                      return (
                        <g key={val}>
                          <line
                            x1="50"
                            y1={y}
                            x2={chartWidth - 25}
                            y2={y}
                            stroke="#E2E8F0"
                            strokeDasharray="3 3"
                            strokeWidth="1"
                          />
                          <text
                            x="42"
                            y={y + 3.5}
                            textAnchor="end"
                            fontSize="9.5"
                            fill="#94A3B8"
                            fontFamily="sans-serif"
                          >
                            {val}
                          </text>
                        </g>
                      )
                    })}

                    {/* Columns */}
                    {pnbpRealizationData.map((d, i) => {
                      const groupWidth = 92
                      const barW = 24
                      const centerX = 70 + i * ((chartWidth - 140) / (pnbpRealizationData.length - 1))
                      const targetH = getBarHeight(d.targetApbn)
                      const realH = getBarHeight(d.realization)
                      const isSelected = d.year === selectedYear

                      return (
                        <g
                          key={d.year}
                          className="cursor-pointer transition-all duration-200"
                          onClick={() => setSelectedYear(d.year)}
                        >
                          {/* Selected Column Highlight Pillar */}
                          {isSelected && (
                            <rect
                              x={centerX - groupWidth / 2}
                              y="10"
                              width={groupWidth}
                              height={baselineY - 10 + 35}
                              fill="#071B33"
                              fillOpacity="0.04"
                              stroke="#071B33"
                              strokeOpacity="0.2"
                              strokeWidth="1"
                              rx="8"
                            />
                          )}

                          {/* Top Achievement Badge */}
                          <g>
                            <rect
                              x={centerX - 24}
                              y="14"
                              width="48"
                              height="16"
                              rx="8"
                              fill={isSelected ? '#071B33' : '#F1F5F9'}
                              stroke={isSelected ? '#071B33' : '#CBD5E1'}
                              strokeWidth="1"
                            />
                            <text
                              x={centerX}
                              y="25.5"
                              textAnchor="middle"
                              fontSize="9"
                              fontWeight="bold"
                              fill={isSelected ? '#FFFFFF' : '#334155'}
                            >
                              {d.percentage}%
                            </text>
                          </g>

                          {/* Target Bar (Kemenkeu Gold) */}
                          <rect
                            x={centerX - barW - 2}
                            y={baselineY - targetH}
                            width={barW}
                            height={targetH}
                            fill="#D4971A"
                            stroke="#B45309"
                            strokeWidth="0.75"
                            rx="3"
                            className="hover:opacity-90 transition"
                          />
                          <text
                            x={centerX - barW / 2 - 2}
                            y={baselineY - targetH - 5}
                            textAnchor="middle"
                            fontSize="9.5"
                            fontWeight="bold"
                            fill="#854D0E"
                          >
                            {d.targetApbn}
                          </text>

                          {/* Realization Bar (Deep Kemenkeu Navy) */}
                          <rect
                            x={centerX + 2}
                            y={baselineY - realH}
                            width={barW}
                            height={realH}
                            fill={isSelected ? '#1E3A8A' : '#2563EB'}
                            stroke="#1E3A8A"
                            strokeWidth="0.75"
                            rx="3"
                            className="hover:fill-blue-900 transition"
                          />
                          <text
                            x={centerX + barW / 2 + 2}
                            y={baselineY - realH - 5}
                            textAnchor="middle"
                            fontSize="9.5"
                            fontWeight="bold"
                            fill="#1E3A8A"
                          >
                            {d.realization}
                          </text>

                          {/* Year Axis Label */}
                          <text
                            x={centerX}
                            y={baselineY + 16}
                            textAnchor="middle"
                            fontSize="11.5"
                            fontWeight={isSelected ? '800' : '600'}
                            fill={isSelected ? '#071B33' : '#64748B'}
                          >
                            {d.year}
                          </text>

                          {/* Realization YoY Growth Label */}
                          <text
                            x={centerX}
                            y={baselineY + 28}
                            textAnchor="middle"
                            fontSize="8.5"
                            fontWeight="bold"
                            fill={d.growthYoy >= 0 ? '#16A34A' : '#DC2626'}
                          >
                            {d.growthYoy > 0 ? `+${d.growthYoy}%` : `${d.growthYoy}%`} YoY
                          </text>
                        </g>
                      )
                    })}
                  </svg>
                </div>
              )}

              {/* VIEW 2: LINE CHART */}
              {chartType === 'line' && (
                <div className="relative w-full overflow-x-auto pb-1">
                  <svg
                    viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                    className="w-full h-auto min-w-[540px]"
                  >
                    {/* Grid Lines */}
                    {[100, 200, 300, 400, 500, 600].map((val) => {
                      const y = getYCoord(val)
                      return (
                        <g key={val}>
                          <line
                            x1="50"
                            y1={y}
                            x2={chartWidth - 25}
                            y2={y}
                            stroke="#E2E8F0"
                            strokeDasharray="3 3"
                            strokeWidth="1"
                          />
                          <text
                            x="42"
                            y={y + 3.5}
                            textAnchor="end"
                            fontSize="9.5"
                            fill="#94A3B8"
                            fontFamily="sans-serif"
                          >
                            {val}
                          </text>
                        </g>
                      )
                    })}

                    {/* Target Line (Gold, dashed) */}
                    <path
                      d={pathTarget}
                      fill="none"
                      stroke="#D4971A"
                      strokeWidth="2.5"
                      strokeDasharray="5 3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {/* Realization Line (Kemenkeu Navy Blue, solid) */}
                    <path
                      d={pathRealization}
                      fill="none"
                      stroke="#1E3A8A"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Dots & Labels */}
                    {pointsRealization.map((p, i) => {
                      const isSelected = p.year === selectedYear
                      const targetP = pointsTarget[i]
                      return (
                        <g
                          key={p.year}
                          className="cursor-pointer"
                          onClick={() => setSelectedYear(p.year)}
                        >
                          {/* Year Axis text */}
                          <text
                            x={p.x}
                            y={baselineY + 16}
                            textAnchor="middle"
                            fontSize="11.5"
                            fontWeight={isSelected ? '800' : '600'}
                            fill={isSelected ? '#1E3A8A' : '#64748B'}
                          >
                            {p.year}
                          </text>

                          {/* Realization YoY Growth Label */}
                          <text
                            x={p.x}
                            y={baselineY + 28}
                            textAnchor="middle"
                            fontSize="8.5"
                            fontWeight="bold"
                            fill={p.growth >= 0 ? '#16A34A' : '#DC2626'}
                          >
                            {p.growth > 0 ? `+${p.growth}%` : `${p.growth}%`} YoY
                          </text>

                          {/* Target Dot */}
                          <circle
                            cx={targetP.x}
                            cy={targetP.y}
                            r={isSelected ? '5.5' : '4'}
                            fill="#D4971A"
                            stroke="#FFFFFF"
                            strokeWidth="2"
                          />
                          <text
                            x={targetP.x}
                            y={targetP.y - 8}
                            textAnchor="middle"
                            fontSize="9"
                            fontWeight="bold"
                            fill="#854D0E"
                          >
                            {targetP.val}
                          </text>

                          {/* Realization Dot (Kemenkeu Navy Blue) */}
                          <circle
                            cx={p.x}
                            cy={p.y}
                            r={isSelected ? '6.5' : '5'}
                            fill="#1E3A8A"
                            stroke="#FFFFFF"
                            strokeWidth="2.5"
                          />
                          <text
                            x={p.x}
                            y={p.y - 9}
                            textAnchor="middle"
                            fontSize="10"
                            fontWeight="bold"
                            fill="#1E3A8A"
                          >
                            {p.val}
                          </text>
                        </g>
                      )
                    })}
                  </svg>
                </div>
              )}

              {/* VIEW 3: DATA TABLE VIEW */}
              {chartType === 'table' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
                    <thead className="bg-slate-100 text-navy-950 font-bold border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">Tahun Anggaran</th>
                        <th className="py-2.5 px-3 text-right">Target APBN</th>
                        <th className="py-2.5 px-3 text-right">Realisasi</th>
                        <th className="py-2.5 px-3 text-right">Capaian (%)</th>
                        <th className="py-2.5 px-3 text-right">Selisih (+/- T)</th>
                        <th className="py-2.5 px-3 text-right">YoY Pertumbuhan</th>
                        <th className="py-2.5 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {pnbpRealizationData.map((d) => {
                        const isSelected = d.year === selectedYear
                        const diff = (d.realization - d.targetApbn).toFixed(1)
                        return (
                          <tr
                            key={d.year}
                            onClick={() => setSelectedYear(d.year)}
                            className={`cursor-pointer transition ${
                              isSelected ? 'bg-navy-50/70 font-semibold' : 'hover:bg-slate-50'
                            }`}
                          >
                            <td className="py-2 px-3 font-mono font-bold text-navy-950 flex items-center gap-1.5">
                              {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-navy-950 inline-block"></span>}
                              {d.year}
                            </td>
                            <td className="py-2 px-3 text-right font-mono text-slate-700">Rp {d.targetApbn} T</td>
                            <td className="py-2 px-3 text-right font-mono font-bold text-navy-950">Rp {d.realization} T</td>
                            <td className="py-2 px-3 text-right">
                              <span className="inline-block rounded bg-emerald-50 px-1.5 py-0.5 text-[11px] font-bold text-emerald-800 border border-emerald-200">
                                {d.percentage}%
                              </span>
                            </td>
                            <td className="py-2 px-3 text-right font-mono text-emerald-700 font-semibold">
                              +{diff} T
                            </td>
                            <td className="py-2 px-3 text-right font-mono text-slate-600">
                              {d.growthYoy > 0 ? `+${d.growthYoy}%` : `${d.growthYoy}%`}
                            </td>
                            <td className="py-2 px-3 text-slate-600 text-[11px] max-w-xs truncate">
                              {d.status}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* FOTO 1: STRUKTUR KONTRIBUSI 4 KATEGORI POKOK (MENGGANTIKAN AREA LINGKARAN BIRU, SEJAJAR) */}
          <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-2xs p-3.5 sm:p-4 flex flex-col justify-between">
            <div>
              {/* Header Breakdown Strip */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2.5">
                <h3 className="text-xs sm:text-sm font-bold text-navy-950">
                  Komposisi Realisasi PNBP ({activeYearData.year})
                </h3>
                <div className="flex items-center gap-1.5 self-start sm:self-auto">
                  <span className="text-[11px] text-slate-500 font-medium">Total Realisasi:</span>
                  <span className="rounded bg-navy-950 text-white font-mono font-bold text-xs px-2 py-0.5 shadow-2xs">
                    Rp {activeYearData.realization.toLocaleString('id-ID')} Triliun
                  </span>
                </div>
              </div>

              {/* Proportional Segmented Bar */}
              <div className="mb-3">
                <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
                  <div
                    style={{ width: `${activeYearData.breakdown.sda.percentage}%` }}
                    className="bg-amber-600 transition-all duration-300"
                    title={`SDA: ${activeYearData.breakdown.sda.percentage}%`}
                  ></div>
                  <div
                    style={{ width: `${activeYearData.breakdown.knd.percentage}%` }}
                    className="bg-blue-600 transition-all duration-300"
                    title={`KND: ${activeYearData.breakdown.knd.percentage}%`}
                  ></div>
                  <div
                    style={{ width: `${activeYearData.breakdown.lainnya.percentage}%` }}
                    className="bg-emerald-600 transition-all duration-300"
                    title={`Layanan K/L: ${activeYearData.breakdown.lainnya.percentage}%`}
                  ></div>
                  <div
                    style={{ width: `${activeYearData.breakdown.blu.percentage}%` }}
                    className="bg-indigo-600 transition-all duration-300"
                    title={`BLU: ${activeYearData.breakdown.blu.percentage}%`}
                  ></div>
                </div>
                {/* Micro Color Legend */}
                <div className="flex flex-wrap items-center justify-between text-[10.5px] text-slate-500 mt-1.5">
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-xs bg-amber-600 inline-block"></span> SDA ({activeYearData.breakdown.sda.percentage}%)
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-xs bg-blue-600 inline-block"></span> KND ({activeYearData.breakdown.knd.percentage}%)
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-xs bg-emerald-600 inline-block"></span> Layanan K/L ({activeYearData.breakdown.lainnya.percentage}%)
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-xs bg-indigo-600 inline-block"></span> BLU ({activeYearData.breakdown.blu.percentage}%)
                  </span>
                </div>
              </div>
            </div>

            {/* 4 Compact Category Cards in 2x2 Grid (Subtext dilingkari merah telah dihapus) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* 1. SDA */}
              <div className="border border-slate-200/90 rounded-lg p-2.5 sm:p-3 bg-slate-50/60 hover:bg-white hover:border-slate-300 transition flex flex-col justify-between">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-navy-950 truncate">1. PNBP SDA</span>
                  <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                    {activeYearData.breakdown.sda.percentage}%
                  </span>
                </div>
                <div className="text-base sm:text-lg font-black text-navy-950 font-mono">
                  Rp {activeYearData.breakdown.sda.value} T
                </div>
              </div>

              {/* 2. KND */}
              <div className="border border-slate-200/90 rounded-lg p-2.5 sm:p-3 bg-slate-50/60 hover:bg-white hover:border-slate-300 transition flex flex-col justify-between">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-navy-950 truncate">2. PNBP KND</span>
                  <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                    {activeYearData.breakdown.knd.percentage}%
                  </span>
                </div>
                <div className="text-base sm:text-lg font-black text-navy-950 font-mono">
                  Rp {activeYearData.breakdown.knd.value} T
                </div>
              </div>

              {/* 3. Layanan K/L */}
              <div className="border border-slate-200/90 rounded-lg p-2.5 sm:p-3 bg-slate-50/60 hover:bg-white hover:border-slate-300 transition flex flex-col justify-between">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-navy-950 truncate">3. PNBP Lainnya (K/L)</span>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                    {activeYearData.breakdown.lainnya.percentage}%
                  </span>
                </div>
                <div className="text-base sm:text-lg font-black text-navy-950 font-mono">
                  Rp {activeYearData.breakdown.lainnya.value} T
                </div>
              </div>

              {/* 4. BLU */}
              <div className="border border-slate-200/90 rounded-lg p-2.5 sm:p-3 bg-slate-50/60 hover:bg-white hover:border-slate-300 transition flex flex-col justify-between">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-navy-950 truncate">4. Pendapatan BLU</span>
                  <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-200">
                    {activeYearData.breakdown.blu.percentage}%
                  </span>
                </div>
                <div className="text-base sm:text-lg font-black text-navy-950 font-mono">
                  Rp {activeYearData.breakdown.blu.value} T
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CITATION FOOTER */}
        <div className="text-[10.5px] text-slate-400 flex items-center justify-between border-t border-slate-200/70 pt-2 px-1">
          <span>
            Sumber Data: Laporan Keuangan Pemerintah Pusat (LKPP) Audited & Publikasi APBN KiTa — Kementerian Keuangan Republik Indonesia.
          </span>
        </div>

      </div>
    </section>
  )
}

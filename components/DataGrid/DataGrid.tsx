'use client';

import React, { useRef, useState, useCallback, useMemo } from 'react';
import { useVirtualization } from './hooks/useVirtualization';
import type { DataGridProps, RowData, Column } from './types';

export function DataGrid<T extends RowData>({
  data,
  columns: initialColumns,
  height = '100%',
  width = '100%',
  rowHeight = 40,
  headerHeight = 44,
  overscanRowCount = 5,
  overscanColumnCount = 2,
  className = '',
}: DataGridProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const columns = useMemo(
    () => initialColumns.filter((col) => col.visible !== false),
    [initialColumns]
  );

  const { pinnedLeftColumns, pinnedRightColumns, scrollableColumns } = useMemo(() => {
    const left: Column<T>[] = [];
    const right: Column<T>[] = [];
    const scrollable: Column<T>[] = [];

    columns.forEach((col) => {
      if (col.pinned === 'left') {
        left.push(col);
      } else if (col.pinned === 'right') {
        right.push(col);
      } else {
        scrollable.push(col);
      }
    });

    return {
      pinnedLeftColumns: left,
      pinnedRightColumns: right,
      scrollableColumns: scrollable,
    };
  }, [columns]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    setScrollTop(target.scrollTop);
    setScrollLeft(target.scrollLeft);
  }, []);

  React.useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;

      const { width, height } = entry.contentRect;
      setContainerSize({ width, height: height - headerHeight });
    });

    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, [headerHeight]);

  const { virtualState, totalHeight, totalWidth, visibleRowIndices, visibleColumnIndices } =
    useVirtualization({
      totalRows: data.length,
      columns: scrollableColumns,
      rowHeight,
      containerHeight: containerSize.height,
      containerWidth: containerSize.width,
      scrollTop,
      scrollLeft,
      overscanRowCount,
      overscanColumnCount,
    });

  const pinnedLeftWidth = useMemo(
    () => pinnedLeftColumns.reduce((sum, col) => sum + (col.width ?? 150), 0),
    [pinnedLeftColumns]
  );

  const pinnedRightWidth = useMemo(
    () => pinnedRightColumns.reduce((sum, col) => sum + (col.width ?? 150), 0),
    [pinnedRightColumns]
  );

  const renderCell = useCallback(
    (row: T, column: Column<T>, rowIndex: number, columnIndex: number) => {
      const value = row[column.field];
      
      if (column.renderer) {
        return column.renderer({ value, row, column, rowIndex, columnIndex });
      }

      return <span className="truncate">{String(value ?? '')}</span>;
    },
    []
  );

  const renderHeaderCell = useCallback((column: Column<T>) => {
    return (
      <div className="flex items-center justify-between h-full px-3 font-medium">
        <span className="truncate">{column.header}</span>
      </div>
    );
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-auto border border-border bg-background ${className}`}
      style={{ height, width }}
      onScroll={handleScroll}
    >
      {/* Header */}
      <div
        className="sticky top-0 z-20 flex border-b border-border bg-background"
        style={{ height: headerHeight }}
      >
        {/* Pinned Left Headers */}
        {pinnedLeftColumns.map((column, idx) => (
          <div
            key={column.id}
            className="sticky left-0 z-30 border-r border-border bg-background"
            style={{
              width: column.width ?? 150,
              left: pinnedLeftColumns.slice(0, idx).reduce((sum, col) => sum + (col.width ?? 150), 0),
            }}
          >
            {renderHeaderCell(column)}
          </div>
        ))}

        {/* Scrollable Headers */}
        <div
          className="relative flex"
          style={{
            width: totalWidth,
            marginLeft: pinnedLeftWidth > 0 ? 0 : undefined,
          }}
        >
          {visibleColumnIndices.map((colIdx) => {
            const column = scrollableColumns[colIdx];
            if (!column) return null;

            const left = scrollableColumns.slice(0, colIdx).reduce((sum, col) => sum + (col.width ?? 150), 0);

            return (
              <div
                key={column.id}
                className="absolute top-0 border-r border-border"
                style={{
                  left,
                  width: column.width ?? 150,
                  height: headerHeight,
                }}
              >
                {renderHeaderCell(column)}
              </div>
            );
          })}
        </div>

        {/* Pinned Right Headers */}
        {pinnedRightColumns.map((column, idx) => (
          <div
            key={column.id}
            className="sticky right-0 z-30 border-l border-border bg-background"
            style={{
              width: column.width ?? 150,
              right: pinnedRightColumns.slice(idx + 1).reduce((sum, col) => sum + (col.width ?? 150), 0),
            }}
          >
            {renderHeaderCell(column)}
          </div>
        ))}
      </div>

      {/* Body */}
      <div className="relative" style={{ height: totalHeight }}>
        {visibleRowIndices.map((rowIdx) => {
          const row = data[rowIdx];
          if (!row) return null;

          const top = rowIdx * rowHeight;

          return (
            <div
              key={rowIdx}
              className="absolute left-0 flex border-b border-border hover:bg-secondary"
              style={{
                top,
                height: rowHeight,
                width: '100%',
              }}
            >
              {/* Pinned Left Cells */}
              {pinnedLeftColumns.map((column, idx) => (
                <div
                  key={`${rowIdx}-${column.id}`}
                  className="sticky left-0 z-10 flex items-center px-3 border-r border-border bg-background hover:bg-secondary"
                  style={{
                    width: column.width ?? 150,
                    left: pinnedLeftColumns.slice(0, idx).reduce((sum, col) => sum + (col.width ?? 150), 0),
                  }}
                >
                  {renderCell(row, column, rowIdx, idx)}
                </div>
              ))}

              {/* Scrollable Cells */}
              <div className="relative flex" style={{ width: totalWidth }}>
                {visibleColumnIndices.map((colIdx) => {
                  const column = scrollableColumns[colIdx];
                  if (!column) return null;

                  const left = scrollableColumns.slice(0, colIdx).reduce((sum, col) => sum + (col.width ?? 150), 0);

                  return (
                    <div
                      key={`${rowIdx}-${column.id}`}
                      className="absolute top-0 flex items-center px-3 border-r border-border"
                      style={{
                        left,
                        width: column.width ?? 150,
                        height: rowHeight,
                      }}
                    >
                      {renderCell(row, column, rowIdx, colIdx + pinnedLeftColumns.length)}
                    </div>
                  );
                })}
              </div>

              {/* Pinned Right Cells */}
              {pinnedRightColumns.map((column, idx) => (
                <div
                  key={`${rowIdx}-${column.id}`}
                  className="sticky right-0 z-10 flex items-center px-3 border-l border-border bg-background hover:bg-secondary"
                  style={{
                    width: column.width ?? 150,
                    right: pinnedRightColumns.slice(idx + 1).reduce((sum, col) => sum + (col.width ?? 150), 0),
                  }}
                >
                  {renderCell(row, column, rowIdx, idx + pinnedLeftColumns.length + scrollableColumns.length)}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

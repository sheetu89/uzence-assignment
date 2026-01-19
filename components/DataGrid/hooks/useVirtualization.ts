import { useMemo, useCallback } from 'react';
import type { VirtualizationState, Column, RowData } from '../types';

interface UseVirtualizationProps<T = RowData> {
  totalRows: number;
  columns: Column<T>[];
  rowHeight: number;
  containerHeight: number;
  containerWidth: number;
  scrollTop: number;
  scrollLeft: number;
  overscanRowCount?: number;
  overscanColumnCount?: number;
}

interface VirtualizationResult {
  virtualState: VirtualizationState;
  totalHeight: number;
  totalWidth: number;
  visibleRowIndices: number[];
  visibleColumnIndices: number[];
}

export function useVirtualization<T = RowData>({
  totalRows,
  columns,
  rowHeight,
  containerHeight,
  containerWidth,
  scrollTop,
  scrollLeft,
  overscanRowCount = 5,
  overscanColumnCount = 2,
}: UseVirtualizationProps<T>): VirtualizationResult {
  const totalHeight = useMemo(() => totalRows * rowHeight, [totalRows, rowHeight]);

  const { columnWidths, totalWidth } = useMemo(() => {
    const widths = columns.map((col) => col.width ?? 150);
    const total = widths.reduce((sum, width) => sum + width, 0);
    return { columnWidths: widths, totalWidth: total };
  }, [columns]);

  const { startRowIndex, endRowIndex, offsetY } = useMemo(() => {
    const start = Math.floor(scrollTop / rowHeight);
    const visibleRows = Math.ceil(containerHeight / rowHeight);
    const end = Math.min(start + visibleRows, totalRows);

    const startWithOverscan = Math.max(0, start - overscanRowCount);
    const endWithOverscan = Math.min(totalRows, end + overscanRowCount);

    return {
      startRowIndex: startWithOverscan,
      endRowIndex: endWithOverscan,
      offsetY: startWithOverscan * rowHeight,
    };
  }, [scrollTop, rowHeight, containerHeight, totalRows, overscanRowCount]);

  const { startColumnIndex, endColumnIndex, offsetX } = useMemo(() => {
    let accumulatedWidth = 0;
    let start = 0;
    let end = columns.length;
    let startOffset = 0;

    for (let i = 0; i < columns.length; i++) {
      const width = columnWidths[i] ?? 150;
      if (accumulatedWidth + width > scrollLeft) {
        start = i;
        startOffset = accumulatedWidth;
        break;
      }
      accumulatedWidth += width;
    }

    accumulatedWidth = startOffset;
    for (let i = start; i < columns.length; i++) {
      const width = columnWidths[i] ?? 150;
      accumulatedWidth += width;
      if (accumulatedWidth > scrollLeft + containerWidth) {
        end = i + 1;
        break;
      }
    }

    const startWithOverscan = Math.max(0, start - overscanColumnCount);
    const endWithOverscan = Math.min(columns.length, end + overscanColumnCount);

    let offsetXValue = 0;
    for (let i = 0; i < startWithOverscan; i++) {
      offsetXValue += columnWidths[i] ?? 150;
    }

    return {
      startColumnIndex: startWithOverscan,
      endColumnIndex: endWithOverscan,
      offsetX: offsetXValue,
    };
  }, [scrollLeft, containerWidth, columns, columnWidths, overscanColumnCount]);

  const visibleRowIndices = useMemo(() => {
    const indices: number[] = [];
    for (let i = startRowIndex; i < endRowIndex; i++) {
      indices.push(i);
    }
    return indices;
  }, [startRowIndex, endRowIndex]);

  const visibleColumnIndices = useMemo(() => {
    const indices: number[] = [];
    for (let i = startColumnIndex; i < endColumnIndex; i++) {
      indices.push(i);
    }
    return indices;
  }, [startColumnIndex, endColumnIndex]);

  const virtualState: VirtualizationState = {
    scrollTop,
    scrollLeft,
    startRowIndex,
    endRowIndex,
    startColumnIndex,
    endColumnIndex,
    offsetY,
    offsetX,
  };

  return {
    virtualState,
    totalHeight,
    totalWidth,
    visibleRowIndices,
    visibleColumnIndices,
  };
}

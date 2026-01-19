export type CellValue = string | number | boolean | null | undefined;

export interface RowData {
  [key: string]: CellValue;
}

export interface CellRendererProps<T = RowData> {
  value: CellValue;
  row: T;
  column: Column<T>;
  rowIndex: number;
  columnIndex: number;
}

export interface CellEditorProps<T = RowData> {
  value: CellValue;
  row: T;
  column: Column<T>;
  rowIndex: number;
  columnIndex: number;
  onChange: (value: CellValue) => void;
  onComplete: () => void;
  onCancel: () => void;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export type CellValidator<T = RowData> = (
  value: CellValue,
  row: T,
  column: Column<T>
) => Promise<ValidationResult> | ValidationResult;

export type CellRenderer<T = RowData> = (
  props: CellRendererProps<T>
) => React.ReactNode;

export type CellEditor<T = RowData> = (props: CellEditorProps<T>) => React.ReactNode;

export interface ColumnMeta {
  [key: string]: unknown;
}

export interface Column<T = RowData> {
  id: string;
  field: string;
  header: string;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  pinned?: 'left' | 'right' | false;
  sortable?: boolean;
  resizable?: boolean;
  reorderable?: boolean;
  editable?: boolean;
  visible?: boolean;
  renderer?: CellRenderer<T>;
  editor?: CellEditor<T>;
  validator?: CellValidator<T>;
  meta?: ColumnMeta;
}

export type SortDirection = 'asc' | 'desc' | null;

export interface SortState {
  columnId: string;
  direction: SortDirection;
  priority: number;
}

export interface EditState {
  rowIndex: number;
  columnId: string;
  value: CellValue;
  originalValue: CellValue;
  isValidating: boolean;
  error?: string;
}

export interface VirtualizationState {
  scrollTop: number;
  scrollLeft: number;
  startRowIndex: number;
  endRowIndex: number;
  startColumnIndex: number;
  endColumnIndex: number;
  offsetY: number;
  offsetX: number;
}

export interface UndoAction {
  type: 'edit' | 'column-resize' | 'column-reorder' | 'column-visibility' | 'sort';
  timestamp: number;
  data: unknown;
  redo: () => void;
  undo: () => void;
}

export interface DataGridProps<T = RowData> {
  data: T[];
  columns: Column<T>[];
  height?: number | string;
  width?: number | string;
  rowHeight?: number;
  headerHeight?: number;
  overscanRowCount?: number;
  overscanColumnCount?: number;
  onCellEdit?: (rowIndex: number, columnId: string, value: CellValue) => void;
  onSortChange?: (sortState: SortState[]) => void;
  onColumnResize?: (columnId: string, width: number) => void;
  onColumnReorder?: (sourceIndex: number, targetIndex: number) => void;
  onColumnVisibilityChange?: (columnId: string, visible: boolean) => void;
  className?: string;
}

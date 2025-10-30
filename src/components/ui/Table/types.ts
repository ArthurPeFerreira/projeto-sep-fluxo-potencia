export interface TableColumn<T> {
  key: keyof T | "actions";
  title: string;
  width?: string;
  align?: "left" | "center" | "right";
  sortable: boolean;
  searchable: boolean;
  visible?: boolean | ((row: T) => boolean);
  render?: (value: any, row: T, index: number) => React.ReactNode;
  searchValue?: (row: T) => string;
}

export interface TableAction<T> {
  key: string;
  label: string;
  icon?: React.ReactNode;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "sm" | "md" | "lg";
  onClick: (row: T, index: number) => void;
  disabled?: (row: T) => boolean;
  hidden?: (row: T) => boolean;
}

export interface TableProps<T = any> {
  columns: TableColumn<T>[];
  data: T[];
  actions?: TableAction<T>[];
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  onRowClick?: (row: T, index: number) => void;
  selectedRow?: T | null;
  selectable?: boolean;
  onSelectionChange?: (selectedRows: T[]) => void;
  itemsPerPage?: number;
  draggable?: boolean;
  onOrderChange?: (newOrder: T[]) => void;
  dragHandleColumn?: string;
  pagination?: boolean;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  itemsPerPageOptions?: number[];
}

export interface TableHeaderProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
  showSearch?: boolean;
  searchPlaceholder?: string;
  searchableColumns?: string[];
}

export interface SortConfig {
  key: string;
  direction: "asc" | "desc";
}

export interface TableState<T = any> {
  currentPage: number;
  itemsPerPage: number;
  sortConfig: SortConfig | null;
  selectedRows: T[];
  searchTerm: string;
}

export interface TableContextValue<T = any> {
  columns: TableColumn<T>[];
  data: T[];
  actions?: TableAction<T>[];
  loading: boolean;
  emptyMessage: string;
  selectable: boolean;
  onRowClick?: (row: T, index: number) => void;
  selectedRow?: T | null;
  onSelectionChange?: (selectedRows: T[]) => void;
  state: TableState<T>;
  setState: React.Dispatch<React.SetStateAction<TableState<T>>>;
  sortedData: T[];
  handleSort: (key: string) => void;
  selectedRows: T[];
  sortConfig: SortConfig | null;
  totalItems: number;
  totalPages: number;
  draggable: boolean;
  onOrderChange?: (newOrder: T[]) => void;
  dragHandleColumn?: string;
  isDragging?: boolean;
  pagination: boolean;
  draggedItemPosition?: number | null;
}

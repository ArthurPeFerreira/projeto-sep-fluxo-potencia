import { TableRoot } from "./TableRoot";
import { TableHeader } from "./TableHeader";
import { TablePagination } from "./TablePagination";
import { TableRows } from "./TableRows";
import { useTableState } from "./useTableState";

export const Table = {
  Root: TableRoot,
  Header: TableHeader,
  Rows: TableRows,
  Pagination: TablePagination,
};

export { useTableState };
export type {
  TableColumn,
  TableProps,
  PaginationProps,
  TableHeaderProps,
  TableAction,
} from "./types";

import { ColumnFiltersState, SortingState } from "@tanstack/react-table";

/**
 * Converts the column filters state to a query params format for the API.
 */
export function getAPIReadyQueryParamsFilters(columnFilters: ColumnFiltersState) {
  return columnFilters.reduce((acc: { [key: string]: any }, filter) => {
    acc["filters[" + filter.id + "]"] = filter.value;
    return acc;
  }, {});
}

/**
 * Converts the sorting state to a query params format for the API.
 */
export function getAPIReadyQueryParamsSorting(sorting: SortingState) {
  if (!sorting.length) {
    return {};
  }

  return {
    orderBy: sorting[0].id,
    orderDirection: sorting[0].desc ? "Desc" : "Asc",
  };
}

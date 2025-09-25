/**
 * This function merges a selected item with an array of options.
 * This is intended to be used with the Autocomplete component,
 * as we have one query to get paginated options for the dropdowns, which may not include the selected item,
 * so the selected item is added manually to the options if it is not already present, so that it can be displayed in the dropdown.
 */
export const mergeSelectedWithOptions = (
  options: Array<{ label: string; value: string }>,
  selected?: { label: string; value: string } | null,
) => {
  if (!selected?.value || options.some((option) => option.value === selected.value)) return options;
  return [{ label: selected.label, value: selected.value }, ...options];
};

/**
 * This function merges an array of selected items with an array of options.
 * This is intended to be used with the MultiAutocomplete component,
 * as we have one query to get paginated options for the dropdowns, which may not include the selected items,
 * so the selected items are added manually to the options if they are not already present, so that they can be displayed in the dropdown.
 */
export const mergeMultiSelectedWithOptions = (
  selected: Array<{ label: string; value: string }>,
  options: Array<{ label: string; value: string }>,
) => {
  const missingSelected = selected.filter((sel) => !options.some((opt) => opt.value === sel.value));
  return [...missingSelected, ...options];
};

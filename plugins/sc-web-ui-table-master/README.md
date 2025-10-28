# SafetyCulture Web UI Table Master Plugin

A specialized plugin for creating and reviewing data tables using SafetyCulture's `sc-web-ui` component library.

## Overview

The SafetyCulture Web UI Table Master Plugin provides expert guidance for building robust, accessible, and performant data tables that follow SafetyCulture's design patterns. It ensures your table implementations use the correct patterns, proper TypeScript types, and performance optimizations from the start.

## Features

### Agent: `sc-web-ui-table-master`

Expert frontend development agent specializing in SafetyCulture's table component library.

**What it does:**

- Creates production-ready table implementations with proper imports and type definitions
- Selects the appropriate pattern (frontend-sorted vs backend-sorted) based on requirements
- Implements sorting, pagination, state management, and row-level actions
- Adds accessibility features and performance optimizations
- Reviews existing table code for adherence to SafetyCulture patterns
- Identifies and fixes common issues (column widths, pinning, wrapping)

**When to use:**

- Creating a new data table component
- Adding sorting, pagination, or filtering to an existing table
- Implementing row-level actions with pinned menu columns
- Migrating from legacy `@sckit/react/table` to `@sc-web-ui/react`
- Reviewing table implementations for best practices
- Troubleshooting table layout or functionality issues

**Usage:**

```
"Create a user management table with name, email, status, and sorting"

"Add a right-pinned actions menu with edit and delete options"

"Review this table component and ensure it follows our patterns"
```

**Output:**
Complete, production-ready implementations with all necessary imports, proper state management, accessibility features, and performance optimizations.

## Core Patterns

### Pattern A: Frontend-Sorted Table

For small datasets where all data is available on the client.

**Key features:**

- `manualSorting={false}` for automatic frontend sorting
- `useState<SortingState>` for sort state management
- Immediate sort feedback without API calls

**Example use cases:** User lists under 100 items, settings tables, dashboard metrics

### Pattern B: Backend-Sorted Table

For large, paginated datasets where the server handles sorting logic.

**Key features:**

- `manualSorting={true}` for backend-controlled sorting
- `useQuery` from TanStack Query for data fetching
- Sorting state converted to API format

**Example use cases:** Inspection lists with thousands of records, audit logs, large organizational directories

### Pinned Actions Menu Column

For tables requiring row-level actions (edit, delete, archive, etc.).

**Key features:**

- Right-pinned column using `columnPinningState={{ right: ['menu'] }}`
- **Menu column must use `size: 64`** (SafetyCulture standard)
- **All columns must have explicit `size` or `minSize` properties**
- **Total column widths must exceed ~1508px for pinning to work**

**Critical implementation:**

```tsx
const columns: Array<ColumnType<RowType>> = [
  { id: "name", minSize: 300, size: 9999 }, // Flexible column
  { id: "status", minSize: 150 },
  { id: "created", minSize: 180 },
  { id: "menu", size: 64 }, // ✅ ALWAYS 64px for menu columns
];

<Table
  data={data}
  columns={columns}
  columnPinningState={{ right: ["menu"] }}
/>;
```

**Recommended column widths:**

- Dates: **180px minimum**
- Status tags: **140-150px**
- Side-by-side metrics: **200px minimum**
- Action menu: **64px exactly**
- Flexible content: `minSize: 300, size: 9999`

## Workflow Example

1. **Request a table:**

```
"Create a user management table with name, email, status, and created date. Include sorting and a right-pinned actions menu."
```

2. **Receive production-ready implementation** with all imports, types, and proper configuration

3. **Review and refine:**

```
"Add multi-column sorting capability"
"Make the status column filterable"
```

4. **Get tests if needed:**

```
"Provide unit tests for this table component"
```

## Common Issues

### ❌ Menu Column Width

**Problem:** Menu column too narrow or too wide

**Solution:** Always use exactly `size: 64` (SafetyCulture standard)

### ❌ Column Pinning Not Working

**Problem:** Right-pinned menu column doesn't stick to the right edge

**Solution:**

- Ensure ALL columns have explicit `size` or `minSize`
- Total column widths must exceed ~1508px
- Use one flexible column with `size: 9999`

### ❌ Content Wrapping

**Problem:** Dates wrapping to two lines, metrics stacking vertically

**Solution:** Use recommended minimum widths (dates: 180px, metrics: 200px, status: 150px)

### ❌ Performance Issues

**Problem:** Table re-renders on every parent component update

**Solution:** Wrap columns array in `useMemo` and use `useCallback` for handlers

## Best Practices

**Column Widths:**

- Set explicit `size` or `minSize` on EVERY column
- Use `size: 64` for all menu columns (never 40 or other values)
- Ensure total column widths exceed ~1508px when using `columnPinningState`
- Use one flexible column with `size: 9999` to fill remaining space

**Performance:**

- Wrap columns array in `useMemo` to prevent unnecessary re-renders
- Use `useCallback` for event handlers
- Avoid inline object/function definitions in render

**Accessibility:**

- Provide descriptive `ariaLabel` props for IconButtons
- Add `data-anchor` attributes for testing
- Ensure keyboard navigation works properly

**Type Safety:**

- Define proper TypeScript types for row data
- Use `ColumnType<YourRowType>` for column definitions
- Import types from `@tanstack/react-table`

## Migration from Legacy Patterns

**Old:** `@sckit/react/table` AdvancedTable with overflow actions

**New:** `@sc-web-ui/react` Table with pinned menu column

The agent will guide you through migrating from legacy patterns to the modern `@sc-web-ui/react` Table implementation with proper TypeScript types, column pinning, and menu components.

## Prerequisites

```json
{
  "dependencies": {
    "@sc-web-ui/react": "latest",
    "@tanstack/react-table": "^8.x",
    "@tanstack/react-query": "^4.x",
    "@safetyculture/icons-react": "latest",
    "react": "^18.x"
  }
}
```

## Resources

- [TanStack Table Documentation](https://tanstack.com/table/latest)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- SafetyCulture sc-web-ui internal documentation
- SafetyCulture Design System Guidelines

## Version

1.0.0

## Maintained by

SafetyCulture Frontend Team

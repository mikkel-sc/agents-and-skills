# Unit Testing Plugin

Expert skill for writing unit tests using Jest and SafetyCulture's testing library.

## Overview

The Unit Testing Plugin provides comprehensive expertise in writing, refactoring, migrating, and reviewing unit tests for SafetyCulture applications. It specializes in SafetyCulture's testing patterns including `initRender`, `data-anchor` attributes, test-helpers, and responsive testing with `@safetyculture/testing-library`.

## Features

### Skill: `unit-testing`

Expert skill for all testing work using Jest and SafetyCulture's testing library.

**What it does:**

- Creates comprehensive unit tests following SafetyCulture patterns
- Discovers and uses existing test patterns from the codebase
- Implements tests with `initRender`, `data-anchor` selectors, and test-helpers
- Migrates legacy tests (Enzyme) to modern patterns (React Testing Library)
- Reviews test coverage and suggests improvements
- Tests components, Redux state, user interactions, navigation, and async operations

**When to use:**

- Writing tests for components or functions
- Adding test coverage for new features
- Refactoring tests to use SafetyCulture's testing library
- Migrating from Enzyme to React Testing Library
- Reviewing or improving test coverage
- Fixing failing tests
- Test-driven development (TDD)

**Usage:**

```
"Write tests for the UserProfile component"
"Add tests to cover the new sorting functionality"
"Refactor these tests to use our testing library"
"Review test coverage for the Dashboard"
"Migrate these enzyme tests to React Testing Library"
```

**Output:**
Complete test files with proper imports, test structure, SafetyCulture patterns, and comprehensive coverage of functionality, edge cases, and error states.

## Workflow: Explore → Plan → Code

### Phase 1: EXPLORE (Discovery-driven testing)

The skill **always verifies existing patterns** before writing tests:

1. Searches for existing tests for similar components/functionality
2. Identifies available test-helpers and mocks in the codebase
3. Understands the component/function being tested
4. Checks existing test coverage and patterns

**Never assumes a test helper, mock, or pattern exists without verification.**

### Phase 2: PLAN

1. Lists what needs to be tested (functionality, edge cases, errors)
2. Identifies required test helpers and mocks
3. Plans test structure (describe blocks, test cases)
4. Gets user approval before writing tests

### Phase 3: CODE

1. Writes tests following discovered patterns
2. Uses SafetyCulture's testing library conventions
3. Verifies tests pass
4. Checks coverage if requested

## Core Patterns

### Basic Component Test

```typescript
import { initRender, fireEvent, waitFor } from "@safetyculture/testing-library";

describe("ComponentName", () => {
  it("renders correctly", async () => {
    const { findByDataAnchor } = initRender({
      component: <ComponentName />,
    });

    expect(await findByDataAnchor("component-name")).toBeInTheDocument();
  });
});
```

### Testing with Redux State

```typescript
const initRenderWithState = (override?: Partial<FeatureState>) =>
  initRender({
    initialState: {
      feature: {
        data: { ...initialState, ...override },
      },
    },
  });

it("displays data from state", async () => {
  const { findByDataAnchor } = initRenderWithState({
    list: [mockItem1, mockItem2],
  });

  expect(await findByDataAnchor("item-list")).toBeInTheDocument();
});
```

### Testing User Interactions

```typescript
it("handles click events", async () => {
  const mockCallback = jest.fn();
  const { findByDataAnchor } = initRender({
    component: <Button onClick={mockCallback} />,
  });

  const button = await findByDataAnchor("submit-button");
  fireEvent.click(button);

  await waitFor(() => {
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });
});
```

### Testing Navigation

```typescript
it("navigates to detail page on click", async () => {
  const { render, history } = initRenderWithState();
  const { findByDataAnchor } = render(<ListComponent />);

  jest.spyOn(history, "push");

  const listItem = await findByDataAnchor("list-item-0");
  fireEvent.click(listItem);

  await waitFor(() => {
    expect(history.push).toHaveBeenCalledWith("/detail/123");
  });
});
```

### Testing Responsive Behavior

```typescript
import createMatchMedia from "jest-matchmedia-mock";
import { ResponsiveContext } from "@safetyculture/responsive";

let matchMedia: any;

beforeAll(() => {
  matchMedia = createMatchMedia(window.innerWidth);
});

it("renders mobile layout on small screens", async () => {
  matchMedia.useMediaQuery("(max-width: 767px)");

  const { findByDataAnchor } = initRender({
    component: (
      <ResponsiveContext.Provider value={{ isMobile: true }}>
        <ResponsiveComponent />
      </ResponsiveContext.Provider>
    ),
  });

  expect(await findByDataAnchor("mobile-menu")).toBeInTheDocument();
});
```

## Key Principles

### 1. Use data-anchor Attributes

SafetyCulture's standard for selecting elements in tests:

```typescript
// Component
<Button data-anchor="submit-button">Submit</Button>;

// Test
const button = await findByDataAnchor("submit-button");
```

**Naming convention:**

- Use kebab-case: `data-anchor="user-profile-name"`
- Be specific: `data-anchor="edit-button"` not `data-anchor="button"`
- Include context: `data-anchor="modal-close-button"`

### 2. Use Test Helpers

Never create mock data manually if test-helpers exist:

```typescript
import { mockHeadsUpManageItem } from "@safetyculture/api/heads-up/test-helpers";
import { mockUser } from "@safetyculture/api/user/test-helpers";

const mockItem = mockHeadsUpManageItem({
  id: "123",
  title: "Test Item",
});
```

### 3. Test Behavior, Not Implementation

Focus on what users see and do:

- ✅ Test that clicking a button shows a modal
- ❌ Test internal state changes

### 4. Keep Tests Simple

One test should verify one behavior:

- Clear test names: `"displays error message when fetch fails"`
- Single assertion per test (when possible)
- Organized with describe blocks

## What to Test

### MUST Test

- Component renders without crashing
- Component displays correct data from props/state
- User interactions trigger expected behavior
- Navigation works correctly
- Loading states display properly
- Error states display properly
- Conditional rendering based on props/state
- Form validation and submission
- Async operations complete successfully

### DON'T Test

- Implementation details (internal state, private methods)
- Third-party library internals
- Styling (unless critical to functionality)
- Exact text content (unless business-critical)

## Common Test Patterns

### Loading States

```typescript
it("shows loading indicator while fetching", async () => {
  const { findByDataAnchor } = initRenderWithState({ loading: true });
  expect(await findByDataAnchor("loading-spinner")).toBeInTheDocument();
});
```

### Error States

```typescript
it("displays error message on failure", async () => {
  const { findByDataAnchor } = initRenderWithState({
    error: "Failed to load data",
  });
  expect(await findByDataAnchor("error-message")).toHaveTextContent(
    "Failed to load data"
  );
});
```

### Forms

```typescript
it("submits form with valid data", async () => {
  const mockSubmit = jest.fn();
  const { findByDataAnchor } = initRender({
    component: <Form onSubmit={mockSubmit} />,
  });

  const input = await findByDataAnchor("name-input");
  fireEvent.change(input, { target: { value: "John Doe" } });

  const submitButton = await findByDataAnchor("submit-button");
  fireEvent.click(submitButton);

  await waitFor(() => {
    expect(mockSubmit).toHaveBeenCalledWith({ name: "John Doe" });
  });
});
```

### Conditional Rendering

```typescript
it("shows admin controls for admin users", async () => {
  const { findByDataAnchor } = initRenderWithState({
    user: { ...mockUser, role: "admin" },
  });
  expect(await findByDataAnchor("admin-controls")).toBeInTheDocument();
});

it("hides admin controls for regular users", async () => {
  const { queryByDataAnchor } = initRenderWithState({
    user: { ...mockUser, role: "user" },
  });
  expect(queryByDataAnchor("admin-controls")).not.toBeInTheDocument();
});
```

## Migration from Enzyme

The skill helps migrate legacy Enzyme tests to modern patterns:

### Old Pattern (Enzyme)

```typescript
import { shallow } from "enzyme";

it("test", () => {
  const wrapper = shallow(<Component />);
  expect(wrapper.find(".class-name")).toHaveLength(1);
  wrapper.find("button").simulate("click");
});
```

### New Pattern (SafetyCulture)

```typescript
import { initRender, fireEvent } from "@safetyculture/testing-library";

it("test", async () => {
  const { findByDataAnchor } = initRender({ component: <Component /> });
  expect(await findByDataAnchor("component-section")).toBeInTheDocument();

  const button = await findByDataAnchor("action-button");
  fireEvent.click(button);
});
```

**Key differences:**

- No shallow rendering → Use full rendering with `initRender`
- No class/id selectors → Use `data-anchor` attributes
- No `.simulate()` → Use `fireEvent` from testing-library
- No `.find()` → Use `findByDataAnchor` or other query methods

## Common Issues

### "Cannot find data-anchor"

**Cause:** Component doesn't have data-anchor attribute

**Solution:** Add data-anchor to component first, then write test

### "Test times out"

**Cause:** Async operation not properly awaited

**Solution:** Use `waitFor` for async assertions

```typescript
await waitFor(() => {
  expect(findByDataAnchor("async-element")).toBeInTheDocument();
});
```

### "State not updating in test"

**Cause:** Not using initRender with initialState

**Solution:** Pass initial state to initRender

```typescript
const { findByDataAnchor } = initRender({
  component: <Component />,
  initialState: {
    feature: { data: mockData },
  },
});
```

## Workflow Example

1. **Request tests:**

```
"Write tests for the UserProfile component"
```

2. **Skill explores codebase:**

   - Searches for similar component tests
   - Identifies available test-helpers
   - Checks if component has data-anchor attributes
   - Verifies state management approach

3. **Skill plans tests:**

   - Lists test cases: render, user interactions, loading, errors
   - Identifies required mocks and helpers
   - Presents plan for approval

4. **Skill writes tests:**

   - Implements using discovered patterns
   - Follows SafetyCulture conventions
   - Verifies tests pass

5. **Review and iterate:**

```
"Add tests for error states"
"Improve coverage for edge cases"
```

## Files in This Plugin

- **SKILL.md** - Comprehensive testing patterns and documentation
- **examples.md** - Real-world testing examples (analytics, feature flags, hooks, mobile, etc.)
- **README.md** - This file

## Coverage Targets

Typical targets for SafetyCulture projects:

- Statements: 80%+
- Branches: 80%+
- Functions: 80%+
- Lines: 80%+

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- SafetyCulture testing-library internal documentation

## Version

1.0.0

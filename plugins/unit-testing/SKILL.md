---
name: unit-testing
color: green
description: |
  Expert in writing unit tests using Jest and SafetyCulture's testing library (@safetyculture/testing-library). Use this skill for ANY testing work - creating, refactoring, migrating, or reviewing unit tests. Specializes in SafetyCulture's patterns including initRender, data-anchor attributes, test-helpers, and responsive testing.

  Examples:
  - "Write tests for the UserProfile component"
  - "Add tests to cover the new sorting functionality"
  - "Refactor these tests to use our testing library"
  - "Review test coverage for the Dashboard"
  - "Migrate these enzyme tests to React Testing Library"
---

# Unit Testing Expert with SafetyCulture Testing Library

## When This Skill Should Be Used

CRITICAL: This skill should trigger for ANY task involving:

**Keywords:** test, testing, unit test, jest, coverage, test coverage, spec, .test.tsx, .test.ts, __tests__, TDD, test-driven

**Specific scenarios:**
- "Write tests for X component" -> Use this skill
- "Add test coverage for X" -> Use this skill
- "Review the tests" -> Use this skill
- "Refactor tests to use testing library" -> Use this skill
- "Migrate enzyme tests" -> Use this skill
- "Fix failing tests" -> Use this skill
- "Improve test coverage" -> Use this skill

**Proactive triggers:** When you see:
- User mentions testing or test coverage in any form
- User asks about jest, React Testing Library, or testing patterns
- User references .test.tsx or .test.ts files
- User asks to verify functionality works
- User mentions TDD or test-driven development

## CRITICAL: Verify Before Implementing

**NEVER assume a test helper, mock, or pattern exists.** Always verify through one of these methods:

1. **Existing tests** - Search codebase for actual usage patterns
2. **Test helpers** - Check @safetyculture/api/*/test-helpers for available mocks
3. **User confirmation** - Ask if unsure about test setup

**If you suggest a pattern that doesn't exist in the user's codebase, you've failed the task.**

## Workflow: Explore -> Plan -> Code

**Phase 1: EXPLORE (Discovery-driven testing)**
1. Search for existing tests for similar components/functionality
2. Identify test helpers and mocks available in the codebase
3. Understand the component/function being tested
4. Check existing test coverage

**Phase 2: PLAN**
1. List what needs to be tested (functionality, edge cases, errors)
2. Identify required test helpers and mocks
3. Plan test structure (describe blocks, test cases)
4. Get user approval before writing tests

**Phase 3: CODE**
1. Write tests following discovered patterns
2. Use SafetyCulture's testing library conventions
3. Verify tests pass
4. Check coverage if requested

## Discovering Test Patterns

Before writing any test, search the codebase:

```bash
# Find similar component tests
Grep: 'initRender' in path matching '*.test.tsx'

# Find test helpers for API mocking
Glob: '@safetyculture/api/*/test-helpers/*.ts'

# Find existing usage of specific test patterns
Grep: 'data-anchor' in test files
Grep: 'ResponsiveContext' in test files
Grep: 'jest-matchmedia-mock' in test files
```

## SafetyCulture Testing Library Patterns

### Core Imports

```typescript
// Primary testing utilities
import { initRender, fireEvent, waitFor } from "@safetyculture/testing-library";

// Test helpers for API mocking
import { mockHeadsUpManageItem } from "@safetyculture/api/heads-up/test-helpers";
import { mockUser } from "@safetyculture/api/user/test-helpers";

// Media query mocking
import createMatchMedia from "jest-matchmedia-mock";

// Responsive testing
import { ResponsiveContext } from "@safetyculture/responsive";
```

### Pattern 1: Basic Component Test with initRender

```typescript
describe("ComponentName", () => {
  it("renders correctly", async () => {
    const { findByDataAnchor } = initRender({
      component: <ComponentName />,
    });

    expect(await findByDataAnchor("component-name")).toBeInTheDocument();
  });
});
```

### Pattern 2: Testing with Redux State

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

### Pattern 3: Testing User Interactions

```typescript
it("handles click events", async () => {
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

### Pattern 4: Testing Navigation

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

### Pattern 5: Testing Responsive Behavior

```typescript
let matchMedia: any;

beforeAll(() => {
  matchMedia = createMatchMedia(window.innerWidth);
});

it("renders mobile layout on small screens", async () => {
  matchMedia.useMediaQuery("(max-width: 767px)");

  const { findByDataAnchor } = initRender({
    component: (
      <ResponsiveContext.Provider value={{ isMobile: true, isTablet: false, isDesktop: false }}>
        <ResponsiveComponent />
      </ResponsiveContext.Provider>
    ),
  });

  expect(await findByDataAnchor("mobile-menu")).toBeInTheDocument();
});
```

## Common Test Patterns

### 1. Testing Loading States

```typescript
it("shows loading indicator while fetching", async () => {
  const { findByDataAnchor } = initRenderWithState({ loading: true });

  expect(await findByDataAnchor("loading-spinner")).toBeInTheDocument();
});

it("shows content after loading completes", async () => {
  const { findByDataAnchor } = initRenderWithState({
    loading: false,
    data: mockData
  });

  expect(await findByDataAnchor("content")).toBeInTheDocument();
});
```

### 2. Testing Error States

```typescript
it("displays error message on failure", async () => {
  const { findByDataAnchor } = initRenderWithState({
    error: "Failed to load data"
  });

  expect(await findByDataAnchor("error-message")).toHaveTextContent("Failed to load data");
});
```

### 3. Testing Forms

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

### 4. Testing Async Operations

```typescript
it("fetches and displays data", async () => {
  const mockFetch = jest.fn().mockResolvedValue({ data: mockData });

  const { findByDataAnchor } = initRender({
    component: <Component fetchData={mockFetch} />,
  });

  await waitFor(() => {
    expect(mockFetch).toHaveBeenCalled();
  });

  expect(await findByDataAnchor("data-display")).toBeInTheDocument();
});
```

### 5. Testing Conditional Rendering

```typescript
it("shows admin controls for admin users", async () => {
  const { findByDataAnchor } = initRenderWithState({
    user: { ...mockUser, role: "admin" }
  });

  expect(await findByDataAnchor("admin-controls")).toBeInTheDocument();
});

it("hides admin controls for regular users", async () => {
  const { queryByDataAnchor } = initRenderWithState({
    user: { ...mockUser, role: "user" }
  });

  expect(queryByDataAnchor("admin-controls")).not.toBeInTheDocument();
});
```

## Test Structure Standards

### Describe Block Organization

```typescript
describe("ComponentName", () => {
  // Setup
  beforeEach(() => {
    // Common setup
  });

  // Happy path tests
  describe("when rendering normally", () => {
    it("displays expected content", () => {});
  });

  // Edge cases
  describe("when data is empty", () => {
    it("shows empty state message", () => {});
  });

  // Error cases
  describe("when an error occurs", () => {
    it("displays error message", () => {});
  });

  // User interactions
  describe("when user interacts", () => {
    it("handles click events", () => {});
    it("handles form submission", () => {});
  });
});
```

### Test Naming Convention

Format: `it("does something when condition", () => {})`

Examples:
- "renders loading spinner when data is loading"
- "displays error message when fetch fails"
- "navigates to detail page when item is clicked"
- "disables submit button when form is invalid"

## Mocking Patterns

### Mocking Functions

```typescript
const mockCallback = jest.fn();
const mockAsyncFunction = jest.fn().mockResolvedValue(mockData);
const mockRejectedFunction = jest.fn().mockRejectedValue(new Error("Failed"));
```

### Mocking Methods

```typescript
jest.spyOn(history, "push");
jest.spyOn(console, "error").mockImplementation(() => {});
jest.spyOn(window, "scrollTo").mockImplementation(() => {});
```

### Mocking API Calls

```typescript
// Use test-helpers from @safetyculture/api
import { mockHeadsUpManageItem } from "@safetyculture/api/heads-up/test-helpers";

const mockItem = mockHeadsUpManageItem({
  id: "123",
  title: "Test Item"
});
```

### Mocking Timers

```typescript
beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

it("executes after delay", () => {
  const callback = jest.fn();
  setTimeout(callback, 1000);

  jest.advanceTimersByTime(1000);

  expect(callback).toHaveBeenCalled();
});
```

## Using data-anchor for Selectors

**CRITICAL:** SafetyCulture uses `data-anchor` attributes as the primary way to select elements in tests.

### Good Practice

```typescript
// Component
<Button data-anchor="submit-button">Submit</Button>

// Test
const { findByDataAnchor } = initRender({ component: <MyForm /> });
const button = await findByDataAnchor("submit-button");
```

### Naming Convention

- Use kebab-case: `data-anchor="user-profile-name"`
- Be specific: `data-anchor="edit-button"` not `data-anchor="button"`
- Include context: `data-anchor="modal-close-button"` not `data-anchor="close"`

### Dynamic Anchors

```typescript
// Component
{items.map((item, index) => (
  <div key={item.id} data-anchor={`list-item-${index}`}>
    {item.name}
  </div>
))}

// Test
const firstItem = await findByDataAnchor("list-item-0");
```

## Testing Checklist

### MUST Test
- [x] Component renders without crashing
- [x] Component displays correct data from props/state
- [x] User interactions trigger expected behavior
- [x] Navigation works correctly
- [x] Loading states display properly
- [x] Error states display properly
- [x] Conditional rendering based on props/state
- [x] Form validation and submission
- [x] Async operations complete successfully

### DON'T Test
- [ ] Implementation details (internal state, private methods)
- [ ] Third-party library internals
- [ ] Styling (unless critical to functionality)
- [ ] Exact text content (unless business-critical)

### Coverage Targets

Search existing tests to understand the project's coverage expectations:

```bash
Grep: 'coverageThreshold' in 'jest.config'
```

Typical targets:
- Statements: 80%+
- Branches: 80%+
- Functions: 80%+
- Lines: 80%+

## Migrating from Legacy Testing Libraries

### From Enzyme to @safetyculture/testing-library

**REPLACE, DON'T PATCH.** Common migrations:

#### Enzyme Pattern (OLD)
```typescript
import { shallow } from 'enzyme';

it('test', () => {
  const wrapper = shallow(<Component />);
  expect(wrapper.find('.class-name')).toHaveLength(1);
  wrapper.find('button').simulate('click');
});
```

#### SafetyCulture Pattern (NEW)
```typescript
import { initRender, fireEvent } from '@safetyculture/testing-library';

it('test', async () => {
  const { findByDataAnchor } = initRender({ component: <Component /> });
  expect(await findByDataAnchor('component-section')).toBeInTheDocument();

  const button = await findByDataAnchor('action-button');
  fireEvent.click(button);
});
```

### Key Differences

1. **No shallow rendering** -> Use full rendering with initRender
2. **No class/id selectors** -> Use data-anchor attributes
3. **No .simulate()** -> Use fireEvent from testing-library
4. **No .find()** -> Use findByDataAnchor or other query methods

## Discovery Checklist

Before writing tests, verify:

1. [ ] Found similar test files in the codebase
2. [ ] Identified available test-helpers for the feature
3. [ ] Checked if component uses data-anchor attributes
4. [ ] Understood component's state management (Redux, local state, etc.)
5. [ ] Verified jest.config settings and coverage requirements
6. [ ] Checked for existing mock setup (timers, media queries, etc.)

## Common Issues and Solutions

### Issue: "Cannot find data-anchor"

**Cause:** Component doesn't have data-anchor attribute

**Solution:** Add data-anchor to component first, then write test

```typescript
// Add to component
<div data-anchor="user-profile">...</div>

// Then test
const profile = await findByDataAnchor("user-profile");
```

### Issue: "Test times out"

**Cause:** Async operation not properly awaited

**Solution:** Use waitFor for async assertions

```typescript
// Wrong
const element = findByDataAnchor("async-element");

// Correct
await waitFor(() => {
  expect(findByDataAnchor("async-element")).toBeInTheDocument();
});
```

### Issue: "State not updating in test"

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

### Issue: "Navigation not working"

**Cause:** History spy not set up correctly

**Solution:** Get history from initRender and spy on it

```typescript
const { render, history } = initRenderWithState();
const { findByDataAnchor } = render(<Component />);

jest.spyOn(history, "push");

// ... trigger navigation ...

expect(history.push).toHaveBeenCalledWith("/expected-path");
```

## Remember

1. **Always search for existing patterns first** - Don't invent new test patterns
2. **Use data-anchor attributes** - This is SafetyCulture's standard
3. **Use test-helpers** - Don't create mock data manually if helpers exist
4. **Test behavior, not implementation** - Focus on what users see and do
5. **Keep tests simple** - One test should verify one behavior
6. **Make tests readable** - Other developers should understand what's being tested

## Questions to Ask

If uncertain about testing approach:

1. "Should I test this component in isolation or with Redux state?"
2. "Are there existing test-helpers I should use?"
3. "What coverage threshold should I aim for?"
4. "Should I add data-anchor attributes to the component first?"
5. "Do you want integration tests or unit tests?"

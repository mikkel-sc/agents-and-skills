# Analytics on the frontend

For analytics, we need to mock the tracking, and then verify that it is called as expected.

```Typescript
import React from "react";

import { analytics } from "@safetyculture/sc-tracking";
import { fireEvent, initRender, screen, waitFor } from "@safetyculture/testing-library";

import { CreateTaskTypeModal } from "./create-task-type-modal";

jest.mock("@safetyculture/sc-tracking");

describe("CreateTaskTypeModal", () => {
  it("should call analytics when Create button is clicked", async () => {
    const taskTypeName = "My Task Type Name";

    const { render } = initRender();
    render(
      <CreateTaskTypeModal
        showModal={true}
        closeModal={jest.fn()}
        onCreated={jest.fn()}
      />,
    );

    const InputBox = screen.getByDataAnchor("actions-create-task-type-input");
    fireEvent.change(InputBox, { target: { value: taskTypeName } });

    const CreateButton = screen.getByDataAnchor(
      "task-details-Create-task-type-confirm",
    );
    fireEvent.click(CreateButton);

    await waitFor(() =>
      expect(analytics.track).toHaveBeenCalledWith("actions.settings", {
        action: "clicked_add_type",
      }),
    );
  });
});
```

# Checkbox checking

It can be dififcult to check checkboxes, as the component implementation isn't eactly a pure checkbox,

## Example

This is for the saelect all checkbox on the actions `/tasks` page.

```Typescript
cy.get("[data-anchor=unchecked-checkbox-svg]").first().click({ multiple: true })
```

# Document attribute testing

You can test document attributes, for example:

```Typescript
expect(global.window.document.title).toBe("Actions | SafetyCulture");
```

# Feature flags testing

To use feature flags in a test, we can mock them like so:

```Typescript
import * as FeatureFlagsHooks from "@safetyculture/api-selectors/feature-flags/hooks";

let featureFlagsMock: jest.SpyInstance;
afterEach(() => {
  featureFlagsMock?.mockRestore();
});
```

In each test/describe:

```Typescript
  beforeEach(() => {
    featureFlagsMock = jest
      .spyOn(FeatureFlagsHooks, "useFeatureFlags")
      .mockReturnValue({
        web_tasks_business_docs_free_limit: true,
      });
  });
```

# History testing

To test history events, we can mock the history like so:

```Typescript
const mockHistoryPush = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: () => ({
    ...jest.requireActual("react-router-dom").useHistory(),
    push: mockHistoryPush,
  }),
}));
```

And then a test might be something like:

```Typescript
  it("should navigate to action type on click", () => {
    render(<MyComponent />);

    fireEvent.click(screen.getByText("Text of my link"));

    expect(mockHistoryPush).toHaveBeenCalledWith("/path/to/something/linkID");
  });
```

# Hooks testing

To mock a hook, do the following:

```Typescript
import * as whateverItIs from "@safetyculture/something/whatever";

//  Whatever data we expect
const mockedData = [
    { ... },
    { ... }
];
```

Then immediately inside every test:

```Typescript
jest.spyOn(whateverItIs, "nameOfMyHook")
    .mockImplementation(jest.fn().mockReturnValue(mockedData));
```

To use the same hook data for every test automatically:

```TypeScript
import * as whateverItIs from "@safetyculture/something/whatever";

//  Whatever data we expect
const mockedData = [
    { ... },
    { ... }
];
```

Then inside the `describe` block, add:

```Typescript
beforeEach(async () => {
    jest.spyOn(whateverItIs, "nameOfMyHook")
        .mockImplementation(jest.fn().mockReturnValue(mockedData);
});
```

# Mobile testing

There is a `isMobile` thingy that uses window.matchMedia, you can to mock it like so:

```Typescript
jest.mock("@safetyculture/sc-media-query", () => ({
  ...jest.requireActual("@safetyculture/sc-media-query"),
  isMobile: jest.fn(),
}));
```

Or if you need control over the matches, this works too:

```Typescript
Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation(() => ({
    matches: false,
    })),
});
```

And one more way to try:

```Typescript
    beforeEach(() => {
        window.matchMedia = jest.fn().mockReturnValue({ matches: false });
    });
```

And return the `matches` value you want for your test, ie: false for desktop, true for mobile. There might be other considerations when testing, eg: resolution settings, etc...

Note: some older components also attach event listeners, so you may need to mock more things, eg:

```Typescript
window.matchMedia = jest.fn().mockReturnValue({
    matches: false,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn()
});
```

# Mock all the things

If you need mock something, it can be quite difficult to get it right.

## Example: a query service that throws and error

```Typescript
import React from "react";

import {
  fireEvent,
  initRender,
  screen,
  waitFor,
} from "@safetyculture/testing-library";
import { Code, ConnectError } from "@bufbuild/connect";

import { CreateTaskTypeModal } from "./create-task-type-modal";

const mockCreateTaskType = jest.fn();

jest.mock("@safetyculture/api/task/actions-queries", () => ({
  ...jest.requireActual("@safetyculture/api/task/actions-queries"),
  useCreateTaskType: () => ({
    mutateAsync: mockCreateTaskType,
  }),
}));

jest.mock("@safetyculture/sc-media-query", () => ({
  ...jest.requireActual("@safetyculture/sc-media-query"),
  isMobile: jest.fn(),
}));

describe("CreateTaskTypeModal", () => {

  it("Shows an error message when error is thrown in create task service", async () => {
    const taskTypeName = "My Task Type Name";

    const mockError = new ConnectError("Already exists", Code.AlreadyExists);

    mockCreateTaskType.mockRejectedValue(mockError);

    const { render } = initRender();
    render(
      <CreateTaskTypeModal
        showModal={true}
        closeModal={jest.fn()}
        onCreated={jest.fn()}
        onCancelled={jest.fn()}
      />,
    );

    const InputBox = screen.getByDataAnchor("asset-create-task-type-input");
    fireEvent.change(InputBox, { target: { value: taskTypeName } });

    const CreateButton = screen.getByDataAnchor(
      "task-details-Create-task-type-confirm",
    );
    fireEvent.click(CreateButton);

    await waitFor(() =>
      expect(
        screen.getByText("Task type name already exists, please try another"),
      ).toBeInTheDocument(),
    );
  });
});
```

## Example: a component

```Typescript
import React from "react";

import {
  fireEvent,
  initRender,
  screen,
  waitFor,
} from "@safetyculture/testing-library";
import { Variation } from "@sc-web-ui/react/button/types";

import { ShareActionLinkContext } from "../../components/share-action-link";
import { BaseMoreDropdown } from "./more-dropdown";

//  Mock IconButton so we can check it receives the correct Variation
jest.mock("@sc-web-ui/react", () => ({
  ...jest.requireActual("@sc-web-ui/react"),
  IconButton: ({ variation, ...props }: { variation: Variation }) => (
    <button
      data-anchor="task-drawer-menu-button"
      data-variation={variation}
      {...props}
    />
  ),
}));

describe("MoreDropdown", () => {
  it("should show as tertiary when when toggleButtonVariation is set to tertiary", async () => {
    const { render } = initRender();
    const variation = "tertiary";

    render(
      <ShareActionLinkContext.Provider
        value={{
          isModalVisible: false,
          taskId: "",
          setModal: jest.fn,
          closeModal: jest.fn,
        }}
      >
        <BaseMoreDropdown
          taskId="task_123"
          taskCreatorId="user_123"
          taskScheduleId="schedule_123"
          toggleButtonVariation={variation}
        />
      </ShareActionLinkContext.Provider>,
    );

    const mockedIconButton = screen.getByDataAnchor("task-drawer-menu-button");
    expect(mockedIconButton).toHaveAttribute("data-variation", variation);
  });
});
```

# Spying is sometimes better

Instead of mocking, sometimes it's better to use a spy, for example if you're testing something that has a nested component, a spy might be enough:

```Typescript
import { taskActionsClient } from "@safetyculture/api/task";

describe("Your test", () => {
    it("does something where a nested component fetches the summaries and you don't care about the data from this test", () => {
        jest.spyOn(actionsAct, "loadAction");
        jest.spyOn(taskActionsClient, "getActionSummaries").mockResolvedValue(
        {
            summaries: [
            {
                taskId: "my-task-id",
                title: "Sample Task 1",
                dueAt: Timestamp.now(),
            },
            {
                taskId: "my-task-id-2",
                title: "Sample Task 2",
                dueAt: Timestamp.now(),
            },
            ],
        } as any,
        );
    });
});
```


# To test for soemthing not being in the document

You can use `.toBeNull()`, which will

```Typescript
  it("Should close modal on cancel button click", () => {
    jest.spyOn(useFeatureFlagImport, "useFeatureFlag").mockReturnValue(true);
    const { getByText, getByDataAnchor, queryByText } = setup({});

    const addTypeButton = getByDataAnchor("create-task-type");
    addTypeButton.click();

    const textToFind = "Create new type"

    expect(getByText(textToFind)).toBeInTheDocument();

    const cancelTypeButton = getByDataAnchor("task-details-Create-task-type-cancel");
    cancelTypeButton.click();

    expect(queryByText(textToFind)).toBeNull();
  })
```

# Testing refs

It can be difficult to test a ref, as you cannot use hooks (easily) in tests

## Using createRef

You can use createRef to test your ref, instead of a useRef hook like so:

```Typescript
    it("submits custom fields", async () => {
      const formRef = React.createRef<HTMLFormElement>();

      const handleSave = () => {
        formRef.current?.submit();
      };

      const { render } = initRender();
      render(<TaskDetailsInternal ref={formRef} action={{ ...mockActionTask, customFields: mockCustomFields }} taskId="task_1" onClose={jest.fn()} />);

      const stringCustomFieldInput = screen.getByDisplayValue("hello");

      fireEvent.change(stringCustomFieldInput, {
        target: { value: "new input.." },
      });

      // fireEvent.click(screen.getByDataAnchor("save-btn"));
      handleSave();

      await waitFor(() => expect(updateActionSpy).toHaveBeenCalled());
    });
```

# See the whole HTML output

In a seperate terminal, run:

```bash
yarn jest-preview
```

Then add a debug statement in your code to see the output, for example:

```Typescript
import { debug } from "jest-preview";

describe("some-test", () => {
    it("does something", () => {
        //  render output
        debug() // shows the output from this point
    })
})
```

## Alternatrve

This will print a URL where you can inspect the output

```Typescript
screen.logTestingPlaygroundURL()
```

It base64 encodes the oputput, so it's kinda large...

Note: it relies on `https://testing-playground.com/`



# You can test that a style has been applied, observe:

```Typescript
it("Should render correct width of label when there is only one label", () => {
    render(
      <Card.ActionsLayout
        title="My Action Card"
        uniqueId="WB-894"
        labels={["Label 1"]}
      />,
    );
    expect(screen.queryByText("Label 1")).toBeVisible();
    expect(screen.getByText("Label 1").parentElement).toHaveStyle(
      "max-width: 100%",
    );
  });
```

# You can wait for a service to respond

First mock it (eg: in `beforeEach`):

```Typescript
cy.intercept("POST", "/api/v3/s12.tasks.v1.ActionsService/UpdateDueAt").as(
    "updateDueAt",
);
```

Then in your test:

```Typescript
cy.wait("@updateDueAt");
```

If the test is async, you may also need to wait a little longer, eg:

```Typescript
const FETCH_WAIT_TIME = 1000
cy.wait(FETCH_WAIT_TIME);
```

import { screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { WaitlistForm } from "@/app/waitlist/WaitlistForm";
import { renderWithI18n } from "@/test/render-with-i18n";

// Mock the server action — we test the form's wiring, not the server logic.
const submitMock = vi.fn();
vi.mock("@/app/waitlist/actions/submit-waitlist", () => ({
  submitWaitlist: (formData: FormData) => submitMock(formData),
}));

beforeEach(() => {
  submitMock.mockReset();
});

describe("WaitlistForm", () => {
  it("renders all required fields with the iPhone autofill pre-selected", () => {
    renderWithI18n(<WaitlistForm phoneAutofill="iphone_ios_26" nativeDefault="en" />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    // Phone shows a <select> (mobile path) since autofill is non-empty.
    const phoneSelect = screen.getByRole("combobox", { name: /phone/i });
    expect((phoneSelect as HTMLSelectElement).value).toBe("iphone_ios_26");
  });

  it("renders a text input for phone when no autofill (desktop visitor)", () => {
    renderWithI18n(<WaitlistForm phoneAutofill="" nativeDefault="en" />);
    const phoneInput = screen.getByRole("textbox", { name: /phone/i });
    expect((phoneInput as HTMLInputElement).type).toBe("text");
  });

  it("pre-selects the default native language and toggles chips on click", async () => {
    const user = userEvent.setup();
    renderWithI18n(<WaitlistForm phoneAutofill="iphone_ios_26" nativeDefault="ja" />);
    // Open the multi-select panel.
    const trigger = screen
      .getAllByRole("button")
      .find((b) => b.getAttribute("aria-haspopup") === "listbox")!;
    await user.click(trigger);
    // Japanese (ja) is the default — shows as pre-selected. Find it within the listbox.
    const listbox = screen.getByRole("listbox");
    const jaOptions = screen.getAllByRole("option").filter((o) => listbox.contains(o));
    const ja = jaOptions.find((o) => o.textContent === "日本語")!;
    expect(ja.getAttribute("aria-selected")).toBe("true");
    // Tap English to ALSO select it.
    const en = jaOptions.find((o) => o.textContent === "English")!;
    await user.click(en);
    expect(en.getAttribute("aria-selected")).toBe("true");
  });

  it("closes the multi-select panel on Escape", async () => {
    const user = userEvent.setup();
    renderWithI18n(<WaitlistForm phoneAutofill="iphone_ios_26" nativeDefault="en" />);
    const trigger = screen
      .getAllByRole("button")
      .find((b) => b.getAttribute("aria-haspopup") === "listbox")!;
    await user.click(trigger);
    expect(screen.queryByRole("listbox")).toBeInTheDocument();
    fireEvent.keyDown(document, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("listbox")).not.toBeInTheDocument());
  });

  it("closes the multi-select on overlay tap", async () => {
    const user = userEvent.setup();
    renderWithI18n(<WaitlistForm phoneAutofill="iphone_ios_26" nativeDefault="en" />);
    const trigger = screen
      .getAllByRole("button")
      .find((b) => b.getAttribute("aria-haspopup") === "listbox")!;
    await user.click(trigger);
    const overlay = screen.getByRole("button", { name: /close/i });
    await user.click(overlay);
    await waitFor(() => expect(screen.queryByRole("listbox")).not.toBeInTheDocument());
  });

  it("toggles the multi-select trigger via repeated clicks", async () => {
    const user = userEvent.setup();
    renderWithI18n(<WaitlistForm phoneAutofill="iphone_ios_26" nativeDefault="en" />);
    const trigger = screen
      .getAllByRole("button")
      .find((b) => b.getAttribute("aria-haspopup") === "listbox")!;
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    await user.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    await user.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });

  it("calls submitWaitlist on submit and shows the thanks state on success", async () => {
    submitMock.mockResolvedValueOnce({ ok: true });
    renderWithI18n(<WaitlistForm phoneAutofill="iphone_ios_26" nativeDefault="en" />);
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/email/i), "ayumi@example.com");
    await user.type(screen.getByLabelText(/first name/i), "Ayumi");
    const targetSelect = screen.getByRole("combobox", { name: /language you want to learn/i });
    await user.selectOptions(targetSelect, "en");
    // Submit the form via its submit button.
    await user.click(screen.getByRole("button", { name: /add me to the waitlist/i }));
    await waitFor(() => expect(submitMock).toHaveBeenCalledTimes(1));
    // Inspect the FormData payload.
    const formData = submitMock.mock.calls[0]![0] as FormData;
    expect(formData.get("email")).toBe("ayumi@example.com");
    expect(formData.get("name")).toBe("Ayumi");
    expect(formData.getAll("nativeLanguages")).toEqual(["en"]);
    expect(formData.get("targetLanguage")).toBe("en");
    // Thanks state appears.
    await waitFor(() => expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument());
  });

  it("deselects a previously selected chip on second click", async () => {
    const user = userEvent.setup();
    renderWithI18n(<WaitlistForm phoneAutofill="iphone_ios_26" nativeDefault="en" />);
    const trigger = screen
      .getAllByRole("button")
      .find((b) => b.getAttribute("aria-haspopup") === "listbox")!;
    await user.click(trigger);
    const enOption = screen.getAllByRole("option").find((o) => o.textContent === "English")!;
    expect(enOption.getAttribute("aria-selected")).toBe("true");
    await user.click(enOption);
    expect(enOption.getAttribute("aria-selected")).toBe("false");
  });

  it("can pick the 'Other' native-language option", async () => {
    const user = userEvent.setup();
    renderWithI18n(<WaitlistForm phoneAutofill="iphone_ios_26" nativeDefault="en" />);
    const trigger = screen
      .getAllByRole("button")
      .find((b) => b.getAttribute("aria-haspopup") === "listbox")!;
    await user.click(trigger);
    const listbox = screen.getByRole("listbox");
    const other = screen
      .getAllByRole("option")
      .filter((o) => listbox.contains(o))
      .find((o) => o.textContent === "Other")!;
    await user.click(other);
    expect(other.getAttribute("aria-selected")).toBe("true");
  });

  it("shows an inline error when the server action returns !ok", async () => {
    submitMock.mockResolvedValueOnce({ ok: false, error: "boom" });
    renderWithI18n(<WaitlistForm phoneAutofill="iphone_ios_26" nativeDefault="en" />);
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/email/i), "x@y.com");
    await user.type(screen.getByLabelText(/first name/i), "X");
    const target = screen.getByRole("combobox", { name: /language you want to learn/i });
    await user.selectOptions(target, "en");
    await user.click(screen.getByRole("button", { name: /add me to the waitlist/i }));
    await waitFor(() => expect(screen.getByText("boom")).toBeInTheDocument());
  });
});

afterEach(() => {
  // Clean up any open dropdown so it doesn't leak between tests.
  fireEvent.keyDown(document, { key: "Escape" });
});

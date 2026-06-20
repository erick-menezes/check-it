import { fireEvent, render, screen } from "@testing-library/react-native";

jest.mock("expo-router", () =>
  require("../test-utils/mocks").createExpoRouterMock(),
);

jest.mock("react-native-safe-area-context", () =>
  require("../test-utils/mocks").createSafeAreaContextMock(),
);

import LimitScreen from "@/app/limit";
import { useActiveListStore } from "@/features/home/active-list-store";
import { router } from "expo-router";

function typeAmount(value: string): void {
  fireEvent.changeText(screen.getByTestId("limit-hidden-input"), value);
}

describe("Limit screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useActiveListStore.setState({ activeList: null, hasHydrated: true });
  });

  it("renders the pt-BR chrome copy exactly per the handoff", () => {
    render(<LimitScreen />);
    expect(screen.getByTestId("limit-screen")).toBeOnTheScreen();
    expect(screen.getByText("Passo 1 de 2")).toBeOnTheScreen();
    expect(screen.getByText("Qual será o seu valor limite?")).toBeOnTheScreen();
    expect(screen.getByText("Toque para editar")).toBeOnTheScreen();
    expect(
      screen.getByText("Te alertamos se a compra ultrapassar esse valor."),
    ).toBeOnTheScreen();
    expect(screen.getByText("Criar lista")).toBeOnTheScreen();
    expect(screen.getByText("R$ 200")).toBeOnTheScreen();
    expect(screen.getByText("R$ 500")).toBeOnTheScreen();
    expect(screen.getByText("R$ 1000")).toBeOnTheScreen();
  });

  it("disables the CTA while the value is R$ 0,00", () => {
    render(<LimitScreen />);
    expect(screen.getByRole("button", { name: "Criar lista" })).toBeDisabled();
  });

  it("enables the CTA after typing a value", () => {
    render(<LimitScreen />);
    typeAmount("1500");
    expect(
      screen.getByRole("button", { name: "Criar lista" }),
    ).not.toBeDisabled();
  });

  it("enables the CTA after tapping a preset", () => {
    render(<LimitScreen />);
    fireEvent.press(screen.getByTestId("limit-preset-500"));
    expect(
      screen.getByRole("button", { name: "Criar lista" }),
    ).not.toBeDisabled();
  });

  it("closes via X without touching the store", () => {
    render(<LimitScreen />);
    fireEvent.press(screen.getByTestId("limit-close"));
    expect(router.back).toHaveBeenCalledTimes(1);
    expect(router.replace).not.toHaveBeenCalled();
    expect(useActiveListStore.getState().activeList).toBeNull();
  });

  it("creates and persists the active list then navigates to shop on confirm", () => {
    render(<LimitScreen />);
    typeAmount("1500");
    fireEvent.press(screen.getByRole("button", { name: "Criar lista" }));
    const { activeList } = useActiveListStore.getState();
    expect(activeList).not.toBeNull();
    expect(activeList?.limitInCents).toBe(1500);
    expect(activeList?.totalInCents).toBe(0);
    expect(activeList?.itemCount).toBe(0);
    expect(router.replace).toHaveBeenCalledWith("/shop");
  });

  it("confirms the preset amount when a pill is tapped", () => {
    render(<LimitScreen />);
    fireEvent.press(screen.getByTestId("limit-preset-200"));
    fireEvent.press(screen.getByRole("button", { name: "Criar lista" }));
    expect(useActiveListStore.getState().activeList?.limitInCents).toBe(20000);
    expect(router.replace).toHaveBeenCalledWith("/shop");
  });

  it("does not create a list when confirming is blocked at R$ 0,00", () => {
    render(<LimitScreen />);
    fireEvent.press(screen.getByRole("button", { name: "Criar lista" }));
    expect(useActiveListStore.getState().activeList).toBeNull();
    expect(router.replace).not.toHaveBeenCalled();
  });
});

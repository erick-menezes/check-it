import AsyncStorage from "@react-native-async-storage/async-storage";
import { act, fireEvent, render, screen } from "@testing-library/react-native";

jest.mock("expo-router", () =>
  require("../test-utils/mocks").createExpoRouterMock(),
);

jest.mock("react-native-safe-area-context", () =>
  require("../test-utils/mocks").createSafeAreaContextMock(),
);

import SettingsScreen from "@/app/(tabs)/settings";
import { useSettingsStore } from "@/features/settings/settings-store";
import { router } from "expo-router";

describe("SettingsScreen", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await AsyncStorage.clear();
    act(() => {
      useSettingsStore.setState({
        budgetAlertsEnabled: true,
        hasHydrated: true,
      });
    });
  });

  it("renders both section eyebrows and never the placeholder", () => {
    render(<SettingsScreen />);
    expect(screen.getByText("NOTIFICAÇÕES")).toBeOnTheScreen();
    expect(screen.getByText("SOBRE")).toBeOnTheScreen();
    expect(screen.queryByText("Em breve")).toBeNull();
  });

  it("renders the three SOBRE rows in order", () => {
    render(<SettingsScreen />);
    expect(screen.getByText("Central de ajuda")).toBeOnTheScreen();
    expect(screen.getByText("Termos e privacidade")).toBeOnTheScreen();
    expect(screen.getByText("Versão")).toBeOnTheScreen();
  });

  it("toggling updates the accessibility state and the store", () => {
    const TOGGLE_LABEL = "Alertas de orçamento";
    render(<SettingsScreen />);
    const toggle = screen.getByRole("switch", { name: TOGGLE_LABEL });
    expect(toggle.props.accessibilityState.checked).toBe(true);
    fireEvent.press(toggle);
    expect(useSettingsStore.getState().budgetAlertsEnabled).toBe(false);
    expect(
      screen.getByRole("switch", { name: TOGGLE_LABEL }).props
        .accessibilityState.checked,
    ).toBe(false);
  });

  it('routes "Central de ajuda" to /help', () => {
    render(<SettingsScreen />);
    fireEvent.press(screen.getByTestId("about-row-help"));
    expect(router.push).toHaveBeenCalledWith("/help");
  });

  it('routes "Termos e privacidade" to /terms', () => {
    render(<SettingsScreen />);
    fireEvent.press(screen.getByTestId("about-row-terms"));
    expect(router.push).toHaveBeenCalledWith("/terms");
  });

  it("does not make the version row pressable", () => {
    render(<SettingsScreen />);
    expect(screen.queryByTestId("about-row-version")).toBeNull();
  });
});

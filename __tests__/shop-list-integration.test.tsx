import { act, fireEvent, render, screen } from "@testing-library/react-native";

jest.mock("expo-router", () =>
  require("../test-utils/mocks").createExpoRouterMock(),
);

jest.mock("react-native-safe-area-context", () =>
  require("../test-utils/mocks").createSafeAreaContextMock(),
);

import ShopScreen from "@/app/shop";
import { createActiveList } from "@/features/home/active-list";
import { useActiveListStore } from "@/features/home/active-list-store";
import { ActiveListCard } from "@/features/home/components/active-list-card";

function seedList(limitInCents = 10000): void {
  act(() => {
    useActiveListStore.setState({
      activeList: createActiveList(limitInCents),
      hasHydrated: true,
    });
  });
}

function firstItemId(): string {
  return useActiveListStore.getState().activeList?.items[0]?.id ?? "";
}

describe("Shop list integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    act(() => {
      useActiveListStore.setState({ activeList: null, hasHydrated: true });
    });
  });

  it("drives add → edit → check → rename → remove and persists each mutation", () => {
    seedList();
    render(<ShopScreen />);
    fireEvent.changeText(screen.getByTestId("shop-add-input"), "Arroz");
    fireEvent.press(screen.getByTestId("shop-add-confirm"));
    expect(useActiveListStore.getState().activeList?.items).toHaveLength(1);
    const itemId = firstItemId();
    fireEvent.press(screen.getByTestId(`shop-item-${itemId}`));
    fireEvent.changeText(screen.getByTestId("edit-price-input"), "500");
    fireEvent.press(screen.getByTestId("edit-qty-increment"));
    fireEvent.press(screen.getByTestId("edit-save"));
    const edited = useActiveListStore.getState().activeList?.items[0];
    expect(edited?.unitPriceInCents).toBe(500);
    expect(edited?.quantity).toBe(2);
    fireEvent.press(screen.getByTestId(`shop-item-checkbox-${itemId}`));
    expect(useActiveListStore.getState().activeList?.totalInCents).toBe(1000);
    fireEvent.press(screen.getByTestId("shop-title"));
    const titleInput = screen.getByTestId("shop-title-input");
    fireEvent.changeText(titleInput, "Compra mensal");
    fireEvent(titleInput, "submitEditing");
    expect(useActiveListStore.getState().activeList?.name).toBe(
      "Compra mensal",
    );
    fireEvent(
      screen.getByTestId(`shop-item-row-${itemId}`),
      "accessibilityAction",
      {
        nativeEvent: { actionName: "delete" },
      },
    );
    fireEvent.press(
      screen.getByTestId(`shop-item-delete-dialog-${itemId}-confirm`),
    );
    expect(useActiveListStore.getState().activeList?.items).toHaveLength(0);
    expect(useActiveListStore.getState().activeList?.totalInCents).toBe(0);
  });

  it("marks every item at once and reflects the total in the budget chip", () => {
    seedList();
    act(() => {
      useActiveListStore.getState().addItems([
        { name: "Arroz", quantity: 1, unitPriceInCents: 1000 },
        { name: "Feijão", quantity: 1, unitPriceInCents: 2000 },
      ]);
    });
    render(<ShopScreen />);
    fireEvent.press(screen.getByTestId("shop-mark-all"));
    expect(useActiveListStore.getState().activeList?.totalInCents).toBe(3000);
    expect(screen.getByTestId("shop-mark-all")).toBeChecked();
  });

  it("deletes the list and routes back to Home", () => {
    seedList();
    act(() => {
      useActiveListStore.getState().addItem("Arroz");
    });
    render(<ShopScreen />);
    fireEvent.press(screen.getByTestId("shop-delete-list"));
    fireEvent.press(screen.getByTestId("delete-list-dialog-confirm"));
    const { router } = require("expo-router");
    expect(useActiveListStore.getState().activeList).toBeNull();
    expect(router.replace).toHaveBeenCalledWith("/home");
  });

  it("keeps the Home active-list card consistent with store mutations", () => {
    seedList(20000);
    act(() => {
      useActiveListStore.getState().addItems([
        { name: "Arroz", quantity: 1, unitPriceInCents: 1000 },
        { name: "Feijão", quantity: 2, unitPriceInCents: 1000 },
      ]);
      useActiveListStore.getState().setAllChecked(true);
    });
    const list = useActiveListStore.getState().activeList;
    if (!list) throw new Error("expected an active list");
    render(<ActiveListCard list={list} onOpen={jest.fn()} />);
    expect(screen.getByText(/2 itens/)).toBeOnTheScreen();
    expect(screen.getByText("R$ 30,00")).toBeOnTheScreen();
  });
});

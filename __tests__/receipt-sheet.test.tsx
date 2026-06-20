import { ReceiptSheet } from "@/features/shop/components/receipt-sheet";
import type { ReceiptScanState } from "@/features/shop/use-receipt-scan";
import { useReceiptScan } from "@/features/shop/use-receipt-scan";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { Linking } from "react-native";

let mockPermission: {
  status: string;
  granted: boolean;
  canAskAgain: boolean;
} | null = { status: "granted", granted: true, canAskAgain: true };
const mockRequestPermission = jest.fn();

jest.mock("expo-camera", () => {
  const React = require("react");
  return {
    CameraView: (props: { onCameraReady?: () => void; testID?: string }) => {
      React.useEffect(() => props.onCameraReady?.(), []);
      return null;
    },
    useCameraPermissions: () => [mockPermission, mockRequestPermission],
  };
});

jest.mock("@/features/shop/use-receipt-scan", () => ({
  useReceiptScan: jest.fn(),
}));

const useReceiptScanMock = useReceiptScan as jest.Mock;
const scan = jest.fn();
const reset = jest.fn();

function mockScanState(state: ReceiptScanState): void {
  useReceiptScanMock.mockReturnValue({ state, scan, reset });
}

describe("ReceiptSheet", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPermission = { status: "granted", granted: true, canAskAgain: true };
    mockScanState({ status: "idle" });
  });

  it("shows the camera preview and triggers a scan from the capture CTA", () => {
    render(<ReceiptSheet visible onClose={jest.fn()} onAddItems={jest.fn()} />);
    expect(screen.getByTestId("receipt-preview")).toBeOnTheScreen();
    fireEvent.press(screen.getByTestId("receipt-capture"));
    expect(scan).toHaveBeenCalledTimes(1);
  });

  it("shows the in-progress state while processing", () => {
    mockScanState({ status: "processing" });
    render(<ReceiptSheet visible onClose={jest.fn()} onAddItems={jest.fn()} />);
    expect(screen.getByTestId("receipt-processing")).toBeOnTheScreen();
  });

  it("announces how many items were added on success", () => {
    mockScanState({ status: "success", count: 3 });
    const onClose = jest.fn();
    render(<ReceiptSheet visible onClose={onClose} onAddItems={jest.fn()} />);
    expect(screen.getByText("3 itens adicionados")).toBeOnTheScreen();
    fireEvent.press(screen.getByTestId("receipt-done"));
    expect(reset).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("shows an error with a retry path", () => {
    mockScanState({ status: "error" });
    render(<ReceiptSheet visible onClose={jest.fn()} onAddItems={jest.fn()} />);
    expect(screen.getByTestId("receipt-error")).toBeOnTheScreen();
    fireEvent.press(screen.getByTestId("receipt-retry"));
    expect(reset).toHaveBeenCalledTimes(1);
  });

  it("explains the denied permission and lets the user request it again", () => {
    mockPermission = { status: "denied", granted: false, canAskAgain: true };
    render(<ReceiptSheet visible onClose={jest.fn()} onAddItems={jest.fn()} />);
    expect(screen.getByTestId("receipt-permission-denied")).toBeOnTheScreen();
    fireEvent.press(screen.getByTestId("receipt-permission-action"));
    expect(mockRequestPermission).toHaveBeenCalled();
  });

  it("routes to system settings when the permission can no longer be asked", () => {
    mockPermission = { status: "denied", granted: false, canAskAgain: false };
    const openSettings = jest
      .spyOn(Linking, "openSettings")
      .mockResolvedValue(undefined);
    render(<ReceiptSheet visible onClose={jest.fn()} onAddItems={jest.fn()} />);
    fireEvent.press(screen.getByTestId("receipt-permission-action"));
    expect(openSettings).toHaveBeenCalledTimes(1);
    openSettings.mockRestore();
  });

  it("dismisses without changes when the backdrop is pressed", () => {
    const onClose = jest.fn();
    render(<ReceiptSheet visible onClose={onClose} onAddItems={jest.fn()} />);
    fireEvent.press(screen.getByTestId("shop-receipt-sheet-backdrop"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

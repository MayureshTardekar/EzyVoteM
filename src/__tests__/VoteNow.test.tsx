import { expect, jest } from "@jest/globals";
import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import VoteNow from "../pages/VoteNow";

jest.mock("ethers", () => ({
  BrowserProvider: jest.fn().mockImplementation(() => ({
    getSigner: () => ({
      getAddress: () => Promise.resolve("0x123..."),
      signMessage: () => Promise.resolve("0xsignature..."),
      sendTransaction: () =>
        Promise.resolve({
          hash: "0x123...",
          wait: () => Promise.resolve({}),
        }),
    }),
  })),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve({
        id: 1,
        title: "Test Election",
        candidates: [
          { id: 1, name: "Candidate A" },
          { id: 2, name: "Candidate B" },
        ],
      }),
  })
) as jest.Mock;

describe("VoteNow Component", () => {
  beforeEach(() => {
    window.ethereum = {
      request: () => Promise.resolve({}),
      on: () => {},
      removeListener: () => {},
      addListener: () => {},
      isMetaMask: true,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should handle voting process", async () => {
    render(<VoteNow />);

    // Wait for candidates to load
    await waitFor(() => {
      expect(screen.getByText("Candidate A")).toBeInTheDocument();
    });

    // Select a candidate
    const candidateRadio = screen.getByLabelText("Candidate A");
    fireEvent.click(candidateRadio);

    // Click vote button
    const voteButton = screen.getByRole("button", { name: /vote/i });
    await fireEvent.click(voteButton);

    // Verify success message
    await waitFor(() => {
      expect(
        screen.getByText("Vote recorded successfully!")
      ).toBeInTheDocument();
    });
  });
});

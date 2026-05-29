import { describe, it, expect } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { usePagination } from "../use-pagination";

describe("usePagination", () => {
  it("returns first page of items", () => {
    const items = Array.from({ length: 25 }, (_, i) => i);
    const { result } = renderHook(() => usePagination(items));

    expect(result.current.page).toBe(1);
    expect(result.current.totalPages).toBe(3);
    expect(result.current.paginatedItems).toHaveLength(10);
    expect(result.current.paginatedItems[0]).toBe(0);
    expect(result.current.paginatedItems[9]).toBe(9);
  });

  it("goes to next page", () => {
    const items = Array.from({ length: 25 }, (_, i) => i);
    const { result } = renderHook(() => usePagination(items));

    act(() => result.current.goToPage(2));

    expect(result.current.page).toBe(2);
    expect(result.current.paginatedItems[0]).toBe(10);
    expect(result.current.paginatedItems[9]).toBe(19);
  });

  it("goes to last page", () => {
    const items = Array.from({ length: 25 }, (_, i) => i);
    const { result } = renderHook(() => usePagination(items));

    act(() => result.current.goToPage(3));

    expect(result.current.page).toBe(3);
    expect(result.current.paginatedItems).toHaveLength(5);
    expect(result.current.paginatedItems[0]).toBe(20);
    expect(result.current.paginatedItems[4]).toBe(24);
  });

  it("does not go below page 1", () => {
    const items = Array.from({ length: 25 }, (_, i) => i);
    const { result } = renderHook(() => usePagination(items));

    act(() => result.current.goToPage(0));

    expect(result.current.page).toBe(1);
  });

  it("does not go above total pages", () => {
    const items = Array.from({ length: 25 }, (_, i) => i);
    const { result } = renderHook(() => usePagination(items));

    act(() => result.current.goToPage(10));

    expect(result.current.page).toBe(3);
  });

  it("returns 1 page for empty array", () => {
    const { result } = renderHook(() => usePagination([]));

    expect(result.current.page).toBe(1);
    expect(result.current.totalPages).toBe(1);
    expect(result.current.paginatedItems).toHaveLength(0);
  });

  it("returns 1 page for less than 10 items", () => {
    const items = Array.from({ length: 3 }, (_, i) => i);
    const { result } = renderHook(() => usePagination(items));

    expect(result.current.totalPages).toBe(1);
    expect(result.current.paginatedItems).toHaveLength(3);
  });

  it("clamps page when items shrink", async () => {
    const { result, rerender } = renderHook(
      ({ items }) => usePagination(items),
      { initialProps: { items: Array.from({ length: 25 }, (_, i) => i) } },
    );

    act(() => result.current.goToPage(3));
    expect(result.current.page).toBe(3);

    rerender({ items: Array.from({ length: 5 }, (_, i) => i) });

    await waitFor(() => {
      expect(result.current.page).toBe(1);
    });
    expect(result.current.totalPages).toBe(1);
    expect(result.current.paginatedItems).toHaveLength(5);
  });
});
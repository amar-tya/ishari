"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { BookEntityList } from "@/core/entities";
import { useBook } from "@/presentation/hooks";
import { getErrorMessage } from "@/shared/utils";
import type { BookViewModel } from "./BookViewModel.types";
import { CreateBookDTO, UpdateBookDTO } from "@/application";

// Re-export types
export type {
  BookViewModel,
  BookViewModelState,
  BookViewModelActions,
} from "./BookViewModel.types";

/**
 * useBookViewModel
 *
 * Presenter/ViewModel untuk Book List Screen.
 * Menggunakan useBook hook untuk fetch data.
 */
export function useBookViewModel(): BookViewModel {
  const {
    createBook,
    updateBook: updateBookHook,
    listBook,
    deleteBook,
  } = useBook();

  // State
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookList, setBookList] = useState<BookEntityList | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  // Refs for safe async operations
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // Actions
  const getBookList = useCallback(
    async (pageParam?: number, searchParam?: string, options?: { silent?: boolean }) => {
      if (!options?.silent) {
        setIsLoading(true);
        setError(null);
      }

      const currentPage = pageParam ?? page;
      const currentSearch = searchParam ?? search;

      try {
        const result = await listBook({
          page: currentPage,
          search: currentSearch || undefined,
        });

        if (!mountedRef.current) return;

        if (result.success) {
          setBookList(result.data);
        } else {
          setError(getErrorMessage(result.error));
        }
      } catch (err) {
        if (mountedRef.current) setError(getErrorMessage(err));
      } finally {
        if (mountedRef.current && !options?.silent) setIsLoading(false);
      }
    },
    [listBook, page, search],
  );

  // Ref to always point to latest getBookList (breaks useCallback chain)
  const fetchRef = useRef(getBookList);
  fetchRef.current = getBookList;

  const storeBook = useCallback(
    async (dto: CreateBookDTO) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await createBook(dto);
        if (!mountedRef.current) return false;

        if (result.success) {
          await fetchRef.current(undefined, undefined, { silent: true });
          return true;
        } else {
          setError(getErrorMessage(result.error));
          return false;
        }
      } catch (error) {
        if (mountedRef.current) setError(getErrorMessage(error));
        return false;
      } finally {
        if (mountedRef.current) setIsLoading(false);
      }
    },
    [createBook],
  );

  const updateBook = useCallback(
    async (id: number, dto: UpdateBookDTO) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await updateBookHook(id, dto);
        if (!mountedRef.current) return false;

        if (result.success) {
          await fetchRef.current(undefined, undefined, { silent: true });
          return true;
        } else {
          setError(getErrorMessage(result.error));
          return false;
        }
      } catch (error) {
        if (mountedRef.current) setError(getErrorMessage(error));
        return false;
      } finally {
        if (mountedRef.current) setIsLoading(false);
      }
    },
    [updateBookHook],
  );

  const removeBook = useCallback(
    async (id: number) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await deleteBook(id);
        if (!mountedRef.current) return false;

        if (result.success) {
          await fetchRef.current(undefined, undefined, { silent: true });
          return true;
        } else {
          setError(getErrorMessage(result.error));
          return false;
        }
      } catch (error) {
        if (mountedRef.current) setError(getErrorMessage(error));
        return false;
      } finally {
        if (mountedRef.current) setIsLoading(false);
      }
    },
    [deleteBook],
  );

  return {
    isLoading,
    error,
    bookList,
    getBookList,
    setPage,
    setSearch,
    storeBook,
    updateBook,
    removeBook,
  };
}

"use client";
import { FC } from "react";
import { IoCaretBack, IoCaretForward } from "react-icons/io5";

interface PaginationProps {
  page: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  onPageChange: (arg0: number) => void;
}

const Pagination: FC<PaginationProps> = ({ page, hasPreviousPage, hasNextPage, onPageChange }) => {
  return (
    <div className="flex justify-center items-center gap-4 mt-6">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={!hasPreviousPage}
        className={`p-2 rounded-full text-white border border-gray-400 transition 
          ${!hasPreviousPage ? "bg-gray-600 cursor-not-allowed" : "bg-zinc-800 hover:bg-zinc-700"}`}>
        <IoCaretBack />
      </button>

      <span className="text-white text-lg font-medium">{`${page}`}</span>

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={!hasNextPage}
        className={`p-2 rounded-full text-white bg-zinc-800 border border-gray-400 hover:bg-zinc-700 transition 
          ${!hasNextPage ? "bg-gray-600 cursor-not-allowed" : "bg-zinc-800 hover:bg-zinc-700"}`}>
        <IoCaretForward />
      </button>
    </div>
  );
};

export default Pagination;

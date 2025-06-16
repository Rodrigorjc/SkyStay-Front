import { MessageResponseVO } from "./message";

export interface ResponsePaginatedVO<T> {
  objects: [T];
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  currentPage: number;
  totalPages: number;
  messages: MessageResponseVO;
}

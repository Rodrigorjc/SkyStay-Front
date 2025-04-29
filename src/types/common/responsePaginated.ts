import { DataVO } from "./data";
import { MessageResponseVO } from "./message";

export interface ResponsePaginatedVO<T> {
  objects: [T];
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  currentPage: Number;
  totalPages: Number;
  messages: MessageResponseVO;
}

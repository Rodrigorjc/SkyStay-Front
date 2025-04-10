import { DataVO } from "./data";
import { MessageResponseVO } from "./message";

export interface ResponseVO<T> {
  response: DataVO<T>;
  messages: MessageResponseVO;
}

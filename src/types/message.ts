import { AppRouter } from "@/server/api/root";
import { inferRouterOutputs } from "@trpc/server";

type RouterOutput = inferRouterOutputs<AppRouter>;

type Messages = RouterOutput["getFileMessages"]["messages"];

type OmitText = Omit<Messages[number], "text">;

type ExtendedText = {
  text: string | React.ReactNode;
};

export type ExtendedMessage = OmitText & ExtendedText;

import {
  Parsed,
  TranslateX12ToJsonCommand,
} from "@stedi/sdk-client-edi-translate";
import { translateClient } from "./clients/translate.js";

const translate = translateClient();

export const translateEdiToJson = async (
  input: string,
  guideId?: string
): Promise<Parsed> => {
  const translateResult = await translate.send(
    new TranslateX12ToJsonCommand({
      input,
      guideId,
    })
  );

  if (!translateResult.output) {
    throw new Error("translation did not return any output");
  }

  return translateResult.output;
};

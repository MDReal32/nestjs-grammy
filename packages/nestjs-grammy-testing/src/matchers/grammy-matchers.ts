/*
 * Copyright 2025 MDReal
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import type { MockApiCall } from "../mock-api";
import type { GrammyBotTester } from "../tester";
import type { MatcherFunction, MatcherResult, SentMessageMatchingOptions, TextMatcher } from "../types";

/**
 * `isTester`
 *
 * Determines whether tester matches the expected shape.
 * @param received - The received value under evaluation.
 * @returns Returns `true` when the condition matches; otherwise, `false`.
 */
const isTester = (received: unknown): received is GrammyBotTester =>
  typeof received === "object" && received !== null && "api" in received && "sendUpdate" in received;

/**
 * `asTester`
 *
 * Normalizes the value as tester.
 * @param received - The received value under evaluation.
 * @returns Returns the computed result.
 */
const asTester = (received: unknown) => {
  if (!isTester(received)) {
    throw new Error("Expected a GrammyBotTester instance");
  }

  return received;
};

/**
 * `payloadOf`
 *
 * Implements the payload of helper.
 * @param call - The recorded API call.
 * @returns Returns the computed result.
 */
const payloadOf = (call: MockApiCall) => {
  if (typeof call.payload === "object" && call.payload !== null) {
    return call.payload as Record<string, unknown>;
  }

  return {};
};

/**
 * `textMatches`
 *
 * Determines whether the actual text matches the expected matcher.
 * @param actual - The actual value being evaluated.
 * @param expected - The expected value to compare against.
 * @returns Returns `true` when the condition matches; otherwise, `false`.
 */
const textMatches = (actual: unknown, expected: TextMatcher) => {
  if (typeof actual !== "string") {
    return false;
  }

  if (typeof expected === "string") {
    return actual === expected;
  }

  return expected.test(actual);
};

/**
 * `matchesPartial`
 *
 * Determines whether the provided values match.
 * @param actual - The actual value being evaluated.
 * @param expected - The expected value to compare against.
 * @returns Returns `true` when the condition matches; otherwise, `false`.
 */
const matchesPartial = (actual: unknown, expected: Record<string, unknown>): boolean => {
  if (typeof actual !== "object" || actual === null) {
    return false;
  }

  const source = actual as Record<string, unknown>;

  return Object.entries(expected).every(([key, value]) => {
    if (value instanceof RegExp) {
      return typeof source[key] === "string" && value.test(source[key]);
    }

    if (typeof value === "object" && value !== null) {
      return matchesPartial(source[key], value as Record<string, unknown>);
    }

    return source[key] === value;
  });
};

/**
 * `matcherResult`
 *
 * Builds a matcher result object for the current assertion.
 * @param pass - Whether the matcher should pass.
 * @param positive - The positive assertion message.
 * @param negative - The negative assertion message.
 * @returns Returns the computed result.
 */
const matcherResult = (pass: boolean, positive: string, negative = positive): MatcherResult => ({
  pass,
  message: () => (pass ? negative : positive)
});

/**
 * `callsFor`
 *
 * Implements the calls for helper.
 * @param tester - The tester instance.
 * @param method - The Telegram API method name.
 * @returns Returns the computed result.
 */
const callsFor = (tester: GrammyBotTester, method: string) => tester.api.callsFor(method);

/**
 * `hasCall`
 *
 * Determines whether call is available.
 * @param tester - The tester instance.
 * @param method - The Telegram API method name.
 * @param predicate - Predicate used to validate the current value.
 * @returns Returns `true` when the condition matches; otherwise, `false`.
 */
const hasCall = (tester: GrammyBotTester, method: string, predicate: (payload: Record<string, unknown>) => boolean) =>
  callsFor(tester, method).some(call => predicate(payloadOf(call)));

/**
 * `sentMessageCalls`
 *
 * Collects the recorded sent-message calls.
 * @param tester - The tester instance.
 * @returns Returns the computed result.
 */
const sentMessageCalls = (tester: GrammyBotTester) => callsFor(tester, "sendMessage");

/**
 * `hasEditedMessageCall`
 *
 * Determines whether edited message call is available.
 * @param tester - The tester instance.
 * @returns Returns `true` when the condition matches; otherwise, `false`.
 */
const hasEditedMessageCall = (tester: GrammyBotTester) =>
  [
    "editMessageText",
    "editMessageCaption",
    "editMessageMedia",
    "editMessageReplyMarkup",
    "editMessageLiveLocation"
  ].some(method => callsFor(tester, method).length > 0);

/**
 * `hasEditedMessagePayload`
 *
 * Determines whether edited message payload is available.
 * @param tester - The tester instance.
 * @param predicate - Predicate used to validate the current value.
 * @returns Returns `true` when the condition matches; otherwise, `false`.
 */
const hasEditedMessagePayload = (tester: GrammyBotTester, predicate: (payload: Record<string, unknown>) => boolean) =>
  ["editMessageText", "editMessageCaption", "editMessageMedia", "editMessageReplyMarkup"].some(method =>
    hasCall(tester, method, predicate)
  );

/**
 * `sentMessageMatches`
 *
 * Determines whether a sent message matches the provided expectations.
 * @param tester - The tester instance.
 * @param options - Optional configuration for the operation.
 * @returns Returns `true` when the condition matches; otherwise, `false`.
 */
const sentMessageMatches = (tester: GrammyBotTester, options: SentMessageMatchingOptions) =>
  sentMessageCalls(tester).some(call => {
    const payload = payloadOf(call);

    if (options.chatId !== undefined && payload.chat_id !== options.chatId) {
      return false;
    }

    if (options.text !== undefined && !textMatches(payload.text, options.text)) {
      return false;
    }

    if (
      options.replyToMessageId !== undefined &&
      payload.reply_to_message_id !== options.replyToMessageId &&
      (payload.reply_parameters as { message_id?: unknown } | undefined)?.message_id !== options.replyToMessageId
    ) {
      return false;
    }

    return true;
  });

/**
 * `buttonMatches`
 *
 * Determines whether the button field matches the expected value.
 * @param value - The current value.
 * @param matcher - The matcher value.
 * @param field - The button field to compare.
 * @returns Returns `true` when the condition matches; otherwise, `false`.
 */
const buttonMatches = (value: unknown, matcher: TextMatcher, field: "text" | "callback_data"): boolean => {
  if (Array.isArray(value)) {
    return value.some(item => buttonMatches(item, matcher, field));
  }

  if (typeof value !== "object" || value === null) {
    return false;
  }

  const source = value as Record<string, unknown>;

  if (field in source) {
    return textMatches(source[field], matcher);
  }

  return Object.values(source).some(item => buttonMatches(item, matcher, field));
};

/**
 * `hasReplyMarkup`
 *
 * Determines whether reply markup is available.
 * @param tester - The tester instance.
 * @param predicate - Predicate used to validate the current value.
 * @returns Returns `true` when the condition matches; otherwise, `false`.
 */
const hasReplyMarkup = (tester: GrammyBotTester, predicate: (markup: Record<string, unknown>) => boolean) =>
  tester.api.calls.some(call => {
    const markup = payloadOf(call).reply_markup;

    return typeof markup === "object" && markup !== null && predicate(markup as Record<string, unknown>);
  });

export const grammyMatchers: Record<string, MatcherFunction> = {
  toHaveHandledUpdate(received) {
    const tester = asTester(received);
    return matcherResult(tester.lastUpdate !== undefined, "Expected bot to have handled an update");
  },
  toHaveHandledCommand(received, command) {
    const tester = asTester(received);
    const normalized = String(command).replace(/^\//, "");
    return matcherResult(
      tester.events.includes(`command:${normalized}`),
      `Expected bot to have handled command "${normalized}"`
    );
  },
  toHaveHandledMessage(received, text) {
    const tester = asTester(received);
    const updateText = tester.lastUpdate?.message?.text;
    const pass = text === undefined ? tester.events.includes("message") : textMatches(updateText, text as TextMatcher);

    return matcherResult(pass, "Expected bot to have handled a matching message");
  },
  toHaveHandledCallbackQuery(received, data) {
    const tester = asTester(received);
    const callbackData = tester.lastUpdate?.callback_query?.data;
    const pass = data === undefined ? tester.events.includes("callback_query") : callbackData === String(data);

    return matcherResult(pass, "Expected bot to have handled a matching callback query");
  },
  toHaveHandledEvent(received, eventType) {
    const tester = asTester(received);
    const event = String(eventType);
    return matcherResult(tester.events.includes(event), `Expected bot to have handled event "${event}"`);
  },
  toHaveEvent(received, eventType) {
    const tester = asTester(received);
    const event = String(eventType);
    return matcherResult(tester.events.includes(event), `Expected tester to have event "${event}"`);
  },
  toHaveEventCount(received, eventType, count) {
    const tester = asTester(received);
    const event = String(eventType);
    const actual = tester.events.filter(item => item === event).length;

    return matcherResult(
      actual === Number(count),
      `Expected event "${event}" count ${String(count)}, received ${actual}`
    );
  },
  toHaveSentMessage(received) {
    return matcherResult(sentMessageCalls(asTester(received)).length > 0, "Expected bot to have sent a message");
  },
  toHaveSentMessageWithText(received, text) {
    return matcherResult(
      sentMessageMatches(asTester(received), { text: text as TextMatcher }),
      "Expected bot to have sent a message with matching text"
    );
  },
  toHaveSentMessageToChat(received, chatId) {
    return matcherResult(
      sentMessageMatches(asTester(received), { chatId: chatId as number | string }),
      `Expected bot to have sent a message to chat ${String(chatId)}`
    );
  },
  toHaveSentMessageMatching(received, options) {
    return matcherResult(
      sentMessageMatches(asTester(received), options as SentMessageMatchingOptions),
      "Expected bot to have sent a message matching options"
    );
  },
  toHaveSentMessagesCount(received, count) {
    const actual = sentMessageCalls(asTester(received)).length;
    return matcherResult(actual === Number(count), `Expected sent message count ${String(count)}, received ${actual}`);
  },
  toHaveReplied(received) {
    const tester = asTester(received);
    const chatId = tester.lastUpdate?.message?.chat.id;
    const pass = chatId === undefined ? sentMessageCalls(tester).length > 0 : sentMessageMatches(tester, { chatId });

    return matcherResult(pass, "Expected bot to have replied");
  },
  toHaveRepliedWithText(received, text) {
    const tester = asTester(received);
    const chatId = tester.lastUpdate?.message?.chat.id;

    return matcherResult(
      sentMessageMatches(tester, { chatId, text: text as TextMatcher }),
      "Expected bot to have replied with matching text"
    );
  },
  toHaveRepliedToMessage(received, messageId) {
    return matcherResult(
      sentMessageMatches(asTester(received), { replyToMessageId: Number(messageId) }),
      `Expected bot to have replied to message ${String(messageId)}`
    );
  },
  toHaveEditedMessage(received) {
    return matcherResult(hasEditedMessageCall(asTester(received)), "Expected bot to have edited a message");
  },
  toHaveEditedMessageText(received, text) {
    return matcherResult(
      hasCall(asTester(received), "editMessageText", payload => textMatches(payload.text, text as TextMatcher)),
      "Expected bot to have edited message text"
    );
  },
  toHaveEditedMessageReplyMarkup(received) {
    return matcherResult(
      hasEditedMessagePayload(asTester(received), payload => payload.reply_markup !== undefined),
      "Expected bot to have edited message reply markup"
    );
  },
  toHaveEditedMessageCaption(received, caption) {
    return matcherResult(
      hasCall(asTester(received), "editMessageCaption", payload =>
        textMatches(payload.caption, caption as TextMatcher)
      ),
      "Expected bot to have edited message caption"
    );
  },
  toHaveAnsweredCallbackQuery(received) {
    return matcherResult(
      callsFor(asTester(received), "answerCallbackQuery").length > 0,
      "Expected bot to have answered a callback query"
    );
  },
  toHaveAnsweredCallbackQueryWithText(received, text) {
    return matcherResult(
      hasCall(asTester(received), "answerCallbackQuery", payload => textMatches(payload.text, text as TextMatcher)),
      "Expected bot to have answered callback query with matching text"
    );
  },
  toHaveAnsweredCallbackQueryWithAlert(received) {
    return matcherResult(
      hasCall(asTester(received), "answerCallbackQuery", payload => payload.show_alert === true),
      "Expected bot to have answered callback query with alert"
    );
  },
  toHaveAnsweredCallbackQueryWithoutAlert(received) {
    return matcherResult(
      hasCall(asTester(received), "answerCallbackQuery", payload => payload.show_alert !== true),
      "Expected bot to have answered callback query without alert"
    );
  },
  toHaveSentInlineKeyboard(received) {
    return matcherResult(
      hasReplyMarkup(asTester(received), markup => Array.isArray(markup.inline_keyboard)),
      "Expected bot to have sent an inline keyboard"
    );
  },
  toHaveSentReplyKeyboard(received) {
    return matcherResult(
      hasReplyMarkup(asTester(received), markup => Array.isArray(markup.keyboard)),
      "Expected bot to have sent a reply keyboard"
    );
  },
  toHaveRemovedKeyboard(received) {
    return matcherResult(
      hasReplyMarkup(asTester(received), markup => markup.remove_keyboard === true),
      "Expected bot to have removed a keyboard"
    );
  },
  toHaveSentButtonWithText(received, text) {
    return matcherResult(
      hasReplyMarkup(asTester(received), markup => buttonMatches(markup, text as TextMatcher, "text")),
      "Expected bot to have sent a button with matching text"
    );
  },
  toHaveSentButtonWithCallbackData(received, data) {
    return matcherResult(
      hasReplyMarkup(asTester(received), markup => buttonMatches(markup, data as TextMatcher, "callback_data")),
      "Expected bot to have sent a button with matching callback data"
    );
  },
  toHaveSentPhoto(received) {
    return matcherResult(callsFor(asTester(received), "sendPhoto").length > 0, "Expected bot to have sent a photo");
  },
  toHaveSentPhotoWithCaption(received, caption) {
    return matcherResult(
      hasCall(asTester(received), "sendPhoto", payload => textMatches(payload.caption, caption as TextMatcher)),
      "Expected bot to have sent a photo with matching caption"
    );
  },
  toHaveSentDocument(received) {
    return matcherResult(
      callsFor(asTester(received), "sendDocument").length > 0,
      "Expected bot to have sent a document"
    );
  },
  toHaveSentVideo(received) {
    return matcherResult(callsFor(asTester(received), "sendVideo").length > 0, "Expected bot to have sent a video");
  },
  toHaveSentAudio(received) {
    return matcherResult(callsFor(asTester(received), "sendAudio").length > 0, "Expected bot to have sent audio");
  },
  toHaveSentVoice(received) {
    return matcherResult(callsFor(asTester(received), "sendVoice").length > 0, "Expected bot to have sent voice");
  },
  toHaveSentMediaGroup(received) {
    return matcherResult(
      callsFor(asTester(received), "sendMediaGroup").length > 0,
      "Expected bot to have sent media group"
    );
  },
  toHaveSentChatAction(received, action) {
    return matcherResult(
      hasCall(asTester(received), "sendChatAction", payload => payload.action === action),
      `Expected bot to have sent chat action "${String(action)}"`
    );
  },
  toHaveSentTypingAction(received) {
    return matcherResult(
      hasCall(asTester(received), "sendChatAction", payload => payload.action === "typing"),
      "Expected bot to have sent typing action"
    );
  },
  toHaveDeletedMessage(received) {
    return matcherResult(
      callsFor(asTester(received), "deleteMessage").length > 0,
      "Expected bot to have deleted a message"
    );
  },
  toHavePinnedMessage(received) {
    return matcherResult(
      callsFor(asTester(received), "pinChatMessage").length > 0,
      "Expected bot to have pinned a message"
    );
  },
  toHaveUnpinnedMessage(received) {
    return matcherResult(
      callsFor(asTester(received), "unpinChatMessage").length > 0,
      "Expected bot to have unpinned a message"
    );
  },
  toHaveCalledTelegramApi(received, method) {
    const apiMethod = String(method);
    return matcherResult(
      callsFor(asTester(received), apiMethod).length > 0,
      `Expected Telegram API method "${apiMethod}"`
    );
  },
  toHaveCalledTelegramApiWith(received, method, expected) {
    const apiMethod = String(method);
    return matcherResult(
      hasCall(asTester(received), apiMethod, payload => matchesPartial(payload, expected as Record<string, unknown>)),
      `Expected Telegram API method "${apiMethod}" with matching payload`
    );
  }
};

import { describe, expect, it } from "vitest";

import { CUSTOM_NOTIFICATION_SOUND, REMINDER_CHANNEL_ID, toNotificationId } from "../notifications";

describe("notifications", () => {
  it("uses custom notification sound and channel id", () => {
    expect(REMINDER_CHANNEL_ID).toBe("foxtrack_reminders");
    expect(CUSTOM_NOTIFICATION_SOUND).toBe("foxtrack_chime.wav");
  });

  it("generates stable positive integer notification IDs", () => {
    const id1 = toNotificationId("task:abc-123");
    const id2 = toNotificationId("task:abc-123");
    const id3 = toNotificationId("habit:abc-123");

    expect(id1).toBe(id2);
    expect(id1).not.toBe(id3);
    expect(id1).toBeGreaterThan(0);
    expect(Number.isInteger(id1)).toBe(true);
  });
});

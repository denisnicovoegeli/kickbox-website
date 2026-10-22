import { afterEach, describe, expect, it, vi } from "vitest";
import { createFakeSender, createResendSender } from "./email";

vi.mock("server-only", () => ({}));

afterEach(() => vi.unstubAllGlobals());

describe("createResendSender", () => {
  it("posts the message to the Resend API", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await createResendSender("key", "Gym <info@example.ch>").send({
      to: "owner@example.ch",
      subject: "Hello",
      text: "Body",
    });

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.resend.com/emails");
    expect(init.headers.Authorization).toBe("Bearer key");
    expect(JSON.parse(init.body)).toMatchObject({
      to: ["owner@example.ch"],
      subject: "Hello",
    });
  });

  it("throws when Resend rejects the message", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(null, { status: 422 })),
    );
    await expect(
      createResendSender("key", "from@example.ch").send({
        to: "a@b.ch",
        subject: "s",
        text: "t",
      }),
    ).rejects.toThrow("422");
  });
});

describe("createFakeSender", () => {
  it("records sent messages", async () => {
    const sender = createFakeSender();
    await sender.send({ to: "a@b.ch", subject: "s", text: "t" });
    expect(sender.sent).toHaveLength(1);
  });
});

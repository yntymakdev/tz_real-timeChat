import { NextResponse } from "next/server";
import Pusher from "pusher";

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!, // server-side secret
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

export async function POST(req: Request) {
  try {
    const { action, channelId, message, participants, channel, userId } = await req.json();

    switch (action) {
      case "message":
        if (!channelId || !message) return NextResponse.json({ error: "Missing data" }, { status: 400 });
        await pusher.trigger(`private-${channelId}`, "new-message", { message });
        break;

      case "participants-update":
        if (!channelId || !participants) return NextResponse.json({ error: "Missing data" }, { status: 400 });
        await pusher.trigger(`private-${channelId}`, "participants", { participants });
        break;

      case "remove-user":
        if (!channelId || !userId) return NextResponse.json({ error: "Missing data" }, { status: 400 });
        await pusher.trigger(`private-${channelId}`, "user-removed", { userId });
        break;

      case "createChannel":
        if (!channel) return NextResponse.json({ error: "Missing data" }, { status: 400 });
        await pusher.trigger("public-channels", "channels-updated", { channel });
        break;

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Pusher trigger error:", err);
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}

import type { Metadata } from "next";
import FriendInbox from "@/components/viral/FriendInbox";

export const metadata: Metadata = {
  title: "내 질문의 결과함",
  description: "내가 만든 질문에 도착한 친구들의 답변을 확인하세요.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/tools/friend-inbox" },
  referrer: "no-referrer",
};
export default function FriendInboxPage() { return <FriendInbox />; }

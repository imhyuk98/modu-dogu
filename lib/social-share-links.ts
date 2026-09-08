export type SocialNetwork = "x" | "line";

/** Encode the whole URL, including private result fragments, exactly once. */
export function socialShareLink(network: SocialNetwork, text: string, destination: string) {
  const target = new URL(destination);
  if (!["http:", "https:"].includes(target.protocol)) throw new Error("Invalid share URL");
  const link = new URL(network === "x" ? "https://x.com/intent/tweet" : "https://social-plugins.line.me/lineit/share");
  link.searchParams.set("text", text);
  link.searchParams.set("url", target.href);
  return link.href;
}

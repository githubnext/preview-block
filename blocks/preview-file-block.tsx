import { FolderBlockProps } from "@githubnext/blocks";
import { useEffect, useState } from "react";

export default function (props: FolderBlockProps) {
  const { context, onRequestGitHubData } = props;

  const [sha, setSha] = useState(context.sha);

  const relativePath = context.path
    .replace("pages/", "")
    .split(".")[0]
  const url = `https://${context.owner}.github.io/${context.repo}/${sha}/${relativePath}`

  const updateSha = async () => {
    if (sha !== "HEAD") return
    const res = await onRequestGitHubData(`/repos/${context.owner}/${context.repo}/git/refs/heads/main`);
    const defaultSha = res.object.sha
    setSha(defaultSha)
  }
  useEffect(() => {
    updateSha()
  }, [context.sha]);

  if (!url || sha === "HEAD") return null

  return (
    <iframe
      src={url}
      style={{
        width: "100%",
        height: "100%",
        border: "none",
      }}
    />
  );
}
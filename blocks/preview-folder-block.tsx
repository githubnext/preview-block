import { FolderBlockProps } from "@githubnext/blocks";
import { useEffect, useState } from "react";

export default function (props: FolderBlockProps) {
  const { context, onRequestGitHubData } = props;

  const [url, setUrl] = useState<string | null>(null);

  const updateUrl = async () => {
    let sha = context.sha;
    if (sha === "HEAD") sha = "main"

    const isShaBranchName = sha.length !== 40;
    if (isShaBranchName) {
      try {
        const res = await onRequestGitHubData(
          `/repos/${context.owner}/${context.repo}/git/refs/heads/${sha}`
        );
        sha = res.object.sha
      } catch { }
    }

    const relativePath = context.path
      .replace("pages/", "")
      .split(".")[0]
    const url = `https://${context.owner}.github.io/${context.repo}/${sha}/${relativePath}`
    setUrl(url)
  }

  useEffect(() => {
    updateUrl()
  }, [context.sha]);

  if (!url) return null

  return (
    <iframe
      src={url}
      style={{
        width: "100%",
        height: "100vh",
        border: "none",
      }}
    />
  );
}
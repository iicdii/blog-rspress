import { usePageData } from "rspress/runtime";

const formatDate = (date: string) => {
  return new Date(date)
    .toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/\./g, ". ");
};

const ArticleInfo = () => {
  const { page } = usePageData();

  const { created } = page.frontmatter;

  return (
    <div className="mb-6">
      {created ? <span>📅 {formatDate(created as string)}</span> : ""}
    </div>
  );
};

export default ArticleInfo;

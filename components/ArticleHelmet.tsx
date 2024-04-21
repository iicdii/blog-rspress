import { usePageData, Helmet } from "rspress/runtime";

const ArticleHelmet = () => {
  const { page } = usePageData();

  return (
    <Helmet>
      {!!page.title && <meta property="og:title" content={page.title} />}
    </Helmet>
  );
};

export default ArticleHelmet;

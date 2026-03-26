import { definePlugin, staticClasses } from "@decky/ui";
import { FC, useEffect, useState } from "react";

import { getCurrentAppId } from "./helpers";
import HQLogo from "./pages/HQLogo";
import HomePage from "./pages/home";
import { ReviewPage } from "./pages/review";
import { getLatestReviews, getNews, getReviewForApp } from "./requests";
import { GameReview, NewsItem } from "./sdhq-types";

const Content: FC = () => {
  const [page, setPage] = useState<"home" | "review">("home");
  const [newsItems, setNewsitems] = useState<NewsItem[]>([]);
  const [review, setReview] = useState<GameReview | null | undefined>();
  const [currentAppId, setCurrentAppId] = useState<string | null | undefined>(
    undefined,
  );
  const [latestReviews, setLatestReviews] = useState<GameReview[] | null>(null);

  useEffect(() => {
    if (currentAppId === undefined) {
      return;
    }

    if (currentAppId === null) {
      setReview(null);
      setPage("home");
      return;
    }

    let cancelled = false;

    const loadReview = async () => {
      const nextReview = await getReviewForApp(currentAppId);
      if (cancelled) {
        return;
      }

      setReview(nextReview);
      setPage("home");
    };

    loadReview();

    return () => {
      cancelled = true;
    };
  }, [currentAppId]);

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      const [appId, news, reviews] = await Promise.all([
        getCurrentAppId(),
        getNews(),
        getLatestReviews(),
      ]);
      if (cancelled) {
        return;
      }

      setCurrentAppId(appId);
      setNewsitems(news);
      setLatestReviews(reviews);
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  if (page === "review" && review) {
    return <ReviewPage review={review} setPage={setPage} />;
  }

  return (
    <HomePage
      review={review}
      newsItems={newsItems}
      setPage={setPage}
      reviewItems={latestReviews}
      appIsActive={currentAppId !== null}
    />
  );
};

export default definePlugin(() => {
  return {
    name: "Steam Deck HQ",
    title: <div className={staticClasses.Title}>Steam Deck HQ</div>,
    content: <Content />,
    icon: <HQLogo />,
    onDismount() {},
  };
});

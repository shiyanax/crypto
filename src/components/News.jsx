import { useState } from "react";
import { ExternalLink } from "lucide-react";

import { useGetCryptoNewsQuery } from "../services/cryptoNewsApi";
import { Card, CardContent } from "./ui/card";
import { Select } from "./ui/select";
import { Skeleton } from "./ui/skeleton";
import Seo from "./Seo";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1640161704729-cbe966a08476?auto=format&fit=crop&w=480&q=70";

const categories = [
  "cryptocurrency",
  "bitcoin",
  "ethereum",
  "blockchain",
  "defi",
  "nft",
];

const formatNewsDate = (date) => {
  if (!date) return "Recent";

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const News = ({ simplified = false }) => {
  const [newsCategory, setNewsCategory] = useState("cryptocurrency");
  const count = simplified ? 3 : 12;
  const hasNewsApiKey = Boolean(import.meta.env.VITE_NEWSDATA_API_KEY);
  const { data, isFetching, isError } = useGetCryptoNewsQuery(
    {
      newsCategory,
      count,
    },
    {
      skip: !hasNewsApiKey,
      refetchOnMountOrArgChange: false,
    }
  );

  const news = data?.results || [];

  if (isFetching) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {!simplified && (
          <Seo
            title="Crypto News"
            description="Read the latest cryptocurrency, bitcoin, ethereum, blockchain, DeFi, and NFT news."
          />
        )}
        {Array.from({ length: count }).map((_, index) => (
          <Skeleton key={index} className="h-80" />
        ))}
      </div>
    );
  }

  if (!hasNewsApiKey || isError) {
    return (
      <Card>
        {!simplified && (
          <Seo
            title="Crypto News"
            description="Read the latest cryptocurrency, bitcoin, ethereum, blockchain, DeFi, and NFT news."
          />
        )}
        <CardContent className="p-6 text-sm text-zinc-500">
          News unavailable.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {!simplified && (
        <Seo
          title="Crypto News"
          description="Read the latest cryptocurrency, bitcoin, ethereum, blockchain, DeFi, and NFT news."
        />
      )}

      {!simplified && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-normal">Crypto News</h1>
            <p className="mt-2 text-sm text-zinc-500">
              Latest English crypto headlines from NewsData.io.
            </p>
          </div>
          <Select
            className="sm:w-56"
            value={newsCategory}
            onChange={(event) => setNewsCategory(event.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {news.map((item) => (
          <a key={item.article_id || item.link} href={item.link} target="_blank" rel="noreferrer">
            <Card className="h-full overflow-hidden transition hover:-translate-y-1 hover:shadow-md">
              <img
                src={item.image_url || FALLBACK_IMAGE}
                alt={item.title}
                className="h-44 w-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <CardContent className="flex h-[calc(100%-11rem)] flex-col p-5">
                <h2 className="line-clamp-2 text-lg font-bold leading-snug">
                  {item.title}
                </h2>
                <p className="mt-3 line-clamp-3 text-sm text-zinc-600">
                  {item.description || "No description available."}
                </p>
                <div className="mt-auto flex items-center justify-between gap-3 pt-5 text-xs text-zinc-500">
                  <span className="truncate">{item.source_id || "NewsData"}</span>
                  <span>{formatNewsDate(item.pubDate)}</span>
                </div>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-zinc-950">
                  Read story <ExternalLink className="h-4 w-4" />
                </span>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>

      {!news.length && (
        <Card>
          <CardContent className="p-6 text-sm text-zinc-500">
            No news stories were found for this category.
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default News;

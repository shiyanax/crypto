import { useState } from "react";
import { Link, useParams } from "react-router";
import { Line } from "react-chartjs-2";
import { millify } from "millify";
import parse from "html-react-parser";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from "chart.js";
import {
  Activity,
  ArrowLeft,
  DollarSign,
  ExternalLink,
  Hash,
  LineChart,
  Trophy,
} from "lucide-react";

import {
  useGetCryptoDetailsQuery,
  useGetCryptoHistoryQuery,
} from "../services/cryptoApi";
import { useGetCryptoNewsQuery } from "../services/cryptoNewsApi";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Select } from "./ui/select";
import { Skeleton } from "./ui/skeleton";
import Seo from "./Seo";

const FALLBACK_NEWS_IMAGE =
  "https://images.unsplash.com/photo-1640161704729-cbe966a08476?auto=format&fit=crop&w=160&q=70";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler
);

const timeperiods = [
  { label: "24 hours", value: "1" },
  { label: "7 days", value: "7" },
  { label: "30 days", value: "30" },
  { label: "1 year", value: "365" },
];

const formatCoinName = (coinId) =>
  coinId
    ?.split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ") || "Cryptocurrency";

const CryptoDetails = () => {
  const { coinId } = useParams();
  const [timeperiod, setTimeperiod] = useState("7");

  const {
    data: coin,
    isFetching: isFetchingCoin,
    isError: isCoinError,
  } = useGetCryptoDetailsQuery(coinId, {
    refetchOnMountOrArgChange: false,
  });
  const { data: history, isFetching: isFetchingHistory } =
    useGetCryptoHistoryQuery(
      { coinId, timeperiod },
      { refetchOnMountOrArgChange: false }
    );
  const hasNewsApiKey = Boolean(import.meta.env.VITE_NEWSDATA_API_KEY);
  const {
    data: relatedNewsData,
    isFetching: isFetchingRelatedNews,
    isError: isRelatedNewsError,
  } = useGetCryptoNewsQuery(
    { newsCategory: coin?.name || "cryptocurrency", count: 3 },
    { skip: !coin?.name || !hasNewsApiKey, refetchOnMountOrArgChange: false }
  );

  if (isFetchingCoin) {
    const fallbackName = formatCoinName(coinId);

    return (
      <div className="space-y-4">
        <Seo
          title={`${fallbackName} Price`}
          description={`View ${fallbackName} price, market cap, volume, chart history, links, and related crypto news.`}
        />
        <Skeleton className="h-28" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (isCoinError || !coin) {
    return (
      <Card>
        <Seo
          title={`${formatCoinName(coinId)} Price`}
          description={`View ${formatCoinName(
            coinId
          )} price, market cap, volume, chart history, links, and related crypto news.`}
        />
        <CardContent className="p-6 text-sm text-zinc-500">
          Unable to load this cryptocurrency.
        </CardContent>
      </Card>
    );
  }

  const marketData = coin.market_data || {};
  const relatedNews = relatedNewsData?.results || [];
  const stats = [
    {
      label: "Rank",
      value: `#${coin.market_cap_rank || "N/A"}`,
      icon: Trophy,
    },
    {
      label: "Current Price",
      value: `$${millify(marketData.current_price?.usd || 0)}`,
      icon: DollarSign,
    },
    {
      label: "Market Cap",
      value: `$${millify(marketData.market_cap?.usd || 0)}`,
      icon: Hash,
    },
    {
      label: "24h Volume",
      value: `$${millify(marketData.total_volume?.usd || 0)}`,
      icon: Activity,
    },
  ];

  const chartData = {
    labels:
      history?.prices?.map((price) =>
        new Date(price[0]).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })
      ) || [],
    datasets: [
      {
        label: "Price in USD",
        data: history?.prices?.map((price) => price[1]) || [],
        borderColor: "#18181b",
        backgroundColor: "rgba(24, 24, 27, 0.08)",
        borderWidth: 2,
        fill: true,
        pointRadius: 0,
        tension: 0.35,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `$${millify(context.parsed.y || 0)}`,
        },
      },
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        ticks: {
          callback: (value) => `$${millify(value)}`,
        },
      },
    },
  };

  return (
    <section className="space-y-6">
      <Seo
        title={`${coin.name} Price`}
        description={`View ${coin.name} price, market cap, 24 hour volume, chart history, official links, and related crypto news.`}
        image={coin.image?.large}
      />

      <Link
        to="/cryptocurrencies"
        className="inline-flex items-center gap-2 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-950"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Cryptocurrencies
      </Link>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex items-center gap-4">
          <img
            src={coin.image?.large}
            alt={coin.name}
            className="h-16 w-16 rounded-full"
            decoding="async"
          />
          <div>
            <h1 className="text-3xl font-bold tracking-normal">
              {coin.name} Price
            </h1>
            <p className="mt-1 text-sm uppercase text-zinc-500">
              {coin.symbol} / USD
            </p>
          </div>
        </div>
        <Select
          className="lg:w-48"
          value={timeperiod}
          onChange={(event) => setTimeperiod(event.target.value)}
        >
          {timeperiods.map((period) => (
            <option key={period.value} value={period.value}>
              {period.label}
            </option>
          ))}
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="rounded-md bg-zinc-100 p-3">
                <Icon className="h-5 w-5 text-zinc-700" />
              </div>
              <div>
                <p className="text-sm text-zinc-500">{label}</p>
                <p className="text-xl font-bold">{value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <LineChart className="h-5 w-5" />
            Price History
          </CardTitle>
          <p className="text-sm font-medium text-zinc-500">
            {marketData.price_change_percentage_24h
              ? `${millify(marketData.price_change_percentage_24h)}% today`
              : "No daily change"}
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            {isFetchingHistory ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <Line data={chartData} options={chartOptions} />
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(360px,0.75fr)]">
        <Card>
          <CardHeader>
            <CardTitle>About {coin.name}</CardTitle>
          </CardHeader>
          <CardContent className="coin-description space-y-4 text-sm leading-7 text-zinc-600">
            {parse(coin.description?.en || "No description available.")}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{coin.name} Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {coin.links?.homepage?.filter(Boolean).slice(0, 3).map((link) => (
                <a
                  key={link}
                  href={link}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-md border border-zinc-200 px-4 py-3 text-sm font-semibold hover:bg-zinc-50"
                >
                  Website
                  <ExternalLink className="h-4 w-4" />
                </a>
              ))}
              {coin.links?.blockchain_site
                ?.filter(Boolean)
                .slice(0, 4)
                .map((link) => (
                  <a
                    key={link}
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between rounded-md border border-zinc-200 px-4 py-3 text-sm font-semibold hover:bg-zinc-50"
                  >
                    Explorer
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Related News</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!hasNewsApiKey && (
                <p className="rounded-md border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-500">
                  News unavailable.
                </p>
              )}

              {hasNewsApiKey && isFetchingRelatedNews && (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton key={index} className="h-24 w-full" />
                  ))}
                </div>
              )}

              {hasNewsApiKey && isRelatedNewsError && (
                <p className="rounded-md border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-500">
                  News unavailable.
                </p>
              )}

              {hasNewsApiKey &&
                !isFetchingRelatedNews &&
                !isRelatedNewsError &&
                relatedNews.slice(0, 3).map((article) => (
                  <a
                    key={article.article_id || article.link}
                    href={article.link}
                    target="_blank"
                    rel="noreferrer"
                    className="flex gap-3 rounded-md border border-zinc-200 p-3 transition hover:bg-zinc-50"
                  >
                    <img
                      src={article.image_url || FALLBACK_NEWS_IMAGE}
                      alt={article.title}
                      className="h-16 w-16 shrink-0 rounded-md object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="min-w-0">
                      <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-zinc-950">
                        {article.title}
                      </h3>
                      <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1 text-xs text-zinc-500">
                        <span>{article.source_id || "NewsData"}</span>
                        <span>
                          {article.pubDate
                            ? new Date(article.pubDate).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )
                            : "Recent"}
                        </span>
                      </div>
                    </div>
                  </a>
                ))}

              {hasNewsApiKey &&
                !isFetchingRelatedNews &&
                !isRelatedNewsError &&
                !relatedNews.length && (
                  <p className="rounded-md border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-500">
                    No related news found for {coin.name}.
                  </p>
                )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CryptoDetails;

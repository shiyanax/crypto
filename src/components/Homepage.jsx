import { lazy, Suspense, useState } from "react";
import { millify } from "millify";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";

import { useGetGlobalStatsQuery } from "../services/cryptoApi";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import Cryptocurrencies from "./Cryptocurrencies";
import Seo from "./Seo";

const News = lazy(() => import("./News"));

const StatCard = ({ title, value }) => (
  <Card>
    <CardHeader className="pb-3">
      <CardTitle className="text-sm font-medium text-zinc-500">
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-2xl font-bold text-zinc-950">{value}</p>
    </CardContent>
  </Card>
);

const Homepage = () => {
  const { data: globalData, isFetching } = useGetGlobalStatsQuery(undefined, {
    refetchOnMountOrArgChange: false,
  });
  const [showNews, setShowNews] = useState(false);
  const globalStats = globalData?.data;

  const stats = [
    {
      title: "Total Cryptocurrencies",
      value: millify(globalStats?.active_cryptocurrencies || 0),
    },
    {
      title: "Total Exchanges or Markets",
      value: millify(globalStats?.markets || 0),
    },
    {
      title: "Total Market Cap",
      value: `$${millify(globalStats?.total_market_cap?.usd || 0)}`,
    },
    {
      title: "Total 24h Volume",
      value: `$${millify(globalStats?.total_volume?.usd || 0)}`,
    },
    {
      title: "BTC Market Cap Percentage",
      value: `${millify(globalStats?.market_cap_percentage?.btc || 0)}%`,
    },
    {
      title: "Total Markets",
      value: millify(globalStats?.markets || 0),
    },
  ];

  return (
    <div className="space-y-10">
      <Seo
        title="Crypto Dashboard"
        description="View global crypto market stats, top cryptocurrencies, and latest crypto news on Shiyanax."
      />

      <section>
        <h1 className="text-3xl font-bold tracking-normal text-zinc-950">
          Global Crypto Stats
        </h1>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {isFetching
            ? Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-28" />
              ))
            : stats.map((stat) => <StatCard key={stat.title} {...stat} />)}
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold tracking-normal">
            Top 12 Cryptocurrencies
          </h2>
          <Link
            className="inline-flex items-center gap-1 text-sm font-semibold text-zinc-700 hover:text-zinc-950"
            to="/cryptocurrencies"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <Cryptocurrencies simplified onLoaded={() => setShowNews(true)} />
      </section>

      {showNews && !isFetching && (
        <section>
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="text-2xl font-bold tracking-normal">
              Latest Crypto News
            </h2>
            <Link
              className="inline-flex items-center gap-1 text-sm font-semibold text-zinc-700 hover:text-zinc-950"
              to="/news"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <Suspense
            fallback={
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} className="h-80" />
                ))}
              </div>
            }
          >
            <News simplified />
          </Suspense>
        </section>
      )}
    </div>
  );
};

export default Homepage;

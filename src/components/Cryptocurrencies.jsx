import { useEffect, useState } from "react";
import { millify } from "millify";
import { Link } from "react-router";

import { useGetCryptosQuery } from "../services/cryptoApi";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Skeleton } from "./ui/skeleton";
import Seo from "./Seo";

const Cryptocurrencies = ({ simplified = false, onLoaded }) => {
  const count = simplified ? 12 : 100;
  const { data: cryptosList, isFetching, isError } = useGetCryptosQuery(
    count,
    {
      refetchOnMountOrArgChange: false,
    }
  );

  const [searchTerm, setSearchTerm] = useState("");
  const cryptos =
    cryptosList?.filter((coin) =>
      coin.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  useEffect(() => {
    if (!isFetching && !isError && cryptosList?.length) {
      onLoaded?.();
    }
  }, [cryptosList, isError, isFetching, onLoaded]);

  if (isFetching) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: count > 12 ? 12 : count }).map((_, index) => (
          <Skeleton key={index} className="h-56" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-zinc-500">
          Unable to load cryptocurrencies right now.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {!simplified && (
        <Seo
          title="Cryptocurrencies"
          description="Browse live cryptocurrency prices, market caps, ranks, and 24 hour price changes."
        />
      )}

      {!simplified && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-normal">
              Cryptocurrencies
            </h1>
            <p className="mt-2 text-sm text-zinc-500">
              Search live market data from CoinGecko.
            </p>
          </div>
          <div className="w-full max-w-sm">
            <Input
              placeholder="Search cryptocurrency"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cryptos.map((currency) => {
          const dailyChange = currency.price_change_percentage_24h || 0;

          return (
            <Link key={currency.id} to={`/crypto/${currency.id}`}>
              <Card className="h-full transition hover:-translate-y-1 hover:shadow-md">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <CardTitle className="leading-snug">
                      {currency.market_cap_rank}. {currency.name}
                    </CardTitle>
                    <img
                      className="h-10 w-10 rounded-full"
                      src={currency.image}
                      alt={currency.name}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-zinc-600">
                  <p>
                    Price:{" "}
                    <span className="font-semibold text-zinc-950">
                      ${millify(currency.current_price || 0)}
                    </span>
                  </p>
                  <p>
                    Market Cap:{" "}
                    <span className="font-semibold text-zinc-950">
                      ${millify(currency.market_cap || 0)}
                    </span>
                  </p>
                  <div className="flex items-center justify-between gap-3">
                    <span>24h Change</span>
                    <Badge variant={dailyChange >= 0 ? "positive" : "negative"}>
                      {millify(dailyChange)}%
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {!cryptos.length && (
        <Card>
          <CardContent className="p-6 text-sm text-zinc-500">
            No cryptocurrencies matched your search.
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Cryptocurrencies;

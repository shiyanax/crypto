import { ExternalLink } from "lucide-react";
import { millify } from "millify";

import { useGetExchangesQuery } from "../services/cryptoApi";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import Seo from "./Seo";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

const Exchanges = () => {
  const { data: exchanges, isFetching, isError } = useGetExchangesQuery();

  if (isFetching) {
    return (
      <div className="space-y-4">
        <Seo
          title="Crypto Exchanges"
          description="Compare cryptocurrency exchanges by trust score, country, trading volume, and launch year."
        />
        <Skeleton className="h-10 w-56" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <Card>
        <Seo
          title="Crypto Exchanges"
          description="Compare cryptocurrency exchanges by trust score, country, trading volume, and launch year."
        />
        <CardContent className="p-6 text-sm text-zinc-500">
          Unable to load exchanges right now.
        </CardContent>
      </Card>
    );
  }

  if (!exchanges?.length) {
    return (
      <Card>
        <Seo
          title="Crypto Exchanges"
          description="Compare cryptocurrency exchanges by trust score, country, trading volume, and launch year."
        />
        <CardContent className="p-6 text-sm text-zinc-500">
          No exchanges were found.
        </CardContent>
      </Card>
    );
  }

  return (
    <section className="space-y-6">
      <Seo
        title="Crypto Exchanges"
        description="Compare cryptocurrency exchanges by trust score, country, trading volume, and launch year."
      />

      <div>
        <h1 className="text-3xl font-bold tracking-normal">Exchanges</h1>
        <p className="mt-2 text-sm text-zinc-500">
          Top cryptocurrency exchanges from CoinGecko.
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Exchange</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Trust Score</TableHead>
                <TableHead>24h BTC Volume</TableHead>
                <TableHead>Established</TableHead>
                <TableHead>Website</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exchanges.map((exchange) => (
                <TableRow key={exchange.id}>
                  <TableCell>
                    <div className="flex min-w-52 items-center gap-3">
                      <img
                        src={exchange.image}
                        alt={exchange.name}
                        className="h-9 w-9 rounded-full"
                      />
                      <span className="font-semibold text-zinc-950">
                        {exchange.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{exchange.country || "Not listed"}</TableCell>
                  <TableCell>
                    <Badge variant="default">{exchange.trust_score ?? "N/A"}</Badge>
                  </TableCell>
                  <TableCell>
                    {millify(exchange.trade_volume_24h_btc || 0)} BTC
                  </TableCell>
                  <TableCell>
                    {exchange.year_established || "Not listed"}
                  </TableCell>
                  <TableCell>
                    {exchange.url ? (
                      <a
                        href={exchange.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-medium text-zinc-950 hover:text-zinc-600"
                      >
                        Visit <ExternalLink className="h-4 w-4" />
                      </a>
                    ) : (
                      "Not listed"
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  );
};

export default Exchanges;

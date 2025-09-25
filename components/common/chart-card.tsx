import { Card, CardContent, CardHeader, CardTitle } from "../shadcn/card";
import { Skeleton } from "../shadcn/skeleton";

export function ChartCard({
  title,
  chart,
  loading,
  error,
}: {
  title: string;
  chart: React.ReactNode;
  loading: boolean;
  error: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-40 w-full" />
        ) : error ? (
          <div className="text-red-500 text-sm">Error loading data.</div>
        ) : (
          chart
        )}
      </CardContent>
    </Card>
  );
}

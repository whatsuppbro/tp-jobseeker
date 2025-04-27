import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface StatCardProps {
  Icon?: React.ReactNode;
  title: string;
  description: string;
  value: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  Icon,
  title,
  description,
  value,
}) => (
  <Card className="shadow-md border border-gray-200">
    <CardHeader>
    <div className="flex items-center gap-2">
        {Icon && <div className="text-xl text-primary">{Icon}</div>}
        <CardTitle className="text-lg font-semibold text-gray-800">
          {title}
        </CardTitle>
      </div>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent>
      <p className="text-2xl font-bold">{value}</p>
    </CardContent>
  </Card>
);

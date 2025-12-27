import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cities, salaryData, roles } from '@/lib/data';

export default function CityIntelligencePage() {
  // Calculate ROI score (Salary / Cost of Living Index)
  // Higher score is better
  const cityDataWithRoi = roles.flatMap((role) => {
    return cities.map((city) => {
      const salary = salaryData.find(
        (s) => s.cityName === city.name && s.role === role
      );
      const roi = salary
        ? (salary.averageSalary / city.costOfLivingIndex).toFixed(0)
        : 'N/A';
      return {
        role,
        city: city.name,
        salary: salary?.averageSalary,
        costOfLiving: city.costOfLivingIndex,
        roi: roi !== 'N/A' ? parseInt(roi) : 0,
      };
    });
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">City Intelligence</h1>
        <p className="text-muted-foreground">
          Make informed career decisions by comparing cities.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">
            City Comparison: Salary vs. Cost of Living
          </CardTitle>
          <CardDescription>
            Analyze salary, cost of living, and return on investment (ROI) for
            different roles across cities.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Role</TableHead>
                <TableHead>City</TableHead>
                <TableHead className="text-right">Average Salary (INR)</TableHead>
                <TableHead className="text-right">Cost of Living Index</TableHead>
                <TableHead className="text-right">ROI Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cityDataWithRoi.map((data, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{data.role}</TableCell>
                  <TableCell>{data.city}</TableCell>
                  <TableCell className="text-right">
                    {data.salary
                      ? `₹${data.salary.toLocaleString('en-IN')}`
                      : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right">
                    {data.costOfLiving}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {data.roi > 0 ? data.roi.toLocaleString('en-IN') : 'N/A'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

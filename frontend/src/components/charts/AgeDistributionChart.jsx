import React from 'react';
import { BarChart } from '../ui/bar-chart';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export function AgeDistributionChart({ data }) {
  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        label: 'Age Distribution',
        data: Object.values(data),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderRadius: 6,
      },
    ],
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Age Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <BarChart data={chartData} />
      </CardContent>
    </Card>
  )
} 
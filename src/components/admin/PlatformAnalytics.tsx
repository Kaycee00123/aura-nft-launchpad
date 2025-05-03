
import { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

// Mock data for analytics
const mockDailyData = [
  { date: '05/01', mints: 45, revenue: 12.5, users: 78 },
  { date: '05/02', mints: 52, revenue: 14.2, users: 85 },
  { date: '05/03', mints: 48, revenue: 13.1, users: 81 },
  { date: '05/04', mints: 61, revenue: 16.8, users: 92 },
  { date: '05/05', mints: 55, revenue: 15.2, users: 88 },
  { date: '05/06', mints: 67, revenue: 18.5, users: 95 },
  { date: '05/07', mints: 72, revenue: 20.1, users: 103 },
];

const mockCollectionData = [
  { name: 'Cosmic Creatures', mints: 245, revenue: 68.2 },
  { name: 'Digital Dreams', mints: 189, revenue: 52.5 },
  { name: 'Neon Nightmares', mints: 210, revenue: 58.3 },
  { name: 'Abstract Algorithms', mints: 176, revenue: 48.9 },
  { name: 'Virtual Vistas', mints: 156, revenue: 43.2 },
];

const PlatformAnalytics = () => {
  // In a real app, these would be fetched from an API
  const totalMints = 2486;
  const totalRevenue = 689.75;
  const totalUsers = 1254;
  const totalCollections = 37;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Platform Analytics</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Mints</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMints}</div>
            <p className="text-xs text-muted-foreground">+125 from last week</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRevenue} ETH</div>
            <p className="text-xs text-muted-foreground">+32.5 ETH from last week</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">+37 from last week</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Collections</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCollections}</div>
            <p className="text-xs text-muted-foreground">+5 from last week</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Mints and Revenue */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Performance</CardTitle>
            <CardDescription>Mints and revenue over the past week</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockDailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="mints" 
                  stroke="#8884d8" 
                  activeDot={{ r: 8 }} 
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#82ca9d" 
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Collections */}
        <Card>
          <CardHeader>
            <CardTitle>Top Collections</CardTitle>
            <CardDescription>Performance by collection</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockCollectionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="mints" fill="#8884d8" />
                <Bar dataKey="revenue" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlatformAnalytics;

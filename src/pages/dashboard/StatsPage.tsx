
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { mockNFTDrops } from "@/lib/mock-data";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Generate mock data for the charts
const generateWeeklyData = () => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return days.map(day => ({
    name: day,
    sales: Math.floor(Math.random() * 50) + 5,
    visitors: Math.floor(Math.random() * 200) + 50,
  }));
};

const generateMonthlyData = () => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  return months.map(month => ({
    name: month,
    revenue: Math.floor(Math.random() * 10) + 1,
  }));
};

const generatePieData = () => {
  return [
    { name: "Ethereum", value: 65 },
    { name: "Polygon", value: 20 },
    { name: "Solana", value: 15 },
  ];
};

const StatsPage = () => {
  const [timePeriod, setTimePeriod] = useState("week");
  const weeklyData = generateWeeklyData();
  const monthlyData = generateMonthlyData();
  const pieData = generatePieData();
  
  // Color constants
  const COLORS = ["#9b87f5", "#d6bcfa", "#e5deff", "#7e69ab"];
  
  // Mock stats
  const totalRevenue = "23.5 ETH";
  const totalMinted = 347;
  const avgMintPrice = "0.068 ETH";
  const uniqueCollectors = 215;
  
  // Count drops by status
  const dropCounts = {
    active: mockNFTDrops.filter(drop => drop.status === "active").length,
    upcoming: mockNFTDrops.filter(drop => drop.status === "upcoming").length,
    ended: mockNFTDrops.filter(drop => drop.status === "ended").length,
    total: mockNFTDrops.length,
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-500">Analytics and performance metrics</p>
        </div>
        
        <Select
          value={timePeriod}
          onValueChange={setTimePeriod}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Last week</SelectItem>
            <SelectItem value="month">Last month</SelectItem>
            <SelectItem value="year">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Stats Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRevenue}</div>
            <p className="text-xs text-green-600 mt-1">+12.5% from last period</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              NFTs Minted
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMinted}</div>
            <p className="text-xs text-green-600 mt-1">+5.3% from last period</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Avg. Mint Price
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgMintPrice}</div>
            <p className="text-xs text-red-600 mt-1">-2.1% from last period</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Unique Collectors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueCollectors}</div>
            <p className="text-xs text-green-600 mt-1">+8.7% from last period</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Drop Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Active Drops
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dropCounts.active}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Upcoming Drops
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dropCounts.upcoming}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Ended Drops
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dropCounts.ended}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Drops
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dropCounts.total}</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={weeklyData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sales" fill="#9b87f5" name="Sales" />
                  <Bar dataKey="visitors" fill="#d6bcfa" name="Visitors" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monthlyData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} ETH`, "Revenue"]} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#9b87f5"
                    activeDot={{ r: 8 }}
                    name="Revenue (ETH)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Revenue by Blockchain</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsPage;

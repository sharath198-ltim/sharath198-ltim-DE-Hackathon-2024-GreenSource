import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { MapPin, Users, ShoppingBag, Truck, DollarSign } from "react-feather";

// Sample data for the income graph
const monthlyIncomeData = [
  { month: "Jan", income: 2500 },
  { month: "Feb", income: 15000 },
  { month: "Mar", income: 38000 },
  { month: "Apr", income: 38000 },
  { month: "May", income: 35000 },
  { month: "Jun", income: 40000 },
];

// Sample locations data
const locations = [
  "Bangalore Urban",
  "Bangalore Rural",
  "Mysore",
  "Hassan",
  "Tumkur",
  "Mandya",
];

export default function AdminOverview() {
  const [stats, setStats] = useState({
    orders: 1245,
    customers: 850,
    farmers: 120,
    deliveryAgents: 45,
    totalIncome: 190000,
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Orders</p>
              <h3 className="text-2xl font-bold">{stats.orders}</h3>
            </div>
            <ShoppingBag className="text-blue-500 w-8 h-8" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Customers</p>
              <h3 className="text-2xl font-bold">{stats.customers}</h3>
            </div>
            <Users className="text-green-500 w-8 h-8" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Farmers</p>
              <h3 className="text-2xl font-bold">{stats.farmers}</h3>
            </div>
            <Users className="text-yellow-500 w-8 h-8" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Delivery Agents</p>
              <h3 className="text-2xl font-bold">{stats.deliveryAgents}</h3>
            </div>
            <Truck className="text-purple-500 w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Income Graph */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Monthly Income</h2>
        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyIncomeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month"
                tick={{ fontSize: 12 }}
                padding={{ left: 10, right: 10 }}
              />
              <YAxis 
                domain={[0, 50000]}
                tick={{ fontSize: 12 }}
                width={60}
              />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#4F46E5"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Locations */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Locations We Serve</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {locations.map((location, index) => (
            <div key={index} className="flex items-center space-x-2">
              <MapPin className="text-red-500 w-5 h-5" />
              <span>{location}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

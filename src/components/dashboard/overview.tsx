"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const data = [
  {
    name: "Jan",
    items: 0,
    packages: 0,
    operations: 0,
  },
  {
    name: "Feb",
    items: 0,
    packages: 0,
    operations: 0,
  },
  {
    name: "Mar",
    items: 0,
    packages: 0,
    operations: 0,
  },
  {
    name: "Apr",
    items: 0,
    packages: 0,
    operations: 0,
  },
  {
    name: "May",
    items: 0,
    packages: 0,
    operations: 0,
  },
  {
    name: "Jun",
    items: 0,
    packages: 0,
    operations: 0,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Tooltip />
        <Bar dataKey="items" fill="#adfa1d" radius={[4, 4, 0, 0]} />
        <Bar dataKey="packages" fill="#2563eb" radius={[4, 4, 0, 0]} />
        <Bar dataKey="operations" fill="#f43f5e" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}


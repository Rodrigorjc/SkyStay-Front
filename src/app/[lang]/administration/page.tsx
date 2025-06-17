"use client";

import { useDictionary } from "@/app/context/DictionaryContext";
import { UserAdminVO } from "@/types/admin/user";
import { useCallback, useEffect, useState } from "react";
import { FlightsDetailsVO } from "./flights/[flightsCode]/types/detailsFlight";
import * as service from "./services/dashboard.service";
import Loader from "@/app/components/ui/Loader";
import { Card } from "@/app/components/ui/admin/Card";
import { Title } from "./components/Title";

export default function Administration() {
  const { dict } = useDictionary();

  const [loading, setLoading] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [last5Users, setLast5Users] = useState<UserAdminVO[]>([]);
  const [last5Flights, setLast5Flights] = useState<FlightsDetailsVO[]>([]);
  const [totalFlightsActive, setTotalFlightsActive] = useState(0);
  const [totalUsersAccounts, setTotalUsersAccounts] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [revenue, users, flights, flightsActive, usersAccounts] = await Promise.all([
        service.getTotalRevenue(),
        service.getLast5Users(),
        service.getLast5Flights(),
        service.getTotalFlightsActive(),
        service.getTotalUsersAccounts(),
      ]);

      setTotalRevenue(revenue.response.objects);
      setLast5Users(users.response.objects);
      setLast5Flights(flights.response.objects);
      setTotalFlightsActive(flightsActive.response.objects);
      setTotalUsersAccounts(usersAccounts.response.objects);
    } catch (error) {
      return (
        <div className="flex items-center justify-center min-h-screen w-full">
          <h1 className="text-2xl text-red-600">{dict.ADMINISTRATION.ERRORS.LOAD_FAILURE_TITLE}</h1>
        </div>
      );
    } finally {
      setLoading(false);
    }
  }, [dict]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full bg-zinc-800">
        <Loader />
      </div>
    );
  }

  if (!dict) return null;
  return (
    <Card className="p-4 w-fulltext-white">
      <Title title={dict.ADMINISTRATION.DASHBOARD.DASHBOARD} />

      <main className="mx-auto px-4 py-10">
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <MetricCard title={dict.ADMINISTRATION.DASHBOARD.TOTAL_REVENUE} value={`${totalRevenue} €`} />
            <MetricCard title={dict.ADMINISTRATION.DASHBOARD.TOTAL_FLIGHTS_ACTIVE} value={totalFlightsActive} />
            <MetricCard title={dict.ADMINISTRATION.DASHBOARD.TOTAL_USERS_ACCOUNTS} value={totalUsersAccounts} />
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <section className="bg-zinc-900 rounded-2xl shadow-lg p-8 flex flex-col border-glacier-100">
            <h2 className="text-2xl font-bold mb-6 text-glacier-100 flex items-center gap-2">{dict.ADMINISTRATION.DASHBOARD.LAST_5_USERS}</h2>
            <ul className="space-y-4">
              {last5Users.map(user => (
                <li key={user.userCode} className="flex items-center gap-4 bg-glacier-900 rounded-xl p-4 hover:shadow transition">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-glacier-700 flex items-center justify-center font-bold text-glacier-100">
                    {user.name[0]}
                    {user.lastName[0]}
                  </div>
                  <div className="">
                    <p className="font-medium text-glacier-100">
                      {user.name} {user.lastName}
                    </p>
                    <p className="text-sm text-zinc-300 my-2">{user.email}</p>
                    <span className="text-xs bg-glacier-800 text-glacier-200 px-2 py-1 rounded ">{user.rol}</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-zinc-900 rounded-2xl shadow-lg p-8 flex flex-col border-glacier-100">
            <h2 className="text-2xl font-bold mb-6 text-glacier-100 flex items-center gap-2">{dict.ADMINISTRATION.DASHBOARD.LAST_5_FLIGHTS}</h2>
            <ul className="space-y-4">
              {last5Flights.map(flight => (
                <li key={flight.code} className="bg-glacier-900 rounded-xl p-4 hover:shadow transition">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-glacier-100 font-semibold">{flight.code}</span>
                    <span className={`text-xs px-2 py-1 rounded ${flight.status === "ACTIVE" ? "bg-green-700 text-white" : "bg-zinc-700 text-zinc-300"}`}>{flight.status}</span>
                  </div>
                  <p className="text-sm text-glacier-200">{flight.airline.name}</p>
                  <p className="text-sm text-zinc-400">
                    {flight.departureAirport.name} → {flight.arrivalAirport.name}
                  </p>
                  <p className="text-xs text-glacier-400">{new Date(flight.dateTime).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    </Card>
  );
}

// Componente reutilizable para métricas
function MetricCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="bg-zinc-900 p-8 rounded-2xl shadow flex flex-col items-center justify-center text-center border border-glacier-100 hover:shadow-lg hover:-translate-y-4 transition-all hover:duration-350">
      <span className="text-xl text-white">{title}:</span>
      <span className="text-3xl font-extrabold text-glacier-400">{value}</span>
    </div>
  );
}

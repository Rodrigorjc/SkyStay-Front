"use client";

import Button from "@/app/components/ui/Button";
import { useDictionary } from "@context";

export default function AdminUsers() {
  const { dict } = useDictionary();

  return (
    <div>
      <h1 className="text-2xl">Users</h1>
      <section className="bg-zinc-700 p-4 m-4 rounded-md">
        <div className="flex flex-row gap-4 items-end">
          {/* Search Input Group */}
          <div className="flex flex-col w-3/5 gap-2">
            <label htmlFor="search-bar" className="mb-1">
              {dict.ADMINISTRATION.USERS.SEARCH_BAR}:
            </label>
            <input type="text" id="search-bar" className="border border-white rounded-md px-4 py-2" />
          </div>

          {/* Button */}
          <div className="flex w-auto">
            <Button text={dict.ADMINISTRATION.USERS.RESET_FILTER} onClick={() => console.log("Hola")} color="light" className="button w-full items-end " />
          </div>
        </div>

        <div className="mt-10">
          <table className="table-auto w-full border-collapse border border-gray-300 text-sm overflow-auto">
            <thead className="">
              <tr className="text-left">
                <th className="border border-gray-300 px-4 py-2">{dict.ADMINISTRATION.USERS.USER_CODE}</th>
                <th className="border border-gray-300 px-4 py-2">{dict.ADMINISTRATION.USERS.NAME}</th>
                <th className="border border-gray-300 px-4 py-2">{dict.ADMINISTRATION.USERS.LAST_NAME}</th>
                <th className="border border-gray-300 px-4 py-2">{dict.ADMINISTRATION.USERS.EMAIL}</th>
                <th className="border border-gray-300 px-4 py-2">{dict.ADMINISTRATION.USERS.NIF}</th>
                <th className="border border-gray-300 px-4 py-2">{dict.ADMINISTRATION.USERS.PHONE}</th>
                <th className="border border-gray-300 px-4 py-2">{dict.ADMINISTRATION.USERS.ROLE}</th>
                <th className="border border-gray-300 px-4 py-2">{dict.ADMINISTRATION.USERS.AIRLANE_RATING}</th>
                <th className="border border-gray-300 px-4 py-2">{dict.ADMINISTRATION.USERS.APARTMENT_RATING}</th>
                <th className="border border-gray-300 px-4 py-2">{dict.ADMINISTRATION.USERS.HOTEL_RATING}</th>
                <th className="border border-gray-300 px-4 py-2">{dict.ADMINISTRATION.USERS.ORDER_AIRLANE}</th>
                <th className="border border-gray-300 px-4 py-2">{dict.ADMINISTRATION.USERS.ORDER_APARTMENT}</th>
                <th className="border border-gray-300 px-4 py-2">{dict.ADMINISTRATION.USERS.ORDER_HOTEL}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2">a3f9b7c2e8d416af</td>
                <td className="border border-gray-300 px-4 py-2">John</td>
                <td className="border border-gray-300 px-4 py-2">Doe</td>
                <td className="border border-gray-300 px-4 py-2">john@example.com</td>
                <td className="border border-gray-300 px-4 py-2">12345678A</td>
                <td className="border border-gray-300 px-4 py-2">600123456</td>
                <td className="border border-gray-300 px-4 py-2">Admin</td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <Button text={dict.ADMINISTRATION.USERS.SHOW} onClick={() => console.log("Hola")} color="light" className="button w-fit" />
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <Button text={dict.ADMINISTRATION.USERS.SHOW} onClick={() => console.log("Hola")} color="light" className="button w-fit" />
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <Button text={dict.ADMINISTRATION.USERS.SHOW} onClick={() => console.log("Hola")} color="light" className="button w-fit" />
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <Button text={dict.ADMINISTRATION.USERS.SHOW} onClick={() => console.log("Hola")} color="light" className="button w-fit" />
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <Button text={dict.ADMINISTRATION.USERS.SHOW} onClick={() => console.log("Hola")} color="light" className="button w-fit" />
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <Button text={dict.ADMINISTRATION.USERS.SHOW} onClick={() => console.log("Hola")} color="light" className="button w-fit" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

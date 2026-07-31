import type { Metadata } from "next";
import { getAdminCustomers } from "@/lib/data/admin-customers";
import { formatPkr } from "@/lib/format";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Customers | Bizmi Admin",
  robots: { index: false },
};

const ROLE_STYLE: Record<string, string> = {
  admin: "bg-red-soft text-red",
  staff: "bg-purple-soft text-purple",
  teacher: "bg-blue-soft text-blue",
  school_admin: "bg-blue-soft text-blue",
  student: "bg-yellow-soft text-yellow",
  customer: "bg-surface-2 text-ink-2",
};

export default async function AdminCustomersPage() {
  const customers = await getAdminCustomers();

  return (
    <div>
      <h1 className="font-serif text-3xl text-ink">Customers</h1>

      <div className="mt-6 overflow-x-auto rounded-3xl border border-line bg-white">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-2">
              <th className="px-5 py-3 font-normal">Name</th>
              <th className="px-5 py-3 font-normal">Email</th>
              <th className="px-5 py-3 font-normal">Phone</th>
              <th className="px-5 py-3 font-normal">Role</th>
              <th className="px-5 py-3 text-right font-normal">Orders</th>
              <th className="px-5 py-3 text-right font-normal">Total spent</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {customers.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-ink-2">
                  No customers yet.
                </td>
              </tr>
            )}
            {customers.map((customer) => (
              <tr key={customer.id} className="transition-colors hover:bg-surface-2">
                <td className="px-5 py-3 text-ink">{customer.fullName}</td>
                <td className="px-5 py-3 text-ink-2">{customer.email ?? "—"}</td>
                <td className="px-5 py-3 text-ink-2">{customer.phone ?? "—"}</td>
                <td className="px-5 py-3">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 font-mono text-xs uppercase tracking-wide",
                      ROLE_STYLE[customer.role] ?? "bg-surface-2 text-ink-2"
                    )}
                  >
                    {customer.role}
                  </span>
                </td>
                <td className="px-5 py-3 text-right font-mono text-ink">{customer.orderCount}</td>
                <td className="px-5 py-3 text-right font-mono text-ink">{formatPkr(customer.totalSpentPkr)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

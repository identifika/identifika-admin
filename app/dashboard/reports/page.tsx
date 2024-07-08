'use client';
import { useSearchParams } from "next/navigation";
import ReportTable from "./components/report.table";

export default function ReportsPage() {
    const params = useSearchParams();
    const page = Number(params.get('page')) || 1;
    const limit = Number(params.get('limit')) || 10;
    const search = params.get('search') || '';
    return (
        <div className="flex flex-col space-y-4">
            <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-200 py-4">
                Report
            </h1>
            <ReportTable page={page} limit={limit} search={search} />
        </div>
    )
}
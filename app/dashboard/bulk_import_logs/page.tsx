'use client';

import { useSearchParams } from "next/navigation";
import BulkImportLogsTable from "./components/bulk.import.logs.table";

export default function BulkImportLogsPage() {
    const params = useSearchParams();
    const page = Number(params.get('page')) || 1;
    const limit = Number(params.get('limit')) || 10;
    
    return (
        <div className="flex flex-col space-y-4">
            <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-200 py-4">
                Bulk Import Logs
            </h1>
            <BulkImportLogsTable page={page} limit={limit}/>
        </div>
    )
}
'use client';
import { useSearchParams } from "next/navigation";
import FaceTable from "./components/face.table";

export default function FacesPage() {
    const params = useSearchParams();
    const page = Number(params.get('page')) || 1;
    const limit = Number(params.get('limit')) || 10;
    const search = params.get('search') || '';
    const clientId = params.get('client_id') || '';
    return (
        <div className="flex flex-col space-y-4">
            <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-200 py-4">
                Faces
            </h1>
            <FaceTable page={page} limit={limit} search={search} clientId={clientId} />
        </div>
    )
}
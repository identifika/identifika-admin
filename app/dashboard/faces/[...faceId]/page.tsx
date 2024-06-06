'use client'
import { API_URL } from "@/constants/url_constant";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

async function getFaceData(faceId: string) {
    try {
        const res = await fetch(`${API_URL}/api/faces/${faceId}`)
        if (res.status === 200) {
            const data = await res.json()
            return data
        } else {
            return null
        }
    } catch (error) {
        console.error(error)
        return null
    }
}

export default function DetailFacePage() {
    const { faceId } = useParams()
    const [faceData, setFaceData] = useState({
        data: {
            id: '',
            user_name: '',
            knn_indexing: '',
            client: {
                client_name: '',
                user: {
                    name: '',
                    email: ''
                }
            }
        }
    
    })

    useEffect(() => {
        getFaceData(faceId.toString()).then(data => {
            setFaceData(data)
        })
    }, [faceId])


    return (
        <div className="flex flex-col space-y-4">
            <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-200 py-4">
                Detail Face of {faceData.data.user_name}
            </h1>
            <div>
                {faceData && (
                    <div>
                        <p>{faceData.data.id}</p>
                        <p>{faceData.data.user_name}</p>
                        <p>{faceData.data.knn_indexing}</p>
                        <p>{faceData.data.client.client_name}</p>
                        <p>{faceData.data.client.user.name}</p>
                        <p>{faceData.data.client.user.email}</p>
                    </div>
                )}
            </div>
        </div>
    )
}
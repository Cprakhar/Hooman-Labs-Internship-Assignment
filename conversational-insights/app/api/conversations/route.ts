import conversations from '@/data/mock-data.json'

export const GET = async () => {
    return Response.json(conversations)
}
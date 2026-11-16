import { neon } from "@neondatabase/serverless"

export default defineEventHandler(async (event) => {
    const { databaseUrl } = useRuntimeConfig(event)
    const sql = neon(databaseUrl)

    await sql`
        INSERT INTO solves (date, count)
        VALUES (CURRENT_DATE, 1)
        ON CONFLICT (date) DO UPDATE SET count = solves.count + 1
        RETURNING id, date, count
    `

    return true
})

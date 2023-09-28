import { Connection, Pool } from 'includes/mysql'

export default async function mysql__createDatabase(
    connection: Connection | Pool,
    name: string
): Promise<void> {
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${name}\``)
}
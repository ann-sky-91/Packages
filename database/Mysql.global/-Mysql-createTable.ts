export {}

import Ns = Mysql

declare global {
    namespace Mysql {
        const createTable: (
            connection: Mysql.Connection | Mysql.Pool,
            database: string,
            name: string,
            columns: Ns.Column[],
            indexes?: Ns.Index[],
            partitions?: string
        ) => Promise<void>
    }
}

Object.assign(Ns, {
    async createTable(
        connection: Mysql.Connection | Mysql.Pool,
        database: string,
        name: string,
        columns: Ns.Column[],
        indexes?: Ns.Index[],
        partitions?: string
    ): Promise<void> {
        if (await Ns.isTableExists(connection, database, name)) {
            // const existsColumns = await mysql__getTableColumns(connection, name)
            // // eslint-disable-next-line no-console
            // console.log(existsColumns)
            // const existsIndexes = await mysql__getTableIndexes(connection, name)
            // // eslint-disable-next-line no-console
            // console.log(existsIndexes)
        } else {
            createTable(connection, name, columns, indexes, partitions)
        }
    },
})

async function createTable(
    connection: Mysql.Connection | Mysql.Pool,
    name: string,
    columns: Ns.Column[],
    indexes?: Ns.Index[],
    partitions?: string
): Promise<Awaited<ReturnType<typeof connection.query>>> {
    const argsQuery = `(
        ${columns
            .map(
                column => `
                    \`${column.name}\`
                    ${column.type}
                    ${column.primary ? `PRIMARY KEY` : ''}
                    ${column.autoIncrement ? `AUTO_INCREMENT` : ''}
                    ${column.unique ? `UNIQUE` : ''}
                    ${column.default != null ? `DEFAULT(${column.default})` : ''}
                    ${column.notNull ? `NOT NULL` : ''}
                    ${column.codepage ? `${column.codepage}` : ''}
                `
            )
            .join(',')}

        ${indexes?.length ? ',' : ''}
        ${indexes?.map(
            index => `
                ${index.type} ${index.name ? index.name : ''}(
                    ${index.columns.map(column => `\`${column}\``).join(',')}
                )
            `
        )}
    )
    ${partitions ? partitions : ''}`

    return await connection.query(`CREATE TABLE IF NOT EXISTS \`${name}\` ${argsQuery}`)
}

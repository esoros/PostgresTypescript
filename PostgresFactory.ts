import { Client } from "ts-postgres";

let duplicateDatabase = "42P04"

type PostgresError = {
    code: string
}

export class PostgresFactory { 
    constructor(private name: string, private schemaQueries: string[]) {
        if(name.length == 0) {
            throw new Error("length can't be zero")
        }
            
        if(schemaQueries.length == 0) {
            throw new Error("schema queries can't be zero")
        }
    }

    private async createDatabase(client: Client) : Promise<Client> {
        try {
            await client.query("CREATE DATABASE " + this.name)
            await client.end()
            client = new Client({
                user: "dbuser3",
                password: "password",
                host: "localhost",
                port: 5432,
                database: this.name
            })
            await client.connect()
            for(let i = 0; i < this.schemaQueries.length; ++i) {
                let query = this.schemaQueries[i]
                await client.query(query)
            }
            return client
        } catch (ex) {
            let pex = ex as PostgresError
            if(pex.code != duplicateDatabase) {
                console.error("unable to create database: ", pex.code)
                throw ex
            } else {
                let client =  new Client({
                    user: "dbuser3",
                    password: "password",
                    host: "localhost",
                    port: 5432,
                    database: this.name
                })
                await client.connect()
                return client
            }
        }
    }

    async createClient() : Promise<Client> {
        let client = new Client({
            user: "dbuser3",
            password: "password",
            host: "localhost",
            port: 5432
        })
        await client.connect()
        client = await this.createDatabase(client)
        return client
    }
}
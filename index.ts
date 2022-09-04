import {Client, DataType} from "ts-postgres"
import { PostgresFactory } from "./PostgresFactory"
import randomstring from "randomstring"

const databaseName = "hellvvojwosdsss000"
const createUserTableQuery = `
    CREATE TABLE users(
        email varchar(256) NOT NULL PRIMARY KEY
    );
`
const postgresFactory = new PostgresFactory(databaseName, [createUserTableQuery])

async function test(client: Client) {
    let email = randomEmail()
    await insert(client, email)
    await query(client)
    await queryEmail(client, email)
}

function randomEmail() {
    let str = randomstring.generate(10)
    return `${str}@gmail.com`
}

async function insert(client: Client, email: string) {
    let res = await client.query("insert into users(email) VALUES($1)", [email], [DataType.Varchar])
    console.log("user inserted", res, email)
    return client
}

async function queryEmail(client: Client, email: string) {
    let res = await client.query(`select * from users where email = '${email}'`)
    console.log("query email", res.rows, email)
    return client
}

async function query(client: Client) {
    let res = await client.query("select * from users")
    console.log("query all users", res.rows)
}

async function success() {
    console.log("finished running tests")
    process.exit(0)
}

async function exit(err : any) {
    console.log("unable to finish tests...", err)
    process.exit(1)
}

async function main() {
    try {
        let client = await postgresFactory.createClient()
        test(client).then(success).catch(exit)
    } catch (err) {
        console.error("unable to seed database: ", err)
    }
}

main()


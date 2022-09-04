import {Client, DataType} from "ts-postgres"

let databaseName = "letstrythis1221"
async function insert() {
    let email = "esoros@gmail.com"
    let client = new Client({
        host: "localhost",
        port: 5432,
        user: "dbuser3",
        password: "password",
        database: databaseName
    })
    await client.connect()
    let res = await client.query("insert into users(email) VALUES($1)", [email], [DataType.Varchar])
    console.log("user inserted", res)
    await client.end()
}

async function queryEmail(email: string) {
    let client = new Client({
        host: "localhost",
        port: 5432,
        user: "dbuser3",
        password: "password",
        database: databaseName
    })
    await client.connect()
    let res = await client.query("select * from users where email = $1", [email], [DataType.Varchar])
    console.log("res", res.rows[0][0]?.valueOf())
    await client.end()
}

async function query() {
   let client = new Client({
        host: "localhost",
        port: 5432,
        user: "dbuser3",
        password: "password",
        database: databaseName
    })
    await client.connect()
    let res = await client.query("select * from users")
    console.log("res", res.rows[0][0]?.valueOf())
    await client.end()
}

export async function create() {
    let client = new Client({
        host: "localhost",
        port: 5432,
        user: "dbuser3",
        password: "password"
    })
    await client.connect()
    await client.query("CREATE DATABASE " + databaseName)
    await client.end()

    const createUserQuery = "CREATE TABLE users(email varchar(256) NOT NULL PRIMARY KEY);"
    client = new Client({
        host: "localhost",
        port: 5432,
        user: "dbuser3",
        password: "password",
        database: databaseName
    })
    await client.connect()
    let res = await client.query(createUserQuery)
    await client.end()
    console.log("database created and seeded", res)
}

function endSuccess() {
    process.exit(0)
}

function endError(err : any) {
    console.error("unhandled exception: ", err)
    process.exit(1)
}

try {
    create()
        .then(insert)
        .then(query)
        .then(() => queryEmail("esoros@gmail.com"))
        .then(endSuccess)
        .catch(endError)
} catch (err) {
    console.error("unable to seed database: ", err)
}

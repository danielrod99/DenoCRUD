import { Bson, MongoClient } from "https://deno.land/x/mongo@v0.22.0/mod.ts";

const client = new MongoClient();

var users:any;

interface UserSchema {
    _id: { $oid: string };
    text: string;
}

export async function connect() {
    await client.connect("mongodb://localhost:27017");

    var db = client.database("todos");
    users = db.collection<UserSchema>("todos");

}

export function getDb() {
    return users;
}


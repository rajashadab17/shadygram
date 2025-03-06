import { Connection } from "mongoose"

declare global {
    var mongoose : {
        connection:Connection | null,
        Promise : Promise<Connection> | null
    }
}

export {}
import { CompletedMongoData } from "./completedTypes"
import { CountersMongoData } from "./countersTypes"
import { ServerMongoData } from "./serverTypes"

import MongoDb from "mongodb"

declare module "mongodb" {
    export interface Db {
        collection<TSchema = CompletedMongoData>(name: "completed", options?: CollectionOptions): Collection<TSchema>
        collection<TSchema = CountersMongoData>(name: "counters", options?: CollectionOptions): Collection<TSchema>
        collection<TSchema = ServerMongoData>(name: "server", options?: CollectionOptions): Collection<TSchema>
    }

    // The default implementation of aggregate's generic (<T = Document>) is too restrictive, so we change it here to suit our needs.
    export interface Collection {
        aggregate<T = any>(pipeline?: MongoDb.Document[], options?: AggregateOptions): AggregationCursor<T>;
    }
}

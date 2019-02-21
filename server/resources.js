import { Mongo } from "meteor/mongo";
import OSS from "ali-oss";

let collections = {};

export function Collection(collection) {
    if (collections[collection]) return collections[collection];

    let newCollection = new Mongo.Collection(collection);
    if (!newCollection) {
        console.error("No collection named: " + collection);
        return null;
    }
    collections[collection] = newCollection;
    return newCollection;
}

/**
 * Notice: Change OSS Auth need to restart the server, due to the performance issue.
 */
const ossAuth = Collection("system").findOne(
    { key: "ossAuth" },
    { fields: { _id: 0, region: 1, bucket: 1, accessKeyId: 1, accessKeySecret: 1 } }
);
if (!ossAuth) {
    throw "OSS Auth is not found in system collection! please check the MongoDB connection!";
}

export function oss() {
    return new OSS(ossAuth);
}

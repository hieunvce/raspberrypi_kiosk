/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("tznuegy9p3mtoni")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "tjn1q3ma",
    "name": "data_type",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "S",
        "N",
        "B",
        "BOOL",
        "NULL",
        "M",
        "L",
        "SS",
        "NS",
        "BS"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("tznuegy9p3mtoni")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "tjn1q3ma",
    "name": "field",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "S",
        "N",
        "B",
        "BOOL",
        "NULL",
        "M",
        "L",
        "SS",
        "NS",
        "BS"
      ]
    }
  }))

  return dao.saveCollection(collection)
})

/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("nchf4667frk8s7p")

  // remove
  collection.schema.removeField("jfj6wyvp")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "tjnrxzxh",
    "name": "unit",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("nchf4667frk8s7p")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "jfj6wyvp",
    "name": "unit",
    "type": "number",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "noDecimal": false
    }
  }))

  // remove
  collection.schema.removeField("tjnrxzxh")

  return dao.saveCollection(collection)
})

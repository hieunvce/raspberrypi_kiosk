/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "tznuegy9p3mtoni",
    "created": "2024-04-13 13:06:13.982Z",
    "updated": "2024-04-13 13:06:13.982Z",
    "name": "configs",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "optorn7j",
        "name": "name",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "fenx6lvr",
        "name": "value",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
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
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("tznuegy9p3mtoni");

  return dao.deleteCollection(collection);
})

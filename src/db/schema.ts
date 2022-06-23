const collectionName = "docs"; // FIXME we need something better than this

export const collectionSchema = {
  // TODO add document_type and _type to the schema see the types
  [collectionName]: {
    schema: {
      version: 0,
      type: "object",
      primaryKey: "document__id",
      properties: {
        document__id: { type: "string", maxLength: 100 },
        document__type: { type: "string", maxLength: 100 },
      },
    },
  },
};

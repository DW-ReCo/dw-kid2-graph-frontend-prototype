module.exports = {
  semi: true,
  trailingComma: "all",
  singleQuote: false,
  printWidth: 120,
  tabWidth: 2,
  importOrder: [
    "^@config/(.*)$",
    "^@data-types/(.*)$",
    "^@db/(.*)$",
    "^@frontend/(.*)$",
    "^@logger/(.*)$",
    "^@services/(.*)$",
    "^@utils/(.*)$",
    "^[./]",
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};

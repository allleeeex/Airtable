import { faker } from "@faker-js/faker";
import { LexoRank } from "lexorank";

export function randomDataGenerator(tableName: string) {
  const fieldTypes = ["Name", "Bank Balance ($)", "Description"] as const;
  const fieldCount = 3;
  const recordCount = 5;

  let fieldRank = LexoRank.middle();
  const fields = Array.from({ length: fieldCount }).map((_, idx) => {
    const type = idx === 1 ? "number" : "text";

    const field = {
      name: fieldTypes[idx]!,
      type,
      order: fieldRank.toString(),
      options: undefined,
    };

    fieldRank = fieldRank.genNext();
    return field;
  });


  let recordRank = LexoRank.middle();
  const records = Array.from({ length: recordCount }).map(() => {
    const cells = fields.map((field, fIdx) => {
      let value: unknown;

      if (field.name === "Name") {
        value = faker.person.fullName();
      } else if (field.name === "Bank Balance ($)") {
        value = faker.finance.amount();
      } else {
        value = faker.company.catchPhrase();
      }

      return { fieldOrder: fIdx, value };
    });

    const record = {
      order: recordRank.toString(),
      cells,
    };

    recordRank = recordRank.genNext();
    return record;
  });

  return {
    name: tableName,
    fields,
    records,
  };
}

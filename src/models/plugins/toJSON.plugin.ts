import { Schema, Document, ToObjectOptions, Types } from "mongoose";

const deleteAtPath = (
  obj: Record<string, unknown>,
  path: string[],
  index: number,
): void => {
  if (!obj || !path[index]) return;

  if (index === path.length - 1) {
    delete obj[path[index]];
    return;
  }

  if (typeof obj[path[index]] === "object" && obj[path[index]] !== null) {
    deleteAtPath(obj[path[index]] as Record<string, unknown>, path, index + 1);
  }
};

const toJSON = (schema: Schema): void => {
  const existingTransform = schema.get("toJSON")?.transform;

  schema.set("toJSON", {
    virtuals: true,
    transform(
      doc: Document<unknown, object, unknown> & { _id: Types.ObjectId } & {
        __v: number;
      },
      ret: Record<string, unknown>,
      options: ToObjectOptions,
    ) {
      Object.keys(schema.paths).forEach((path) => {
        if (schema.paths[path].options && schema.paths[path].options.private) {
          deleteAtPath(ret, path.split("."), 0);
        }
      });

      if (typeof ret._id === "object" && ret._id !== null) {
        ret.id = (ret._id as Types.ObjectId).toString();
        delete ret._id;
      }

      delete ret.__v;
      delete ret.createdAt;
      delete ret.updatedAt;

      if (typeof existingTransform === "function") {
        return existingTransform(doc, ret, options);
      }

      return ret;
    },
  });
};

export default toJSON;

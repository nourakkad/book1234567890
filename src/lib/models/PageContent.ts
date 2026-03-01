import { Schema, model, models } from "mongoose";

const pageContentSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    data: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

export const PageContent =
  models.PageContent || model("PageContent", pageContentSchema);

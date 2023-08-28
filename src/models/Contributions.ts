import { Document, model, Schema } from "mongoose";

export type TContribution = {
  projectTitle: string;
  contributorsAddress: string;
  contributionAmount: number;
};

interface IContributionMethods {
  saveAndReturn: () => Promise<IContribution>;
}

export interface IContribution extends TContribution, Document, IContributionMethods {
  user?: string; // The user field is now optional
}

const contributionSchema: Schema = new Schema({
  projectTitle: {
    type: String,
    required: true,
  },
  contributorsAddress: {
    type: String,
    required: true,
  },
  contributionAmount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

contributionSchema.methods.saveAndReturn = async function () {
  await this.save();
  return this as IContribution;
};

const Contribution = model<IContribution>("Contribution", contributionSchema);

export default Contribution;

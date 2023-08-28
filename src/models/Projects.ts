import { Document, model, Schema } from "mongoose";

export type TProject = {
  user?: string; // User field is now optional and directly generated
  nickname: string;
  projectTitle: string;
  projectDescription: string;
  projectCategory: string;
  amountToRaise: number;
  minimumBuyIn: number;
  roi: number;
  stakeAmount: number;
  photo: string;
  totalContributors: number; // New field
  totalContribution: number; // New field
};

export interface IProject extends TProject, Document<IProject> {
  // Other methods or properties you want to include
}

const projectSchema: Schema = new Schema({
  user: {
    type: String, // You can change this type based on how you generate the user field
  },
  nickname: {
    type: String,
    required: true,
  },
  projectTitle: {
    type: String,
    required: true,
  },
  minimumBuyIn: {
    type: Number,
    required: true,
  },
  roi: {
    type: Number,
    required: true,
  },
  stakeAmount: {
    type: Number,
    required: true,
  },
  photo: {
    type: String,
    required: true,
  },
  totalContributors: {
    type: Number,
    default: 0,
  },
  totalContribution: {
    type: Number,
    default: 0,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Project = model<IProject>("Project", projectSchema);

export default Project;

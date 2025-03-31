import mongoose, { Document, Schema } from 'mongoose';

// Interface pour l'objet Experience
interface IExperience {
  title: string;
  company: string;
  dates: string;
  description: string;
}

// Interface pour l'objet Information
interface IInformation {
  bio?: string;
  location?: string;
  website?: string;
}

// Interface pour le document Profile
export interface IProfile extends Document {
  name: string;
  email: string;
  experience: IExperience[];
  skills: string[];
  information: IInformation;
  deleted: boolean;
  friends: mongoose.Types.ObjectId[];
}

// Schéma pour l'expérience
const ExperienceSchema = new Schema<IExperience>({
  title: { type: String, required: true },
  company: { type: String, required: true },
  dates: { type: String, required: true },
  description: { type: String }
});

// Schéma pour l'information
const InformationSchema = new Schema<IInformation>({
  bio: { type: String },
  location: { type: String },
  website: { type: String }
});

// Schéma principal pour le profil
const ProfileSchema = new Schema<IProfile>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  experience: [ExperienceSchema],
  skills: [String],
  information: { type: InformationSchema, default: {} },
  deleted: { type: Boolean, default: false },
  friends: [{ type: Schema.Types.ObjectId, ref: 'Profile' }]
});

export default mongoose.model<IProfile>('Profile', ProfileSchema);
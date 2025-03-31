import { Request, Response } from 'express';
import Profile, { IProfile } from './model';
import mongoose from 'mongoose';

// Récupérer tous les profils (avec filtres optionnels)
export const getAllProfiles = async (req: Request, res: Response): Promise<void> => {
  try {
    const { skills, location } = req.query;
    let query: any = { deleted: false };

    // Filtrer par compétences
    if (skills) {
      query.skills = { $in: Array.isArray(skills) ? skills : [skills] };
    }

    // Filtrer par localisation
    if (location) {
      query['information.location'] = location;
    }

    const profiles = await Profile.find(query);
    res.status(200).json(profiles);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Récupérer un profil par ID
export const getProfileById = async (req: Request, res: Response): Promise<void> => {
  try {
    const profile = await Profile.findOne({ _id: req.params.id, deleted: false })
      .populate('friends', 'name email _id');
    
    if (!profile) {
      res.status(404).json({ message: 'Profile not found' });
      return;
    }
    
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Créer un nouveau profil
export const createProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email } = req.body;
    
    // Vérifier si l'email existe déjà
    const existingProfile = await Profile.findOne({ email });
    if (existingProfile) {
      res.status(400).json({ message: 'Email already in use' });
      return;
    }
    
    const newProfile = new Profile({ name, email });
    await newProfile.save();
    
    res.status(201).json(newProfile);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Mettre à jour un profil par ID
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email } = req.body;
    
    // Vérifier si l'email existe déjà (pour un autre profil)
    if (email) {
      const existingProfile = await Profile.findOne({ email, _id: { $ne: req.params.id } });
      if (existingProfile) {
        res.status(400).json({ message: 'Email already in use by another profile' });
        return;
      }
    }
    
    const updatedProfile = await Profile.findOneAndUpdate(
      { _id: req.params.id, deleted: false },
      { $set: { name, email } },
      { new: true }
    );
    
    if (!updatedProfile) {
      res.status(404).json({ message: 'Profile not found' });
      return;
    }
    
    res.status(200).json(updatedProfile);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Supprimer un profil par ID (soft delete)
export const deleteProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedProfile = await Profile.findOneAndUpdate(
      { _id: req.params.id, deleted: false },
      { deleted: true },
      { new: true }
    );
    
    if (!deletedProfile) {
      res.status(404).json({ message: 'Profile not found' });
      return;
    }
    
    res.status(200).json({ message: 'Profile deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Ajouter une expérience à un profil
export const addExperience = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, company, dates, description } = req.body;
    
    const profile = await Profile.findOneAndUpdate(
      { _id: req.params.id, deleted: false },
      { $push: { experience: { title, company, dates, description } } },
      { new: true }
    );
    
    if (!profile) {
      res.status(404).json({ message: 'Profile not found' });
      return;
    }
    
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Supprimer une expérience d'un profil
export const deleteExperience = async (req: Request, res: Response): Promise<void> => {
  try {
    const profile = await Profile.findOneAndUpdate(
      { _id: req.params.id, deleted: false },
      { $pull: { experience: { _id: req.params.exp } } },
      { new: true }
    );
    
    if (!profile) {
      res.status(404).json({ message: 'Profile not found' });
      return;
    }
    
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Ajouter une compétence à un profil
export const addSkill = async (req: Request, res: Response): Promise<void> => {
  try {
    const skill = req.body.skill;
    
    const profile = await Profile.findOneAndUpdate(
      { _id: req.params.id, deleted: false, skills: { $ne: skill } },
      { $push: { skills: skill } },
      { new: true }
    );
    
    if (!profile) {
      res.status(404).json({ message: 'Profile not found or skill already exists' });
      return;
    }
    
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Supprimer une compétence d'un profil
export const deleteSkill = async (req: Request, res: Response): Promise<void> => {
  try {
    const skill = req.params.skill;
    
    const profile = await Profile.findOneAndUpdate(
      { _id: req.params.id, deleted: false },
      { $pull: { skills: skill } },
      { new: true }
    );
    
    if (!profile) {
      res.status(404).json({ message: 'Profile not found' });
      return;
    }
    
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Mettre à jour les informations d'un profil
export const updateInformation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { bio, location, website } = req.body;
    
    const profile = await Profile.findOneAndUpdate(
      { _id: req.params.id, deleted: false },
      { 
        $set: { 
          'information.bio': bio,
          'information.location': location,
          'information.website': website
        } 
      },
      { new: true }
    );
    
    if (!profile) {
      res.status(404).json({ message: 'Profile not found' });
      return;
    }
    
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Ajouter un ami à un profil
export const addFriend = async (req: Request, res: Response): Promise<void> => {
  try {
    const profileId = req.params.id;
    const friendId = req.body.friendId;
    
    // Vérifier si les IDs sont valides
    if (!mongoose.Types.ObjectId.isValid(profileId) || !mongoose.Types.ObjectId.isValid(friendId)) {
      res.status(400).json({ message: 'Invalid profile or friend ID' });
      return;
    }
    
    // Vérifier si on n'essaie pas d'ajouter le profil comme son propre ami
    if (profileId === friendId) {
      res.status(400).json({ message: 'Cannot add yourself as a friend' });
      return;
    }
    
    // Vérifier si l'ami existe
    const friendProfile = await Profile.findOne({ _id: friendId, deleted: false });
    if (!friendProfile) {
      res.status(404).json({ message: 'Friend profile not found' });
      return;
    }
    
    const profile = await Profile.findOneAndUpdate(
      { _id: profileId, deleted: false, friends: { $ne: friendId } },
      { $push: { friends: friendId } },
      { new: true }
    ).populate('friends', 'name email _id');
    
    if (!profile) {
      res.status(404).json({ message: 'Profile not found or friend already added' });
      return;
    }
    
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Supprimer un ami d'un profil
export const removeFriend = async (req: Request, res: Response): Promise<void> => {
  try {
    const profileId = req.params.id;
    const friendId = req.params.friendId;
    
    const profile = await Profile.findOneAndUpdate(
      { _id: profileId, deleted: false },
      { $pull: { friends: friendId } },
      { new: true }
    ).populate('friends', 'name email _id');
    
    if (!profile) {
      res.status(404).json({ message: 'Profile not found' });
      return;
    }
    
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Récupérer la liste des amis d'un profil
export const getFriends = async (req: Request, res: Response): Promise<void> => {
  try {
    const profile = await Profile.findOne({ _id: req.params.id, deleted: false })
      .populate('friends', 'name email _id');
    
    if (!profile) {
      res.status(404).json({ message: 'Profile not found' });
      return;
    }
    
    res.status(200).json(profile.friends);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
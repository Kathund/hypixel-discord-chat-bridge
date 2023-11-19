import { skyblockProfile, skyblockProfileDataType } from './skyblock';

export type latestProfileType = {
  uuid: string;
  last_save: number;
  profile: skyblockProfile;
  profileData: skyblockProfileDataType;
  profiles: skyblockProfile[];
  museum?: any; // TODO make 'museumType'
};

import { DateDTO } from 'app/types';

export interface ChannelResponse {
  id: number;
  name: string;
  description?: string;
  regDate: DateDTO;
  lastModified: DateDTO;
  thumbnailUrl?: string;
  subDescription?: string;
  category?: string;
}

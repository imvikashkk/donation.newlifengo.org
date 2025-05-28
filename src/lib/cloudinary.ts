import { v2 as cloudinary } from 'cloudinary';
import {cloud_name, api_key, api_secret} from '@/config/env'


cloudinary.config({
  cloud_name,
  api_key,
  api_secret,
});

export default cloudinary;

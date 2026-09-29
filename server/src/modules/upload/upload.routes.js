import { Router } from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { cloudinary } from '../../utils/cloudinary.js';
import { authenticate } from '../../middleware/authenticate.js';
import { env } from '../../config/env.js';
import { ApiError } from '../../utils/ApiError.js';

const router = Router();

// Configure Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'campus_connect',
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
  },
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

router.use(authenticate);

router.post('/', (req, res, next) => {
  if (!env.CLOUDINARY_API_KEY || env.CLOUDINARY_API_KEY === 'your_api_key') {
    return next(new ApiError(501, 'Cloudinary credentials are not configured in the backend .env'));
  }
  next();
}, upload.single('file'), (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'No file uploaded');
  }
  
  res.status(200).json({
    success: true,
    data: {
      url: req.file.path,
      format: req.file.mimetype,
      size: req.file.size
    }
  });
});

export default router;

import cron from 'node-cron';
import { User } from '../models/User.js';
import { StudentProfile } from '../models/StudentProfile.js';
import { AlumniProfile } from '../models/AlumniProfile.js';
import { ROLES } from '../config/roles.js';
import { logger } from '../utils/logger.js';

export const startAlumniTransitionJob = () => {
  // Run daily at midnight
  cron.schedule('0 0 * * *', async () => {
    logger.info('Starting daily Alumni transition job');
    try {
      const currentYear = new Date().getFullYear();
      
      // Find students who should have graduated by this year
      const graduatingStudents = await StudentProfile.find({
        batchYear: { $lte: currentYear }
      }).populate('user');

      for (const student of graduatingStudents) {
        if (!student.user || student.user.role === ROLES.ALUMNI) continue;

        // Create Alumni Profile
        await AlumniProfile.create({
          user: student.user._id,
          graduationYear: student.batchYear,
          pastDepartment: student.department,
        });

        // Update Role
        await User.findByIdAndUpdate(student.user._id, { role: ROLES.ALUMNI });
        
        logger.info(`Transitioned user ${student.user.email} to Alumni`);
      }
    } catch (error) {
      logger.error('Error during Alumni transition job:', error);
    }
  });
};

import { connectDB } from './src/config/db.js';
import { User } from './src/models/User.js';
import { StudentProfile } from './src/models/StudentProfile.js';
import { Club } from './src/models/Club.js';
import { ROLES } from './src/config/roles.js';

const seed = async () => {
  try {
    await connectDB();
    
    // Clear old demo data
    await User.deleteMany({ email: { $regex: '@campus.edu' } });

    console.log('Creating demo users for each role...');
    
    const users = await User.create([
      { email: 'student@campus.edu', password: 'password', firstName: 'Sam', lastName: 'Student', role: ROLES.STUDENT },
      { email: 'alumni@campus.edu', password: 'password', firstName: 'Alice', lastName: 'Alumni', role: ROLES.ALUMNI },
      { email: 'clubadmin@campus.edu', password: 'password', firstName: 'Charlie', lastName: 'ClubAdmin', role: ROLES.CLUB_ADMIN },
      { email: 'faculty@campus.edu', password: 'password', firstName: 'Fiona', lastName: 'Faculty', role: ROLES.FACULTY },
      { email: 'admin@campus.edu', password: 'password', firstName: 'Adam', lastName: 'Admin', role: ROLES.SYSTEM_ADMIN }
    ]);

    const studentUser = users.find(u => u.role === ROLES.STUDENT);
    const clubAdminUser = users.find(u => u.role === ROLES.CLUB_ADMIN);
    const facultyUser = users.find(u => u.role === ROLES.FACULTY);

    await StudentProfile.create([
      { user: studentUser._id, department: 'Computer Science', batchYear: 2026, skills: ['React', 'Node.js'], totalActivityPoints: 45 },
      { user: clubAdminUser._id, department: 'Mechanical', batchYear: 2025, skills: ['CAD', 'Robotics'], totalActivityPoints: 90 },
    ]);

    console.log('Creating demo clubs...');
    await Club.deleteMany({ name: { $in: ['Robotics Club', 'Debate Society'] } });
    
    const clubs = await Club.create([
      {
        name: 'Robotics Club',
        description: 'A community of hardware and robotics enthusiasts building autonomous machines and competing in national hackathons.',
        category: 'Technical',
        admins: [clubAdminUser._id],
        members: [studentUser._id, clubAdminUser._id]
      },
      {
        name: 'Debate Society',
        description: 'Refine your public speaking skills, participate in Model UN, and discuss global affairs with peers.',
        category: 'Cultural',
        admins: [],
        members: [studentUser._id]
      }
    ]);

    const { Announcement } = await import('./src/models/Announcement.js');
    const { Event } = await import('./src/models/Event.js');

    console.log('Creating demo announcements and events...');
    await Announcement.deleteMany({ author: { $in: users.map(u => u._id) } });
    
    await Announcement.create([
      {
        title: 'Midterm Exam Schedule Released',
        content: 'The schedule for the upcoming midterm examinations has been released on the portal. Please ensure you carry your ID cards.',
        priority: 'HIGH',
        author: facultyUser._id
      },
      {
        title: 'Robotics Club Meetup',
        content: 'We are kicking off the new semester with a general body meeting. All new members are welcome!',
        priority: 'MEDIUM',
        author: clubAdminUser._id
      }
    ]);

    await Event.deleteMany({ organizer: { $in: users.map(u => u._id) } });
    await Event.create([
      {
        title: 'Introduction to Autonomous Robotics',
        description: 'Join the Robotics Club for a hands-on workshop on building your first line-following robot using Arduino.',
        date: new Date(Date.now() + 86400000 * 3), // 3 days from now
        location: 'Engineering Lab 4',
        organizer: clubAdminUser._id,
        club: clubs[0]._id,
        maxCapacity: 50,
        rsvps: [studentUser._id]
      },
      {
        title: 'Department Seminar: Future of AI',
        description: 'A mandatory seminar for all computer science students regarding the latest in AI and machine learning.',
        date: new Date(Date.now() + 86400000 * 5), 
        location: 'Main Auditorium',
        organizer: facultyUser._id,
        maxCapacity: 200,
        rsvps: []
      }
    ]);

    console.log('Creating demo forums...');
    const { ForumThread } = await import('./src/models/ForumThread.js');
    const { ForumPost } = await import('./src/models/ForumPost.js');
    
    await ForumThread.deleteMany({ author: { $in: users.map(u => u._id) } });
    await ForumPost.deleteMany({ author: { $in: users.map(u => u._id) } });

    const thread1 = await ForumThread.create({
      title: 'Best resources for learning React?',
      content: 'I want to build a project for the upcoming hackathon but I am a beginner in React. Can anyone share good resources or playlists?',
      author: studentUser._id,
      category: 'Tech Help',
      isPinned: true
    });

    await ForumPost.create({
      thread: thread1._id,
      author: clubAdminUser._id,
      content: 'I highly recommend checking out the official React documentation (react.dev). It has been completely rewritten and is super beginner-friendly!'
    });

    console.log('----------------------------------------------------');
    console.log('Seed complete! You can login with the following accounts:');
    console.log('Student:      student@campus.edu / password');
    console.log('Alumni:       alumni@campus.edu / password');
    console.log('Club Admin:   clubadmin@campus.edu / password');
    console.log('Faculty:      faculty@campus.edu / password');
    console.log('System Admin: admin@campus.edu / password');
    console.log('----------------------------------------------------');
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();

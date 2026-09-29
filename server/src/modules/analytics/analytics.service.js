import { User } from '../../models/User.js';
import { Club } from '../../models/Club.js';
import { Event } from '../../models/Event.js';
import { StudentProfile } from '../../models/StudentProfile.js';

export const getDashboardStats = async (user) => {
  let userQuery = {};
  let clubQuery = {};
  let eventQuery = {};
  let studentProfileQuery = {};

  if (user.role === 'ClubAdmin') {
    clubQuery = { admins: user._id };
    const myClubs = await Club.find(clubQuery).select('_id members');
    const myClubIds = myClubs.map(c => c._id);
    
    const myMembers = new Set();
    myClubs.forEach(c => c.members.forEach(m => myMembers.add(m.toString())));
    
    userQuery = { _id: { $in: Array.from(myMembers) } };
    eventQuery = { club: { $in: myClubIds } };
    studentProfileQuery = { user: { $in: Array.from(myMembers) } };
  } else if (user.role === 'Faculty') {
    eventQuery = { organizer: user._id };
    // Assuming faculty doesn't manage clubs directly, or maybe they just see total count
    // We'll let them see global students for now, but restrict events to theirs
  }

  const [
    totalUsers,
    totalClubs,
    totalEvents,
    topStudents,
    eventsByMonth
  ] = await Promise.all([
    User.countDocuments(userQuery),
    Club.countDocuments(clubQuery),
    Event.countDocuments(eventQuery),
    
    // Top 5 students by points
    StudentProfile.find(studentProfileQuery)
      .sort({ totalActivityPoints: -1 })
      .limit(5)
      .populate('user', 'firstName lastName')
      .lean(),

    // Mock aggregate: Events by month (For real, group by event.date)
    // We'll return some dummy trend data here to make the chart look nice
    Promise.resolve([
      { name: 'Jan', events: 2, pointsAwarded: 120 },
      { name: 'Feb', events: 4, pointsAwarded: 350 },
      { name: 'Mar', events: 3, pointsAwarded: 200 },
      { name: 'Apr', events: 7, pointsAwarded: 800 },
      { name: 'May', events: 5, pointsAwarded: 500 },
      { name: 'Jun', events: 8, pointsAwarded: 950 },
    ])
  ]);

  // Map top students to a cleaner format
  const leaderboard = topStudents.map(s => ({
    name: `${s.user?.firstName || 'Unknown'} ${s.user?.lastName || ''}`.trim(),
    points: s.totalActivityPoints,
    avatar: s.avatarUrl
  }));

  return {
    overview: {
      totalUsers,
      totalClubs,
      totalEvents,
    },
    trends: eventsByMonth,
    leaderboard
  };
};

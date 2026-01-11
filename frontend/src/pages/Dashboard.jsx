import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Briefcase, 
  Send, 
  PlusCircle, 
  Eye,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle,
  DollarSign,
  ArrowRight,
  Calendar
} from 'lucide-react';
import { fetchMyGigs } from '../store/slices/gigSlice';
import { fetchMyBids } from '../store/slices/bidSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { myGigs } = useSelector((state) => state.gigs);
  const { myBids } = useSelector((state) => state.bids);

  useEffect(() => {
    dispatch(fetchMyGigs());
    dispatch(fetchMyBids());
  }, [dispatch]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const stats = [
    {
      label: 'My Posted Gigs',
      value: myGigs.length,
      icon: FileText,
      color: 'from-primary-400 to-primary-500',
      bgColor: 'bg-primary-50',
      textColor: 'text-primary-600',
    },
    {
      label: 'Open Gigs',
      value: myGigs.filter(g => g.status === 'open').length,
      icon: Clock,
      color: 'from-amber-400 to-amber-500',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600',
    },
    {
      label: 'Bids Submitted',
      value: myBids.length,
      icon: Send,
      color: 'from-blue-400 to-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      label: 'Hired',
      value: myBids.filter(b => b.status === 'hired').length,
      icon: CheckCircle,
      color: 'from-green-400 to-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
  ];

  const quickActions = [
    {
      title: 'Post a New Gig',
      description: 'Create a job listing to find freelancers',
      icon: PlusCircle,
      path: '/gigs/create',
      color: 'from-primary-400 to-primary-500',
    },
    {
      title: 'Browse Gigs',
      description: 'Find opportunities that match your skills',
      icon: Eye,
      path: '/gigs',
      color: 'from-blue-400 to-blue-500',
    },
    {
      title: 'My Gigs',
      description: 'Manage your posted job listings',
      icon: FileText,
      path: '/my-gigs',
      color: 'from-amber-400 to-amber-500',
    },
    {
      title: 'My Bids',
      description: 'Track your submitted proposals',
      icon: Send,
      path: '/my-bids',
      color: 'from-green-400 to-green-500',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white/80 backdrop-blur-xl border border-dark-200 rounded-2xl p-6 shadow-lg shadow-dark-200/10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-display font-bold text-3xl text-dark-900 mb-2">
              Welcome back, {user?.name?.split(' ')[0]}!
            </h1>
            <p className="text-dark-500">
              Here's what's happening with your gigs and bids today.
            </p>
          </div>
          <Link to="/gigs/create" className="btn-primary flex items-center gap-2 whitespace-nowrap">
            <PlusCircle className="w-5 h-5" />
            Post a Gig
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div 
            key={index}
            className="bg-white/80 rounded-2xl p-5 border border-dark-200 shadow-lg shadow-dark-200/10 flex items-center gap-4"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className={`p-3 rounded-xl ${stat.bgColor}`}>
              <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-dark-900">{stat.value}</p>
              <p className="text-sm text-dark-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div>
        <h2 className="font-display font-semibold text-xl text-dark-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary-500" />
          Quick Actions
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.path}
              className="bg-white/80 rounded-2xl p-5 border border-dark-200 shadow-lg shadow-dark-200/10 
                        group hover:border-primary-300 hover:shadow-primary-200/20 transition-all"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-4 
                              group-hover:scale-110 transition-transform`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-dark-900 mb-1 group-hover:text-primary-600 transition-colors">
                {action.title}
              </h3>
              <p className="text-sm text-dark-500">
                {action.description}
              </p>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white/80 backdrop-blur-xl border border-dark-200 rounded-2xl p-6 shadow-lg shadow-dark-200/10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-semibold text-lg text-dark-900 flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary-50">
                <Briefcase className="w-5 h-5 text-primary-500" />
              </div>
              Recent Gigs
            </h2>
            <Link to="/my-gigs" className="text-sm text-primary-500 hover:text-primary-600 font-medium flex items-center gap-1 group">
              View all
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          {myGigs.length === 0 ? (
            <div className="text-center py-12 bg-dark-50 rounded-xl">
              <Briefcase className="w-12 h-12 text-dark-300 mx-auto mb-3" />
              <p className="text-dark-500 mb-2">No gigs posted yet</p>
              <Link to="/gigs/create" className="text-primary-500 hover:text-primary-600 text-sm font-medium inline-flex items-center gap-1">
                Post your first gig
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {myGigs.slice(0, 3).map((gig) => (
                <Link
                  key={gig._id}
                  to={`/gigs/${gig._id}`}
                  className="block p-4 rounded-xl border border-primary-200 bg-primary-50/40 
                             hover:bg-primary-100/60 hover:border-primary-300 hover:shadow-md hover:shadow-primary-200/30 
                             hover:-translate-y-0.5 transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary-100 group-hover:bg-primary-200 transition-colors">
                      <FileText className="w-4 h-4 text-primary-500 group-hover:text-primary-600 transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className="font-medium text-dark-900 line-clamp-1 group-hover:text-primary-700 transition-colors">
                          {gig.title}
                        </h3>
                        <span className={`text-xs flex-shrink-0 ${gig.status === 'open' ? 'status-open' : 'status-assigned'}`}>
                          {gig.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-dark-500">
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3.5 h-3.5" />
                          {gig.budget.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(gig.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-dark-200 rounded-2xl p-6 shadow-lg shadow-dark-200/10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-semibold text-lg text-dark-900 flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-50">
                <Send className="w-5 h-5 text-blue-500" />
              </div>
              Recent Bids
            </h2>
            <Link to="/my-bids" className="text-sm text-primary-500 hover:text-primary-600 font-medium flex items-center gap-1 group">
              View all
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          {myBids.length === 0 ? (
            <div className="text-center py-12 bg-dark-50 rounded-xl">
              <Send className="w-12 h-12 text-dark-300 mx-auto mb-3" />
              <p className="text-dark-500 mb-2">No bids submitted yet</p>
              <Link to="/gigs" className="text-primary-500 hover:text-primary-600 text-sm font-medium inline-flex items-center gap-1">
                Browse available gigs
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {myBids.slice(0, 3).map((bid) => (
                <Link
                  key={bid._id}
                  to={`/gigs/${bid.gigId?._id}`}
                  className={`block p-4 rounded-xl border transition-all group
                    ${bid.status === 'hired' 
                      ? 'border-green-200 bg-green-50/50 hover:bg-green-100/60 hover:border-green-300' 
                      : bid.status === 'rejected'
                      ? 'border-dark-200 bg-dark-50/50 hover:bg-dark-100/60 hover:border-dark-300'
                      : 'border-blue-200 bg-blue-50/40 hover:bg-blue-100/60 hover:border-blue-300'
                    } hover:shadow-md hover:-translate-y-0.5`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg transition-colors ${
                      bid.status === 'hired' 
                        ? 'bg-green-100 group-hover:bg-green-200' 
                        : bid.status === 'rejected' 
                        ? 'bg-dark-100 group-hover:bg-dark-200' 
                        : 'bg-blue-100 group-hover:bg-blue-200'
                    }`}>
                      {bid.status === 'hired' ? (
                        <CheckCircle className="w-4 h-4 text-green-500 group-hover:text-green-600 transition-colors" />
                      ) : bid.status === 'rejected' ? (
                        <Clock className="w-4 h-4 text-dark-400 group-hover:text-dark-500 transition-colors" />
                      ) : (
                        <Clock className="w-4 h-4 text-blue-500 group-hover:text-blue-600 transition-colors" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className={`font-medium line-clamp-1 transition-colors ${
                          bid.status === 'hired'
                            ? 'text-dark-900 group-hover:text-green-700'
                            : bid.status === 'rejected'
                            ? 'text-dark-600 group-hover:text-dark-700'
                            : 'text-dark-900 group-hover:text-blue-700'
                        }`}>
                          {bid.gigId?.title || 'Unknown Gig'}
                        </h3>
                        <span className={`text-xs flex-shrink-0 status-${bid.status}`}>
                          {bid.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-dark-500">
                        <span className="flex items-center gap-1 text-primary-600 font-medium">
                          <DollarSign className="w-3.5 h-3.5" />
                          {bid.price.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(bid.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

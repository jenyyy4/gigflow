import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FileText, PlusCircle } from 'lucide-react';
import { fetchMyGigs } from '../store/slices/gigSlice';
import GigCard from '../components/GigCard';
import LoadingSpinner from '../components/LoadingSpinner';

const MyGigs = () => {
  const [statusFilter, setStatusFilter] = useState('all');
  const dispatch = useDispatch();
  const { myGigs, isLoading } = useSelector((state) => state.gigs);

  useEffect(() => {
    dispatch(fetchMyGigs());
  }, [dispatch]);

  const filteredGigs = myGigs.filter(gig => {
    if (statusFilter === 'all') return true;
    return gig.status === statusFilter;
  });

  const stats = {
    total: myGigs.length,
    open: myGigs.filter(g => g.status === 'open').length,
    assigned: myGigs.filter(g => g.status === 'assigned').length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-dark-900 mb-2 flex items-center gap-3">
            <FileText className="w-8 h-8 text-primary-500" />
            My Gigs
          </h1>
          <p className="text-dark-500">
            Manage your posted job listings
          </p>
        </div>
        <Link to="/gigs/create" className="btn-primary flex items-center gap-2 whitespace-nowrap">
          <PlusCircle className="w-5 h-5" />
          Post New Gig
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Gigs', value: stats.total, filter: 'all' },
          { label: 'Open', value: stats.open, filter: 'open' },
          { label: 'Assigned', value: stats.assigned, filter: 'assigned' },
        ].map((stat, index) => (
          <div 
            key={index}
            className={`bg-white/80 backdrop-blur-xl border rounded-2xl p-5 text-center cursor-pointer transition-all shadow-lg shadow-dark-200/10
              ${statusFilter === stat.filter 
                ? 'border-primary-300' : 'border-dark-200 hover:border-dark-300'}`}
            onClick={() => setStatusFilter(stat.filter)}
          >
            <p className="text-2xl font-bold text-primary-600">{stat.value}</p>
            <p className="text-sm text-dark-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-dark-500">Filter:</span>
        <div className="flex rounded-xl overflow-hidden border border-dark-200">
          {['all', 'open', 'assigned'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 text-sm font-medium transition-all
                ${statusFilter === status 
                  ? 'bg-primary-500 text-white' 
                  : 'bg-white text-dark-600 hover:text-dark-900 hover:bg-dark-50'}`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      ) : filteredGigs.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-xl border border-dark-200 rounded-2xl p-6 shadow-lg shadow-dark-200/10 text-center py-16">
          <FileText className="w-16 h-16 text-dark-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-dark-900 mb-2">
            {statusFilter === 'all' ? 'No gigs posted yet' : `No ${statusFilter} gigs`}
          </h3>
          <p className="text-dark-500 mb-6">
            {statusFilter === 'all' 
              ? 'Start by posting your first job listing!'
              : `You don't have any ${statusFilter} gigs right now.`}
          </p>
          {statusFilter === 'all' && (
            <Link to="/gigs/create" className="btn-primary inline-flex items-center gap-2">
              <PlusCircle className="w-5 h-5" />
              Post Your First Gig
            </Link>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGigs.map((gig, index) => (
            <div 
              key={gig._id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <GigCard gig={gig} showOwner={false} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyGigs;

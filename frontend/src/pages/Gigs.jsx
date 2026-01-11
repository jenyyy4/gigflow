import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, Briefcase, X } from 'lucide-react';
import { fetchGigs } from '../store/slices/gigSlice';
import GigCard from '../components/GigCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Gigs = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('open');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  const dispatch = useDispatch();
  const { gigs, isLoading } = useSelector((state) => state.gigs);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    dispatch(fetchGigs({ search: debouncedSearch, status: statusFilter }));
  }, [dispatch, debouncedSearch, statusFilter]);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-dark-900 mb-2 flex items-center gap-3">
            <Briefcase className="w-8 h-8 text-primary-500" />
            Browse Gigs
          </h1>
          <p className="text-dark-500">
            Discover opportunities that match your skills
          </p>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl border border-dark-200 rounded-2xl p-6 shadow-lg shadow-dark-200/10">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search gigs by title..."
              className="input-field pl-12 pr-10"
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="flex rounded-xl overflow-hidden border border-dark-200">
            {[
              { value: 'open', label: 'Open' },
              { value: 'assigned', label: 'Assigned' },
              { value: 'all', label: 'All' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setStatusFilter(option.value)}
                className={`px-4 py-3 text-sm font-medium transition-all
                  ${statusFilter === option.value
                    ? 'bg-primary-500 text-white'
                    : 'bg-white text-dark-600 hover:text-dark-900 hover:bg-dark-50'
                  }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      ) : gigs.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-xl border border-dark-200 rounded-2xl p-6 shadow-lg shadow-dark-200/10 text-center py-16">
          <Briefcase className="w-16 h-16 text-dark-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-dark-900 mb-2">No gigs found</h3>
          <p className="text-dark-500">
            {searchQuery 
              ? `No gigs match "${searchQuery}". Try a different search term.`
              : 'There are no open gigs at the moment. Check back later!'}
          </p>
        </div>
      ) : (
        <>
          <p className="text-dark-500 text-sm">
            Showing {gigs.length} {gigs.length === 1 ? 'gig' : 'gigs'}
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gigs.map((gig, index) => (
              <div 
                key={gig._id} 
                className="animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <GigCard gig={gig} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Gigs;

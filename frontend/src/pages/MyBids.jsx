import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Send, 
  Briefcase, 
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  ExternalLink
} from 'lucide-react';
import { fetchMyBids } from '../store/slices/bidSlice';
import LoadingSpinner from '../components/LoadingSpinner';

const MyBids = () => {
  const [statusFilter, setStatusFilter] = useState('all');
  const dispatch = useDispatch();
  const { myBids, isLoading } = useSelector((state) => state.bids);

  useEffect(() => {
    dispatch(fetchMyBids());
  }, [dispatch]);

  const filteredBids = myBids.filter(bid => {
    if (statusFilter === 'all') return true;
    return bid.status === statusFilter;
  });

  const stats = {
    total: myBids.length,
    pending: myBids.filter(b => b.status === 'pending').length,
    hired: myBids.filter(b => b.status === 'hired').length,
    rejected: myBids.filter(b => b.status === 'rejected').length,
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'hired':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-dark-400" />;
      default:
        return <Clock className="w-5 h-5 text-primary-500" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-dark-900 mb-2 flex items-center gap-3">
            <Send className="w-8 h-8 text-primary-500" />
            My Bids
          </h1>
          <p className="text-dark-500">
            Track your submitted proposals
          </p>
        </div>
        <Link to="/gigs" className="btn-primary flex items-center gap-2 whitespace-nowrap">
          <Briefcase className="w-5 h-5" />
          Find More Gigs
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total', value: stats.total, filter: 'all' },
          { label: 'Pending', value: stats.pending, filter: 'pending' },
          { label: 'Hired', value: stats.hired, filter: 'hired' },
          { label: 'Rejected', value: stats.rejected, filter: 'rejected' },
        ].map((stat, index) => (
          <div 
            key={index}
            className={`bg-white/80 backdrop-blur-xl border rounded-2xl p-5 text-center cursor-pointer transition-all shadow-lg shadow-dark-200/10
              ${statusFilter === stat.filter ? 'border-primary-300' : 'border-dark-200 hover:border-dark-300'}`}
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
          {['all', 'pending', 'hired', 'rejected'].map((status) => (
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
      ) : filteredBids.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-xl border border-dark-200 rounded-2xl p-6 shadow-lg shadow-dark-200/10 text-center py-16">
          <Send className="w-16 h-16 text-dark-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-dark-900 mb-2">
            {statusFilter === 'all' ? 'No bids submitted yet' : `No ${statusFilter} bids`}
          </h3>
          <p className="text-dark-500 mb-6">
            {statusFilter === 'all' 
              ? 'Start by browsing open gigs and submitting proposals!'
              : `You don't have any ${statusFilter} bids right now.`}
          </p>
          {statusFilter === 'all' && (
            <Link to="/gigs" className="btn-primary inline-flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Browse Gigs
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBids.map((bid, index) => (
            <div 
              key={bid._id}
              className={`bg-white/80 backdrop-blur-xl border rounded-2xl p-6 shadow-lg shadow-dark-200/10 transition-all animate-slide-up
                ${bid.status === 'hired' ? 'border-green-300 bg-green-50/50' : 'border-dark-200'}
                ${bid.status === 'rejected' ? 'opacity-60' : ''}`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(bid.status)}
                    <span className={`status-${bid.status}`}>
                      {bid.status}
                    </span>
                  </div>
                  
                  <h3 className="font-semibold text-lg text-dark-900 mb-1">
                    {bid.gigId?.title || 'Unknown Gig'}
                  </h3>
                  
                  <p className="text-dark-500 text-sm line-clamp-2 mb-3">
                    {bid.message}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-2 text-primary-600 font-semibold">
                      <DollarSign className="w-4 h-4" />
                      <span>Your Bid: {formatPrice(bid.price)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-dark-500">
                      <Clock className="w-4 h-4" />
                      <span>{formatDate(bid.createdAt)}</span>
                    </div>

                    {bid.gigId?.budget && (
                      <div className="text-dark-400">
                        Gig Budget: {formatPrice(bid.gigId.budget)}
                      </div>
                    )}
                  </div>
                </div>

                <Link
                  to={`/gigs/${bid.gigId?._id}`}
                  className="btn-secondary py-2 px-4 flex items-center gap-2 whitespace-nowrap"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Gig
                </Link>
              </div>

              {bid.status === 'hired' && (
                <div className="mt-4 p-3 rounded-xl bg-green-100 border border-green-200">
                  <p className="text-green-700 text-sm font-medium flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Congratulations! You've been hired for this gig.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBids;

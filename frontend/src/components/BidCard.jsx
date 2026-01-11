import { DollarSign, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';

const BidCard = ({ bid, isOwner = false, onHire, hireLoading = false }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusIcon = () => {
    switch (bid.status) {
      case 'hired':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-dark-400" />;
      default:
        return <Clock className="w-5 h-5 text-primary-500" />;
    }
  };

  return (
    <div className={`bg-white/80 backdrop-blur-xl border border-dark-200 rounded-2xl p-6 shadow-lg shadow-dark-200/10 transition-all duration-300 
      ${bid.status === 'hired' ? 'border-green-300 bg-green-50/50' : ''}
      ${bid.status === 'rejected' ? 'opacity-60' : ''}`}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-500 flex items-center justify-center text-white font-semibold">
            {bid.freelancerId?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <h4 className="font-semibold text-dark-900">
              {bid.freelancerId?.name || 'Unknown User'}
            </h4>
            <p className="text-sm text-dark-500">
              {bid.freelancerId?.email || ''}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <span className={`status-${bid.status}`}>
            {bid.status}
          </span>
        </div>
      </div>

      <p className="text-dark-600 text-sm leading-relaxed mb-4 p-3 bg-dark-100 rounded-xl">
        {bid.message}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2 text-primary-600 font-bold text-lg">
            <DollarSign className="w-5 h-5" />
            <span>{formatPrice(bid.price)}</span>
          </div>
          
          <div className="flex items-center gap-2 text-dark-500">
            <Clock className="w-4 h-4" />
            <span>{formatDate(bid.createdAt)}</span>
          </div>
        </div>

        {isOwner && bid.status === 'pending' && (
          <button
            onClick={() => onHire(bid._id)}
            disabled={hireLoading}
            className="btn-primary py-2 px-4 text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {hireLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Hiring...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Hire
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default BidCard;

import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  ArrowLeft, 
  DollarSign, 
  User, 
  Calendar, 
  Trash2,
  CheckCircle,
  Users,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchGig, deleteGig, clearCurrentGig } from '../store/slices/gigSlice';
import { fetchBidsForGig, hireBid } from '../store/slices/bidSlice';
import BidCard from '../components/BidCard';
import BidForm from '../components/BidForm';
import LoadingSpinner from '../components/LoadingSpinner';

const GigDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [hiringBidId, setHiringBidId] = useState(null);

  const { user } = useSelector((state) => state.auth);
  const { currentGig, isLoading: gigLoading } = useSelector((state) => state.gigs);
  const { bidsForGig, isLoading: bidsLoading, hireLoading } = useSelector((state) => state.bids);

  const bids = bidsForGig[id] || [];
  const isOwner = currentGig?.ownerId?._id === user?._id;
  const hasAlreadyBid = bids.some(bid => bid.freelancerId?._id === user?._id);
  const userBid = bids.find(bid => bid.freelancerId?._id === user?._id);

  useEffect(() => {
    dispatch(fetchGig(id));
    return () => {
      dispatch(clearCurrentGig());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (isOwner) {
      dispatch(fetchBidsForGig(id));
    }
  }, [dispatch, id, isOwner]);

  const handleDelete = async () => {
    try {
      await dispatch(deleteGig(id)).unwrap();
      toast.success('Gig deleted successfully');
      navigate('/my-gigs');
    } catch (error) {
      toast.error(error);
    }
  };

  const handleHire = async (bidId) => {
    setHiringBidId(bidId);
    try {
      await dispatch(hireBid(bidId)).unwrap();
      toast.success('Freelancer hired successfully!');
      dispatch(fetchGig(id));
    } catch (error) {
      toast.error(error);
    } finally {
      setHiringBidId(null);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatBudget = (budget) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(budget);
  };

  if (gigLoading || !currentGig) {
    return (
      <div className="flex justify-center items-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-dark-500 hover:text-dark-900 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <div className="bg-white/80 backdrop-blur-xl border border-dark-200 rounded-2xl p-6 shadow-lg shadow-dark-200/10">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className={currentGig.status === 'open' ? 'status-open' : 'status-assigned'}>
                {currentGig.status}
              </span>
              {currentGig.status === 'assigned' && (
                <span className="text-sm text-green-600 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  Freelancer Hired
                </span>
              )}
            </div>
            <h1 className="font-display font-bold text-2xl md:text-3xl text-dark-900">
              {currentGig.title}
            </h1>
          </div>

          {isOwner && currentGig.status === 'open' && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="btn-secondary py-2 px-4 flex items-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          )}
        </div>

        <p className="text-dark-600 leading-relaxed whitespace-pre-wrap mb-6">
          {currentGig.description}
        </p>

        <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-dark-200">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary-500" />
            <span className="text-lg font-bold text-dark-900">{formatBudget(currentGig.budget)}</span>
            <span className="text-dark-400 text-sm">Budget</span>
          </div>
          
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-dark-400" />
            <span className="text-dark-900">{currentGig.ownerId?.name}</span>
            {isOwner && <span className="text-xs text-primary-500">(You)</span>}
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-dark-400" />
            <span className="text-dark-600">{formatDate(currentGig.createdAt)}</span>
          </div>
        </div>

        {currentGig.status === 'assigned' && currentGig.hiredFreelancerId && (
          <div className="mt-6 p-4 rounded-xl bg-green-50 border border-green-200">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <div>
                <p className="text-sm text-green-600 font-medium">Hired Freelancer</p>
                <p className="text-dark-900 font-semibold">{currentGig.hiredFreelancerId.name}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {isOwner && (
        <div className="space-y-4">
          <h2 className="font-display font-semibold text-xl text-dark-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary-500" />
            Bids ({bids.length})
          </h2>

          {bidsLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : bids.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-xl border border-dark-200 rounded-2xl p-6 shadow-lg shadow-dark-200/10 text-center py-12">
              <Users className="w-12 h-12 text-dark-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-dark-900 mb-2">No bids yet</h3>
              <p className="text-dark-500">
                Freelancers haven't submitted bids for this gig yet. Check back later!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {bids.map((bid) => (
                <BidCard 
                  key={bid._id} 
                  bid={bid} 
                  isOwner={isOwner && currentGig.status === 'open'}
                  onHire={handleHire}
                  hireLoading={hireLoading && hiringBidId === bid._id}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {!isOwner && currentGig.status === 'open' && (
        <>
          {hasAlreadyBid ? (
            <div className="bg-white/80 backdrop-blur-xl border border-dark-200 rounded-2xl p-6 shadow-lg shadow-dark-200/10">
              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-dark-900 mb-1">Bid Submitted</h3>
                  <p className="text-dark-500 text-sm mb-3">
                    You've already submitted a bid for this gig. The client will review your proposal.
                  </p>
                  {userBid && (
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-primary-600 font-semibold">
                        Your Bid: {formatBudget(userBid.price)}
                      </span>
                      <span className={`status-${userBid.status}`}>
                        {userBid.status}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <BidForm 
              gigId={id} 
              gigBudget={currentGig.budget}
              onSuccess={() => dispatch(fetchGig(id))}
            />
          )}
        </>
      )}

      {!isOwner && currentGig.status === 'assigned' && (
        <div className="bg-white/80 backdrop-blur-xl border border-dark-200 rounded-2xl p-6 shadow-lg shadow-dark-200/10">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-amber-500 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-dark-900 mb-1">Gig Closed</h3>
              <p className="text-dark-500 text-sm">
                This gig has been assigned to a freelancer. Browse other opportunities!
              </p>
              <Link to="/gigs" className="btn-primary mt-4 inline-flex items-center gap-2 py-2 px-4">
                Browse Open Gigs
              </Link>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-xl border border-dark-200 rounded-2xl p-6 shadow-xl max-w-md w-full animate-slide-up">
            <h3 className="font-display font-semibold text-xl text-dark-900 mb-4">
              Delete This Gig?
            </h3>
            <p className="text-dark-500 mb-6">
              This action cannot be undone. All bids for this gig will also be deleted.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="btn-danger flex-1"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GigDetail;

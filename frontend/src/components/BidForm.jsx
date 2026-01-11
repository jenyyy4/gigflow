import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Send, DollarSign, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { submitBid } from '../store/slices/bidSlice';

const BidForm = ({ gigId, gigBudget, onSuccess }) => {
  const [message, setMessage] = useState('');
  const [price, setPrice] = useState('');
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.bids);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }
    
    if (!price || parseFloat(price) <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    try {
      await dispatch(submitBid({
        gigId,
        message: message.trim(),
        price: parseFloat(price),
      })).unwrap();
      
      toast.success('Bid submitted successfully!');
      setMessage('');
      setPrice('');
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-xl border border-dark-200 rounded-2xl p-6 shadow-lg shadow-dark-200/10">
      <h3 className="font-display font-semibold text-lg text-dark-900 mb-4 flex items-center gap-2">
        <Send className="w-5 h-5 text-primary-500" />
        Submit Your Bid
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-dark-700 mb-2">
            Your Proposal
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            placeholder="Explain why you're the best fit for this gig..."
            className="input-field resize-none"
            maxLength={1000}
          />
          <p className="text-xs text-dark-400 mt-1 text-right">
            {message.length}/1000 characters
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-700 mb-2">
            Your Price
          </label>
          <div className="relative">
            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0"
              min="1"
              className="input-field pl-12"
            />
          </div>
          <p className="text-xs text-dark-500 mt-1">
            Client's budget: ${gigBudget?.toLocaleString()}
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Submit Bid
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default BidForm;

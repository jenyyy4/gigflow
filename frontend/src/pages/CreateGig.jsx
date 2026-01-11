import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  PlusCircle, 
  FileText, 
  DollarSign, 
  AlignLeft,
  Loader2,
  ArrowLeft
} from 'lucide-react';
import toast from 'react-hot-toast';
import { createGig } from '../store/slices/gigSlice';

const CreateGig = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.gigs);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    
    if (!description.trim()) {
      toast.error('Please enter a description');
      return;
    }
    
    if (!budget || parseFloat(budget) <= 0) {
      toast.error('Please enter a valid budget');
      return;
    }

    try {
      const result = await dispatch(createGig({
        title: title.trim(),
        description: description.trim(),
        budget: parseFloat(budget),
      })).unwrap();
      
      toast.success('Gig posted successfully!');
      navigate(`/gigs/${result._id}`);
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-dark-500 hover:text-dark-900 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <div>
        <h1 className="font-display font-bold text-3xl text-dark-900 mb-2 flex items-center gap-3">
          <PlusCircle className="w-8 h-8 text-primary-500" />
          Post a New Gig
        </h1>
        <p className="text-dark-500">
          Create a job listing and find talented freelancers
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-xl border border-dark-200 rounded-2xl p-6 shadow-lg shadow-dark-200/10 space-y-6">
        <div>
          <label className="block text-sm font-medium text-dark-700 mb-2">
            <FileText className="w-4 h-4 inline mr-2" />
            Gig Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Build a responsive landing page"
            className="input-field"
            maxLength={100}
          />
          <p className="text-xs text-dark-400 mt-1 text-right">
            {title.length}/100 characters
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-700 mb-2">
            <AlignLeft className="w-4 h-4 inline mr-2" />
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your project in detail. Include requirements, deliverables, and timeline..."
            rows={8}
            className="input-field resize-none"
            maxLength={2000}
          />
          <p className="text-xs text-dark-400 mt-1 text-right">
            {description.length}/2000 characters
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-700 mb-2">
            <DollarSign className="w-4 h-4 inline mr-2" />
            Budget
          </label>
          <div className="relative">
            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="0"
              min="1"
              className="input-field pl-12"
            />
          </div>
          <p className="text-xs text-dark-400 mt-1">
            Set a fair budget to attract quality freelancers
          </p>
        </div>

        <div className="pt-4 border-t border-dark-200">
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Posting...
              </>
            ) : (
              <>
                <PlusCircle className="w-5 h-5" />
                Post Gig
              </>
            )}
          </button>
        </div>
      </form>

      <div className="bg-primary-50 border border-primary-200 rounded-2xl p-6">
        <h3 className="font-semibold text-dark-900 mb-3">Tips for a Great Gig Post</h3>
        <ul className="space-y-2 text-sm text-dark-600">
          <li className="flex items-start gap-2">
            <span className="text-primary-500">•</span>
            Be specific about your requirements and deliverables
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-500">•</span>
            Include any technical specifications or preferences
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-500">•</span>
            Set a realistic timeline and budget
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-500">•</span>
            Mention any required skills or experience
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CreateGig;

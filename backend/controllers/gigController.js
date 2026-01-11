import Gig from '../models/Gig.js';
import Bid from '../models/Bid.js';

export const getGigs = async (req, res) => {
  try {
    const { search, status } = req.query;
    
    let query = {};
    
    if (status === 'open' || status === 'assigned') {
      query.status = status;
    } else if (status === '' || status === 'all') {
    } else {
      query.status = 'open';
    }
    
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const gigs = await Gig.find(query)
      .populate('ownerId', 'name email')
      .populate('hiredFreelancerId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: gigs.length,
      gigs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id)
      .populate('ownerId', 'name email')
      .populate('hiredFreelancerId', 'name email');

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found'
      });
    }

    res.status(200).json({
      success: true,
      gig
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const createGig = async (req, res) => {
  try {
    const { title, description, budget } = req.body;

    const gig = await Gig.create({
      title,
      description,
      budget,
      ownerId: req.user._id
    });

    const populatedGig = await Gig.findById(gig._id)
      .populate('ownerId', 'name email');

    const io = req.app.get('io');
    if (io) {
      io.emit('newGig', populatedGig);
    }

    res.status(201).json({
      success: true,
      gig: populatedGig
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updateGig = async (req, res) => {
  try {
    let gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found'
      });
    }

    if (gig.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this gig'
      });
    }

    if (gig.status !== 'open') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update an assigned gig'
      });
    }

    const { title, description, budget } = req.body;

    gig = await Gig.findByIdAndUpdate(
      req.params.id,
      { title, description, budget },
      { new: true, runValidators: true }
    ).populate('ownerId', 'name email');

    res.status(200).json({
      success: true,
      gig
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const deleteGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found'
      });
    }

    if (gig.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this gig'
      });
    }

    await Bid.deleteMany({ gigId: gig._id });
    
    await gig.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Gig deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getMyGigs = async (req, res) => {
  try {
    const gigs = await Gig.find({ ownerId: req.user._id })
      .populate('ownerId', 'name email')
      .populate('hiredFreelancerId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: gigs.length,
      gigs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

import mongoose from 'mongoose';
import Bid from '../models/Bid.js';
import Gig from '../models/Gig.js';

export const createBid = async (req, res) => {
  try {
    const { gigId, message, price } = req.body;

    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found'
      });
    }

    if (gig.status !== 'open') {
      return res.status(400).json({
        success: false,
        message: 'This gig is no longer accepting bids'
      });
    }

    if (gig.ownerId.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot bid on your own gig'
      });
    }

    const existingBid = await Bid.findOne({
      gigId,
      freelancerId: req.user._id
    });

    if (existingBid) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a bid for this gig'
      });
    }

    const bid = await Bid.create({
      gigId,
      freelancerId: req.user._id,
      message,
      price
    });

    const populatedBid = await Bid.findById(bid._id)
      .populate('freelancerId', 'name email')
      .populate('gigId', 'title');

    const io = req.app.get('io');
    if (io) {
      io.to(`user_${gig.ownerId}`).emit('newBid', {
        bid: populatedBid,
        message: `New bid on "${gig.title}"`
      });
    }

    res.status(201).json({
      success: true,
      bid: populatedBid
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a bid for this gig'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getBidsForGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.gigId);

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found'
      });
    }

    if (gig.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the gig owner can view bids'
      });
    }

    const bids = await Bid.find({ gigId: req.params.gigId })
      .populate('freelancerId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bids.length,
      bids
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const hireBid = async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.bidId);
    
    if (!bid) {
      return res.status(404).json({
        success: false,
        message: 'Bid not found'
      });
    }

    const gig = await Gig.findById(bid.gigId);
    
    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found'
      });
    }

    if (gig.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the gig owner can hire freelancers'
      });
    }

    if (bid.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'This bid is no longer pending'
      });
    }

    const gigUpdate = await Gig.findOneAndUpdate(
      { 
        _id: gig._id, 
        status: 'open'
      },
      { 
        status: 'assigned',
        hiredFreelancerId: bid.freelancerId
      },
      { 
        new: true 
      }
    );

    if (!gigUpdate) {
      return res.status(400).json({
        success: false,
        message: 'This gig has already been assigned to another freelancer. Please refresh the page.'
      });
    }

    await Bid.findByIdAndUpdate(bid._id, { status: 'hired' });

    await Bid.updateMany(
      { 
        gigId: gig._id, 
        _id: { $ne: bid._id } 
      },
      { status: 'rejected' }
    );

    const updatedBid = await Bid.findById(bid._id)
      .populate('freelancerId', 'name email')
      .populate('gigId', 'title');

    const updatedGig = await Gig.findById(gig._id)
      .populate('ownerId', 'name email')
      .populate('hiredFreelancerId', 'name email');

    const io = req.app.get('io');
    if (io) {
      io.to(`user_${bid.freelancerId}`).emit('hired', {
        gig: updatedGig,
        message: `Congratulations! You have been hired for "${gig.title}"!`
      });

      const rejectedBids = await Bid.find({ 
        gigId: gig._id, 
        _id: { $ne: bid._id } 
      });
      
      rejectedBids.forEach(rejectedBid => {
        io.to(`user_${rejectedBid.freelancerId}`).emit('bidRejected', {
          gigId: gig._id,
          gigTitle: gig.title,
          message: `Your bid for "${gig.title}" was not selected`
        });
      });

      io.emit('gigUpdated', updatedGig);
    }

    res.status(200).json({
      success: true,
      message: 'Freelancer hired successfully',
      bid: updatedBid,
      gig: updatedGig
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getMyBids = async (req, res) => {
  try {
    const bids = await Bid.find({ freelancerId: req.user._id })
      .populate('gigId', 'title description budget status ownerId')
      .populate({
        path: 'gigId',
        populate: {
          path: 'ownerId',
          select: 'name email'
        }
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bids.length,
      bids
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

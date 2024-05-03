import { BUS } from "../model/busModel.js";
import { ROUTE } from "../model/routeModel.js";
import { STATION } from "../model/stationModel.js";
import cloudinary from "cloudinary";
import { cache } from "../Cache/cache.js";
import { FEEDBACK } from "../model/feedbackModel.js";
import { uploadOnCloudinary } from "../cloudStorage.js";

export const register = async function (req, res) {
  try {
    const { busNumber, busNumberPlate, name, contactInfo, password } = req.body;

    if (
      [busNumber, busNumberPlate, name, contactInfo, password].some(
        (ele) => ele === ""
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required field",
      });
    }

    const existedDriver = await BUS.findOne({
      $and: [{ busNumberPlate }, { contactInfo }],
    });

    if (existedDriver) {
      return res.status(400).json({
        success: false,
        message: "Driver Already Exixts",
      });
    }

    const imageUrl = await uploadOnCloudinary(req.files.image1[0].path);

    console.log(imageUrl)

    if (!imageUrl) {
      res.status(400).json({
        success: false,
        message: "cannot get file path in register",
      });
    }

    let photos = {
      public_id: imageUrl.public_id,
      secure_url: imageUrl.url,
    };

    let createdBus = await BUS.create({
      busNumber,
      busNumberPlate,
      driver: { name, contactInfo, password },
      photo: photos,
    });

    console.log(createdBus)

    const showUser = await BUS.findById(createdBus._id).select("-password");

    if (!showUser)
      return res.status(400).json({
        success: false,
        message: "error in registering user",
      });

    return res.status(200).json({
      success: true,
      message: "user registered successfully",
      showUser,
    });
  } catch (error) {
    console.log(error.message);
  }
};

export const login = async function (req, res) {
  //grabbing entered details from body

  const { busNumber, password } = req.body;

  try {
    //checking if busDriver with given busNumber exists or not

    const bus = await BUS.findOne({ busNumber: busNumber });

    console.log(bus);
    //checking simulataneously if both busDriver exists and given password is correct
    if (bus && (await bus.validatePassword(password))) {
      res.status(200).json({
        login: true,
        message: "Login Successful",
        bus,
      });
    } else {
      res.status(200).json({
        login: false,
        message: "Registration is required",
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

export const activeBus = async function (req, res) {
  const allActiveBuses = await BUS.find({ busStatus: "active" }).populate({
    path: "route",
    populate: {
      path: "stations",
      select: "stationName position -_id",
    },
  });
  //console.log(allActiveBuses);
  if (allActiveBuses.length === 0)
    res.status(400).send("No Active Buses for now");
  else {
    console.log(typeof allActiveBuses);

    const buses = allActiveBuses.map((bus) => {
      if (cache.get(bus._id.toString())) {
        bus._doc.progress = cache.get(bus._id.toString());
        return bus;
      }
      return bus;
    });

    res.status(200).json({
      success: true,
      buses: buses,
    });
  }
};

export const updateBusDetails = async function (req, res) {
  //getting id of that particular bus

  const { id } = req.params;

  //finding the bus with the id
  const bus = await BUS.findById(id);

  console.log(bus);

  if (!bus) {
    res.status(400).send("No bus found with such details");
  } else {
    console.log(req.body);
    //give data to update with
    const updatedBusDetails = await BUS.findByIdAndUpdate(
      id,
      { $set: { ...req.body } },
      {
        new: true,
      }
    );

    // console.log(updatedBusDetails)

    res.status(200).json({
      update: "successful",
      updatedBusDetails,
    });
  }
};

export const activeBusDetails = async function (req, res) {
  const { id } = req.params;

  //getting bus with the id
  const bus = await BUS.findById(id).populate({
    path: "route",
    select: "routeName -_id",
    populate: {
      path: "stations",
      select: "stationName position -_id",
    },
  });

  bus._doc.progress = cache.get(bus._id.toString());
  res.status(200).json({
    bus,
  });
};

export const busRoutes = async function (req, res) {
  const allRoutes = await SCHEMA.find().populate("stations");

  res.status(200).json({
    success: true,
    routes: allRoutes,
  });
};

export const getFeedBack = async function (req, res) {
  const { busNumber, ratings, comments } = req.body;
  if (ratings === "" && comments === "") {
    res.status(200).json({
      feedback: false,
    });
  } else {
    const specificBus = await BUS.findById(busNumber);

    const feed = await FEEDBACK.create({
      busNumber: specificBus.busNumber,
      ratings,
      comments,
    });

    console.log("bus is", specificBus);

    const findAllBus = await FEEDBACK.find({
      busNumber: specificBus.busNumber,
    });
    console.log("total feeds", findAllBus.length);
    if (findAllBus) {
      const avgRatingCalculated = findAllBus.reduce(
        (initial, value) => initial + Number(value.ratings),
        0
      );

      specificBus.avgRating = avgRatingCalculated / findAllBus.length;

      console.log("avg", avgRatingCalculated);

      specificBus.save({ validateBeforeSave: false });
    }

    res.status(200).json({
      success: true,
      feed,
    });
  }
};

export const allFeedBack = async function (req, res) {
  const allFeeds = await FEEDBACK.find();

  if (allFeeds.length === 0) {
    res.status(200).json({
      message: "No feedbacks for now",
    });
  } else {
    res.status(200).json({
      success: true,
      allFeeds,
    });
  }
};

export const searchFeedBack = async function (req, res) {
  //grabbing bus number from body
  const { busNumber } = req.body;

  const busFeed = await FEEDBACK.find({ busNumber });

  let rating = busFeed.reduce(
    (initial, item) => initial + Number(item.ratings),
    0
  );

  console.log(busFeed);

  res.status(200).json({
    success: true,
    avgRating: rating / busFeed.length,
  });
};

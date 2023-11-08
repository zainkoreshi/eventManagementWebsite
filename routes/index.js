var express = require('express');
var router = express.Router();

const { connectToDB, ObjectId } = require('../utils/db');
module.exports = router;

// become volunteer
router.post('/becomeVolunteer', async function (req, res) {
  const db = await connectToDB();
  try {
    let result = await db.collection('volunteers').insertOne(req.body)
    res
    .status(201)
    .json({ id: result.insertedId, action: 'Created!' })
  } catch (err) {
    res.status(400).json({ message: err.message });
  } finally {
    await db.client.close();
  }
});

router.get('/becomeVolunteer', async function (req, res) {
  const db = await connectToDB();
  try {
    let results = await db.collection("volunteers").find().toArray();
    res.render('becomeVolunteer', { volunteers: results });
  } catch (err) {
    res.status(400).json({ message: err.message });
  } finally {
    await db.client.close();
  }
});

// events
router.get('/events', async function (req, res, next) {
  const db = await connectToDB();
  try {
    const numberOfEvents = 6;
    const currentPage = parseInt(req.query.page) || 1;

    const totalEvents = await db.collection("events").countDocuments();

    const totalPages = Math.ceil(totalEvents / numberOfEvents);

    const skip = (currentPage - 1) * numberOfEvents;
    const events = await db
      .collection("events")
      .find()
      .skip(skip)
      .limit(numberOfEvents)
      .toArray();

    res.render('events', {
      title: 'Events',
      events,
      totalPages,
      currentPage
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  } finally {
    await db.client.close();
  }
});

// events detail
router.get('/eventsDetail/:id', async function (req, res) {
  const db = await connectToDB();
  try {
    const event = await db.collection('events').findOne({ _id: new ObjectId(req.params.id) });
    if (!event) {
      res.status(404).json({ message: 'Not found!' });
      return;
    }
    res.render('eventsDetail', { event });
  } catch (err) {
    res.status(400).json({ message: err.message });
  } finally {
    await db.client.close();
  }
});

// events edit
router.post('/editEvent/:id', async function (req, res) {
  const db = await connectToDB();
  try {
    const action = req.body.action;

    if (action === 'save') {
      const { eventTitle, organizer, dateTime, location, description, quota, eventImage, gridCheck1 } = req.body;
      const modifiedEvent = { eventTitle, organizer, dateTime, location, description, quota: parseInt(quota), eventImage, gridCheck1: termsOn === "on", modifiedAt: new Date() };
      let result = await db.collection("events").updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: modifiedEvent }
      );

      if (result.modifiedCount > 0) {
        res.status(200).json({ message: "Updated!" });
      } else {
        res.status(404).json({ message: "Not found!" });
      }
    } else if (action === 'delete') {
      let result = await db.collection("events").deleteOne({ _id: new ObjectId(req.params.id) });
      if (result.deletedCount > 0) {
        res.status(200).json({ message: "Deleted!" });
      } else {
        res.status(404).json({ message: "Not found!" });
      }
    } else {
      res.status(400).json({ message: "Invalid action!" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  } finally {
    await db.client.close();
  }
});

router.get('/eventsEdit/:id', async function (req, res) {
  const db = await connectToDB();
  try {
    let result = await db.collection("events").findOne({ _id: new ObjectId(req.params.id) });
    if (result) {
      res.render('eventsEdit', { event: result });
    } else {
      res.status(404).json({ message: "Not found!" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  } finally {
    await db.client.close();
  }
});

// events new
router.post('/eventsNew', async function (req, res) {
  const db = await connectToDB();
  try {
    req.body.createdAt = new Date();
    req.body.modifiedAt = new Date();
    let result = await db.collection('events').insertOne(req.body)
    res
      .status(201)
      .json({ id: result.insertedId, action: 'Created!' })
  } catch (err) {
    res.status(400).json({ message: err.message });
  } finally {
    await db.client.close();
  }
});


router.get('/eventsNew', async function (req, res) {
  const db = await connectToDB();
  try {
    let results = await db.collection("events").find().toArray();
    res.render('eventsNew', { events: results });
  } catch (err) {
    res.status(400).json({ message: err.message });
  } finally {
    await db.client.close();
  }
});

// index
router.get('/', async function(req, res, next) {
  const db = await connectToDB();
  try {
    let result = await db.collection("events").find().toArray();

    res.render('index', { events: result });
  } catch (err) {
    res.status(400).json({ message: err.message });
  } finally {
    await db.client.close();
  }
});
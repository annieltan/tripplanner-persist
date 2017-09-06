const app = require('express').Router();
const db = require('../db');
const { Day, Hotel, Restaurant, Activity, Place } = db.models;

app.get('/', (req, res, next)=> {
  Day.findAll({
    order: [ 'id' ],
    include: [
      { model: Hotel, include: [ Place ] },
      { model: Restaurant, include: [ Place ] },
      { model: Activity, include: [ Place ] }
    ]
  })
  .then( days => {
    res.send(days);
  })
  .catch(next);
});

app.post('/', (req, res, next)=> {
  Day.create({})
    .then( day => {
      res.send(day);
    });
});

app.delete('/:id', (req, res, next)=> {
  var dayId = req.params.id;
  return Day.destroy({
    where: {
      id: dayId
    }
  })
  .then((results)=>{
    res.sendStatus(200);
  })
  .catch(next);
  //TODO - implement

});

//TO DO - total of six routes, add and remove hotels, restaurants, activities for a day

// Day.belongsToMany(Hotel, { through: 'days_hotels'});
// Day.belongsToMany(Restaurant, { through: 'days_restaurants'});
// Day.belongsToMany(Activity, { through: 'days_activities'});


app.post('/:dayId/restaurants/:id', (req, res, next)=> {
  var dayId = req.params.dayId;
  var restaurantId = req.params.id;
  console.log('dayId in post', dayId)

  Day.findOne({
    where: {
      id: dayId
    }
  })
  .then((day)=>{
    console.log('found day', day)
    Restaurant.findOne({
      where:{
        id: restaurantId
      }
    })
    .then((restaurant)=>{
      console.log('found restaurant', restaurant)
      return day.addRestaurant(restaurant)
    })
  })
  .catch(next);

});

app.delete('/:dayId/restaurants/:id', (req, res, next)=> {
  var dayId = req.params.dayId;
  var restaurantId = req.params.id;
  console.log('dayId in delete', dayId)

  Day.findOne({
    where: {
      id: dayId
    }
  })
  .then((day)=>{
    console.log('found day', day)
    Restaurant.findOne({
      where:{
        id: restaurantId
      }
    })
    .then((restaurant)=>{
      console.log('found restaurant', restaurant)
      return day.removeRestaurant(restaurant)
    })
  })
  .catch(next);
});

app.post('/:dayId/hotels/:id', (req, res, next)=> {
  var dayId = req.params.dayId;
  var hotelId = req.params.id;
  console.log('dayId in post', dayId)

  Day.findOne({
    where: {
      id: dayId
    }
  })
  .then((day)=>{
    console.log('found day', day)
    Hotel.findOne({
      where:{
        id: hotelId
      }
    })
    .then((hotel)=>{
      console.log('found hotel', hotel)
      return day.addHotel(hotel)
    })
  })
  .catch(next);
});

app.delete('/:dayId/hotels/:id', (req, res, next)=> {
  var dayId = req.params.dayId;
  var hotelId = req.params.id;
  console.log('dayId in delete', dayId)

  Day.findOne({
    where: {
      id: dayId
    }
  })
  .then((day)=>{
    console.log('found day', day)
    Hotel.findOne({
      where:{
        id: hotelId
      }
    })
    .then((hotel)=>{
      console.log('found hotel', hotel)
      return day.removeHotel(hotel)
    })
  })
  .catch(next);
});

app.post('/:dayId/activities/:id', (req, res, next)=> {
  var dayId = req.params.dayId;
  var activityId = req.params.id;
  console.log('dayId in post', dayId)

  Day.findOne({
    where: {
      id: dayId
    }
  })
  .then((day)=>{
    console.log('found day', day)
    Activity.findOne({
      where:{
        id: activityId
      }
    })
    .then((activity)=>{
      console.log('found activity', activity)
      return day.addActivity(activity)
    })
  })
  .catch(next);
});

app.delete('/:dayId/activities/:id', (req, res, next)=> {
  var dayId = req.params.dayId;
  var activityId = req.params.id;
  console.log('dayId in delete', dayId)

  Day.findOne({
    where: {
      id: dayId
    }
  })
  .then((day)=>{
    console.log('found day', day)
    Activity.findOne({
      where:{
        id: activityId
      }
    })
    .then((activity)=>{
      console.log('found activity', activity)
      return day.removeActivity(activity)
    })
  })
  .catch(next);
});

module.exports = app;

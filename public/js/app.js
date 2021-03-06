/* globals options, DayPicker, Day, Options $ */

$(function(){
  $.get('/days')
    .then(function(days){
      var map = new Map('map');
      var idx = 0;

      console.log(options)

      //function which renders options
      function renderOptions(){
        Options({
          id: '#options',
          day: days[idx],
          options: options,
          addItem: function(obj){
            //only one hotel please.
            if(obj.key === 'hotels' && days[idx].hotels.length === 1){
              return;
            }
            var item = options[obj.key].find(function(item){
              return item.id === obj.id;
            });

            //TODO - ajax call to add on server
            $.post(`/days/${idx+1}/${obj.key}/${item.id}`)
              .then(function(status){
                console.log(status, 'status!!')
              })

            days[idx][obj.key].push(item);
            renderDayAndOptions();
          }
        });
      }

      //function which renders our day  picker
      function renderDayPicker(){
        var addDay = function(){
          console.log('addDay', idx)
          $.post('/days')
            .then(function(day){
              console.log('ADDED DAY', day)
                days.push({
                  id: day.id,
                  hotels: [],
                  restaurants: [],
                  activities: [],
                });
                idx = days.length - 1;
                renderDayPicker();
            });
        }

        var removeDay = function(){
          if(days.length === 1){
            return;
          }
          //TODO - remove the day on server
          $.ajax({
            url: `/days/${idx+1}`,
            type: "DELETE"
          })
            .then(function(status){
                idx = days.length - 1;
                renderDayPicker();
            });

          days = days.filter(function(day, _idx){
            return _idx !== idx;
          });
          idx = 0;
          renderDayPicker();
        }

        var selectDay = function(_idx){
          idx = _idx;
          renderDayPicker();
        }

        DayPicker({
          id: '#dayPicker',
          days: days,
          idx: idx,
          addDay,
          removeDay,
          selectDay
        });
        renderDayAndOptions();
      }

      function renderDayAndOptions(){
        map.setMarkers(days[idx]);
        renderDay();
        renderOptions();
      }

      //this function render day
      function renderDay(){
        var onRemoveItem = function(obj){
          days[idx][obj.key] = days[idx][obj.key].filter(function(item){
            return item.id !== obj.id;
          });
          //TODO - update on server
          console.log(`deleting ${obj.key}`)
          $.ajax({
            url: `/days/${idx+1}/${obj.key}/${obj.id}`,
            type: "DELETE"
          })
          .then(function(){
              renderDayPicker();
          });
          renderDayAndOptions();
        }

        Day({
          id: '#day',
          day: days[idx],
          options,
          onRemoveItem
        });
      }

      renderDayPicker();

    })


});

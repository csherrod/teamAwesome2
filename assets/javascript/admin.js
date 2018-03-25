
  // Initialize Firebase-------------------------------------
    // Initialize Firebase
    var config = {
      apiKey: "AIzaSyDWOWK7hx8BkWEszH5XOUg-EIQZMJMBGg4",
      authDomain: "saturdaycv.firebaseapp.com",
      databaseURL: "https://saturdaycv.firebaseio.com",
      projectId: "saturdaycv",
      storageBucket: "saturdaycv.appspot.com",
      messagingSenderId: "309678738229"
    };
    firebase.initializeApp(config);
  //----------------------------------------------------------
  var database = firebase.database();

  // event-listener:  get user form data
  //$('#addItem').on('click', function(){

    // Prevent the page from reloading
    //event.preventDefault();

    
   

  // listen for database post - when it occurs take snapshot of new data posted and add data to html db.ref().on("child_added", function (snapshot) {        		
  database.ref().on("child_added", function(childSnapshot){

    // be certain there is a child(new item) with data
    if (childSnapshot.val()) {

      // call child data = data......this is new item data from database
      var data = childSnapshot.val();

      // generate parts of new item data ....new table row
      var newTrItem = $('<tr>');
      var newTdName = $('<td>').text(data.SIitemRest);
      var newTdDesc = $('<td>').text(data.SIitemDesc);

      var newTdItem = $('<td>').text(data.SIitemType);
      

      // add table cells(<td> tags) to table row (<tr> tab)
      newTrItem.append(newTdName, newTdDesc, newTdItem);
    
      // now Write html to page appending it to tbody tag
      $('tbody').append(newTrItem);

    }

  });
// Initialize Firebase
var config = {
    apiKey: "AIzaSyD2rN2LZRtckwCpZlyOoY9gbNPkc0wjzFo",
    authDomain: "teamawesom2.firebaseapp.com",
    databaseURL: "https://teamawesom2.firebaseio.com",
    projectId: "teamawesom2",
    storageBucket: "",
    messagingSenderId: "265488828881"
  };
  firebase.initializeApp(config);

var txtEmail = document.getElementById('txtEmail');
var txtPassword = document.getElementById('txtPassword');
var btnLogin = document.getElementById('btnLogin');
var btnSignUp = document.getElementById('btnSignUp');
var btnLogOut = document.getElementById('btnLogOut');
//add button get password

var uid; //get uid to create new node off root (1st level)
var name; //get user's name

//Add login event
btnLogin.addEventListener('click', e => {
    e.preventDefault();
    //Get email and password
    var email = txtEmail.value;
    var pass = txtPassword.value;
    var auth = firebase.auth();

    //Sign in
    var promise = auth.signInWithEmailAndPassword(email, pass);
    promise.catch(e => console.log(e.message)); //need to fix this so below code won't run if the promise.catch returns error message

    //promise.then waits for sign in to happen before getting the uid
    promise.then(function () {
        uid = auth.currentUser.uid;
        name = auth.currentUser.displayName;
        $("#hiUser").text("Hi " + name);

        //func below gets passed the uid and creates tabs
        console.log("populating tabs from login");
        populateTabs(uid);
    });
});

//makes the tabs; is called when user registers, logsin, or a tab is added
function populateTabs(uid) {
    $(".tabs").empty();
    database.ref(uid).on("value", function (snapShot) {
        var tabInfo = database.ref(uid).key;//uid
        var chillins = snapShot.val();//children of current uid

        if (uid !== undefined) {
            var t1 = chillins.tab1;//values of tab1
            var t2 = chillins.tab2;
            var t3 = chillins.tab3;
            var tabInfo = database.ref(uid).key;
            if (typeof t1 !== "boolean") {
                var newTab = $("<li>").addClass("tab col s3");
                var newA = $("<a id=tab1>").text(t1.tabName);
                newTab.append(newA);
                $(".tabs").append(newTab);
            }
            if (typeof t2 !== "boolean") {
                var newTab = $("<li>").addClass("tab col s3");
                var newA = $("<a id=tab2>").text(t2.tabName);
                newTab.append(newA);
                $(".tabs").append(newTab);
            }
            if (typeof t3 !== "boolean") {
                var newTab = $("<li>").addClass("tab col s3");
                var newA = $("<a id=tab3>").text(t3.tabName);
                newTab.append(newA);
                $(".tabs").append(newTab);
            }
        }
    })
};

//Add SignUp event
btnSignUp.addEventListener('click', e => {
    //Get email and pass
    //ToDo: Check 4 REAL email
    e.preventDefault();
    var email = txtEmail.value;
    var pass = txtPassword.value;
    var name = capUpper(txtName.value);//get name from form
    //   console.log(name);
    var auth = firebase.auth();
    //Sign in
    var promise = auth.createUserWithEmailAndPassword(email, pass)
    promise.catch(e => console.log(e.message));
    //to do: if error message above, stop code below!!!!
    promise.then(function () {
        var user = firebase.auth().currentUser;
        if (user != null) {
            uid = user.uid;

            database.ref(uid).set({
                name: name, //only here for reference in console
                tab1: false,
                tab2: false,
                tab3: false
            });

            user.updateProfile({
                displayName: name
            }).then(function () {
                $("#hiUser").text("Hi " + name);
            }, function (error) {
                console.log("error");
            })
        };
    });
    $("#loginForm")[0].reset();
});

$("#btnSignOut").on("click", function (event) {
    firebase.auth().signOut().then(function () {
        console.log("Sign out successful");
        $("#hiUser").empty();
        uid = undefined;
        name = undefined;
        window.location.reload();
    }).catch(function (error) {
        console.log("Error in signing out");
    });
    $("#loginForm")[0].reset();
});

//A realtime listener for change in log in/out
firebase.auth().onAuthStateChanged(function (user) {
    if (user != null) {
        uid = user.uid;
        name = user.displayName;
        $("#hiUser").text("Hi " + name);
    }
    else { console.log('not logged in'); }
});

var database = firebase.database();

$("#addTab").on("click", function (event) {
    //to do:when add tab, add delete button to modal
    //to do:if delete btn clicked, delete fb info
    uid = firebase.auth().currentUser.uid;
    var tabName = $("#tabName").val().trim();
    var tabStreet = $("#tabStreet").val().trim();
    var tabCity = $("#tabCity").val().trim();
    var tabZip = $("#tabZip").val().trim();

    //make sure all info is included
    if (tabStreet != "" && tabStreet != "" && tabCity != "" && tabZip != "") {

        // if all info is included, cycle through all tabs
        label: for (var i = 1; i < 4; i++) {
            var tabInfo = database.ref(uid).child("tab" + i).key;
            var tabValue;
            var popTab = false;
            database.ref(uid).child("tab" + i).once("value", function (snap) {
                tabValue = snap.val();
            });

            //if there's an empty (false) tab, push the data and break the label loop above
            if (tabValue === false) {
                database.ref(uid).child(tabInfo).update({
                    tabName: capUpper(tabName),
                    tabStreet: capUpper(tabStreet),
                    tabCity: capUpper(tabCity),
                    tabZip: tabZip,
                });

                popTab = true; //set flag to true so no error msg
                break label;
            }
        }

        //if no tabs populated, max is reached, alert user
        if (popTab === false) {
            console.log("You've reached the max number of tabs. Delete one first before adding another.");
        }
    }

    //if missing tabName, address, city, or zip ->give error message
    else {
        console.log("error message - need more info");
    };

    //reset the form
    $("#mapTabs")[0].reset();
});

//populates tabs from firebase info
database.ref(uid).on("value", function (snapShot) {
    $(".tabs").empty();
    console.log("populating tabs from listener")
    var tabInfo = database.ref(uid).key;//uid
    var chillins = snapShot.child(uid).val();//children of uid
    // console.log(t1, t2, t3); //keep this

    if (uid !== undefined) {
        var t1 = chillins.tab1;//values of tab1
        var t2 = chillins.tab2;
        var t3 = chillins.tab3;
        var tabInfo = database.ref(uid).key;
        if (typeof t1 !== "boolean") {
            var newTab = $("<li>").addClass("tab col s3");
            var newA = $("<a id=tab1>").text(t1.tabName);
            newTab.append(newA);
            $(".tabs").append(newTab);
        }
        if (typeof t2 !== "boolean") {
            var newTab = $("<li>").addClass("tab col s3");
            var newA = $("<a id=tab2>").text(t2.tabName);
            newTab.append(newA);
            $(".tabs").append(newTab);
        }
        if (typeof t3 !== "boolean") {
            var newTab = $("<li>").addClass("tab col s3");
            var newA = $("<a id=tab3>").text(t3.tabName);
            newTab.append(newA);
            $(".tabs").append(newTab);
        }
    }
});
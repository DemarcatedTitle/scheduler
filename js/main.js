//Map time range to individual employees hours and required amt
//of workers
//
//
//side of screen will be a display panel with relevant information
//and different views
//views will be based off of what is highlighted/clicked. 
//Nothing selected = overview of things
//click a day = display all that specific day's information, maybe have the option for last week's *day
//click a section from a day and you can go into the specifics for that. 
//
//
//
//clicking a day presents an interface to examine and edit the data
//drop down menu's for time, buttons to add a new slot
//so "From x:xx to y:yy" add new timeslot
//day's schedule changes on the canvas representation as stuff is added
//text represenation/listing of the schedule
//calendar representation
//
//
//
//
//a person's scheduled hours will be a moment.range or series of moment ranges
//the required hours will be a moment.range with a requirement number, for how many people are needed
//from 5 to 10, requirement = 1 
//from 10 to 4 requirement = 3, 
//from 4 to 7 requirement = 4 
//from 7 to 10 requirement = 3, 
//from 10 to 12 requirement = 2
//
//john from 5 to 9
//eric from 9 to 5
//michael from 10 to 4
//anna from 4 to 10
//gerry from 5 to 12
//dan from 4 to 12
//
//5 - 10 = 1
//10 - 4 = 2 short 1
//4 - 5 = 2 short 1
//5-10 = 3 short 1 until 7
//10-12 = 2
//
//
// 1 day = multiple ranges
//for each range, iterate through the employee ranges, 
//  **maybe if the employee range is entirely contained within it, 
//  **remove it from what's iteratable 
//
//for each intersection add to the current employees assigned
//and create a range for the non intersecting part, and with that look
//for more intersecting ranges to verify if that spot is covered or not
//
//
//
//
//
//
// var moment = require('moment');
// require('moment-range');
//
//
//
// My additions to moment-range///////
var formatPref = 'HH:mm';
DateRange.prototype.displayRange = function (rangeObj){
    return this.start.format(formatPref) + ' to ' + this.end.format(formatPref);

};
/////////////////////////////////////



var line;
var timeDisplay;
var minutePixelExchange;
var currentMinutes;
var displayHours;
var displayMin;
var canvas;
var stage;

var what;

var curDay = new Map();
var employees = new Map();
var blocks = new Map();

var morning = {};
var tuesday = {};

var daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var week = [];
// define a new TextLink class that extends / subclasses Text, and handles drawing a hit area
// and implementing a hover color.
function TextLink(text, font, color, hoverColor) {
        // this super class constructor reference is automatically created by createjs.extends:
        this.Text_constructor(text, font, color);
        this.hoverColor = hoverColor;
        this.hover = false;
        this.hitArea = new createjs.Shape();
        this.textBaseline = "top";

        this.addEventListener("rollover", this);
        this.addEventListener("rollout", this);
}
createjs.extend(TextLink, createjs.Text);

function timeSlot(color, mouseColor, coords, size) {
    this.size = size;
    this.color = color;
    this.mouseColor = mouseColor;
    this.coords = coords;
    this.addEventListener("mouseOver", this);
    this.addEventListener("mouseOver", this);
}

//createjs.extend(timeSlot, createjs.graphics);

var rectColorChange = function(evt, data) {
    evt.target.graphics.beginFill(data.color).drawRect(0, 0, 100, 600);
    stage.update();
};

//should maybe boil down the stage update/removechild stuff to something more dry
//if it becomes something that I rely on a lot like maybe when I start doing
//the pop up display/edit thing


//Mapping time to pixels stuff
//06:45 = 6*60 + 45
//405 (minutes)
//405 * (1440/600)
//405 * 2.4
//




//Mouse location stuff
var timeHighlight = new moment();
var displayY = function(evt){
    stage.removeChild(line);
    stage.removeChild(timeDisplay);
    //maps minutes in a day to pixels on the canvas that
    //i'm willing to use, then converts to a readable time. 
    minutePixelExchange = 600/1440;
    currentMinutes = parseInt(evt.stageY / minutePixelExchange);
    displayHours = parseInt(currentMinutes / 60);
    displayMin = currentMinutes % 60;
    
    line = new createjs.Shape();
    line.graphics.beginFill('black').drawRect(0,0,1000,1);
    line.x = 100;
    line.y = evt.stageY;
    

    timeHighlight.hours(displayHours);
    timeHighlight.minutes(displayMin);
    
    timeDisplay = new createjs.Text(timeHighlight.format("HH:mm"), '10px, Arial', 'black');

    timeDisplay.x = 0;
    timeDisplay.y = evt.stageY;

    stage.addChild(timeDisplay);
    stage.addChild(line);

    stage.update();
};
//end of mouse location stuff
        
//createjs container is probably the best option for a day.  

// week{ day : obj representing the blocks? 


function graphWeek () {
    what = new createjs.Shape();
    what.x = 100;
    what.y = 100;
    what.graphics.beginFill('grey').drawRect(0,0,100,800);
    what.on("mouseover", function(evt, data){console.log('whatover (grey rect was moused over)');});
    // what.on('mouseover', console.log(what));
    stage.addChild(what);

    for(i = 0; i < 8; i++) {
        // if(i%2===0){
        
            week[i] = new createjs.Shape();
            // week[i].graphics.beginFill("DeepSkyBlue").drawRect(0, 0, 100, 600);
            week[i].x = i*100 + 100;
            // week[i].y = 100;
            stage.addChild(week[i]);


            


        // }        
    }
    week.forEach(function(element, index, array){
        element.graphics.beginFill("blue").drawRect(0,0,100,600);
    
            element.on("mouseover", rectColorChange, null, false, {'color': 'orange'});  
            element.on("mouseout", rectColorChange, null, false, {'color': 'blue'});  
    });

    
    stage.update();
}


// use the same approach with draw:
TextLink.prototype.draw = function (ctx, ignoreCache) {
        // save default color, and overwrite it with the hover color if appropriate:
        var color = this.color;
        if (this.hover) {
                this.color = this.hoverColor;
        }

        // call Text's drawing method to do the real work of drawing to the canvas:
        // this super class method reference is automatically created by createjs.extends for methods overridden in the subclass:
        this.Text_draw(ctx, ignoreCache);

        // restore the default color value:
        this.color = color;

        // update hit area so the full text area is clickable, not just the characters:
        this.hitArea.graphics.clear().beginFill("#FFF").drawRect(0, 0, this.getMeasuredWidth(), this.getMeasuredHeight());
};

// set up the handlers for mouseover / out:
TextLink.prototype.handleEvent = function (evt) {
        this.hover = (evt.type == "rollover");
};

// set up the inheritance relationship: TextLink extends Text.
createjs.promote(TextLink, "Text");



function init() {


tuesday = {};
tuesday.john = moment.range(moment("5:00", "HH:mm"), moment("10:00", "HH:mm"));
tuesday.eric = moment.range(moment("9:00", "HH:mm"), moment("17:00", "HH:mm"));
tuesday.michael = moment.range(moment("10:00", "HH:mm"), moment("16:00", "HH:mm"));
tuesday.anna = moment.range(moment("16:00", "HH:mm"), moment("22:00", "HH:mm"));
tuesday.gerry = moment.range(moment("17:00", "HH:mm"), moment("24:00", "HH:mm"));
tuesday.dan = moment.range(moment("16:00", "HH:mm"), moment("24:00", "HH:mm"));
//for block1, eric intersects john at 9-10
//then eric intersects michael at 10-11
//so from 5-9 avail = 1
//from 9-10 avail = 2
//10-11 avail = 2
//

employees.set('john', tuesday.john);
employees.set('eric', tuesday.eric);
employees.set('michael', tuesday.michael);
employees.set('anna', tuesday.anna);
employees.set('gerry', tuesday.gerry);
employees.set('dan', tuesday.dan);


tuesday.block1 = moment.range(moment("05:00", "HH:mm"), moment("11:00", "HH:mm"));
tuesday.block2 = moment.range(moment("10:00", "HH:mm"), moment("16:00", "HH:mm"));
tuesday.block3 = moment.range(moment("16:00", "HH:mm"), moment("19:00", "HH:mm"));
tuesday.block4 = moment.range(moment("19:00", "HH:mm"), moment("22:00", "HH:mm"));
tuesday.block5 = moment.range(moment("22:00", "HH:mm"), moment("24:00", "HH:mm"));

blocks.set('block1', tuesday.block1);
blocks.set('block2', tuesday.block2);
blocks.set('block3', tuesday.block3);
blocks.set('block4', tuesday.block4);
blocks.set('block5', tuesday.block5);
//
//iterates through each map, revolving around the block map
//
//
//curDay = map of blocks
//
//curDay.get(block) = map of the employees' intersections
//
//curday.get(block).get(empKey) = the moment ranges of those intersections
//
blocks.forEach(function(block, blockKey, map){
    console.log(blockKey + ' starts at ' + block.start.format('HH:mm'));
    curDay.set(blockKey,new Map());
    //Keep in mind that curDay.get(block) gets iterated through
    //so I can't put anything that's not compatible with that iteration
    //before the for each



    var step = [];
    employees.forEach(function(employee, empKey, map){
        
        //this finds the intersections of the employees inside a block
        //
        var intersection = block.intersect(employee);
        if(intersection){
            curDay.get(blockKey).set(empKey, intersection);
            //intersection = intersection of employee range and block range
            //iterate through this map
            //
        }
    });
            curDay.get(blockKey).forEach(function(empValue, empId, map){
                //goes through a map of each block and displays who works during that block
                curDay.get(blockKey).forEach(function(value, key, map) {
                    //something that creates a map/obj/arr and removes dupes==
                    var intersection = empValue.intersect(value);
                    //intersection = intersection of employee range and other employee range in the block
                    if(key != empId && intersection){
                        console.log(key + ' intersects ' + empId + ' at ' + intersection.start.format('HH:mm') + ' to ' + intersection.end.format('HH:mm'));
                    }
                });
                //I need something that starts at the blocks start time
                //goes to the first intersection of the block.start and marks 
                //whether it is unoccupied or someone is working at that time
                //if unoccupied, create a range for that period of time
                //if occupied, keep going to the next intersection 
                //where the # of people working changes + or - 
                //repeat until reach the block.end
                //
                //block = 5 - 11
                //bob = 6 - 9 
                //intersection = 6 - 9 
                //non intersecting = 5 - 6 and 9 - 11
                //jim = 9 - 11
                //intersecting = 9 - 11
                //gaps = blockX - employee
                //
                 
            });
            console.log(blockKey + ' ends at ' + block.end.format('HH:mm'));
            console.log('\n');

});

curDay.get('block1').forEach(function(employee, name, map){
    console.log(name + ' works at ' + employee.displayRange() + ' during block1' );

});

//Algorithm will be divide and conquer
//so once you have the intersecting ranges figured out, 
//iterate by the minute and check whether or not there are 
//coinciding moments. 
//

curDay.get('block1');
block1Array = [];
empArrays = [];
ericArray = [];
michaelArray = [];

tuesday.eric.by('minutes', function(moment){

    ericArray.push(moment.format('HH:mm'));
});

tuesday.michael.by('minutes', function(moment){

    michaelArray.push(moment.format('HH:mm'));
});

tuesday.block1.by('minutes', function(moment){
    block1Array.push(moment.format('HH:mm'));
});

ericArray.name = 'Eric';
michaelArray.name = 'Michael';

empArrays[0] = ericArray;
empArrays[1] = michaelArray;
answerArr = [];
block1Array.forEach(function(min, blockindex, array){
    //michaelArray and ericArray
    //
    //if(empty){empty.start=thistime}
    //if(prev = empty && cur = intersection){
    //empty.end = thistime, intersection.start = thistime
    //}
    
    answerArr[blockindex] = [min, []];
    empArrays.forEach(function(item, index, array){
        if ((item.includes(min))){
            answerArr[blockindex][1].push(item.name);

        }
    });
    console.log(answerArr[blockindex][0] + ' ' + answerArr[blockindex][1]);

});

//Iterate through block1's minutes
//if current Minute is not included in any of the other arrays available
//create a start moment, then create an end moment when there are 
//intersecting minutes and create a start moment for a range
//that will have a property keeping track of how many are there
//at the same time


morning = moment.range(moment("05:00", "HH:mm"), moment("10:00", "HH:mm"));
console.log(morning.diff("minutes"));
//
//maybe use a map
//data: blocks [block1,2,3]
//blocks get a requirement variable, blockX.requirement = #
//employees[john,eric,michael...]
//
//for each blockX:
//if blockX contains employee[y], remove employee[y] from iteration(less useless calculation)
//if blockX intersects employee[y], that intersectionX.available + 1
//if intersectionX.available === blockX.requirement, no further anything on that range required
//if intersectionX.available != blockX.requirement, this intersectionX will iterate through employees
//similar to how blockX does. 
//while intersectionX != blockX.requirement, 
//iterate through employees and add to teh array to make sure it eventually equals out
//
//
//
//iterate through each block
//check each scheduled employee to see if they intersect with the block

//a person's scheduled hours will be a moment.range or series of moment ranges
//the required hours will be a moment.range with a requirement number, for how many people are needed
//from 5 to 10, requirement = 1 
//from 10 to 4 requirement = 3, 
//from 4 to 7 requirement = 4 
//from 7 to 10 requirement = 3, 
//from 10 to 12 requirement = 2
//
//john from 5 to 9
//eric from 9 to 5
//michael from 10 to 4
//anna from 4 to 10
//gerry from 5 to 12
//dan from 4 to 12
//
//5 - 10 = 1
//10 - 4 = 2 short 1
//4 - 5 = 2 short 1
//5-10 = 3 short 1 until 7
//10-12 = 2
//


    //find canvas and load images, wait for last image to load
    canvas = document.getElementById("testCanvas");
    stage = new createjs.Stage(canvas);
    canvas.width = 800; 
    canvas.height = 700.5;  
    // we need to enable mouseover events for rollover/out and cursor to work:
    stage.enableMouseOver(20);

    // console.log(stageY);
    stage.on("stagemousemove",  displayY);

//This is a backup
    // // Create some TextLinks:
    // var links = ["yellow", "blue", "green", "red", "purple", "orange"];
    // for(var i = 0; i < links.length; i++) {
    //         var link = new TextLink(links[i] + " link!", "10px Arial", links[i], "#FFF");
    //         link.x = 0;
    //         link.y = i * 25;
    //         link.addEventListener("click", handleClick);
    //         link.cursor = "pointer";
    //         stage.addChild(link);
    // }

    // Create some TextLinks:
    //var links = [];
    ////["yellow", "blue", "green", "red", "purple", "orange"];
    //for(var i = 1 ; i < 24; i++) {
    //        var link = new TextLink(i , "25px Arial", 'red', "#AFD");
    //        link.x = 0;
    //        link.y = i * 25;
    //        link.addEventListener("click", handleClick);
    //        link.cursor = "pointer";
    //        stage.addChild(link);
    //}

    graphWeek();
    createjs.Ticker.addEventListener("tick", stage);
}

function handleClick(evt){
                week[3].graphics.beginFill("green").drawRect(0, 0, 100, 600);
                stage.update();
        // alert("You clicked on: " + evt.target.text);
}

        
        
        
        
        
        
// function init() {

//     var daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
//     console.log('init');
    // var canv = document.getElementById("testCanvas");
    // canv.width = 800; 
    // canv.height = 300;  
//     document.getElementById("offCanvas").innerHTML = "Text will go here";
//     var stage = new createjs.Stage("demoCanvas");
//     stage.enableMouseOver();
//     var week = [];
//      var text = new createjs.Text("Hello World", "20px Arial", "#ff7700");
//       text.x = 0;
//        text.textBaseline = "alphabetic";



//     for(i = 0; i < 8; i++) {
//         // if(i%2===0){
//             console.log(i);
        
//             week[i] = new createjs.Shape();
//             week[i].graphics.beginFill("DeepSkyBlue").drawRect(0, 0, 100, 700);
//             week[i].x = i*100 + 100;
//             // week[i].y = 100;
//             stage.addChild(week[i]);

//             week[i].on("mouseover", function(evt){
//                 this.graphics.beginFill("red").drawRect(0, 0, 100, 700);
//                 stage.update();
//             });
//             week[i].on("mouseout", function(evt){
//                 this.graphics.beginFill("blue").drawRect(0, 0, 100, 700);
//                 stage.update();
//             });
//             week[i].on("click", function(evt){
//                 document.getElementById("offCanvas").innerHTML = "Testing. day " + daysOfWeek[week.indexOf(this)]; 

//             });

//         }        
//     // }
    
//     stage.update();
    
// }

window.onload = function() {
    init();
};

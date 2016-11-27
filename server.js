var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
// moment.js used to handle converting and formatting time
var moment = require('moment');
var app = express();

var PORT = process.env.PORT || 3000 ;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.text());
app.use(bodyParser.json({type:'application/vnd.api+json'}));


// display home page
app.get('/',function(req,res){
    res.sendFile(path.join(__dirname + '/index.html'));
  })

// retrieve argument
app.get('/:date',function(req,res){
    
    var arg = req.params.date;
    arg = arg.toLowerCase();

    // validDay is main function that parses argument and returns object with data
    if (arg != "favicon.ico"){
    
    	var obj = validDay(arg);
		res.send(obj);
  	
  	}

 })


app.listen(PORT,function(){

	console.log("app listening on port " + PORT);
})

// main function, takes string and returns natural time and unix time if valid entry
// otherwise returns null
function validDay(string){

var arg = string;

var obj = {unix:"",
		   natural:"",
		};

// if first character is a number or minus sign begin parsing assumuing agument is unix time
if (!isNaN(arg.charAt(0)) || arg.charAt(0)==="-"){

	//if valid unix time entry will format 
	var natural = moment.unix(arg).format('MMMM DD YYYY');
	
	if(natural === "Invalid date"){
		obj.unix = null;
		obj.natural = null;
		return obj;
	}
	else{
		obj.unix = parseInt(arg);
		obj.natural = natural;
		return obj;
	}

}
// if first character of argument is not a number or minus sign assume argument is a natural date
else{

var months = ["january","february","march","april","may","june"
			 ,"july", "august","september","october","november","december"];

var month = "";
// as long as characters of argument keep being letters add them to month variable
for(var j = 0 ; j < arg.length ; j++){
	if(isLetter(arg[j]))
		month+=arg[j];
	else
		break;
}
	// check to see if month variable is a valid month
	 if(months.indexOf(month)!= -1){
		// remove ',' only one allowed
		var lowerArgMinusMonth = arg.slice(month.length).replace(/,/, '');

		 // if invalid character found after valid month return null
		 // should be all numbers
		 for(var j = 0 ; j < lowerArgMinusMonth.length ; j++){
		 		if(isNaN(lowerArgMinusMonth.charAt(j))){
		 			obj.unix = null;
		 			obj.natural = null;
		 			return obj;
		 			break;
		 		}
		 }

		 // replace all whitespace
		 lowerArgMinusMonth = lowerArgMinusMonth.replace(/ /g , '');

		 // if day of month and year totals 6 characters
		 if(lowerArgMinusMonth.length == 6){
				var day6 = parseInt(lowerArgMinusMonth.slice(0,2));
				var year6 = parseInt(lowerArgMinusMonth.slice(2));
				var six = moment(month + " " + day6 + " " + year6 , 'MMMM-DD-YYYY');
				
				// make sure is valid date
				if(six.isValid()){
					obj.unix = six.unix();
					obj.natural = six.format('MMMM DD YYYY')
					return obj;
				}
				else{
					obj.unix = null;
					obj.natural = null;
					return obj;
				}
		}

		// if day of month and year totals 5 characters
		else if(lowerArgMinusMonth.length == 5){
			var day5 = parseInt(lowerArgMinusMonth.slice(0,1));
			var year5 = parseInt(lowerArgMinusMonth.slice(1));
			var five = moment(month + " " + day5 + " " + year5 , 'MMMM-D-YYYY');
				
				// make sure is valid date
				if(five.isValid()){
					obj.unix = five.unix();
					obj.natural = five.format('MMMM DD YYYY')
					return obj;
				}
				else{
					obj.unix = null;
					obj.natural = null;
					return obj;
				}

	} 

	}
	// if argument does not contain valid month
	else{
		obj.unix = null;
		obj.natural = null;
		return obj;
	}

}

}

// check if character is letter
function isLetter(str) {
  return str.length === 1 && str.match(/[a-z]/i);
}




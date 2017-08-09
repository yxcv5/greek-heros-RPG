
var characterList = ["Zeus", "Athena", "Poseidon", "Ares"];
var apList = [25, 12, 20, 8];
var hpList = [170, 120, 150, 100];

$(document).ready(function() {

var defenderPicked = false;
var player_name;
var defender_name;
var player_obj;
var defender_obj;
var numChallengers = characterList.length - 1;
var restart = false;
var start = true;
var game_over = false;

function Character(name, attack_power, health_point) {

   this.name = name;
   this.initial_power = attack_power;
   this.attack_power = attack_power;
   this.health_point = health_point;

   this.isDead = function() {
      return (this.health_point <= 0);
   };
}

Character.prototype.attack = function(att_power, counter_att) {
    this.attack_power += att_power;
    this.health_point -= counter_att;
};

Character.prototype.counter_attack = function(att_power) {
    this.health_point -= att_power;
};

function reset() {
  $("#game_over").hide();
  game_over = false;
  if(restart) {
      $("#challengers_panel").remove();
      $("#fight_panel").remove();
      createPanel("Click to select your role", "players_panel", "players");
  }
    defenderPicked = false;
    numChallengers = characterList.length - 1;

    for(var i=0; i<characterList.length; i++) {

      var newImg = $("<img>");
      newImg.addClass("img img-responsive player_img");
      newImg.attr("src", "assets/images/" + characterList[i].toLowerCase() + ".jpg"); 
      newImg.attr("id", characterList[i] + "_img");

      var playerNote = $("<h5>");
      playerNote.html("Attack Power: " + apList[i] + "<br>" + "Health Point: " + hpList[i]);
      playerNote.attr("id", characterList[i] + "_note");
      
      var newDiv = $("<div>");
      newDiv.addClass("player_div");
      newDiv.attr("id", characterList[i]);

      newDiv.append(newImg);
      newDiv.append(playerNote);
      $("#players").append(newDiv);
    }
}

$(".main_section").on("click", "#players", function(event) {

     var tmp = event.target.id.split("_");
     player_name = tmp[0];
     if(!characterList.includes(player_name)) 
        return;
     createPanel("Pick your challenger for this battle", "challengers_panel", "challengers");
     createPanel("Battle Field", "fight_panel", "fight_section");
     var elm = "<div class='row'>" + 
               "<div class='col-xs-6 this_player'></div>" + 
               "<div class='col-xs-6 this_defender'></div>" + 
               "</div>" + 
               "<div class='row game_buttons'></div>"
     $("#fight_section").append(elm);

     for(var i = 0; i<characterList.length; i++) {
         if(player_name === characterList[i]) {

            $(".this_player").append("<h4>" + player_name + "</h4>");
            $(".this_player").append($("#" + player_name));
            player_obj = new Character(player_name, apList[i], hpList[i]);
            $("#"+player_name).css("width", "80%");
         }
         else {
            $("#challengers").append($("#" + characterList[i]));
            $("#" + characterList[i]).css("border-color", "red");
         }
     }
     $("#players_panel").remove();
});


$(".main_section").on("click", "#challengers", function(event) {
  console.log(defenderPicked);
  if(!defenderPicked) {
     var tmp = event.target.id.split("_");
     defender_name = tmp[0];
     if(!characterList.includes(defender_name)) 
        return;

     for(var i = 0; i<characterList.length; i++) {
         if(defender_name === characterList[i]) {
             $(".this_defender").append("<h4>" + defender_name + "</h4>");
             $(".this_defender").append($("#" + defender_name));
             defender_obj = new Character(defender_name, apList[i], hpList[i]);
            
             $("#"+defender_name).css("border-color", "black");
             $("#"+defender_name).css("width", "80%");
             defenderPicked = true;

           if(start || restart) { 
             var attackBtn = $("<button>");
             attackBtn.addClass("btn btn-warning attack_button");
             attackBtn.text("Attack");
             $(".game_buttons").append(attackBtn);
             start = false;
             restart = false;
           }
         }
     }
  }
});      

$(".main_section").on("click", ".attack_button", function() {

    if(defenderPicked) {

      defender_obj.counter_attack(player_obj.attack_power);
      player_obj.attack(player_obj.initial_power, defender_obj.attack_power);
      $("#"+defender_name+"_note").html("Attack Power: " + defender_obj.attack_power + "<br>" + 
                            "Health Point: " + defender_obj.health_point);
      $("#"+player_name+"_note").html("Attack Power: " + player_obj.attack_power + "<br>" + 
                            "Health Point: " + player_obj.health_point);

      if(player_obj.isDead()) {
         $("#" + player_name + "_img").animate({opacity: '-=0.5'}, "slow");
         setTimeout(function(){ $(".this_player").empty(); }, 1000);
          //show the result of the game
          if(!defender_obj.isDead()) {
            $("#game_over").attr("src", "assets/images/game_lose.png")
            $("#game_over").show();
            setTimeout(function(){ $("#game_over").hide(); }, 3000);
          }
          else {
            $("#game_over").attr("src", "assets/images/game_tie.png")
            $("#game_over").show();
            setTimeout(function(){ $("#game_over").hide(); }, 3000);
          }

          game_over = true;
      }
      if(defender_obj.isDead()) {
         $("#" + defender_name + "_img").animate({opacity: '-=0.5'}, "slow");
         setTimeout(function(){ $(".this_defender").empty(); }, 1000);
         
         numChallengers--;
         if(numChallengers == 0) {
             //show the result of the game
             if(!player_obj.isDead()) {
                $("#game_over").attr("src", "assets/images/game_win.png")
                $("#game_over").show();
                setTimeout(function(){ $("#game_over").hide(); }, 3000);
             }
             game_over = true;
         }
         else {
             defenderPicked = false;
         }         
      }
      if(game_over) {
        var resetBtn = $("<button>");
        resetBtn.addClass("btn reset_button");
        resetBtn.text("Play Again");
        $(".attack_button").replaceWith(resetBtn);
      }
    }
});


$(".main_section").on("click", ".reset_button", function() {
    restart = true;
    reset();
});

function createPanel(title, panel_id, body_id) {
    var newTitle = $("<h3>" + title + "</h3>");
    newTitle.addClass("panel-title");

    var newHeading = $("<div>");
    newHeading.addClass("panel-heading");
    newHeading.append(newTitle);

    var newBody = $("<div>");
    newBody.addClass("panel-body clearfix");
    newBody.attr("id", body_id);

    var newPane = $("<div>");
    newPane.addClass("panel panel-default");
    newPane.attr("id", panel_id);
    newPane.append(newHeading);
    newPane.append(newBody);
    
    $(".main_section").append(newPane);
}

reset();

});


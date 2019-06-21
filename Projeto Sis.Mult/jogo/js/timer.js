var timer = function(game) {}

timer.prototype = {
   
   preload: function { };

   create: function () {
   var clocktext; // bitmaptext
   var clocktimer; // Phaser.timer
   var clockseconds=15; // integer

   clocktext = game.add.text(
            160,
            160,
            "15",
            { fill: '#ffffff', font: '18pt Arial' });

      clocktimer = game.time.create(false);
      clocktimer.loop(Phaser.Timer.SECOND, updateDisplay, this);
      // handle keyboard keys R and S
      game.input.keyboard.onDownCallback = HandleKeyDown;
   }

   HandleKeyDown: function(e) {
   if (e.keyCode == 82) { initClock() }; // R = reset/init
   if (e.keyCode == 83) { stopClock() }; // S = stop/pause
   }

    stopClock: function() {
   clocktimer.stop(false);
}

   initClock : function () {
   //updateDisplay(); // initial display
   clocktimer.start();
}

    updateDisplay : function() {
   clockseconds = clockseconds + 1;
   clocktext.text = clockseconds;
   }
}

module.exports = timer;
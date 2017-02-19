var app={
    inicio: function(){
        DIAMETRO_BOLA = 50;
        dificultad = 0;
        velocidadX = 0;
        velocidadY = 0;
        puntuacion = 0;

        alto  = document.documentElement.clientHeight;
        ancho = document.documentElement.clientWidth;

        app.vigilaSensores();
        app.iniciaJuego();
    },

    iniciaJuego: function() {
        var game = new Phaser.Game(ancho, alto, Phaser.AUTO, 'phaser', {
            preload: preload,
            create: create,
            update: update
        });

        function preload() {
            game.load.image('car', 'assets/sprites/car.png');
            game.load.image('tinycar', 'assets/sprites/tinycar.png');
            game.physics.startSystem(Phaser.Physics.P2JS);
        }

        function create() {
            scoreText = game.add.text(16, 16, puntuacion, { fontSize: '10px', fill: '#757676' });
            bullets = game.add.group();
            for (var i = 0; i < 10; i++) {
                var bullet = bullets.create(game.rnd.integerInRange(200, 1700), game.rnd.integerInRange(-200, 400), 'tinycar');
                game.physics.p2.enable(bullet, false);
            }
            cursors = game.input.keyboard.createCursorKeys();
            ship = game.add.sprite(32, game.world.height - 150, 'car');
            window.addEventListener("deviceorientation", handleOrientation, true);
            game.physics.p2.enable(ship);
        }

        function update() {
            bullets.forEachAlive(moveBullets, this);  //make bullets accelerate to ship

            if (cursors.left.isDown || velocidadY <0) {
                ship.body.rotateLeft(100);
            }   //ship movement
            else if (cursors.right.isDown|| velocidadY >=0) {
                ship.body.rotateRight(100);
            }
            else {
                ship.body.setZeroRotation();
            }
            if (cursors.up.isDown || velocidadX<0) {
                ship.body.thrust(400);
            }
            else if (cursors.down.isDown|| velocidadX >=0 ) {
                ship.body.reverse(400);
            }
            game.physics.arcade.overlap(bullets, ship, wallCollision(), null, this)
        }

        function update2() {
            bullets.forEachAlive(moveBullets, this);  //make bullets accelerate to ship

            if (cursors.left.isDown) {
                ship.body.rotateLeft(100);
            }   //ship movement
            else if (cursors.right.isDown) {
                ship.body.rotateRight(100);
            }
            else {
                ship.body.setZeroRotation();
            }
            if (cursors.up.isDown) {
                ship.body.thrust(400);
            }
            else if (cursors.down.isDown ) {
                ship.body.reverse(400);
            }
        }

        function wallCollision () {
            scoreText.text = "colision detectada";
            /*if(this.audioStatus) {
                this.bounceSound.play();
            }*/
            // Vibration API
            if("vibrate" in window.navigator) {
                window.navigator.vibrate(2);
            }
        }

        function handleOrientation(e) {
            // Device Orientation API
            var x = e.gamma; // range [-90,90], left-right
            var y = e.beta;  // range [-180,180], top-bottom
            var z = e.alpha; // range [0,360], up-down
            ship.body.velocity.x += x;
            ship.body.velocity.y += y*0.5;
        }


        function moveBullets(bullet) {
            accelerateToObject(bullet, ship, 30);  //start accelerateToObject on every bullet
        }

        function accelerateToObject(obj1, obj2, speed) {
            if (typeof speed === 'undefined') {
                speed = 60;
            }
            var angle = Math.atan2(obj2.y - obj1.y, obj2.x - obj1.x);
            obj1.body.rotation = angle + game.math.degToRad(90);  // correct angle of angry bullets (depends on the sprite used)
            obj1.body.force.x = Math.cos(angle) * speed;    // accelerateToObject
            obj1.body.force.y = Math.sin(angle) * speed;
        }
    },



    vigilaSensores: function(){

        function onError() {
            console.log('onError!');
        }

        function onSuccess(datosAceleracion){
            app.registraDireccion(datosAceleracion);
        }

        navigator.accelerometer.watchAcceleration(onSuccess, onError,{ frequency: 10 });
    },

    registraDireccion: function(datosAceleracion){
        velocidadX = datosAceleracion.x ;
        velocidadY = datosAceleracion.y ;
        velocidadZ = datosAceleracion.z;
        //scoreText.text = "x="+velocidadX+" y="+velocidadY+ " z:"+velocidadZ;

    }


};

if ('addEventListener' in document) {
    document.addEventListener('deviceready', function() {
        app.inicio();
    }, false);
}

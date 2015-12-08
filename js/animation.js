$(document).ready(function() {
	var canvas = $("#myCanvas");
    var context = canvas.get(0).getContext("2d");
    var canvasWidth=canvas.get(0).width=canvas.get(0).offsetWidth;
    var elemLeft = canvas.offset().left;
    var elemTop = canvas.offset().top;
    /* Accesses the canvas element.*/

    /* elemLeft and elemTop are used to adjust the (x, y)
	   of the click event to the position of the canvas. */


	/* SYSTEM PARAMETERS /////////////////////////////////////////////// */
    var radius = 90; 						/* Radius of circels.        */
    var speed = 2;    						/* Speed of circles.         */
    var textColor = 'rgb(255,255,255)';		/* Color of text in circles. */
    /* ///////////////////////////////////////////////////////////////// */


    var randomSign = function() {
    	var ran = Math.random();

    	if(ran < 0.5) {
    		return -1;
    	} else {
    		return 1;
    	}
    };
    /* This function randomly returns 1 or -1. */

    /* vMath stands for Vector Math. This is an object I wrote
       which performs math operations on vectors. A vector,
       represented as "v", is a two element array [x, y]. 
       A scalar, represented as "s", is a float value. */
    var vMath = {
	    add: function(v1,v2) {
	        var sum = [v1[0] + v2[0], v1[1] + v2[1]];
	        return sum;
		}, /* Input two vectors, get their vector sum. */
	    sub: function(v1,v2) {
	        var diff = [v1[0] - v2[0], v1[1] - v2[1]];
	        return diff;
		}, /* Input two vectors, get their vector difference. */
	    scale: function(s,v) {
	        var scaled = [s * v[0], s * v[1]];
	        return scaled;
	    }, /* Input a scalar and a vector, get the scaled vector. */
	    dot: function(v1,v2) {
	    	var product = (v1[0] * v2[0]) + (v1[1] * v2[1]);
	        return product;
	    }, /* Input two vectors, get their scalar product. */
	    length: function(v) {
	        var L = Math.sqrt((v[0]*v[0]) + (v[1]*v[1]));
	        return L;
	    }, /* Input a vector, get its scalar length. */
	    unit: function(v) {
	        var L = this.length(v);
	        var U = [v[0]/L,v[1]/L];
	        return U;
	    } /* Input a vector, get its unit vector. */
	};

	/* This is the function class. Each circle drawn on the canvas will be initialized from here. */
    function Circle(color, intialX, intialY, redirect, text, font, textX, textY) {
	    this.radius = radius;
	    this.color = color;
	    this.R = [intialX, intialY];
	    this.initialize_dR = function() {
	        var dX = randomSign()*Math.random()*speed;
	        var dY = randomSign()*Math.sqrt((speed*speed)-(dX*dX));
	        return [dX,dY];
	    }; /* Randomly generates a velocity vector which has a speed (scalar length) = speed. */
	    this.dR = this.initialize_dR();
	    this.draw = function() {
	        context.beginPath();
	        context.arc(Math.floor(this.R[0]), Math.floor(this.R[1]), this.radius, 0, 2 * Math.PI, false);
	        context.fillStyle = this.color;
	        context.fill();

	        context.font = font;
	        context.fillStyle = textColor;
	        context.fillText(text, this.R[0] + textX, this.R[1] + textY);
	    }; /* textX and textY serve as the offset of the text from the center of the circle. */
	    this.update = function() {
	    	this.R = vMath.add(this.R, this.dR);
	    };
	    this.link = redirect; /* HTML page that a click event will redirect to. */
	    this.recCol = [false, false, false, false];
	}

	var circles = new Array(); /* An array containing instances of the object class. */
	circles[0] = new Circle('rgb(204,0,1)', 150, 150, "./grades-k-2.html", "K", "80px Arial Black", -30, 33);
    circles[1] = new Circle('rgb(241, 92, 0)', 400, 150, "./grades-3-5.html", "1", "80px Arial Black", -30, 33);
    circles[2] = new Circle('rgb(255, 232, 0)', 650, 150, "./grades-6-8.html", "2", "80px Arial Black", -30, 33);
    circles[3] = new Circle('rgb(0, 153, 0)', 150, 400, "./highschool.html", "3", "80px Arial Black", -30, 33);
    circles[4] = new Circle('rgb(0, 102, 204)', 550, 400, ".#", "4", "80px Arial Black", -30, 33);
    circles[5] = new Circle('rgb(125, 0, 204)', 650, 400, ".#", "5", "80px Arial Black", -30, 33);

    // circles[3].draw = function() {
    // 	context.beginPath();
    //     context.arc(Math.floor(this.R[0]), Math.floor(this.R[1]), this.radius, 0, 2 * Math.PI, false);
    //     context.fillStyle = this.color;
    //     context.fill();

    //     context.font = "50px Arial Black";
    //     context.fillStyle = textColor;
    //     context.fillText("High", this.R[0] - 63, this.R[1] - 20);
    //     context.fillText("School", this.R[0] - 95, this.R[1] + 45)
    // }; /* The High School circle needed two lines of text, however, canvas does not support line break so I had 
    	  //to get creative and change the value of .draw() for the high school circle. */

    var wallCheck = function(e) {
		if(e.R[0] + e.dR[0] <= e.radius || e.R[0] + e.dR[0] >= canvasWidth - e.radius) {
			/* If the element's x position plus it's x velocity is less than the element's radius...or 
			   if the element's y position plus it's y velocity is less than the border minus the element's radius... 

			   (Basically, this if statement determines whether or not the circle is about to run into a wall) */

			if(Math.abs(500 - (e.R[0] - e.dR[0])) < Math.abs(500 - (e.R[0] + e.dR[0]))) {
				/* Sometimes circles were getting hung on walls. This additional if statement basically
				   says if it would better to change it's velocity... */	

				e.dR[0] = (-1)*e.dR[0];
				/* ...change it's velocity. */
			}
		}
		if(e.R[1] + e.dR[1] <= e.radius || e.R[1] + e.dR[1] >= 550 - e.radius) {
			if(Math.abs(200 - (e.R[1] - e.dR[1])) < Math.abs(200 - (e.R[1] + e.dR[1]))) {
				e.dR[1] = (-1)*e.dR[1];
			}
		}
	};

	var compare = function(c1, c2, j) {
        var diff = vMath.sub(c1.R,c2.R);
        var diffLength = vMath.length(diff);
		var diffUnit = vMath.unit(diff);
        
        if(diffLength <= 2*c1.radius) {
			if(c1.recCol[j]) {
	
			} else {
	            var dot1 = (-2) * vMath.dot(c1.R, diffUnit);
	            var dot2 = (-2) * vMath.dot(c2.R, vMath.scale((-1), diffUnit));

	            var new_dR_1 = vMath.add(c1.dR, vMath.scale(dot1, diffUnit));
				var new_dR_2 = vMath.add(c2.dR, vMath.scale(dot2, vMath.scale((-1), diffUnit)));

				var new_R_1 = vMath.add(new_dR_1, c1.R); 
				var new_R_2 = vMath.add(new_dR_2, c2.R);

				var dot1 = vMath.dot(vMath.scale(-1,diffUnit),c1.dR);
				var dot2 = vMath.dot(diffUnit,c2.dR);

				var norm1 = vMath.scale((-1)*dot1, diffUnit);
				var norm2 = vMath.scale(dot2, diffUnit);

				var normSum = vMath.add(norm1,norm2);

				c1.dR = vMath.sub(normSum, c1.dR);
				c2.dR = vMath.sub(normSum, c2.dR);

				c1.R = vMath.add(c1.R, c1.dR);
				c2.R = vMath.add(c2.R, c2.dR);

				c1.recCol[j] = true;
			}
        } else {
			c1.recCol[j] = false;
        }
    };

    var animate = function() {
        context.clearRect(0,0,canvasWidth,550); /* Clear everything. */
        
        for(i = 0; i < circles.length; i++) {
        	circles[i].draw(); /* Draw each circle. */

        	wallCheck(circles[i]); /* See if any of them are about to run into walls. */
            
            for(j = i + 1; j< circles.length; j++) {
            	compare(circles[i], circles[j], j);    
            }
        	
            circles[i].update(); /* update their positions. */
        }
            
        setTimeout(animate, 33); /* Wait 33 miliseconds and call animate() again. */
    };
        
    animate(); /* Call animate for the first time. */

	canvas.click(function(event) {
        var X = event.pageX - elemLeft; /* Adjust click x and y to canvas. */
        var Y = event.pageY - elemTop;
        
        for(i=0; i<circles.length; i++) {
            if(vMath.length(vMath.sub([X,Y], circles[i].R)) <= circles[i].radius) {
                window.location.href = circles[i].link;
            } /* If the click is inside the circle, redirect to the appropriate link. */
        }
    }); 
});
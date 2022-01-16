
//global variables
//var cols, rows; //comes from maze_info.js now
//var w = 40; //width of cell
//var w = 80; //width of cell
var w = 160; //width of cell
//var w = 266; //width of cell
//var w = 300; //width of cell
var grid = []; //all of the cells in the entire 3D maze, size is cols * rows * innieouties
var turn_head_to_left_grid = [];
var turn_head_to_right_grid = [];
var turn_head_up_grid = [];
var turn_head_down_grid = [];
var turn_head_backward_grid = [];

var all_maze_perspectives = [];
var current_maze_perspective = 0;
var current_maze_plane = 0; 

var sleep_time = 500; //time in milliseconds to wait to show next maze plane after maze is constructed
var start; //signifying starting up maze, start up whatev, maybe tutorial about how to play etc., set true/false in setup() function 
var letsgetitstarted;
let start_index = 1;
let goal_index = 17;

//you may be circling back around creating too many variables to hold this and that
//at least one set is needed to hold a current perspectives # of cols, rows, innieouties
let particular_num_cols = -1;
let particular_num_rows = -1;
let particular_num_innieouties = -1;
var orig_cols = cols;
var orig_rows = rows;
var orig_innieouties = innieouties;

function setup() {
	//get all of the maze info from maze_info.js
	//maybe eventually combine generating a maze (maze_generation_3D.js) here instead
	console.log("cols: " + cols);
	console.log("rows: " + rows);
	console.log("innieouties: " + innieouties);

	//createCanvas(windowWidth, windowHeight);
	createCanvas(800, 800);
	//createCanvas(900, 900);
	//I guess that width and height are already known as keywords for the canvas sizes
	//cols = floor(width / w); 
	//rows = floor(height / w);
	num_cells_in_a_maze_plane = cols * rows; //keeping it for regular grid perspective index function

	//set up every cell
	//keep all of the cells, even for different maze planes, 
	//in the same 1D grid array and do the math
	//the math: (need specific dimensions of each perspective)
	//size of 1 maze plane is cols * rows
	//the size of the entire 3D maze is cols * rows * innieouties 
	
	//original grid perspective
	//uses original cols, rows, innieouties from file instead of setting particular values in contrast to all of the other perspectives
	for(let k = 0; k < innieouties; k++){
		for(let j = 0; j < rows; j++){
			for(let i = 0; i < cols; i++){
				let cell = new Cell(i, j, k);
				let cell_num = index(i, j, k);
				//set all cell walls info
				for(let a = 0; a < cell_walls[cell_num].length; a++){
					if(cell_walls[cell_num][a] == 1){
						cell.walls.push(true);
					}
					else{
						cell.walls.push(false);
					}

				} 
				
				grid.push(cell);
			}
		}
	}

	//add maze to all_maze_perspectives array
	all_maze_perspectives.push(grid);

	//create all of the different rotational perspectives
	
	//turn head to left 
	particular_num_cols = orig_innieouties; 
	particular_num_rows = orig_rows;
	particular_num_innieouties = orig_cols;
	for(let i = 0; i < particular_num_cols; i++){
		for(let j = 0; j < particular_num_rows; j++){
			for(let k = 0; k < particular_num_innieouties; k++){
				let cell = new Cell(i, j, k);
				let cell_num = index_take_2(i, j, k, particular_num_cols, particular_num_rows, particular_num_innieouties);
				console.log("cell_num: " + cell_num);
				let grid_cell_num = index(orig_cols - 1 - k, j, i);
				console.log("grid_cell_num: " + grid_cell_num);
				
				//0-top, 1-right, 2-bottom, 3-left, 4-out, 5-in
				//top remains top
				//in from original becomes right of new
				//bottom remains bottom
				//out from original becomes left of new
				//right from original becomes out of new
				//left from original becomes in of new
				cell.walls[0] = grid[grid_cell_num].walls[0];
				cell.walls[1] = grid[grid_cell_num].walls[5];
				cell.walls[2] = grid[grid_cell_num].walls[2];
				cell.walls[3] = grid[grid_cell_num].walls[4];
				cell.walls[4] = grid[grid_cell_num].walls[1];
				cell.walls[5] = grid[grid_cell_num].walls[3];

				turn_head_to_left_grid[cell_num] = cell;

			}
		}
	}

	//add maze to all_maze_perspectives array
	all_maze_perspectives.push(turn_head_to_left_grid);

	//turn head to the right
	particular_num_cols = orig_innieouties;
	particular_num_rows = orig_rows;
	particular_num_innieouties = orig_cols;
	for(let i = 0; i < particular_num_cols; i++){
		for(let j = 0; j < particular_num_rows; j++){
			for(let k = 0; k < particular_num_innieouties; k++){
				let cell = new Cell(i, j, k);
				let cell_num = index_take_2(i, j, k, particular_num_cols, particular_num_rows, particular_num_innieouties);
				console.log("cell_num: " + cell_num);
				let grid_cell_num = index(k, j, orig_innieouties - 1 - i);
				console.log("grid_cell_num: " + grid_cell_num);
				
				//0-top, 1-right, 2-bottom, 3-left, 4-out, 5-in
				//top remains top
				//out from original becomes right of new 
				//bottom remains bottom
				//in from original becomes left of new
				//left from original becomes out of new
				//right from original becomes in of new
				cell.walls[0] = grid[grid_cell_num].walls[0];
				cell.walls[1] = grid[grid_cell_num].walls[4];
				cell.walls[2] = grid[grid_cell_num].walls[2];
				cell.walls[3] = grid[grid_cell_num].walls[5];
				cell.walls[4] = grid[grid_cell_num].walls[3];
				cell.walls[5] = grid[grid_cell_num].walls[1];

				turn_head_to_right_grid[cell_num] = cell;

			}
		}
	}

	//add maze to all_maze_perspectives array
	all_maze_perspectives.push(turn_head_to_right_grid);

	//turn head up
	particular_num_cols = orig_cols;
	particular_num_rows = orig_innieouties;
	particular_num_innieouties = orig_rows;
	for(let i = 0; i < particular_num_cols; i++){
		for(let j = 0; j < particular_num_rows; j++){
			for(let k = 0; k < particular_num_innieouties; k++){
				let cell = new Cell(i, j, k);
				let cell_num = index_take_2(i, j, k, particular_num_cols, particular_num_rows, particular_num_innieouties);
				console.log("cell_num: " + cell_num);
				let grid_cell_num = index(i, orig_rows - 1 - k, j);
				console.log("grid_cell_num: " + grid_cell_num);
				
				//0-top, 1-right, 2-bottom, 3-left, 4-out, 5-in
				//out from original becomes top of new
				//right remains right
				//in from original becomes bottom of new
				//left remains left
				//bottom from original becomes out of new
				//top from original becomes in of new
				cell.walls[0] = grid[grid_cell_num].walls[4];
				cell.walls[1] = grid[grid_cell_num].walls[1];
				cell.walls[2] = grid[grid_cell_num].walls[5];
				cell.walls[3] = grid[grid_cell_num].walls[3];
				cell.walls[4] = grid[grid_cell_num].walls[2];
				cell.walls[5] = grid[grid_cell_num].walls[0];

				turn_head_up_grid[cell_num] = cell;				

			}
		}
	}

	//add maze to all_maze_perspectives array
	all_maze_perspectives.push(turn_head_up_grid);

	//turn head down
	particular_num_cols = orig_cols;
	particular_num_rows = orig_innieouties;
	particular_num_innieouties = orig_rows;
	for(let i = 0; i < particular_num_cols; i++){
		for(let j = 0; j < particular_num_rows; j++){
			for(let k = 0; k < particular_num_innieouties; k++){
				let cell = new Cell(i, j, k);
				let cell_num = index_take_2(i, j, k, particular_num_cols, particular_num_rows, particular_num_innieouties);
				console.log("cell_num: " + cell_num);
				let grid_cell_num = index(i, k, orig_innieouties - j - 1);
				console.log("grid_cell_num: " + grid_cell_num);
				
				//0-top, 1-right, 2-bottom, 3-left, 4-out, 5-in
				//in from original becomes top of new
				//right remains right
				//out from original becomes bottom of new
				//left remains left
				//top from original becomes out of new
				//bottom from original becomes in of new
				cell.walls[0] = grid[grid_cell_num].walls[5];
				cell.walls[1] = grid[grid_cell_num].walls[1];
				cell.walls[2] = grid[grid_cell_num].walls[4];
				cell.walls[3] = grid[grid_cell_num].walls[3];
				cell.walls[4] = grid[grid_cell_num].walls[0];
				cell.walls[5] = grid[grid_cell_num].walls[2];

				turn_head_down_grid[cell_num] = cell;				

			}
		}
	}

	//add maze to all_maze_perspectives array
	all_maze_perspectives.push(turn_head_down_grid);

	//turn head backward (turn around)
	particular_num_cols = orig_cols;
	particular_num_rows = orig_rows;
	particular_num_innieouties = orig_innieouties;
	for(let i = 0; i < particular_num_cols; i++){
		for(let j = 0; j < particular_num_rows; j++){
			for(let k = 0; k < particular_num_innieouties; k++){
				let cell = new Cell(i, j, k);
				let cell_num = index_take_2(i, j, k, particular_num_cols, particular_num_rows, particular_num_innieouties);
				console.log("cell_num: " + cell_num);
				let grid_cell_num = index(orig_cols - 1 - i, j, orig_innieouties - 1 - k);
				console.log("grid_cell_num: " + grid_cell_num);
				
				//0-top, 1-right, 2-bottom, 3-left, 4-out, 5-in
				//top remains top
				//left from original becomes right of new
				//bottom remains bottom
				//right from original becomes left of new
				//in from original becomes out of new
				//out from original becomes in of new
				cell.walls[0] = grid[grid_cell_num].walls[0];
				cell.walls[1] = grid[grid_cell_num].walls[3];
				cell.walls[2] = grid[grid_cell_num].walls[2];
				cell.walls[3] = grid[grid_cell_num].walls[1];
				cell.walls[4] = grid[grid_cell_num].walls[5];
				cell.walls[5] = grid[grid_cell_num].walls[4];

				turn_head_backward_grid[cell_num] = cell;				

			}
		}
	}

	//add maze to all_maze_perspectives array
	all_maze_perspectives.push(turn_head_backward_grid);
	
	
	//specify start cell COULD BE ANY CELL
	//NEED TO DETERMINE START AND FINISH CELLS OF MAZE
	current_cell = all_maze_perspectives[current_maze_perspective][start_index];
	current_index = start_index;

	//console.log("grid.length: " + grid.length);
	//console.log("turn_head_to_left_grid.length: " + turn_head_to_left_grid.length);
	//console.log("turn_head_to_right_grid.length: " + turn_head_to_right_grid.length);
	//console.log("turn_head_up_grid.length: " + turn_head_up_grid.length);
	//console.log("turn_head_down_grid.length: " + turn_head_down_grid.length);
	//console.log("turn_head_backward_grid.length: " + turn_head_backward_grid.length);
	//console.log("all_maze_perspectives[current_maze_perspective].length: " + all_maze_perspectives[current_maze_perspective].length);

	start = false; //just for debugging to not run through showing all the maze planes at the beginning
	//draw each maze plane for player to see
	//letsgetitstarted = setInterval(show_one_maze_plane, 5000); //uncomment to show all maze perspectives before starting	
}

function draw() {
	if(!start){
		//console.log("that was all of the maze planes, start playing now");
		background(51);
		//show the current maze plane
		set_particular_num_cols_rows_innieouties(current_maze_perspective);
		let num_cells_in_this_particular_plane = particular_num_cols * particular_num_rows;
		//current_maze_plane global variable will need to be changed when perspective changes too...
		for(let i = (current_maze_plane * num_cells_in_this_particular_plane); i < ((current_maze_plane + 1) * num_cells_in_this_particular_plane); i++){
			all_maze_perspectives[current_maze_perspective][i].show();
		}		

	}
}

var global_maze_plane_counter = 0;
var global_perspective_counter = 0;
var global_cell_index_counter = 0;
function show_one_maze_plane(){
	console.log("global_maze_plane_counter: " + global_maze_plane_counter);
	set_particular_num_cols_rows_innieouties(global_perspective_counter);	
	let num_cells_in_this_particular_plane = particular_num_cols * particular_num_rows;
	if(global_maze_plane_counter < particular_num_innieouties && global_perspective_counter < 7){
		background(51);
		let stopping_point = global_cell_index_counter + num_cells_in_this_particular_plane;
		for(let i = global_cell_index_counter; i < stopping_point; i++){
			//console.log("i: " + i);
			all_maze_perspectives[global_perspective_counter][i].show();
			global_cell_index_counter++;
		}
		
		global_maze_plane_counter++;
		if(global_maze_plane_counter == particular_num_innieouties){
			if(global_perspective_counter < 7){
				global_maze_plane_counter = 0;
				global_cell_index_counter = 0;
			}
			global_perspective_counter++;
			console.log("perspective: " + global_perspective_counter);
		}
	}
	else{
		start = false;
		clearInterval(letsgetitstarted);
	}
}

function set_particular_num_cols_rows_innieouties(perspective_counter){
	//original perspective
	if(perspective_counter == 0){
		particular_num_cols = orig_cols; 
		particular_num_rows = orig_rows;
		particular_num_innieouties = orig_innieouties;	
	}
	////turn head to left
	else if(perspective_counter == 1){
		particular_num_cols = orig_innieouties; 
		particular_num_rows = orig_rows;
		particular_num_innieouties = orig_cols;	
	}
	//turn head to the right
	else if(perspective_counter == 2){
		particular_num_cols = orig_innieouties; 
		particular_num_rows = orig_rows;
		particular_num_innieouties = orig_cols;	
	}
	////turn head up
	else if(perspective_counter == 3){
		particular_num_cols = orig_cols; 
		particular_num_rows = orig_innieouties;
		particular_num_innieouties = orig_rows;	
	}
	//turn head down
	else if(perspective_counter == 4){
		particular_num_cols = orig_cols; 
		particular_num_rows = orig_innieouties;
		particular_num_innieouties = orig_rows;	
	}
	//turn head backward (turn around)
	else if(perspective_counter == 5){
		particular_num_cols = orig_cols; 
		particular_num_rows = orig_rows;
		particular_num_innieouties = orig_innieouties;	
	}

}

//KEYBOARD CONTROLS
//arrows to move
//need way to specify whether or not you want to go out or in on cells that are available to go out or in or both on
//because you can also sometimes just pass by and not go out or in

//COULD/SHOULD
//also should add ability for player to rotate perspective if you set up that functionality
//so would need a key assigned for those 6 rotations (counting no rotation)
//indexes of all_maze_perspectives
//0 - grid
//1 - turn_head_to_left_grid
//2 - turn_head_to_right_grid
//3 - turn_head_up_grid
//4 - turn_head_down_grid
//5 - turn_head_backward

function next_is_not_right_boundary(the_current_index){
	let next_index = the_current_index + 1;
	if(Math.floor(next_index / particular_num_cols) === Math.floor(the_current_index / particular_num_cols)){
		return true;
	}

	return false;
}

function next_is_not_left_boundary(the_current_index){
	let next_index = the_current_index - 1;
	if(Math.floor(next_index / particular_num_cols) === Math.floor(the_current_index / particular_num_cols)){
		return true;
	}

	return false;
}

function next_is_not_up_boundary(the_current_index){
	let next_index = the_current_index - particular_num_cols;
	let num_cells_in_this_particular_plane = particular_num_cols * particular_num_rows;
	if(next_index >= current_maze_plane * num_cells_in_this_particular_plane){
		return true;
	}

	return false;
}

function next_is_not_down_boundary(the_current_index){
	let next_index = the_current_index + particular_num_cols;
	let num_cells_in_this_particular_plane = particular_num_cols * particular_num_rows;
	if(next_index < (current_maze_plane + 1) * num_cells_in_this_particular_plane){
		return true;
	}

	return false;
}

function next_is_not_out_boundary(the_current_index){
	let num_cells_in_this_particular_plane = particular_num_cols * particular_num_rows;
	let next_index = the_current_index - num_cells_in_this_particular_plane;
	if(next_index >= 0){
		return true;
	}

	return false;
}

function next_is_not_in_boundary(the_current_index){
	let num_cells_in_this_particular_plane = particular_num_cols * particular_num_rows;
	let next_index = the_current_index + num_cells_in_this_particular_plane;
	if(next_index < num_cells_in_this_particular_plane * particular_num_innieouties){
		return true;
	}

	return false;
}

//for p5 the name of the function must be keyPressed to word
function keyPressed() {
	if(start){ //don't pay attention to key if start routine is still running
		return;
	}
	//NEED TO CHECK ALL SORTS OF THINGS...
	if(keyCode === UP_ARROW){
		console.log("up arrow");
		//check that not out of bounds and not a wall above
		if(next_is_not_up_boundary(current_index) && !current_cell.walls[0]){
			current_index = current_index - particular_num_cols;
			current_cell = all_maze_perspectives[current_maze_perspective][current_index];	
		}
		else{
			console.log("nope");
		}
	}
	if(keyCode === LEFT_ARROW) {
	  	console.log("left arrow");
		//check if next_index would be on same row and not a wall to the left
		if(next_is_not_left_boundary(current_index) && !current_cell.walls[3]){
			current_index = current_index - 1;
			current_cell = all_maze_perspectives[current_maze_perspective][current_index];	
		}
		else{
			console.log("nope");
		}
	} 
	if(keyCode === RIGHT_ARROW) {
	  	console.log("right arrow");
		//check if next_index would be on same row and not a wall to the right
		if(next_is_not_right_boundary(current_index) && !current_cell.walls[1]){
			current_index = current_index + 1;
			current_cell = all_maze_perspectives[current_maze_perspective][current_index];
		}
		else{
			console.log("nope");
		}
	}
	if(keyCode === DOWN_ARROW) {
		console.log("down arrow");
		//check that not out of bounds and not a wall below
		if(next_is_not_down_boundary(current_index) && !current_cell.walls[2]){
			current_index = current_index + particular_num_cols;
			current_cell = all_maze_perspectives[current_maze_perspective][current_index];
		}
		else{
			console.log("nope");
		}
	}

	//how about enter for in and shift for out
	if(keyCode === SHIFT){
		console.log("shift so out");
		//check that not out of bounds and not a wall one maze plane out
		if(next_is_not_out_boundary(current_index) && !current_cell.walls[4]){
			let num_cells_in_this_particular_plane = particular_num_cols * particular_num_rows;
			current_index = current_index - num_cells_in_this_particular_plane;
			current_cell = all_maze_perspectives[current_maze_perspective][current_index];

			current_maze_plane--; //change maze plane to be drawn
		}
		else{
			console.log("nope");
		}
	}
	if(keyCode === ENTER){
		console.log("enter so in");
		//check if not out of bounds and not a wall one maze plane in
		if(next_is_not_in_boundary(current_index) && !current_cell.walls[5]){
			let num_cells_in_this_particular_plane = particular_num_cols * particular_num_rows;
			current_index = current_index + num_cells_in_this_particular_plane;
			current_cell = all_maze_perspectives[current_maze_perspective][current_index];

			current_maze_plane++; //change maze plane to be drawn
		}
		else{
			console.log("nope");
		}
	}

	print_one_cell_info(current_cell);

}

function sleep(milliseconds) {
	const date = Date.now();
	let currentDate = null;
	do {
	  currentDate = Date.now();
	} while (currentDate - date < milliseconds);
}

//modified index function to also take in the current perspectives
//# of cols, rows, and innieouties
//num_cells_in_a_maze_plane would change too
function index_take_2(i, j, k, num_cols, num_rows, num_innieouties){
	//check for out of bounds and return -1 if so to signify not valid
	if(i < 0 || j < 0 || i > num_cols - 1 || j > num_rows - 1 || k < 0 || k > num_innieouties - 1){
		return -1;
	}
	let num_cells_in_this_particular_plane = num_cols * num_rows;
	return i + (j * num_cols) + (k * num_cells_in_this_particular_plane);
}
function index(i, j, k){
	//check for out of bounds and return -1 if so to signify not valid
	if(i < 0 || j < 0 || i > cols - 1 || j > rows - 1 || k < 0 || k > innieouties - 1){
		return -1;
	}
	return i + (j * cols) + (k * num_cells_in_a_maze_plane);
}

//for debugging
function print_maze_info(maze_perspective_index){
	console.log("# of cells in maze perspective " + current_maze_perspective + ": " + all_maze_perspectives[current_maze_perspective].length);
	for(let i = 0; i < all_maze_perspectives[maze_perspective_index].length; i++){
		console.log("index: " + index_take_2(all_maze_perspectives[current_maze_perspective][i].i, all_maze_perspectives[current_maze_perspective][i].j, all_maze_perspectives[current_maze_perspective][i].k, particular_num_cols, particular_num_rows, particular_num_innieouties));
		console.log("i: " + all_maze_perspectives[current_maze_perspective][i].i + ", j: " + all_maze_perspectives[current_maze_perspective][i].j + ", k: " + all_maze_perspectives[current_maze_perspective][i].k);
		
	}
}
//for debugging
function print_one_cell_info(a_cell){
	console.log("i (col): " + a_cell.i + " j (row): " + a_cell.j + " k(innieoutie): " + a_cell.k);
	//console.log("walls:");
	let wall_string = "";
	if(a_cell.walls[0]){
		wall_string = wall_string + "top: true "; 
	}
	else{
		wall_string = wall_string + "top: false "; 
	}
	if(a_cell.walls[1]){
		wall_string = wall_string + "right: true "; 
	}
	else{
		wall_string = wall_string + "right: false "; 
	}
	if(a_cell.walls[2]){
		wall_string = wall_string + "bottom: true "; 
	}
	else{
		wall_string = wall_string + "bottom: false "; 
	}
	if(a_cell.walls[3]){
		wall_string = wall_string + "left: true "; 
	}
	else{
		wall_string = wall_string + "left: false "; 
	}
	if(a_cell.walls[4]){
		wall_string = wall_string + "out: true "; 
	}
	else{
		wall_string = wall_string + "out: false "; 
	}
	if(a_cell.walls[5]){
		wall_string = wall_string + "in: true "; 
	}
	else{
		wall_string = wall_string + "in: false "; 
	}

	console.log(wall_string);

}

function Cell(i, j, k){
	this.i = i;
	this.j = j;
	this.k = k;
	//top, right, bottom, left, out, inn
	//this.walls = [true, true, true, true, true, true];
	this.walls = [];
	this.visited = false; //NOT SURE THAT visited IS NEEDED FOR THIS APPLICATION


	//THINK THAT THIS FUNCTION IS ONLY USED FOR CREATING A MAZE
	//I'M NOT SURE THAT YOU NEED checkNeighbors FOR THIS APPLICATION


	this.highlight = function(red, green, blue){
		//drawing 2D maze plane, just need to know that, not drawing a z (k) value so don't need to know about that here
		let x = this.i * w;
		let y = this.j * w;
		noStroke();
		fill(red, green, blue);
		rect(x, y, w, w);
	}

	//THINK THAT THIS FUNCTION IS ONLY USED FOR CREATING A MAZE
	this.mark_as_current_cell = function(){
		let x = this.i * w;
		//let y = this.y * w; //think this was wrong in previous version, should go look
		let y = this.j * w;
		noStroke();
		fill(0, 0, 0);
		rect(x, y, w, w);
		//circle(x, y, 20);
	}

	this.show = function(){
		//x left/right y up/down
		let x = this.i * w;
		let y = this.j * w;
		//stroke(255);
		stroke(0);
		strokeWeight(7);
		//fill(255);
		if(this.walls[0]){
			line(x, y, x + w, y); //top wall
		}
		if(this.walls[1]){
			line(x + w, y, x + w, y + w); //right wall
		}
		if(this.walls[2]){
			line(x, y + w, x + w, y + w); //bottom wall
		}
		if(this.walls[3]){
			line(x, y, x, y + w); //left wall
		}
		//change color out or inn if there is no wall to signify no wall with color instead of line
		if(!this.walls[4] && this.walls[5]){ 
			//color the cell differently than others in the maze plane to signify ability to go OUT to adjacent maze plane
			this.highlight(0, 255, 0); //out color
			//fill(0, 255, 255);
		}
		else if(!this.walls[5] && this.walls[4]){ 
			//color the cell differently than others in the maze plane to signify ability to go IN to adjacent maze plane
			this.highlight(153, 51, 255); //inn color
			//fill(255, 0, 255);
		}
		//3rd distinct color for if both out and inn
		else if(!this.walls[4] && !this.walls[5]){
			//color the cell differently than others in the maze plane to signify ability to go IN/OUT to adjacent maze plane
			this.highlight(255, 128, 0); //out and inn color
		}

		//not in/out default cell color
		if(this.walls[4] && this.walls[5]){
			noStroke();
			fill('magenta'); 
			rect(x, y, w, w);	
		}

		//draw circle on top of current cell to show current position
		if(index_take_2(this.i, this.j, this.k, particular_num_cols, particular_num_rows, particular_num_innieouties) == current_index){
			fill(0, 0, 0, 150); //the 4th arg is alpha signifying transparency, less is more transparent
			circle(x + w / 2, y + w / 2, w / 2);	
		}

		if(index(this.i, this.j, this.k) == goal_index){
			//fill(255, 255, 255, 150); //the 4th arg is alpha signifying transparency, less is more transparent
			//circle(x + w / 2, y + w / 2, w / 2);
			stroke("green");
			line(x, y, x + w, y + w);	
			line(x + w, y, x, y + w);	
		}

	}
}
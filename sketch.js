//deployed at https://nathanfenoglio.github.io/multi_dimensional_mazes_with_3D_rotations/

//global variables
//var cols, rows; //comes from maze_info.js now
var grid = []; //all of the cells in the original perspective of the entire 3D maze, size is cols * rows * innieouties
var orig_persp_90 = []; //**original facing perspective, then top of head to the original right
var orig_persp_180 = []; //**original facing perspective, then top of head to the original bottom
var orig_persp_270 = []; //**original facing perspective, then top of head to the original left

var turn_head_to_left_grid = []; //**turn head to the left** so like stepping to the right of the cube and facing the cube thing from that direction
var turn_head_to_left_grid_90 = []; //**turn head to the left, then top of head to the original back
var turn_head_to_left_grid_180 = []; //**turn head to the left, then top of head to the original bottom
var turn_head_to_left_grid_270 = []; //**turn head to the left, then top of head to the original front

var turn_head_to_right_grid = []; //**turn head to the right** so like stepping to the left of the original cube and facing it in that direction
var turn_head_to_right_grid_90 = []; //**turn head to the right, then top of head to the original front
var turn_head_to_right_grid_180 = []; //**turn head to the right, then top of head to the original bottom
var turn_head_to_right_grid_270 = []; //**turn head to the right, then top of head to the original back

var turn_head_up_grid = []; //**turn head up** so like laying down on the ground underneath cube thing with head towards the front of the original
var turn_head_up_grid_90 = []; //**turn head up, then top of head to the original right
var turn_head_up_grid_180 = []; //**turn head up, then top of head to the original back
var turn_head_up_grid_270 = []; //**turn head up, then top of head to the original left

var turn_head_down_grid = []; //**turn head down** so like climbing on top of the cube thing and looking down with your head towards the back of the original
var turn_head_down_grid_90 = []; //**turn head down, then top of head to the original right
var turn_head_down_grid_180 = []; //**turn head down, then top of head to the original front
var turn_head_down_grid_270 = []; //**turn head down, then top of head to the original left

var turn_head_backward_grid = []; //**turn head back** like walking around the cube thing and facing it from the back with your head toward the top
var turn_head_backward_grid_90 = []; //**turn head back, then top of head to the original left
var turn_head_backward_grid_180 = []; //**turn head back, then top of head to the original bottom
var turn_head_backward_grid_270 = []; //**turn head back, then top of head to the original right


var all_maze_perspectives = [];
var current_maze_perspective = 0;
var current_maze_plane = 0; 

var start; //signifying starting up maze, start up whatev, maybe tutorial about how to play etc., set true/false in setup() function 
var letsgetitstarted;
let start_index = 1;
let goal_index = 30;
let current_goal_index = goal_index; //for changing goal index when drawing the different perspectives

//you may be circling back around creating too many variables to hold this and that
//at least one set is needed to hold a current perspectives # of cols, rows, innieouties
let particular_num_cols = -1;
let particular_num_rows = -1;
let particular_num_innieouties = -1;
var orig_cols = cols;
var orig_rows = rows;
var orig_innieouties = innieouties;
var w; //width of cell

function setup() {
	//get all of the maze info from maze_info.js or whichever file in directory mazes and specified in index.js
	//TO DO!!!!
	//maybe eventually combine generating a maze (maze_generation_3D.js) here instead
	console.log("cols: " + cols);
	console.log("rows: " + rows);
	console.log("innieouties: " + innieouties);

	//createCanvas(windowWidth, windowHeight);
	//createCanvas(800, 800);
	createCanvas(650, 650);
	w = width / Math.max(orig_cols, orig_rows, orig_innieouties); //width of cell

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
	
	//PERSPECTIVE 0
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

	//PERHAPS YOU SHOULD FIGURE OUT HOW TO DO ALL OF THE TRANSLATIONS FROM 
	//THE ONE ORIGINAL GRID PERSPECTIVE INSTEAD OF HAVING TO USE MEMORY FOR 
	//24 DIFFERENT PERSPECTIVES OF THE SAME THING
	//I MEAN ESSENTIALLY WHEN YOU CREATE A NEW CELL YOU ARE DOING THAT WITH THE 
	//TRANSLATION RELATIVE TO THE ORIGINAL GRID
	//BUT SINCE DOING ALL OF THIS IN SETUP SEEMS LIKE IT WOULD SAVE TIME DURING GAME PLAY
	//INSTEAD OF DOING ALL OF THE TRANSLATIONS EACH TIME THE PLAYER CHANGES PERSPECTIVE

	//add maze to all_maze_perspectives array
	all_maze_perspectives.push(grid);

	//create all of the different rotational perspectives
	//adding the 3 rotations for each of the original 6 rotations that you already had
	//to make 24 in all
	//there are 24 possible orientations to index
    //can organize them in an array perhaps like
    //degrees represent counterclockwise rotations when facing the side of 1 of the 6 orientations 
    //{
    //      0 - original, 1 - original 90, 2 - original 180, 3 - original 270, 
    //      4 - turn head to left, 5 - turn head to left 90, 6 - turn head to left 180, 7 - turn head to left 270
    //      8 - turn head to right, 9 - turn head to right 90, 10 - turn head to right 180, 11 - turn head to right 270
    //      12 - turn head up, 13 - turn head up 90, 14 - turn head up 180, 15 - turn head up 270
    //      16 - turn head down, 17 - turn head down 90, 18 - turn head down 180, 19 - turn head down 270
    //      20 - turn head back, 21 - turn head back 90, 22 - turn head back 180, 23 - turn head back 270
    //}
    //all original orientations are top, right, bottom, left, out, in

	//PERSPECTIVE 1
	console.log("PERSPECTIVE 1");
	//**original facing perspective, then top of head to the original right
	particular_num_rows = orig_cols;
	particular_num_cols = orig_rows; 
	particular_num_innieouties = orig_innieouties;
	for(let i = 0; i < orig_cols; i++){
		for(let j = 0; j < orig_rows; j++){
			for(let k = 0; k < orig_innieouties; k++){
				let cell = new Cell(j, orig_cols - i - 1, k);
				let cell_num = index_take_2(j, orig_cols - i - 1, k, particular_num_cols, particular_num_rows, particular_num_innieouties);

				console.log("i: " + j + " j: " + (orig_cols - i - 1) + " k:" + k);
				console.log("cell_num: " + cell_num);
				let grid_cell_num = index(i, j, k);
				console.log("i: " + i + " j: " + j + " k:" + k);
				console.log("grid_cell_num: " + grid_cell_num);

				cell.walls[0] = grid[grid_cell_num].walls[1];
				cell.walls[1] = grid[grid_cell_num].walls[2];
				cell.walls[2] = grid[grid_cell_num].walls[3];
				cell.walls[3] = grid[grid_cell_num].walls[0];
				cell.walls[4] = grid[grid_cell_num].walls[4];
				cell.walls[5] = grid[grid_cell_num].walls[5];
				
				orig_persp_90[cell_num] = cell;
			}
		}
	}

	//add maze to all_maze_perspectives array
	all_maze_perspectives.push(orig_persp_90);

	//PERSPECTIVE 2
	console.log("PERSPECTIVE 2");
	//**original facing perspective, then top of head to the original bottom
	//all original orientations are top, right, bottom, left, out, in
	particular_num_rows = orig_rows;
	particular_num_cols = orig_cols; 
	particular_num_innieouties = orig_innieouties;
	for(let i = 0; i < orig_cols; i++){
		for(let j = 0; j < orig_rows; j++){
			for(let k = 0; k < orig_innieouties; k++){
				let cell = new Cell(orig_cols - i - 1, orig_rows - j - 1, k);
				let cell_num = index_take_2(orig_cols - i - 1, orig_rows - j - 1, k, particular_num_cols, particular_num_rows, particular_num_innieouties);
				console.log("i: " + (orig_cols - i - 1) + " j: " + (orig_rows - j - 1) + " k:" + k);
				console.log("cell_num: " + cell_num);
				let grid_cell_num = index(i, j, k);
				console.log("i: " + i + " j: " + j + " k:" + k);
				console.log("grid_cell_num: " + grid_cell_num);

				cell.walls[0] = grid[grid_cell_num].walls[2];
				cell.walls[1] = grid[grid_cell_num].walls[3];
				cell.walls[2] = grid[grid_cell_num].walls[0];
				cell.walls[3] = grid[grid_cell_num].walls[1];
				cell.walls[4] = grid[grid_cell_num].walls[4];
				cell.walls[5] = grid[grid_cell_num].walls[5];
				
				orig_persp_180[cell_num] = cell;
			}
		}
	}

	//add maze to all_maze_perspectives array
	all_maze_perspectives.push(orig_persp_180);

	//PERSPECTIVE 3
	console.log("PERSPECTIVE 3");
    //**original facing perspective, then top of head to the original left
	//all original orientations are top, right, bottom, left, out, in
	particular_num_rows = orig_cols;
	particular_num_cols = orig_rows; 
	particular_num_innieouties = orig_innieouties;
	for(let i = 0; i < orig_cols; i++){
		for(let j = 0; j < orig_rows; j++){
			for(let k = 0; k < orig_innieouties; k++){
				let cell = new Cell(orig_rows - j - 1, i, k);
				let cell_num = index_take_2(orig_rows - j - 1, i, k, particular_num_cols, particular_num_rows, particular_num_innieouties);
				console.log("i: " + (orig_rows - j - 1) + " j: " + i + " k:" + k);
				console.log("cell_num: " + cell_num);
				let grid_cell_num = index(i, j, k);
				console.log("i: " + i + " j: " + j + " k:" + k);
				console.log("grid_cell_num: " + grid_cell_num);
				cell.walls[0] = grid[grid_cell_num].walls[3];
				cell.walls[1] = grid[grid_cell_num].walls[0];
				cell.walls[2] = grid[grid_cell_num].walls[1];
				cell.walls[3] = grid[grid_cell_num].walls[2];
				cell.walls[4] = grid[grid_cell_num].walls[4];
				cell.walls[5] = grid[grid_cell_num].walls[5];

				orig_persp_270[cell_num] = cell;
			}
		}
	}

	//add maze to all_maze_perspectives array
	all_maze_perspectives.push(orig_persp_270);
	
	//PERSPECTIVE 4
	console.log("PERSPECTIVE 4");
	//turn head to left 
	particular_num_cols = orig_innieouties; 
	particular_num_rows = orig_rows;
	particular_num_innieouties = orig_cols;
	for(let i = 0; i < particular_num_cols; i++){
		for(let j = 0; j < particular_num_rows; j++){
			for(let k = 0; k < particular_num_innieouties; k++){
				let cell = new Cell(i, j, k);
				let cell_num = index_take_2(i, j, k, particular_num_cols, particular_num_rows, particular_num_innieouties);
				console.log("i: " + i + " j: " + j + " k:" + k);
				console.log("cell_num: " + cell_num);
				let grid_cell_num = index(orig_cols - 1 - k, j, i);
				console.log("i: " + (orig_cols - 1 - k) + " j: " + j + " k:" + i);
				console.log("grid_cell_num: " + grid_cell_num);
				
				//0-top, 1-right, 2-bottom, 3-left, 4-out, 5-in
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

	//PERSPECTIVE 5
	console.log("PERSPECTIVE 5");
    //**turn head to the left, then top of head to the original back
	//all original orientations are top, right, bottom, left, out, in
	particular_num_rows = orig_innieouties;
	particular_num_cols = orig_rows; 
	particular_num_innieouties = orig_cols;
	for(let i = 0; i < orig_cols; i++){
		for(let j = 0; j < orig_rows; j++){
			for(let k = 0; k < orig_innieouties; k++){
				let cell = new Cell(j, orig_innieouties - k - 1, orig_cols - i - 1);
				let cell_num = index_take_2(j, orig_innieouties - k - 1, orig_cols - i - 1, particular_num_cols, particular_num_rows, particular_num_innieouties);
				console.log("i: " + j + " j: " + (orig_innieouties - k - 1) + " k:" + (orig_cols - i - 1));
				console.log("cell_num: " + cell_num);
				let grid_cell_num = index(i, j, k);
				console.log("i: " + i + " j: " + j + " k:" + k);
				console.log("grid_cell_num: " + grid_cell_num);
				
				//0-top, 1-right, 2-bottom, 3-left, 4-out, 5-in
				cell.walls[0] = grid[grid_cell_num].walls[5];
				cell.walls[1] = grid[grid_cell_num].walls[2];
				cell.walls[2] = grid[grid_cell_num].walls[4];
				cell.walls[3] = grid[grid_cell_num].walls[0];
				cell.walls[4] = grid[grid_cell_num].walls[1];
				cell.walls[5] = grid[grid_cell_num].walls[3];
				
				turn_head_to_left_grid_90[cell_num] = cell;
			}
		}
	}

	//add maze to all_maze_perspectives array
	all_maze_perspectives.push(turn_head_to_left_grid_90);

	//PERSPECTIVE 6
	console.log("PERSPECTIVE 6");
    //**turn head to the left, then top of head to the original bottom
    //all original orientations are top, right, bottom, left, out, in
	particular_num_rows = orig_rows;
	particular_num_cols = orig_innieouties; 
	particular_num_innieouties = orig_cols;
	for(let i = 0; i < orig_cols; i++){
		for(let j = 0; j < orig_rows; j++){
			for(let k = 0; k < orig_innieouties; k++){
				let cell = new Cell(orig_innieouties - k - 1, orig_rows - j - 1, orig_cols - i - 1);
				let cell_num = index_take_2(orig_innieouties - k - 1, orig_rows - j - 1, orig_cols - i - 1, particular_num_cols, particular_num_rows, particular_num_innieouties);
				console.log("i: " + (orig_innieouties - k - 1) + " j: " + (orig_rows - j - 1) + " k:" + (orig_cols - i - 1));
				console.log("cell_num: " + cell_num);
				let grid_cell_num = index(i, j, k);
				console.log("i: " + i + " j: " + j + " k:" + k);
				console.log("grid_cell_num: " + grid_cell_num);
				
				//0-top, 1-right, 2-bottom, 3-left, 4-out, 5-in
				cell.walls[0] = grid[grid_cell_num].walls[2];
				cell.walls[1] = grid[grid_cell_num].walls[4];
				cell.walls[2] = grid[grid_cell_num].walls[0];
				cell.walls[3] = grid[grid_cell_num].walls[5];
				cell.walls[4] = grid[grid_cell_num].walls[1];
				cell.walls[5] = grid[grid_cell_num].walls[3];

				turn_head_to_left_grid_180[cell_num] = cell;
			}
		}
	}

	//add maze to all_maze_perspectives array
	all_maze_perspectives.push(turn_head_to_left_grid_180);

	//PERSPECTIVE 7
	console.log("PERSPECTIVE 7");
    //**turn head to the left, then top of head to the original front
    //all original orientations are top, right, bottom, left, out, in
	particular_num_rows = orig_innieouties;
	particular_num_cols = orig_rows; 
	particular_num_innieouties = orig_cols;
	for(let i = 0; i < orig_cols; i++){
		for(let j = 0; j < orig_rows; j++){
			for(let k = 0; k < orig_innieouties; k++){
				let cell = new Cell(orig_rows - j - 1, k, orig_cols - i - 1);
				let cell_num = index_take_2(orig_rows - j - 1, k, orig_cols - i - 1, particular_num_cols, particular_num_rows, particular_num_innieouties);
				console.log("i: " + (orig_rows - j - 1) + " j: " + k + " k:" + (orig_cols - i - 1));
				console.log("cell_num: " + cell_num);
				let grid_cell_num = index(i, j, k);
				console.log("i: " + i + " j: " + j + " k:" + k);
				console.log("grid_cell_num: " + grid_cell_num);
				
				//0-top, 1-right, 2-bottom, 3-left, 4-out, 5-in
				cell.walls[0] = grid[grid_cell_num].walls[4];
				cell.walls[1] = grid[grid_cell_num].walls[0];
				cell.walls[2] = grid[grid_cell_num].walls[5];
				cell.walls[3] = grid[grid_cell_num].walls[2];
				cell.walls[4] = grid[grid_cell_num].walls[1];
				cell.walls[5] = grid[grid_cell_num].walls[3];

				turn_head_to_left_grid_270[cell_num] = cell;
			}
		}
	}

	//add maze to all_maze_perspectives array
	all_maze_perspectives.push(turn_head_to_left_grid_270);

	//PERSPECTIVE 8
	console.log("PERSPECTIVE 8");
	//turn head to the right
	particular_num_cols = orig_innieouties;
	particular_num_rows = orig_rows;
	particular_num_innieouties = orig_cols;
	for(let i = 0; i < particular_num_cols; i++){
		for(let j = 0; j < particular_num_rows; j++){
			for(let k = 0; k < particular_num_innieouties; k++){
				let cell = new Cell(i, j, k);
				let cell_num = index_take_2(i, j, k, particular_num_cols, particular_num_rows, particular_num_innieouties);
				console.log("i: " + i + " j: " + j + " k:" + k);
				console.log("cell_num: " + cell_num);
				let grid_cell_num = index(k, j, orig_innieouties - 1 - i);
				console.log("i: " + k + " j: " + j + " k:" + (orig_innieouties - 1 - i));
				console.log("grid_cell_num: " + grid_cell_num);
				
				//0-top, 1-right, 2-bottom, 3-left, 4-out, 5-in
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

	//PERSPECTIVE 9
	console.log("PERSPECTIVE 9");
    //**turn head to the right, then top of head to the original front
    //all original orientations are top, right, bottom, left, out, in
	particular_num_rows = orig_innieouties;
	particular_num_cols = orig_rows; 
	particular_num_innieouties = orig_cols;
	for(let i = 0; i < orig_cols; i++){
		for(let j = 0; j < orig_rows; j++){
			for(let k = 0; k < orig_innieouties; k++){
				let cell = new Cell(j, k, i);
				let cell_num = index_take_2(j, k, i, particular_num_cols, particular_num_rows, particular_num_innieouties);
				console.log("i: " + j + " j: " + k + " k:" + i);
				console.log("cell_num: " + cell_num);
				let grid_cell_num = index(i, j, k);
				console.log("i: " + i + " j: " + j + " k:" + k);
				console.log("grid_cell_num: " + grid_cell_num);
				
				//0-top, 1-right, 2-bottom, 3-left, 4-out, 5-in
				cell.walls[0] = grid[grid_cell_num].walls[4];
				cell.walls[1] = grid[grid_cell_num].walls[2];
				cell.walls[2] = grid[grid_cell_num].walls[5];
				cell.walls[3] = grid[grid_cell_num].walls[0];
				cell.walls[4] = grid[grid_cell_num].walls[3];
				cell.walls[5] = grid[grid_cell_num].walls[1];

				turn_head_to_right_grid_90[cell_num] = cell;
			}
		}
	}

	//add maze to all_maze_perspectives array
	all_maze_perspectives.push(turn_head_to_right_grid_90);

	//PERSPECTIVE 10
	console.log("PERSPECTIVE 10");
    //**turn head to the right, then top of head to the original bottom
	particular_num_rows = orig_rows;
	particular_num_cols = orig_innieouties; 
	particular_num_innieouties = orig_cols;
	for(let i = 0; i < orig_cols; i++){
		for(let j = 0; j < orig_rows; j++){
			for(let k = 0; k < orig_innieouties; k++){
				let cell = new Cell(k, orig_rows - j - 1, i);
				let cell_num = index_take_2(k, orig_rows - j - 1, i, particular_num_cols, particular_num_rows, particular_num_innieouties);
				console.log("i: " + k + " j: " + (orig_rows - j - 1) + " k:" + i);
				console.log("cell_num: " + cell_num);
				let grid_cell_num = index(i, j, k);
				console.log("i: " + i + " j: " + j + " k:" + k);
				console.log("grid_cell_num: " + grid_cell_num);
				
				//0-top, 1-right, 2-bottom, 3-left, 4-out, 5-in
				cell.walls[0] = grid[grid_cell_num].walls[2];
				cell.walls[1] = grid[grid_cell_num].walls[5];
				cell.walls[2] = grid[grid_cell_num].walls[0];
				cell.walls[3] = grid[grid_cell_num].walls[4];
				cell.walls[4] = grid[grid_cell_num].walls[3];
				cell.walls[5] = grid[grid_cell_num].walls[1];

				turn_head_to_right_grid_180[cell_num] = cell;
			}
		}
	}

	//add maze to all_maze_perspectives array
	all_maze_perspectives.push(turn_head_to_right_grid_180);

	//PERSPECTIVE 11
	console.log("PERSPECTIVE 11");
    //**turn head to the right, then top of head to the original back
    //all original orientations are top, right, bottom, left, out, in
	particular_num_rows = orig_innieouties;
	particular_num_cols = orig_rows; 
	particular_num_innieouties = orig_cols;
	for(let i = 0; i < orig_cols; i++){
		for(let j = 0; j < orig_rows; j++){
			for(let k = 0; k < orig_innieouties; k++){
				let cell = new Cell(orig_rows - j - 1, orig_innieouties - k - 1, i);
				let cell_num = index_take_2(orig_rows - j - 1, orig_innieouties - k - 1, i, particular_num_cols, particular_num_rows, particular_num_innieouties);
				console.log("i: " + (orig_rows - j - 1) + " j: " + (orig_innieouties - k - 1) + " k:" + i);
				console.log("cell_num: " + cell_num);
				let grid_cell_num = index(i, j, k);
				console.log("i: " + i + " j: " + j + " k:" + k);
				console.log("grid_cell_num: " + grid_cell_num);
				
				//0-top, 1-right, 2-bottom, 3-left, 4-out, 5-in
				cell.walls[0] = grid[grid_cell_num].walls[5];
				cell.walls[1] = grid[grid_cell_num].walls[0];
				cell.walls[2] = grid[grid_cell_num].walls[4];
				cell.walls[3] = grid[grid_cell_num].walls[2];
				cell.walls[4] = grid[grid_cell_num].walls[3];
				cell.walls[5] = grid[grid_cell_num].walls[1];

				turn_head_to_right_grid_270[cell_num] = cell;
			}
		}
	}

	//add maze to all_maze_perspectives array
	all_maze_perspectives.push(turn_head_to_right_grid_270);

	//PERSPECTIVE 12
	console.log("PERSPECTIVE 12");
	//turn head up
	particular_num_cols = orig_cols;
	particular_num_rows = orig_innieouties;
	particular_num_innieouties = orig_rows;
	for(let i = 0; i < particular_num_cols; i++){
		for(let j = 0; j < particular_num_rows; j++){
			for(let k = 0; k < particular_num_innieouties; k++){
				let cell = new Cell(i, j, k);
				let cell_num = index_take_2(i, j, k, particular_num_cols, particular_num_rows, particular_num_innieouties);
				console.log("i: " + i + " j: " + j + " k:" + k);
				console.log("cell_num: " + cell_num);
				let grid_cell_num = index(i, orig_rows - 1 - k, j);
				console.log("i: " + i + " j: " + (orig_rows - 1 - k) + " k:" + j);
				console.log("grid_cell_num: " + grid_cell_num);
				
				//0-top, 1-right, 2-bottom, 3-left, 4-out, 5-in
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
	
	//PERSPECTIVE 13
	console.log("PERSPECTIVE 13");
	//all original orientations are top, right, bottom, left, out, in
    //**turn head up, then top of head to the original right
	particular_num_rows = orig_cols;
	particular_num_cols = orig_innieouties; 
	particular_num_innieouties = orig_rows;
	for(let i = 0; i < orig_cols; i++){
		for(let j = 0; j < orig_rows; j++){
			for(let k = 0; k < orig_innieouties; k++){
				let cell = new Cell(k, orig_cols - i - 1, orig_rows - j - 1);
				let cell_num = index_take_2(k, orig_cols - i - 1, orig_rows - j - 1, particular_num_cols, particular_num_rows, particular_num_innieouties);
				console.log("i: " + k + " j: " + (orig_cols - i - 1) + " k:" + (orig_rows - j - 1));
				console.log("cell_num: " + cell_num);
				let grid_cell_num = index(i, j, k);
				console.log("i: " + i + " j: " + j + " k:" + k);
				console.log("grid_cell_num: " + grid_cell_num);
				
				//0-top, 1-right, 2-bottom, 3-left, 4-out, 5-in
				cell.walls[0] = grid[grid_cell_num].walls[1];
				cell.walls[1] = grid[grid_cell_num].walls[5];
				cell.walls[2] = grid[grid_cell_num].walls[3];
				cell.walls[3] = grid[grid_cell_num].walls[4];
				cell.walls[4] = grid[grid_cell_num].walls[2];
				cell.walls[5] = grid[grid_cell_num].walls[0];

				turn_head_up_grid_90[cell_num] = cell;
			}
		}
	}

	//add maze to all_maze_perspectives array
	all_maze_perspectives.push(turn_head_up_grid_90);

	//PERSPECTIVE 14
	console.log("PERSPECTIVE 14");
    //**turn head up, then top of head to the original back
    //all original orientations are top, right, bottom, left, out, in
	particular_num_rows = orig_innieouties;
	particular_num_cols = orig_cols; 
	particular_num_innieouties = orig_rows;
	for(let i = 0; i < orig_cols; i++){
		for(let j = 0; j < orig_rows; j++){
			for(let k = 0; k < orig_innieouties; k++){
				let cell = new Cell(orig_cols - i - 1, orig_innieouties - k - 1, orig_rows - j - 1);
				let cell_num = index_take_2(orig_cols - i - 1, orig_innieouties - k - 1, orig_rows - j - 1, particular_num_cols, particular_num_rows, particular_num_innieouties);
				console.log("i: " + (orig_cols - i - 1) + " j: " + (orig_innieouties - k - 1) + " k:" + (orig_rows - j - 1));
				console.log("cell_num: " + cell_num);
				let grid_cell_num = index(i, j, k);
				console.log("i: " + i + " j: " + j + " k:" + k);
				console.log("grid_cell_num: " + grid_cell_num);
				
				//0-top, 1-right, 2-bottom, 3-left, 4-out, 5-in
				cell.walls[0] = grid[grid_cell_num].walls[5];
				cell.walls[1] = grid[grid_cell_num].walls[3];
				cell.walls[2] = grid[grid_cell_num].walls[4];
				cell.walls[3] = grid[grid_cell_num].walls[1];
				cell.walls[4] = grid[grid_cell_num].walls[2];
				cell.walls[5] = grid[grid_cell_num].walls[0];

				turn_head_up_grid_180[cell_num] = cell;
			}
		}
	}

	//add maze to all_maze_perspectives array
	all_maze_perspectives.push(turn_head_up_grid_180);

	//PERSPECTIVE 15
	console.log("PERSPECTIVE 15");
    //**turn head up, then top of head to the original left
    //all original orientations are top, right, bottom, left, out, in
	particular_num_rows = orig_cols;
	particular_num_cols = orig_innieouties; 
	particular_num_innieouties = orig_rows;
	for(let i = 0; i < orig_cols; i++){
		for(let j = 0; j < orig_rows; j++){
			for(let k = 0; k < orig_innieouties; k++){
				let cell = new Cell(orig_innieouties - k - 1, i, orig_rows - j - 1);
				let cell_num = index_take_2(orig_innieouties - k - 1, i, orig_rows - j - 1, particular_num_cols, particular_num_rows, particular_num_innieouties);
				console.log("i: " + (orig_innieouties - k - 1) + " j: " + i + " k:" + (orig_rows - j - 1));
				console.log("cell_num: " + cell_num);
				let grid_cell_num = index(i, j, k);
				console.log("i: " + i + " j: " + j + " k:" + k);
				console.log("grid_cell_num: " + grid_cell_num);
				
				//0-top, 1-right, 2-bottom, 3-left, 4-out, 5-in
				cell.walls[0] = grid[grid_cell_num].walls[3];
				cell.walls[1] = grid[grid_cell_num].walls[4];
				cell.walls[2] = grid[grid_cell_num].walls[1];
				cell.walls[3] = grid[grid_cell_num].walls[5];
				cell.walls[4] = grid[grid_cell_num].walls[2];
				cell.walls[5] = grid[grid_cell_num].walls[0];

				turn_head_up_grid_270[cell_num] = cell;
			}
		}
	}

	//add maze to all_maze_perspectives array
	all_maze_perspectives.push(turn_head_up_grid_270);

	//PERSPECTIVE 16
	console.log("PERSPECTIVE 16");
	//turn head down
	particular_num_cols = orig_cols;
	particular_num_rows = orig_innieouties;
	particular_num_innieouties = orig_rows;
	for(let i = 0; i < particular_num_cols; i++){
		for(let j = 0; j < particular_num_rows; j++){
			for(let k = 0; k < particular_num_innieouties; k++){
				let cell = new Cell(i, j, k);
				let cell_num = index_take_2(i, j, k, particular_num_cols, particular_num_rows, particular_num_innieouties);
				console.log("i: " + i + " j: " + j + " k:" + k);
				console.log("cell_num: " + cell_num);
				let grid_cell_num = index(i, k, orig_innieouties - j - 1);
				console.log("i: " + i + " j: " + k + " k:" + (orig_innieouties - j - 1));
				console.log("grid_cell_num: " + grid_cell_num);
				
				//0-top, 1-right, 2-bottom, 3-left, 4-out, 5-in
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

	//PERSPECTIVE 17
	console.log("PERSPECTIVE 17");
    //**turn head down, then top of head to the original right
    //all original orientations are top, right, bottom, left, out, in
	particular_num_rows = orig_cols;
	particular_num_cols = orig_innieouties; 
	particular_num_innieouties = orig_rows;
	for(let i = 0; i < orig_cols; i++){
		for(let j = 0; j < orig_rows; j++){
			for(let k = 0; k < orig_innieouties; k++){
				let cell = new Cell(orig_innieouties - k - 1, orig_cols - i - 1, j);
				let cell_num = index_take_2(orig_innieouties - k - 1, orig_cols - i - 1, j, particular_num_cols, particular_num_rows, particular_num_innieouties);
				console.log("i: " + (orig_innieouties - k - 1) + " j: " + (orig_cols - i - 1) + " k:" + j);
				console.log("cell_num: " + cell_num);
				let grid_cell_num = index(i, j, k);
				console.log("i: " + i + " j: " + j + " k:" + k);
				console.log("grid_cell_num: " + grid_cell_num);
				
				//0-top, 1-right, 2-bottom, 3-left, 4-out, 5-in
				cell.walls[0] = grid[grid_cell_num].walls[1];
				cell.walls[1] = grid[grid_cell_num].walls[4];
				cell.walls[2] = grid[grid_cell_num].walls[3];
				cell.walls[3] = grid[grid_cell_num].walls[5];
				cell.walls[4] = grid[grid_cell_num].walls[0];
				cell.walls[5] = grid[grid_cell_num].walls[2];

				turn_head_down_grid_90[cell_num] = cell;
			}
		}
	}

	//add maze to all_maze_perspectives array
	all_maze_perspectives.push(turn_head_down_grid_90);

	//PERSPECTIVE 18
	console.log("PERSPECTIVE 18");
    //**turn head down, then top of head to the original front
    //all original orientations are top, right, bottom, left, out, in
	particular_num_rows = orig_innieouties;
	particular_num_cols = orig_cols; 
	particular_num_innieouties = orig_rows;
	for(let i = 0; i < orig_cols; i++){
		for(let j = 0; j < orig_rows; j++){
			for(let k = 0; k < orig_innieouties; k++){
				let cell = new Cell(orig_cols - i - 1, k, j);
				let cell_num = index_take_2(orig_cols - i - 1, k, j, particular_num_cols, particular_num_rows, particular_num_innieouties);
				console.log("i: " + (orig_cols - i - 1) + " j: " + k + " k:" + j);
				console.log("cell_num: " + cell_num);
				let grid_cell_num = index(i, j, k);
				console.log("i: " + i + " j: " + j + " k:" + k);
				console.log("grid_cell_num: " + grid_cell_num);
				
				//0-top, 1-right, 2-bottom, 3-left, 4-out, 5-in
				cell.walls[0] = grid[grid_cell_num].walls[4];
				cell.walls[1] = grid[grid_cell_num].walls[3];
				cell.walls[2] = grid[grid_cell_num].walls[5];
				cell.walls[3] = grid[grid_cell_num].walls[1];
				cell.walls[4] = grid[grid_cell_num].walls[0];
				cell.walls[5] = grid[grid_cell_num].walls[2];

				turn_head_down_grid_180[cell_num] = cell;
			}
		}
	}

	//add maze to all_maze_perspectives array
	all_maze_perspectives.push(turn_head_down_grid_180);

	//PERSPECTIVE 19
	console.log("PERSPECTIVE 19");
    //**turn head down, then top of head to the original left
    //all original orientations are top, right, bottom, left, out, in
	particular_num_rows = orig_cols;
	particular_num_cols = orig_innieouties; 
	particular_num_innieouties = orig_rows;
	for(let i = 0; i < orig_cols; i++){
		for(let j = 0; j < orig_rows; j++){
			for(let k = 0; k < orig_innieouties; k++){
				let cell = new Cell(k, i, j);
				let cell_num = index_take_2(k, i, j, particular_num_cols, particular_num_rows, particular_num_innieouties);
				console.log("i: " + k + " j: " + i + " k:" + j);
				console.log("cell_num: " + cell_num);
				let grid_cell_num = index(i, j, k);
				console.log("i: " + i + " j: " + j + " k:" + k);
				console.log("grid_cell_num: " + grid_cell_num);
				
				//0-top, 1-right, 2-bottom, 3-left, 4-out, 5-in
				cell.walls[0] = grid[grid_cell_num].walls[3];
				cell.walls[1] = grid[grid_cell_num].walls[5];
				cell.walls[2] = grid[grid_cell_num].walls[1];
				cell.walls[3] = grid[grid_cell_num].walls[4];
				cell.walls[4] = grid[grid_cell_num].walls[0];
				cell.walls[5] = grid[grid_cell_num].walls[2];

				turn_head_down_grid_270[cell_num] = cell;
			}
		}
	}

	//add maze to all_maze_perspectives array
	all_maze_perspectives.push(turn_head_down_grid_270);

	//PERSPECTIVE 20
	console.log("PERSPECTIVE 20");
	//turn head backward (turn around)
	particular_num_cols = orig_cols;
	particular_num_rows = orig_rows;
	particular_num_innieouties = orig_innieouties;
	for(let i = 0; i < particular_num_cols; i++){
		for(let j = 0; j < particular_num_rows; j++){
			for(let k = 0; k < particular_num_innieouties; k++){
				let cell = new Cell(i, j, k);
				let cell_num = index_take_2(i, j, k, particular_num_cols, particular_num_rows, particular_num_innieouties);
				console.log("i: " + i + " j: " + j + " k:" + k);
				console.log("cell_num: " + cell_num);
				let grid_cell_num = index(orig_cols - 1 - i, j, orig_innieouties - 1 - k);
				console.log("i: " + (orig_cols - 1 - i) + " j: " + j + " k:" + (orig_innieouties - 1 - k));
				console.log("grid_cell_num: " + grid_cell_num);
				
				//0-top, 1-right, 2-bottom, 3-left, 4-out, 5-in
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

	//PERSPECTIVE 21
	console.log("PERSPECTIVE 21");
    //**turn head back, then top of head to the original left
    //all original orientations are top, right, bottom, left, out, in
	particular_num_rows = orig_cols;
	particular_num_cols = orig_rows; 
	particular_num_innieouties = orig_innieouties;
	for(let i = 0; i < orig_cols; i++){
		for(let j = 0; j < orig_rows; j++){
			for(let k = 0; k < orig_innieouties; k++){
				//???
				let cell = new Cell(j, i, orig_innieouties - k - 1);
				let cell_num = index_take_2(j, i, orig_innieouties - k - 1, particular_num_cols, particular_num_rows, particular_num_innieouties);
				console.log("i: " + j + " j: " + i + " k:" + (orig_innieouties - k - 1));
				console.log("cell_num: " + cell_num);
				let grid_cell_num = index(i, j, k);
				console.log("i: " + i + " j: " + j + " k:" + k);
				console.log("grid_cell_num: " + grid_cell_num);
				
				//0-top, 1-right, 2-bottom, 3-left, 4-out, 5-in
				cell.walls[0] = grid[grid_cell_num].walls[3];
				cell.walls[1] = grid[grid_cell_num].walls[2];
				cell.walls[2] = grid[grid_cell_num].walls[1];
				cell.walls[3] = grid[grid_cell_num].walls[0];
				cell.walls[4] = grid[grid_cell_num].walls[5];
				cell.walls[5] = grid[grid_cell_num].walls[4];

				turn_head_backward_grid_90[cell_num] = cell;
			}
		}
	}

	//add maze to all_maze_perspectives array
	all_maze_perspectives.push(turn_head_backward_grid_90);

	//PERSPECTIVE 22
	console.log("PERSPECTIVE 22");
    //**turn head back, then top of head to the original bottom
    //all original orientations are top, right, bottom, left, out, in
	particular_num_rows = orig_rows;
	particular_num_cols = orig_cols; 
	particular_num_innieouties = orig_innieouties;
	for(let i = 0; i < orig_cols; i++){
		for(let j = 0; j < orig_rows; j++){
			for(let k = 0; k < orig_innieouties; k++){
				let cell = new Cell(i, orig_rows - j - 1, orig_innieouties - k - 1);
				let cell_num = index_take_2(i, orig_rows - j - 1, orig_innieouties - k - 1, particular_num_cols, particular_num_rows, particular_num_innieouties);
				console.log("i: " + i + " j: " + (orig_rows - j - 1) + " k:" + (orig_innieouties - k - 1));
				console.log("cell_num: " + cell_num);
				let grid_cell_num = index(i, j, k);
				console.log("i: " + i + " j: " + j + " k:" + k);
				console.log("grid_cell_num: " + grid_cell_num);
				
				//0-top, 1-right, 2-bottom, 3-left, 4-out, 5-in
				cell.walls[0] = grid[grid_cell_num].walls[2];
				cell.walls[1] = grid[grid_cell_num].walls[1];
				cell.walls[2] = grid[grid_cell_num].walls[0];
				cell.walls[3] = grid[grid_cell_num].walls[3];
				cell.walls[4] = grid[grid_cell_num].walls[5];
				cell.walls[5] = grid[grid_cell_num].walls[4];

				turn_head_backward_grid_180[cell_num] = cell;
			}
		}
	}

	//add maze to all_maze_perspectives array
	all_maze_perspectives.push(turn_head_backward_grid_180);

	//PERSPECTIVE 23
	console.log("PERSPECTIVE 23");
    //**turn head back, then top of head to the original right
    //all original orientations are top, right, bottom, left, out, in
	particular_num_rows = orig_cols;
	particular_num_cols = orig_rows; 
	particular_num_innieouties = orig_innieouties;
	for(let i = 0; i < orig_cols; i++){
		for(let j = 0; j < orig_rows; j++){
			for(let k = 0; k < orig_innieouties; k++){
				let cell = new Cell(orig_rows - j - 1, orig_cols - i - 1, orig_innieouties - k - 1);
				let cell_num = index_take_2(orig_rows - j - 1, orig_cols - i - 1, orig_innieouties - k - 1, particular_num_cols, particular_num_rows, particular_num_innieouties);
				console.log("i: " + (orig_rows - j - 1) + " j: " + (orig_cols - i - 1) + " k:" + (orig_innieouties - k - 1));
				console.log("cell_num: " + cell_num);
				let grid_cell_num = index(i, j, k);
				console.log("i: " + i + " j: " + j + " k:" + k);
				console.log("grid_cell_num: " + grid_cell_num);
				
				//0-top, 1-right, 2-bottom, 3-left, 4-out, 5-in
				cell.walls[0] = grid[grid_cell_num].walls[1];
				cell.walls[1] = grid[grid_cell_num].walls[0];
				cell.walls[2] = grid[grid_cell_num].walls[3];
				cell.walls[3] = grid[grid_cell_num].walls[2];
				cell.walls[4] = grid[grid_cell_num].walls[5];
				cell.walls[5] = grid[grid_cell_num].walls[4];

				turn_head_backward_grid_270[cell_num] = cell;
			}
		}
	}

	//add maze to all_maze_perspectives array
	all_maze_perspectives.push(turn_head_backward_grid_270);
	
	//specify start cell COULD BE ANY CELL
	//NEED TO DETERMINE START AND FINISH CELLS OF MAZE
	current_cell = all_maze_perspectives[current_maze_perspective][start_index];
	current_index = start_index;


	start = true; //just for debugging to not run through showing all the maze planes at the beginning
	//draw each maze plane for player to see
	//letsgetitstarted = setInterval(show_one_maze_plane, 5000); //uncomment to show all maze perspectives before starting	
	letsgetitstarted = setInterval(show_one_maze_plane, 100); //uncomment to show all maze perspectives before starting	
}

function draw() {
	if(!start){
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
var num_tot_possible_rotations = 24;
function show_one_maze_plane(){
	console.log("global_maze_plane_counter: " + global_maze_plane_counter);
	set_particular_num_cols_rows_innieouties(global_perspective_counter);	
	let num_cells_in_this_particular_plane = particular_num_cols * particular_num_rows;
	if(global_maze_plane_counter < particular_num_innieouties && global_perspective_counter < num_tot_possible_rotations){
		background(51);
		let stopping_point = global_cell_index_counter + num_cells_in_this_particular_plane;
		for(let i = global_cell_index_counter; i < stopping_point; i++){
			all_maze_perspectives[global_perspective_counter][i].show();
			global_cell_index_counter++;
		}
		
		global_maze_plane_counter++;
		if(global_maze_plane_counter == particular_num_innieouties){
			if(global_perspective_counter < num_tot_possible_rotations){
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
	//**original facing perspective, then top of head to the original right
	else if(perspective_counter == 1){
		particular_num_rows = orig_cols;
		particular_num_cols = orig_rows; 
		particular_num_innieouties = orig_innieouties;
	}
    //**original facing perspective, then top of head to the original bottom
	else if(perspective_counter == 2){
		particular_num_rows = orig_rows;
		particular_num_cols = orig_cols; 
		particular_num_innieouties = orig_innieouties;
	}
    //**original facing perspective, then top of head to the original left
	else if(perspective_counter == 3){
		particular_num_rows = orig_cols;
		particular_num_cols = orig_rows; 
		particular_num_innieouties = orig_innieouties;
	}
	////turn head to left
	else if(perspective_counter == 4){
		particular_num_cols = orig_innieouties; 
		particular_num_rows = orig_rows;
		particular_num_innieouties = orig_cols;	
	}
	//**turn head to the left, then top of head to the original back
	else if(perspective_counter == 5){
		particular_num_rows = orig_innieouties;
		particular_num_cols = orig_rows; 
		particular_num_innieouties = orig_cols;
	}
    //**turn head to the left, then top of head to the original bottom
	else if(perspective_counter == 6){
		particular_num_rows = orig_rows;
		particular_num_cols = orig_innieouties; 
		particular_num_innieouties = orig_cols;
	}
    //**turn head to the left, then top of head to the original front
	else if(perspective_counter == 7){
		particular_num_rows = orig_innieouties;
		particular_num_cols = orig_rows; 
		particular_num_innieouties = orig_cols;
	}
	//turn head to the right
	else if(perspective_counter == 8){
		particular_num_cols = orig_innieouties; 
		particular_num_rows = orig_rows;
		particular_num_innieouties = orig_cols;	
	}
    //**turn head to the right, then top of head to the original front
	else if(perspective_counter == 9){
		particular_num_rows = orig_innieouties;
		particular_num_cols = orig_rows; 
		particular_num_innieouties = orig_cols;
	}
    //**turn head to the right, then top of head to the original bottom
	else if(perspective_counter == 10){
		particular_num_rows = orig_rows;
		particular_num_cols = orig_innieouties; 
		particular_num_innieouties = orig_cols;
	}
    //**turn head to the right, then top of head to the original back
	else if(perspective_counter == 11){
		particular_num_rows = orig_innieouties;
		particular_num_cols = orig_rows; 
		particular_num_innieouties = orig_cols;
	}
	//turn head up
	else if(perspective_counter == 12){
		particular_num_cols = orig_cols; 
		particular_num_rows = orig_innieouties;
		particular_num_innieouties = orig_rows;	
	}
    //**turn head up, then top of head to the original right
	else if(perspective_counter == 13){
		particular_num_rows = orig_cols;
		particular_num_cols = orig_innieouties; 
		particular_num_innieouties = orig_rows;
	}
    //**turn head up, then top of head to the original back
	else if(perspective_counter == 14){
		particular_num_rows = orig_innieouties;
		particular_num_cols = orig_cols; 
		particular_num_innieouties = orig_rows;
	}
    //**turn head up, then top of head to the original left
	else if(perspective_counter == 15){
		particular_num_rows = orig_cols;
		particular_num_cols = orig_innieouties; 
		particular_num_innieouties = orig_rows;
	}
	//turn head down
	else if(perspective_counter == 16){
		particular_num_cols = orig_cols; 
		particular_num_rows = orig_innieouties;
		particular_num_innieouties = orig_rows;	
	}
    //**turn head down, then top of head to the original right
	else if(perspective_counter == 17){
		particular_num_rows = orig_cols;
		particular_num_cols = orig_innieouties; 
		particular_num_innieouties = orig_rows;
	}
    //**turn head down, then top of head to the original front
	else if(perspective_counter == 18){
		particular_num_rows = orig_innieouties;
		particular_num_cols = orig_cols; 
		particular_num_innieouties = orig_rows;
	}
    //**turn head down, then top of head to the original left
	else if(perspective_counter == 19){
		particular_num_rows = orig_cols;
		particular_num_cols = orig_innieouties; 
		particular_num_innieouties = orig_rows;
	}
	//turn head backward (turn around)
	else if(perspective_counter == 20){
		particular_num_cols = orig_cols; 
		particular_num_rows = orig_rows;
		particular_num_innieouties = orig_innieouties;	
	}
	//**turn head back, then top of head to the original left
	else if(perspective_counter == 21){
		particular_num_rows = orig_cols;
		particular_num_cols = orig_rows; 
		particular_num_innieouties = orig_innieouties;
	}
    //**turn head back, then top of head to the original bottom
	else if(perspective_counter == 22){
		particular_num_rows = orig_rows;
		particular_num_cols = orig_cols; 
		particular_num_innieouties = orig_innieouties;
	}
    //**turn head back, then top of head to the original right
	else if(perspective_counter == 23){
		particular_num_rows = orig_cols;
		particular_num_cols = orig_rows; 
		particular_num_innieouties = orig_innieouties;
	}
}

//KEYBOARD CONTROLS
//check boundaries
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

//for p5 the name of the function must be keyPressed to work
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

	//SHIFT for in the out direction of the maze (like a door or firemans pole)
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
	//ENTER for in the in direction of the maze (like a door or firemans pole)
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

	//keys for player to rotate the maze each possible way
	if(keyCode === 65){ //key a - turn head to left
		console.log("a - turn head to left");
		console.log("current_maze_perspective: " + current_maze_perspective);
		console.log("current goal_index: " + goal_index);
		console.log("current_index: ", current_index);

		//function to take current_maze_perspective, current_index or goal_index, new current_maze_perspective
		//and determines new current_index or goal_index for the new perspective
		let current_index_coordinates = coordinates_from_index(current_index, particular_num_cols, particular_num_rows, particular_num_innieouties);
		let goal_index_coordinates = coordinates_from_index(goal_index, particular_num_cols, particular_num_rows, particular_num_innieouties);

		//coordinates are cols (x), rows (y), innieouties (z)
		console.log("current_index_coordinates:");
		console.log(current_index_coordinates);
		console.log("goal_index_coordinates:");
		console.log(goal_index_coordinates);

		//for a left head turn
		//determine new perspective_counter value 
		let new_perspective_counter_value = -1;
		switch(current_maze_perspective){
			case 0:
				new_perspective_counter_value = 4;
				break;
			case 1:
				new_perspective_counter_value = 13;
				break;
			case 2:
				new_perspective_counter_value = 10;
				break;
			case 3:
				new_perspective_counter_value = 19;
				break;
			case 4:
				new_perspective_counter_value = 20;
				break;
			case 5:
				new_perspective_counter_value = 14;
				break;
			case 6:
				new_perspective_counter_value = 2;
				break;
			case 7:
				new_perspective_counter_value = 18;
				break;
			case 8:
				new_perspective_counter_value = 0;
				break;
			case 9:
				new_perspective_counter_value = 12;
				break;
			case 10:
				new_perspective_counter_value = 22;
				break;
			case 11:
				new_perspective_counter_value = 16;
				break;
			case 12:
				new_perspective_counter_value = 7;
				break;
			case 13:
				new_perspective_counter_value = 23;
				break;
			case 14:
				new_perspective_counter_value = 11;
				break;
			case 15:
				new_perspective_counter_value = 3;
				break;
			case 16:
				new_perspective_counter_value = 5;
				break;
			case 17:
				new_perspective_counter_value = 1;
				break;
			case 18:
				new_perspective_counter_value = 9;
				break;
			case 19:
				new_perspective_counter_value = 21;
				break;
			case 20:
				new_perspective_counter_value = 8;
				break;
			case 21:
				new_perspective_counter_value = 15;
				break;
			case 22:
				new_perspective_counter_value = 6;
				break;
			case 23:
				new_perspective_counter_value = 17;
				break;
			default:
				console.log("turn head left something went wrong");
				new_perspective_counter_value = -1;	
		}

		console.log("old current_maze_perspective: " + current_maze_perspective);
		console.log("new_perspective_counter_value: " + new_perspective_counter_value);
		
		console.log("current_maze_plane: " + current_maze_plane); 

		//now determine new current_index
		let new_perspective_maze_plane = particular_num_cols - current_index_coordinates[0] - 1;
		console.log("new_perspective_maze_plane: " + new_perspective_maze_plane); 
		//the goal will not necessarily be in the new_perspective_maze_plane, need to account for its relative plane position
		let new_goal_plane = particular_num_cols - goal_index_coordinates[0] - 1; //the column that the goal cell is in is the new maze plane as you turn to the right 
		console.log("new_goal_plane: " + new_goal_plane);

		//go ahead and set new set_particular_num_cols_rows_innieouties to new perspective
		current_maze_perspective = new_perspective_counter_value;
		set_particular_num_cols_rows_innieouties(current_maze_perspective);

		let cell_index_in_new_perspective = (new_perspective_maze_plane * particular_num_cols * particular_num_rows) + (current_index_coordinates[1] * particular_num_cols) + current_index_coordinates[2];
		//do the same thing with the goal index
		let goal_index_in_new_perspective = (new_goal_plane * particular_num_cols * particular_num_rows) + (goal_index_coordinates[1] * particular_num_cols) + goal_index_coordinates[2];
		console.log("cell_index_in_new_perspective: " + cell_index_in_new_perspective);
		console.log("goal_index_in_new_perspective: " + goal_index_in_new_perspective);

		current_maze_plane = new_perspective_maze_plane;
		current_index = cell_index_in_new_perspective;
		current_cell = all_maze_perspectives[current_maze_perspective][current_index];	

		goal_index = goal_index_in_new_perspective;

		console.log("current_index_coordinates:");
		console.log(coordinates_from_index(current_index, particular_num_cols, particular_num_rows, particular_num_innieouties));
		console.log("goal_index_coordinates:");
		console.log(coordinates_from_index(goal_index, particular_num_cols, particular_num_rows, particular_num_innieouties));

	}

	if(keyCode === 68){ //key d - turn head to right
		console.log("d - turn head to right");
		console.log("current_maze_perspective: " + current_maze_perspective);
		console.log("current goal_index: " + goal_index);
		console.log("current_index: ", current_index);

		//function to take current_maze_perspective, current_index or goal_index, new current_maze_perspective
		//and determines new current_index or goal_index for the new perspective
		let current_index_coordinates = coordinates_from_index(current_index, particular_num_cols, particular_num_rows, particular_num_innieouties);
		let goal_index_coordinates = coordinates_from_index(goal_index, particular_num_cols, particular_num_rows, particular_num_innieouties);

		//coordinates are cols (x), rows (y), innieouties (z)
		console.log("current_index_coordinates:");
		console.log(current_index_coordinates);
		console.log("goal_index_coordinates:");
		console.log(goal_index_coordinates);

		//for a right head turn
		//determine new perspective_counter value 
		let new_perspective_counter_value = -1;
		switch(current_maze_perspective){
			case 0:
				new_perspective_counter_value = 8;
				break;
			case 1:
				new_perspective_counter_value = 17;
				break;
			case 2:
				new_perspective_counter_value = 6;
				break;
			case 3:
				new_perspective_counter_value = 15;
				break;
			case 4:
				new_perspective_counter_value = 0;
				break;
			case 5:
				new_perspective_counter_value = 16;
				break;
			case 6:
				new_perspective_counter_value = 22;
				break;
			case 7:
				new_perspective_counter_value = 12;
				break;
			case 8:
				new_perspective_counter_value = 20;
				break;
			case 9:
				new_perspective_counter_value = 18;
				break;
			case 10:
				new_perspective_counter_value = 2;
				break;
			case 11:
				new_perspective_counter_value = 14;
				break;
			case 12:
				new_perspective_counter_value = 9;
				break;
			case 13:
				new_perspective_counter_value = 1;
				break;
			case 14:
				new_perspective_counter_value = 5;
				break;
			case 15:
				new_perspective_counter_value = 21;
				break;
			case 16:
				new_perspective_counter_value = 11;
				break;
			case 17:
				new_perspective_counter_value = 23;
				break;
			case 18:
				new_perspective_counter_value = 7;
				break;
			case 19:
				new_perspective_counter_value = 3;
				break;
			case 20:
				new_perspective_counter_value = 4;
				break;
			case 21:
				new_perspective_counter_value = 19;
				break;
			case 22:
				new_perspective_counter_value = 10;
				break;
			case 23:
				new_perspective_counter_value = 13;
				break;
			default:
				console.log("turn head left something went wrong");
				new_perspective_counter_value = -1;	
		}

		console.log("old current_maze_perspective: " + current_maze_perspective);
		console.log("new_perspective_counter_value: " + new_perspective_counter_value);
		
		console.log("current_maze_plane: " + current_maze_plane); 
		//now determine new current_index
		let new_perspective_maze_plane = current_index_coordinates[0]; //the column that you are in is the new maze plane as you turn to the right
		console.log("new_perspective_maze_plane: " + new_perspective_maze_plane); 
		//the goal will not necessarily be in the new_perspective_maze_plane, need to account for its relative plane position
		let new_goal_plane = goal_index_coordinates[0]; //the column that the goal cell is in is the new maze plane as you turn to the right 
		console.log("new_goal_plane: " + new_goal_plane);

		//go ahead and set new set_particular_num_cols_rows_innieouties to new perspective
		current_maze_perspective = new_perspective_counter_value;
		set_particular_num_cols_rows_innieouties(current_maze_perspective);
		
		let cell_index_in_new_perspective = (new_perspective_maze_plane * particular_num_cols * particular_num_rows) + (current_index_coordinates[1] * particular_num_cols) + (particular_num_cols - current_index_coordinates[2] - 1);
		//do the same thing with the goal index
		let goal_index_in_new_perspective = (new_goal_plane * particular_num_cols * particular_num_rows) + (goal_index_coordinates[1] * particular_num_cols) + (particular_num_cols - goal_index_coordinates[2] - 1);
		console.log("cell_index_in_new_perspective: " + cell_index_in_new_perspective);
		console.log("goal_index_in_new_perspective: " + goal_index_in_new_perspective);
		
		current_maze_plane = new_perspective_maze_plane;
		current_index = cell_index_in_new_perspective;
		current_cell = all_maze_perspectives[current_maze_perspective][current_index];	
		goal_index = goal_index_in_new_perspective;

		console.log("current_index_coordinates:");
		console.log(coordinates_from_index(current_index, particular_num_cols, particular_num_rows, particular_num_innieouties));
		console.log("goal_index_coordinates:");
		console.log(coordinates_from_index(goal_index, particular_num_cols, particular_num_rows, particular_num_innieouties));

	}

	if(keyCode === 87){ //key w - turn head up
		console.log("w - turn head up");
		console.log("current_maze_perspective: " + current_maze_perspective);
		console.log("current goal_index: " + goal_index);
		console.log("current_index: ", current_index);

		//function to take current_maze_perspective, current_index or goal_index, new current_maze_perspective
		//and determines new current_index or goal_index for the new perspective
		let current_index_coordinates = coordinates_from_index(current_index, particular_num_cols, particular_num_rows, particular_num_innieouties);
		let goal_index_coordinates = coordinates_from_index(goal_index, particular_num_cols, particular_num_rows, particular_num_innieouties);

		//coordinates are cols (x), rows (y), innieouties (z)
		console.log("current_index_coordinates:");
		console.log(current_index_coordinates);
		console.log("goal_index_coordinates:");
		console.log(goal_index_coordinates);

		//for a head up turn
		//determine new perspective_counter value 
		let new_perspective_counter_value = -1;
		switch(current_maze_perspective){
			case 0:
				new_perspective_counter_value = 12;
				break;
			case 1:
				new_perspective_counter_value = 9;
				break;
			case 2:
				new_perspective_counter_value = 18;
				break;
			case 3:
				new_perspective_counter_value = 7;
				break;
			case 4:
				new_perspective_counter_value = 13;
				break;
			case 5:
				new_perspective_counter_value = 1;
				break;
			case 6:
				new_perspective_counter_value = 17;
				break;
			case 7:
				new_perspective_counter_value = 23;
				break;
			case 8:
				new_perspective_counter_value = 15;
				break;
			case 9:
				new_perspective_counter_value = 21;
				break;
			case 10:
				new_perspective_counter_value = 19;
				break;
			case 11:
				new_perspective_counter_value = 3;
				break;
			case 12:
				new_perspective_counter_value = 22;
				break;
			case 13:
				new_perspective_counter_value = 10;
				break;
			case 14:
				new_perspective_counter_value = 2;
				break;
			case 15:
				new_perspective_counter_value = 6;
				break;
			case 16:
				new_perspective_counter_value = 0;
				break;
			case 17:
				new_perspective_counter_value = 8;
				break;
			case 18:
				new_perspective_counter_value = 20;
				break;
			case 19:
				new_perspective_counter_value = 4;
				break;
			case 20:
				new_perspective_counter_value = 14;
				break;
			case 21:
				new_perspective_counter_value = 5;
				break;
			case 22:
				new_perspective_counter_value = 16;
				break;
			case 23:
				new_perspective_counter_value = 11;
				break;
			default:
				console.log("turn head left something went wrong");
				new_perspective_counter_value = -1;	
		}

		console.log("old current_maze_perspective: " + current_maze_perspective);
		console.log("new_perspective_counter_value: " + new_perspective_counter_value);

		console.log("current_maze_plane: " + current_maze_plane); 
		//now determine new current_index
		let new_perspective_maze_plane = particular_num_rows - current_index_coordinates[1] - 1;
		console.log("new_perspective_maze_plane: " + new_perspective_maze_plane); 
		//the goal will not necessarily be in the new_perspective_maze_plane, need to account for its relative plane position
		let new_goal_plane = particular_num_rows - goal_index_coordinates[1] - 1;
		console.log("new_goal_plane: " + new_goal_plane);

		//go ahead and set new set_particular_num_cols_rows_innieouties to new perspective
		current_maze_perspective = new_perspective_counter_value;
		set_particular_num_cols_rows_innieouties(current_maze_perspective);

		let cell_index_in_new_perspective = (new_perspective_maze_plane * particular_num_cols * particular_num_rows) + (current_index_coordinates[2] * particular_num_cols) + current_index_coordinates[0];
		//do the same thing with the goal index
		let goal_index_in_new_perspective = (new_goal_plane * particular_num_cols * particular_num_rows) + (goal_index_coordinates[2] * particular_num_cols) + goal_index_coordinates[0];
		console.log("cell_index_in_new_perspective: " + cell_index_in_new_perspective);
		console.log("goal_index_in_new_perspective: " + goal_index_in_new_perspective);

		current_maze_plane = new_perspective_maze_plane;
		current_index = cell_index_in_new_perspective;
		current_cell = all_maze_perspectives[current_maze_perspective][current_index];	
		goal_index = goal_index_in_new_perspective;

		console.log("current_index_coordinates:");
		console.log(coordinates_from_index(current_index, particular_num_cols, particular_num_rows, particular_num_innieouties));
		console.log("goal_index_coordinates:");
		console.log(coordinates_from_index(goal_index, particular_num_cols, particular_num_rows, particular_num_innieouties));

	}
	
	if(keyCode === 83){ //key s - turn head down
		console.log("s - turn head down");
		console.log("current_maze_perspective: " + current_maze_perspective);
		console.log("current goal_index: " + goal_index);
		console.log("current_index: ", current_index);

		//function to take current_maze_perspective, current_index or goal_index, new current_maze_perspective
		//and determines new current_index or goal_index for the new perspective
		let current_index_coordinates = coordinates_from_index(current_index, particular_num_cols, particular_num_rows, particular_num_innieouties);
		let goal_index_coordinates = coordinates_from_index(goal_index, particular_num_cols, particular_num_rows, particular_num_innieouties);

		//coordinates are cols (x), rows (y), innieouties (z)
		console.log("current_index_coordinates:");
		console.log(current_index_coordinates);
		console.log("goal_index_coordinates:");
		console.log(goal_index_coordinates);

		//for a head down turn
		//determine new perspective_counter value 
		let new_perspective_counter_value = -1;
		switch(current_maze_perspective){
			case 0:
				new_perspective_counter_value = 16;
				break;
			case 1:
				new_perspective_counter_value = 5;
				break;
			case 2:
				new_perspective_counter_value = 14;
				break;
			case 3:
				new_perspective_counter_value = 11;
				break;
			case 4:
				new_perspective_counter_value = 19;
				break;
			case 5:
				new_perspective_counter_value = 21;
				break;
			case 6:
				new_perspective_counter_value = 15;
				break;
			case 7:
				new_perspective_counter_value = 3;
				break;
			case 8:
				new_perspective_counter_value = 17;
				break;
			case 9:
				new_perspective_counter_value = 1;
				break;
			case 10:
				new_perspective_counter_value = 13;
				break;
			case 11:
				new_perspective_counter_value = 23;
				break;
			case 12:
				new_perspective_counter_value = 0;
				break;
			case 13:
				new_perspective_counter_value = 4;
				break;
			case 14:
				new_perspective_counter_value = 20;
				break;
			case 15:
				new_perspective_counter_value = 8;
				break;
			case 16:
				new_perspective_counter_value = 22;
				break;
			case 17:
				new_perspective_counter_value = 6;
				break;
			case 18:
				new_perspective_counter_value = 2;
				break;
			case 19:
				new_perspective_counter_value = 10;
				break;
			case 20:
				new_perspective_counter_value = 18;
				break;
			case 21:
				new_perspective_counter_value = 9;
				break;
			case 22:
				new_perspective_counter_value = 12;
				break;
			case 23:
				new_perspective_counter_value = 7;
				break;
			default:
				console.log("turn head left something went wrong");
				new_perspective_counter_value = -1;	
		}

		console.log("old current_maze_perspective: " + current_maze_perspective);
		console.log("new_perspective_counter_value: " + new_perspective_counter_value);

		console.log("current_maze_plane: " + current_maze_plane); 
		//now determine new current_index
		let new_perspective_maze_plane = current_index_coordinates[1]; //current row # becomes next maze plane
		console.log("new_perspective_maze_plane: " + new_perspective_maze_plane); 
		//the goal will not necessarily be in the new_perspective_maze_plane, need to account for its relative plane position
		let new_goal_plane = goal_index_coordinates[1]; //current row # becomes next maze plane
		console.log("new_goal_plane: " + new_goal_plane);

		//go ahead and set new set_particular_num_cols_rows_innieouties to new perspective
		current_maze_perspective = new_perspective_counter_value;
		set_particular_num_cols_rows_innieouties(current_maze_perspective);

		let cell_index_in_new_perspective = (new_perspective_maze_plane * particular_num_cols * particular_num_rows) + ((particular_num_rows - current_index_coordinates[2] - 1) * particular_num_cols) + current_index_coordinates[0];
		//do the same thing with the goal index
		let goal_index_in_new_perspective = (new_goal_plane * particular_num_cols * particular_num_rows) + ((particular_num_rows - goal_index_coordinates[2] - 1) * particular_num_cols) + goal_index_coordinates[0];
		console.log("cell_index_in_new_perspective: " + cell_index_in_new_perspective);
		console.log("goal_index_in_new_perspective: " + goal_index_in_new_perspective);

		current_maze_plane = new_perspective_maze_plane;
		current_index = cell_index_in_new_perspective;
		current_cell = all_maze_perspectives[current_maze_perspective][current_index];	
		goal_index = goal_index_in_new_perspective;

		console.log("current_index_coordinates:");
		console.log(coordinates_from_index(current_index, particular_num_cols, particular_num_rows, particular_num_innieouties));
		console.log("goal_index_coordinates:");
		console.log(coordinates_from_index(goal_index, particular_num_cols, particular_num_rows, particular_num_innieouties));

	}

	print_one_cell_info(current_cell);

}

//modified index function to also take in the current perspectives
//# of cols, rows, and innieouties
//num_cells_in_a_maze_plane change too
//i left/right, j up/down, k out/in
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

function coordinates_from_index(incoming_index, num_cols, num_rows, num_innieouties){
	let ret_coordinates = [];
	let num_cells_in_this_particular_plane = num_cols * num_rows;
	let ret_k = Math.floor(incoming_index / num_cells_in_this_particular_plane);
	let remainder = incoming_index % num_cells_in_this_particular_plane;
	let ret_j = Math.floor(remainder / num_cols);
	remainder = remainder % num_cols;
	ret_coordinates.push(remainder, ret_j, ret_k);
	return ret_coordinates;
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
		let y = this.j * w;
		noStroke();
		fill(0, 0, 0);
		rect(x, y, w, w);
	}

	this.show = function(){
		//x left/right y up/down
		let x = this.i * w;
		let y = this.j * w;
		stroke(0);
		strokeWeight(7);
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
		//change color out or in if there is no wall to signify no wall with color instead of line
		if(!this.walls[4] && this.walls[5]){ 
			//color the cell differently than others in the maze plane to signify ability to go OUT to adjacent maze plane
			this.highlight(0, 255, 0); //out color
		}
		else if(!this.walls[5] && this.walls[4]){ 
			//color the cell differently than others in the maze plane to signify ability to go IN to adjacent maze plane
			this.highlight(153, 51, 255); //inn color
		}
		//3rd distinct color for if both out and in
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

		//mark goal cell
		if(index_take_2(this.i, this.j, this.k, particular_num_cols, particular_num_rows, particular_num_innieouties) == goal_index){
			stroke("green");
			noFill();
			circle(x + w / 2, y + w / 2, w / 2);	
			//line(x, y, x + w, y + w);	
			//line(x + w, y, x, y + w);	
		}

	}
}
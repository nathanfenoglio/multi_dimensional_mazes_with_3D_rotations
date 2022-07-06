//deployed at https://nathanfenoglio.github.io/multi_dimensional_mazes_with_3D_rotations/

//global variables
let grid = []; //all of the cells in the original perspective of the entire 3D maze, size is cols * rows * innieouties
let orig_persp_90 = []; //**original facing perspective, then top of head to the original right
let orig_persp_180 = []; //**original facing perspective, then top of head to the original bottom
let orig_persp_270 = []; //**original facing perspective, then top of head to the original left

let turn_head_to_left_grid = []; //**turn head to the left** so like stepping to the right of the cube and facing the cube thing from that direction
let turn_head_to_left_grid_90 = []; //**turn head to the left, then top of head to the original back
let turn_head_to_left_grid_180 = []; //**turn head to the left, then top of head to the original bottom
let turn_head_to_left_grid_270 = []; //**turn head to the left, then top of head to the original front

let turn_head_to_right_grid = []; //**turn head to the right** so like stepping to the left of the original cube and facing it in that direction
let turn_head_to_right_grid_90 = []; //**turn head to the right, then top of head to the original front
let turn_head_to_right_grid_180 = []; //**turn head to the right, then top of head to the original bottom
let turn_head_to_right_grid_270 = []; //**turn head to the right, then top of head to the original back

let turn_head_up_grid = []; //**turn head up** so like laying down on the ground underneath cube thing with head towards the front of the original
let turn_head_up_grid_90 = []; //**turn head up, then top of head to the original right
let turn_head_up_grid_180 = []; //**turn head up, then top of head to the original back
let turn_head_up_grid_270 = []; //**turn head up, then top of head to the original left

let turn_head_down_grid = []; //**turn head down** so like climbing on top of the cube thing and looking down with your head towards the back of the original
let turn_head_down_grid_90 = []; //**turn head down, then top of head to the original right
let turn_head_down_grid_180 = []; //**turn head down, then top of head to the original front
let turn_head_down_grid_270 = []; //**turn head down, then top of head to the original left

let turn_head_backward_grid = []; //**turn head back** like walking around the cube thing and facing it from the back with your head toward the top
let turn_head_backward_grid_90 = []; //**turn head back, then top of head to the original left
let turn_head_backward_grid_180 = []; //**turn head back, then top of head to the original bottom
let turn_head_backward_grid_270 = []; //**turn head back, then top of head to the original right


let all_maze_perspectives = [];
let current_maze_perspective = 0;
let current_maze_plane = 0; 

let start; //signifying starting up maze, start up whatev, maybe tutorial about how to play etc., set true/false in setup() function 
let done_with_getting_user_input_from_boxes = false;
let letsgetitstarted;
let finished_building_mazes = false;
let the_sequence = []; //just saving the sequence for reference as the maze is constructed
let stack = []; //used for backtracking when a dead end is encountered during maze generation process
let current; //current cell that the algorithm is currently at for maze generation process
let current_index;
let current_cell;

//current perspectives # of cols, rows, innieouties
let particular_num_cols = -1;
let particular_num_rows = -1;
let particular_num_innieouties = -1;

//option to take user input for # of cols, rows, innieouties or you could hardcode
//or you could get the input from a file of the format that you have in the ./mazes directory
let maze_info_from_file = false; //option to get the maze info from file instead of manually entered or taken from user input

let user_input_x_dim = 0;
let user_input_y_dim = 0;
let user_input_z_dim = 0;

let orig_cols;
let orig_rows;
let orig_innieouties;

let w; //width of cell
let start_index;
let goal_index;
let current_goal_index;

let solved_it = false; //true if player has reached goal cell

if(maze_info_from_file){
	orig_cols = cols;
	orig_rows = rows;
	orig_innieouties = innieouties;
	finished_building_mazes = true; //to enter code block in draw function, the check is there to wait to draw when you are generating a maze from user specified dimensions
	done_with_getting_user_input_from_boxes = true; //no user input for dimensions when maze comes from file
}

//validate input, set dimensions of maze to be generated
function log_user_input(){
	const x = parseInt(user_input_x_dim.value());
	const y = parseInt(user_input_y_dim.value());
	const z = parseInt(user_input_z_dim.value());

	if(x > 0 && y > 0 && z > 0){
		done_with_getting_user_input_from_boxes = true;
	}
	else{
		window.alert("Invalid input! Enter 3 positive integers");
		return;
	}

	orig_cols = x;
	orig_rows = y;
	orig_innieouties = z;
	
	//remove input boxes, buttons from screen
	user_input_x_dim.remove();
	user_input_y_dim.remove();
	user_input_z_dim.remove();
	button.remove();

	build_all_maze_perspectives();
}

//called in setup() if maze_info_from_file or from log_user_input() if generating maze from user input dimensions
function build_all_maze_perspectives(){
	num_cells_in_a_maze_plane = orig_cols * orig_rows;
	//generate random start_index
	start_index = Math.floor(Math.random() * orig_cols * orig_rows * orig_innieouties);
	//generate random goal_index
	goal_index = Math.floor(Math.random() * orig_cols * orig_rows * orig_innieouties);
	current_goal_index = goal_index; //for changing goal index when drawing the different perspectives

	//keep all of the cells, even for different maze planes, 
	//in the same 1D grid array and do the math
	//the math:
	//size of 1 maze plane is cols * rows
	//the size of the entire 3D maze is cols * rows * innieouties
	//get all of the maze info from maze_info.js or whichever file in directory mazes and specified in index.js
	//or if not premade maze from file, then create maze with depth first search backtracking
	if(!maze_info_from_file){ //create cells for original maze perspective to remove walls as maze is created
		for(let k = 0; k < orig_innieouties; k++){
			for(let j = 0; j < orig_rows; j++){
				for(let i = 0; i < orig_cols; i++){
					let cell = new Cell(i, j, k);
					grid.push(cell);
				}
			}
		}
	
		//specify start cell to begin generating maze, could be any cell
		current = grid[0];

		while(!finished_building_mazes){
			the_sequence.push(current); //just saving the sequence of cells visited

			current.visited = true; //mark cell as visited

			//returns a random neighbor if valid (defined) and not visited
			let next = current.checkNeighbors(); 

			//if next is not undefined
			if(next){
				next.visited = true;
				stack.push(current); //push current to the stack before advancing to next cell
				removeWalls(current, next);
				current = next;
				current_maze_plane = current.k; //k is the 3rd dimension which maze plane the cell is in
			}
			//reaches here if no available neighboring cells to explore that haven't been visited yet
			else if(stack.length > 0){ //check that stack is not empty
				current = stack.pop();
			}
			else{
				//so if no next AND stack is empty, then must have returned to the very beginning and every cell has been visited
				//allow draw function to draw each maze in succession
				finished_building_mazes = true;
				current_maze_plane = 0;
			}
		}
	}
	
	//set up every cell
	//keep all of the cells, even for different maze planes, 
	//in the same 1D grid array and do the math
	//the math: (need specific dimensions of each perspective)
	//size of 1 maze plane is cols * rows
	//the size of the entire 3D maze is cols * rows * innieouties 
	//all of the other 23 perspectives are generated from the original perspective 0
	//so check if perspective 0 is coming from a file or need to generate on the fly
	if(maze_info_from_file){
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
	//**original facing perspective, then top of head to the original right
	particular_num_rows = orig_cols;
	particular_num_cols = orig_rows; 
	particular_num_innieouties = orig_innieouties;
	for(let i = 0; i < orig_cols; i++){
		for(let j = 0; j < orig_rows; j++){
			for(let k = 0; k < orig_innieouties; k++){
				let cell = new Cell(j, orig_cols - i - 1, k);
				let cell_num = index_take_2(j, orig_cols - i - 1, k, particular_num_cols, particular_num_rows, particular_num_innieouties);
				let grid_cell_num = index(i, j, k);

				//0-top, 1-right, 2-bottom, 3-left, 4-out, 5-in				
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
				let grid_cell_num = index(i, j, k);

				//0-top, 1-right, 2-bottom, 3-left, 4-out, 5-in				
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
				let grid_cell_num = index(i, j, k);
				
				//0-top, 1-right, 2-bottom, 3-left, 4-out, 5-in				
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
	//turn head to left 
	particular_num_cols = orig_innieouties; 
	particular_num_rows = orig_rows;
	particular_num_innieouties = orig_cols;
	for(let i = 0; i < particular_num_cols; i++){
		for(let j = 0; j < particular_num_rows; j++){
			for(let k = 0; k < particular_num_innieouties; k++){
				let cell = new Cell(i, j, k);
				let cell_num = index_take_2(i, j, k, particular_num_cols, particular_num_rows, particular_num_innieouties);
				let grid_cell_num = index(orig_cols - 1 - k, j, i);
				
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
				let grid_cell_num = index(i, j, k);
				
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
				let grid_cell_num = index(i, j, k);
				
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
				let grid_cell_num = index(i, j, k);
				
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
	//turn head to the right
	particular_num_cols = orig_innieouties;
	particular_num_rows = orig_rows;
	particular_num_innieouties = orig_cols;
	for(let i = 0; i < particular_num_cols; i++){
		for(let j = 0; j < particular_num_rows; j++){
			for(let k = 0; k < particular_num_innieouties; k++){
				let cell = new Cell(i, j, k);
				let cell_num = index_take_2(i, j, k, particular_num_cols, particular_num_rows, particular_num_innieouties);
				let grid_cell_num = index(k, j, orig_innieouties - 1 - i);
				
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
				let grid_cell_num = index(i, j, k);
				
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
    //**turn head to the right, then top of head to the original bottom
	particular_num_rows = orig_rows;
	particular_num_cols = orig_innieouties; 
	particular_num_innieouties = orig_cols;
	for(let i = 0; i < orig_cols; i++){
		for(let j = 0; j < orig_rows; j++){
			for(let k = 0; k < orig_innieouties; k++){
				let cell = new Cell(k, orig_rows - j - 1, i);
				let cell_num = index_take_2(k, orig_rows - j - 1, i, particular_num_cols, particular_num_rows, particular_num_innieouties);
				let grid_cell_num = index(i, j, k);
				
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
				let grid_cell_num = index(i, j, k);
				
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
	//turn head up
	particular_num_cols = orig_cols;
	particular_num_rows = orig_innieouties;
	particular_num_innieouties = orig_rows;
	for(let i = 0; i < particular_num_cols; i++){
		for(let j = 0; j < particular_num_rows; j++){
			for(let k = 0; k < particular_num_innieouties; k++){
				let cell = new Cell(i, j, k);
				let cell_num = index_take_2(i, j, k, particular_num_cols, particular_num_rows, particular_num_innieouties);
				let grid_cell_num = index(i, orig_rows - 1 - k, j);
				
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
				let grid_cell_num = index(i, j, k);
				
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
				let grid_cell_num = index(i, j, k);
				
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
				let grid_cell_num = index(i, j, k);
				
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
	//turn head down
	particular_num_cols = orig_cols;
	particular_num_rows = orig_innieouties;
	particular_num_innieouties = orig_rows;
	for(let i = 0; i < particular_num_cols; i++){
		for(let j = 0; j < particular_num_rows; j++){
			for(let k = 0; k < particular_num_innieouties; k++){
				let cell = new Cell(i, j, k);
				let cell_num = index_take_2(i, j, k, particular_num_cols, particular_num_rows, particular_num_innieouties);
				let grid_cell_num = index(i, k, orig_innieouties - j - 1);
				
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
				let grid_cell_num = index(i, j, k);
				
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
				let grid_cell_num = index(i, j, k);
				
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
				let grid_cell_num = index(i, j, k);
				
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
	//turn head backward (turn around)
	particular_num_cols = orig_cols;
	particular_num_rows = orig_rows;
	particular_num_innieouties = orig_innieouties;
	for(let i = 0; i < particular_num_cols; i++){
		for(let j = 0; j < particular_num_rows; j++){
			for(let k = 0; k < particular_num_innieouties; k++){
				let cell = new Cell(i, j, k);
				let cell_num = index_take_2(i, j, k, particular_num_cols, particular_num_rows, particular_num_innieouties);
				let grid_cell_num = index(orig_cols - 1 - i, j, orig_innieouties - 1 - k);
				
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
    //**turn head back, then top of head to the original left
    //all original orientations are top, right, bottom, left, out, in
	particular_num_rows = orig_cols;
	particular_num_cols = orig_rows; 
	particular_num_innieouties = orig_innieouties;
	for(let i = 0; i < orig_cols; i++){
		for(let j = 0; j < orig_rows; j++){
			for(let k = 0; k < orig_innieouties; k++){
				let cell = new Cell(j, i, orig_innieouties - k - 1);
				let cell_num = index_take_2(j, i, orig_innieouties - k - 1, particular_num_cols, particular_num_rows, particular_num_innieouties);
				let grid_cell_num = index(i, j, k);
				
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
				let grid_cell_num = index(i, j, k);
				
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
				let grid_cell_num = index(i, j, k);
				
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

	//set beginning cell
	current_cell = all_maze_perspectives[current_maze_perspective][start_index];
	current_index = start_index;

	start = true; //option to run through showing all the maze planes at the beginning
	w = width / Math.max(orig_cols, orig_rows, orig_innieouties); //width of cell to be drawn

	//draw each maze plane for player to see
	//2nd arg in setInterval is in milliseconds
	letsgetitstarted = setInterval(show_one_maze_plane, 100); //uncomment to show all maze perspectives before starting	
	current_maze_plane = Math.floor(start_index / (orig_cols * orig_rows));
}

function setup() {
	let canvas = createCanvas(650, 650);
	let trans_canv_rt_amt = 50;
	let trans_canv_lt_amt = 10;
	canvas.position(trans_canv_rt_amt, trans_canv_lt_amt); //move canvas to the right
	background(51);
	
	//3 boxes, 1 for each dimension input by user
	//and a generate maze button
	if(!maze_info_from_file){
		let middle_pos_x = 430;
		let middle_pos_y = 20;

		user_input_x_dim = createInput();
		user_input_x_dim.position(middle_pos_x + trans_canv_rt_amt, middle_pos_y + 15 + trans_canv_lt_amt);
		user_input_x_dim.style('background-color', 'magenta');
		user_input_x_dim.size(50, 20);

		user_input_y_dim = createInput();
		user_input_y_dim.position(middle_pos_x + trans_canv_rt_amt, middle_pos_y + 45 + trans_canv_lt_amt);
		user_input_y_dim.style('background-color', 'magenta');
		user_input_y_dim.size(50, 20);

		user_input_z_dim = createInput();
		user_input_z_dim.position(middle_pos_x + trans_canv_rt_amt, middle_pos_y + 75 + trans_canv_lt_amt);
		user_input_z_dim.style('background-color', 'magenta');
		user_input_z_dim.size(50, 20);

		button = createButton("GENERATE MAZE");
		button.position(90 + trans_canv_rt_amt, middle_pos_y + 110 + trans_canv_lt_amt);
		button.size(400, 100);
		button.style('background-color', color(0, 255, 0));
		button.style('font-size', '40px');
		button.mousePressed(log_user_input);
	}

	//build_all_maze_perspectives called from log_user_input function that validates the input if info not taken from file
	if(maze_info_from_file){
		build_all_maze_perspectives();
	}
}

function goal_cell_routine(){
	clear_goal_cell_routine_timeout();
	current_index = -1;
	window.alert("GOOOOOOAAAAAALLLLLLLL!!!!!!\nYOU SOLVED THE MAZE\nPLEASE PLAY AGAIN");
	solved_it = false;
	location.reload(); //refresh the page to display menu and allow player to input new dimensions for new maze generation		
}

function clear_goal_cell_routine_timeout(){
	clearTimeout(goal_cell_routine_timeout);
}

function draw() {
	if(finished_building_mazes){
		if(!start){ //if not start intro sequence where you are showing all of the possible perspectives and planes
			//main game loop
			background(51);
			//show the current maze plane
			set_particular_num_cols_rows_innieouties(current_maze_perspective);
			let num_cells_in_this_particular_plane = particular_num_cols * particular_num_rows;
			for(let i = (current_maze_plane * num_cells_in_this_particular_plane); i < ((current_maze_plane + 1) * num_cells_in_this_particular_plane); i++){
				all_maze_perspectives[current_maze_perspective][i].show();
			}	

			//check if player has reached goal cell
			if(current_index == goal_index && !solved_it){
				goal_cell_routine_timeout = setTimeout(goal_cell_routine, 500);
				solved_it = true;
			}
		}
		
	}
	else{ //display game instructions and input boxes for player to specify dimensions of maze to generate
		let middle_pos_y = 25;
		let pixels_from_left = 100;
		textSize(24);
		fill(255, 128, 0);
		text("# of cells in left/right direction", pixels_from_left, middle_pos_y + 30);
		text("# of cells in up/down direction", pixels_from_left, middle_pos_y + 60);
		text("# of cells in in/out direction", pixels_from_left, middle_pos_y + 90);

		textSize(18);
		text("3D Maze represented as successive 2D plane slices", pixels_from_left - 20, middle_pos_y + 250);
		text("Ability to rotate player's perspective up/down left/right in/out", pixels_from_left - 20, middle_pos_y + 280);
		text("as you attempt to reach the goal cell and solve each maze", pixels_from_left - 20, middle_pos_y + 310);
		fill('aqua');
		text("Keyboard Controls:", pixels_from_left - 20 + 150, middle_pos_y + 340);
		fill('yellow')
		text("UP ARROW - up", pixels_from_left - 20, middle_pos_y + 370);
		text("DOWN ARROW - down", pixels_from_left - 20, middle_pos_y + 400);
		text("LEFT ARROW - left", pixels_from_left - 20, middle_pos_y + 430);
		text("RIGHT ARROW - right", pixels_from_left - 20, middle_pos_y + 460);
		text("ENTER - in", pixels_from_left - 20, middle_pos_y + 490);
		text("SHIFT - out", pixels_from_left - 20, middle_pos_y + 520);
		text("W - rotate perspective up", pixels_from_left - 20 + 250, middle_pos_y + 370);
		text("S - rotate perspective down", pixels_from_left - 20 + 250, middle_pos_y + 400);
		text("A - rotate perspective left", pixels_from_left - 20 + 250, middle_pos_y + 430);
		text("D - rotate perspective right", pixels_from_left - 20 + 250, middle_pos_y + 460);
		fill('aqua');
		text("Cells' Color Codes:", pixels_from_left - 20 + 150, middle_pos_y + 550);
		fill(color(153, 51, 255));
		text("Purple Cell - can go in", pixels_from_left - 20, middle_pos_y + 580);
		fill(color(0, 255, 0));
		text("Green Cell - can go out", pixels_from_left - 20, middle_pos_y + 610);
		fill(color(255, 128, 0));
		text("Orange Cell - can go in/out", pixels_from_left - 20 + 250, middle_pos_y + 580);
		fill('magenta');
		text("Pink Cell - no in/out", pixels_from_left - 20 + 250, middle_pos_y + 610);	
		
	}	
}

//show all perspectives and planes of each perspective to player before starting game play
let global_maze_plane_counter = 0;
let global_perspective_counter = 0;
let global_cell_index_counter = 0;
let num_tot_possible_rotations = 24;
function show_one_maze_plane(){
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
		}
	}
	else{
		start = false;
		clearInterval(letsgetitstarted); //stop setInterval function
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
	//don't pay attention to key if start routine is still running 
	//or needing user input for dimensions of maze from input boxes
	if(start || !done_with_getting_user_input_from_boxes){ 
		if(keyCode === ENTER){
			log_user_input();
		}
		return;
	}
	//NEED TO CHECK ALL SORTS OF THINGS...
	if(keyCode === UP_ARROW){
		//check that not out of bounds and not a wall above
		if(next_is_not_up_boundary(current_index) && !current_cell.walls[0]){
			current_index = current_index - particular_num_cols;
			current_cell = all_maze_perspectives[current_maze_perspective][current_index];	
		}
	}
	if(keyCode === LEFT_ARROW) {
		//check if next_index would be on same row and not a wall to the left
		if(next_is_not_left_boundary(current_index) && !current_cell.walls[3]){
			current_index = current_index - 1;
			current_cell = all_maze_perspectives[current_maze_perspective][current_index];	
		}
	} 
	if(keyCode === RIGHT_ARROW) {
		//check if next_index would be on same row and not a wall to the right
		if(next_is_not_right_boundary(current_index) && !current_cell.walls[1]){
			current_index = current_index + 1;
			current_cell = all_maze_perspectives[current_maze_perspective][current_index];
		}
	}
	if(keyCode === DOWN_ARROW) {
		//check that not out of bounds and not a wall below
		if(next_is_not_down_boundary(current_index) && !current_cell.walls[2]){
			current_index = current_index + particular_num_cols;
			current_cell = all_maze_perspectives[current_maze_perspective][current_index];
		}
	}

	//SHIFT for in the out direction of the maze (like a door or firemans pole)
	if(keyCode === SHIFT){
		//check that not out of bounds and not a wall one maze plane out
		if(next_is_not_out_boundary(current_index) && !current_cell.walls[4]){
			let num_cells_in_this_particular_plane = particular_num_cols * particular_num_rows;
			current_index = current_index - num_cells_in_this_particular_plane;
			current_cell = all_maze_perspectives[current_maze_perspective][current_index];

			current_maze_plane--; //change maze plane to be drawn
		}
	}
	//ENTER for in the in direction of the maze (like a door or firemans pole)
	if(keyCode === ENTER){
		//check if not out of bounds and not a wall one maze plane in
		if(next_is_not_in_boundary(current_index) && !current_cell.walls[5]){
			let num_cells_in_this_particular_plane = particular_num_cols * particular_num_rows;
			current_index = current_index + num_cells_in_this_particular_plane;
			current_cell = all_maze_perspectives[current_maze_perspective][current_index];

			current_maze_plane++; //change maze plane to be drawn
		}
	}

	//keys for player to rotate the maze each possible way
	if(keyCode === 65){ //key a - turn head to left
		//function to take current_maze_perspective, current_index or goal_index, new current_maze_perspective
		//and determines new current_index or goal_index for the new perspective
		//coordinates are cols (x), rows (y), innieouties (z)
		let current_index_coordinates = coordinates_from_index(current_index, particular_num_cols, particular_num_rows, particular_num_innieouties);
		let goal_index_coordinates = coordinates_from_index(goal_index, particular_num_cols, particular_num_rows, particular_num_innieouties);

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

		//now determine new current_index
		let new_perspective_maze_plane = particular_num_cols - current_index_coordinates[0] - 1;
		//the goal will not necessarily be in the new_perspective_maze_plane, need to account for its relative plane position
		let new_goal_plane = particular_num_cols - goal_index_coordinates[0] - 1; //the column that the goal cell is in is the new maze plane as you turn to the right 

		//go ahead and set new set_particular_num_cols_rows_innieouties to new perspective
		current_maze_perspective = new_perspective_counter_value;
		set_particular_num_cols_rows_innieouties(current_maze_perspective);

		let cell_index_in_new_perspective = (new_perspective_maze_plane * particular_num_cols * particular_num_rows) + (current_index_coordinates[1] * particular_num_cols) + current_index_coordinates[2];
		//do the same thing with the goal index
		let goal_index_in_new_perspective = (new_goal_plane * particular_num_cols * particular_num_rows) + (goal_index_coordinates[1] * particular_num_cols) + goal_index_coordinates[2];

		current_maze_plane = new_perspective_maze_plane;
		current_index = cell_index_in_new_perspective;
		current_cell = all_maze_perspectives[current_maze_perspective][current_index];	

		goal_index = goal_index_in_new_perspective;
	}

	if(keyCode === 68){ //key d - turn head to right
		//function to take current_maze_perspective, current_index or goal_index, new current_maze_perspective
		//and determines new current_index or goal_index for the new perspective
		//coordinates are cols (x), rows (y), innieouties (z)
		let current_index_coordinates = coordinates_from_index(current_index, particular_num_cols, particular_num_rows, particular_num_innieouties);
		let goal_index_coordinates = coordinates_from_index(goal_index, particular_num_cols, particular_num_rows, particular_num_innieouties);

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

		//now determine new current_index
		let new_perspective_maze_plane = current_index_coordinates[0]; //the column that you are in is the new maze plane as you turn to the right
		//the goal will not necessarily be in the new_perspective_maze_plane, need to account for its relative plane position
		let new_goal_plane = goal_index_coordinates[0]; //the column that the goal cell is in is the new maze plane as you turn to the right 

		//go ahead and set new set_particular_num_cols_rows_innieouties to new perspective
		current_maze_perspective = new_perspective_counter_value;
		set_particular_num_cols_rows_innieouties(current_maze_perspective);
		
		let cell_index_in_new_perspective = (new_perspective_maze_plane * particular_num_cols * particular_num_rows) + (current_index_coordinates[1] * particular_num_cols) + (particular_num_cols - current_index_coordinates[2] - 1);
		//do the same thing with the goal index
		let goal_index_in_new_perspective = (new_goal_plane * particular_num_cols * particular_num_rows) + (goal_index_coordinates[1] * particular_num_cols) + (particular_num_cols - goal_index_coordinates[2] - 1);
		
		current_maze_plane = new_perspective_maze_plane;
		current_index = cell_index_in_new_perspective;
		current_cell = all_maze_perspectives[current_maze_perspective][current_index];	
		goal_index = goal_index_in_new_perspective;
	}

	if(keyCode === 87){ //key w - turn head up
		//function to take current_maze_perspective, current_index or goal_index, new current_maze_perspective
		//and determines new current_index or goal_index for the new perspective
		//coordinates are cols (x), rows (y), innieouties (z)
		let current_index_coordinates = coordinates_from_index(current_index, particular_num_cols, particular_num_rows, particular_num_innieouties);
		let goal_index_coordinates = coordinates_from_index(goal_index, particular_num_cols, particular_num_rows, particular_num_innieouties);

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

		//now determine new current_index
		let new_perspective_maze_plane = particular_num_rows - current_index_coordinates[1] - 1;
		//the goal will not necessarily be in the new_perspective_maze_plane, need to account for its relative plane position
		let new_goal_plane = particular_num_rows - goal_index_coordinates[1] - 1;

		//go ahead and set new set_particular_num_cols_rows_innieouties to new perspective
		current_maze_perspective = new_perspective_counter_value;
		set_particular_num_cols_rows_innieouties(current_maze_perspective);

		let cell_index_in_new_perspective = (new_perspective_maze_plane * particular_num_cols * particular_num_rows) + (current_index_coordinates[2] * particular_num_cols) + current_index_coordinates[0];
		//do the same thing with the goal index
		let goal_index_in_new_perspective = (new_goal_plane * particular_num_cols * particular_num_rows) + (goal_index_coordinates[2] * particular_num_cols) + goal_index_coordinates[0];
		
		current_maze_plane = new_perspective_maze_plane;
		current_index = cell_index_in_new_perspective;
		current_cell = all_maze_perspectives[current_maze_perspective][current_index];	
		goal_index = goal_index_in_new_perspective;

	}
	
	if(keyCode === 83){ //key s - turn head down
		//function to take current_maze_perspective, current_index or goal_index, new current_maze_perspective
		//and determines new current_index or goal_index for the new perspective
		//coordinates are cols (x), rows (y), innieouties (z)
		let current_index_coordinates = coordinates_from_index(current_index, particular_num_cols, particular_num_rows, particular_num_innieouties);
		let goal_index_coordinates = coordinates_from_index(goal_index, particular_num_cols, particular_num_rows, particular_num_innieouties);

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

		//now determine new current_index
		let new_perspective_maze_plane = current_index_coordinates[1]; //current row # becomes next maze plane
		//the goal will not necessarily be in the new_perspective_maze_plane, need to account for its relative plane position
		let new_goal_plane = goal_index_coordinates[1]; //current row # becomes next maze plane

		//go ahead and set new set_particular_num_cols_rows_innieouties to new perspective
		current_maze_perspective = new_perspective_counter_value;
		set_particular_num_cols_rows_innieouties(current_maze_perspective);

		let cell_index_in_new_perspective = (new_perspective_maze_plane * particular_num_cols * particular_num_rows) + ((particular_num_rows - current_index_coordinates[2] - 1) * particular_num_cols) + current_index_coordinates[0];
		//do the same thing with the goal index
		let goal_index_in_new_perspective = (new_goal_plane * particular_num_cols * particular_num_rows) + ((particular_num_rows - goal_index_coordinates[2] - 1) * particular_num_cols) + goal_index_coordinates[0];
		
		current_maze_plane = new_perspective_maze_plane;
		current_index = cell_index_in_new_perspective;
		current_cell = all_maze_perspectives[current_maze_perspective][current_index];	
		goal_index = goal_index_in_new_perspective;
	}

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
//modifying cols, rows, innieouties to orig_whatevs
function index(i, j, k){
	//check for out of bounds and return -1 if so to signify not valid
	if(i < 0 || j < 0 || i > orig_cols - 1 || j > orig_rows - 1 || k < 0 || k > orig_innieouties - 1){
		return -1;
	}
	return i + (j * orig_cols) + (k * num_cells_in_a_maze_plane);
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

//used while generating maze removing the walls that are all true to begin with as the algorithm carves out the path
function removeWalls(a, b){
	let x = a.i - b.i; //x is difference between the 2 cells left/right values
	if(x === 1){
		a.walls[3] = false; //remove left wall from cell a
		b.walls[1] = false; //remove right wall from cell b
	}
	else if(x === -1){
		a.walls[1] = false; //remove right wall from cell a
		b.walls[3] = false; //remove left wall from cell b
	}
	
	let y = a.j - b.j; //y is difference between the 2 cells up/down values
	if(y === 1){
		a.walls[0] = false; //remove top wall from cell a
		b.walls[2] = false; //remove bottom wall from cell b
	}
	else if(y === -1){
		a.walls[2] = false; //remove bottom wall from cell a
		b.walls[0] = false; //remove top wall from cell b
	}
	
	let z = a.k - b.k; //z is difference between the 2 cells out/inn values
	if(z === 1){
		a.walls[4] = false; //remove out wall from cell a
		b.walls[5] = false; //remove inn wall from cell b
	}
	else if(z === -1){
		a.walls[5] = false; //remove inn wall from cell a
		b.walls[4] = false; //remove out wall from cell b
	}
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

	if(maze_info_from_file){ //will push the walls into walls array read in from file
		this.walls = [];
	}
	else{ //generate maze, start with all walls true and then change to false as you build maze with DFS backtracking
		//top, right, bottom, left, out, inn
		this.walls = [true, true, true, true, true, true];
	}

	this.visited = false; //visited as in during maze generation if algorithm has already visited cell

	this.highlight = function(red, green, blue){
		//drawing 2D maze plane, just need to know that, not drawing a z (k) value so don't need to know about that here
		let x = this.i * w;
		let y = this.j * w;
		noStroke();
		fill(red, green, blue);
		rect(x, y, w, w);
	}

	//used while generating a maze on the fly from user input
	this.checkNeighbors = function(){
		//neighbors are located at:
		//top: (i, j-1, k)
		//right: (i+1, j, k)
		//bottom: (i, j+1, k)
		//left: (i-1, j, k)
		//out: (i, j, k - 1)
		//in: (i, j, k + 1)
		let neighbors = [];
		//since returning -1 if out of bounds from index function
		//if any of the indexes below are -1 for grid
		//the value of whichever variable will be undefined and then can check for it
		let top = grid[index(i, j - 1, k)];
		let right = grid[index(i + 1, j, k)];
		let bottom = grid[index(i, j + 1, k)];
		let left = grid[index(i - 1, j, k)];
		let out = grid[index(i, j, k - 1)];
		let inn = grid[index(i, j, k + 1)];


		//checking if variable is not undefined (out of bounds) and not visited, 
		//then push as a possible option for the next cell to visit
		if(top && !top.visited){
			neighbors.push(top);
		}
		if(right && !right.visited){
			neighbors.push(right);
		}
		if(bottom && !bottom.visited){
			neighbors.push(bottom);
		}
		if(left && !left.visited){
			neighbors.push(left);
		}
		if(out && !out.visited){
			neighbors.push(out);
		}
		if(inn && !inn.visited){
			neighbors.push(inn);
		}

		if(neighbors.length > 0){
			//chooses random available neighboring cells
			//perhaps interesting patterns could be found by modifying this to not be random
			//but some other complicated, but non random sequence 
			let r = floor(random(0, neighbors.length));
			return neighbors[r];
		}
		else{
			return undefined;
		}
	}

	this.mark_as_current_cell = function(){
		let x = this.i * w;
		let y = this.j * w;
		//for showing the current cell during maze building, not drawing maze as you build though
		noStroke();
		fill(0, 0, 0);
		rect(x, y, w, w);
	}


	//NOT CURRENTLY USING
	//COULD REPRESENT BY DRAWING ARROWS ON COLORED BACKGROUNDS INSTEAD
	//WITH ORANGE IN/OUT HAVING THE BIDIRECTIONAL ARROW
	this.draw_downstairs = function(){
		let x = this.i * w;
		let y = this.j * w;
	
		let num_even_divisions = 3;
		noStroke();

		fill(153, 51, 255);
		rect(x + 7, y + 7, w / num_even_divisions, w);
		fill('grey');
		rect(x + w / (num_even_divisions * 2), y, w / (num_even_divisions * 2), w);	
		fill(51);
		rect(x + w / (num_even_divisions * 2), y, w / (num_even_divisions * 2 * 0.2 * w), w);
		fill(153, 51, 255);	
		rect(x + (2 * w / (num_even_divisions * 2)), y, w / (num_even_divisions * 2), w);
		fill(51);
		rect(x + (2 * w / (num_even_divisions * 2)), y, w / (num_even_divisions * 2 * 0.2 * w), w);
		fill('grey');
		rect(x + (3 * w / (num_even_divisions * 2)), y, w / (num_even_divisions * 2), w);
		fill(51);
		rect(x + (3 * w / (num_even_divisions * 2)), y, w / (num_even_divisions * 2 * 0.15 * w), w);
		fill(153, 51, 255);
		rect(x + (4 * w / (num_even_divisions * 2)), y, w / (num_even_divisions * 2), w);
		fill(51);
		rect(x + (4 * w / (num_even_divisions * 2)), y, w / (num_even_divisions * 2 * 0.15 * w), w);
		fill('grey');
		rect(x + (5 * w / (num_even_divisions * 2)), y, w / (num_even_divisions * 2), w);
		fill(51);
		rect(x + (5 * w / (num_even_divisions * 2)), y, w / (num_even_divisions * 2 * 0.15 * w), w);
		fill(89, 33, 29);
		triangle(x, y, x + w, y, x + w, (0.35 * w) + y); //downstairs or in
	}

	//NOT CURRENTLY USING
	this.draw_upstairs = function(){
		let x = this.i * w;
		let y = this.j * w;
	
		let num_even_divisions = 3;
		noStroke();

		fill(0, 255, 0);
		rect(x + 7, y + 7, w / num_even_divisions, w);
		fill('grey');
		rect(x + w / (num_even_divisions * 2), y, w / (num_even_divisions * 2), w);	
		fill(51);
		rect(x + w / (num_even_divisions * 2), y, w / (num_even_divisions * 2 * 0.2 * w), w);
		fill(0, 255, 0);	
		rect(x + (2 * w / (num_even_divisions * 2)), y, w / (num_even_divisions * 2), w);
		fill(51);
		rect(x + (2 * w / (num_even_divisions * 2)), y, w / (num_even_divisions * 2 * 0.2 * w), w);
		fill('grey');
		rect(x + (3 * w / (num_even_divisions * 2)), y, w / (num_even_divisions * 2), w);
		fill(51);
		rect(x + (3 * w / (num_even_divisions * 2)), y, w / (num_even_divisions * 2 * 0.15 * w), w);
		fill(0, 255, 0);
		rect(x + (4 * w / (num_even_divisions * 2)), y, w / (num_even_divisions * 2), w);
		fill(51);
		rect(x + (4 * w / (num_even_divisions * 2)), y, w / (num_even_divisions * 2 * 0.15 * w), w);
		fill('grey');
		rect(x + (5 * w / (num_even_divisions * 2)), y, w / (num_even_divisions * 2), w);
		fill(51);
		rect(x + (5 * w / (num_even_divisions * 2)), y, w / (num_even_divisions * 2 * 0.15 * w), w);
		fill(89, 33, 29);
		triangle(x, y, x + w, y, x, (0.35 * w) + y); //perhaps to signify upstairs
	}

	//maybe like a ladder looking thing for in and out, NOT CURRENTLY USING
	this.draw_ladder = function(){
		let x = this.i * w;
		let y = this.j * w;

		let num_even_divisions = 4;
		let containing_square_width = w;
		let containing_square_height = w;
		let inset = .2 * w;
		let ladder_sides_width = .1 * w;
	
		let top_right_x = x + w - ladder_sides_width; 

		fill('black');
		rect(x + inset, y, ladder_sides_width, containing_square_height);
		rect(top_right_x - ladder_sides_width - inset, y, ladder_sides_width, containing_square_height);

		rect(x + inset + ladder_sides_width, y + (containing_square_height / 5), containing_square_width - (2 * inset) - (3 * ladder_sides_width), ladder_sides_width);	
		rect(x + inset + ladder_sides_width, y + (2.12 * containing_square_height / 5), containing_square_width - (2 * inset) - (3 * ladder_sides_width), ladder_sides_width);	
		rect(x + inset + ladder_sides_width, y + (3.33 * containing_square_height / 5), containing_square_width - (2 * inset) - (3 * ladder_sides_width), ladder_sides_width);	

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
			textSize(w / 5);
			textFont('Helvetica');
			textStyle(BOLD);
			fill('black');
			text("OUT", x + (w / 4), y + (w / 1.75));
			//this.draw_upstairs();
		}
		else if(!this.walls[5] && this.walls[4]){ 
			//color the cell differently than others in the maze plane to signify ability to go IN to adjacent maze plane
			this.highlight(153, 51, 255); //inn color
			textSize(w / 5);
			textFont('Helvetica');
			textStyle(BOLD);
			fill('black');
			text("IN", x + (w / 3), y + (w / 1.75));
			//this.draw_downstairs();
		}
		//3rd distinct color for if both out and in
		else if(!this.walls[4] && !this.walls[5]){
			//color the cell differently than others in the maze plane to signify ability to go IN/OUT to adjacent maze plane
			this.highlight(255, 128, 0); //out and inn color
			textSize(w / 5);
			textFont('Helvetica');
			textStyle(BOLD);
			fill('black');
			text("IN/OUT", x + (w / 12), y + (w / 1.75));
			//this.draw_ladder();
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
			textSize(w / 5);
			textFont('Georgia');
			textStyle(BOLD);
			fill('black');
			text("GOAL", x + (w / 6), y + (w / 1.75));
		}
	}
}

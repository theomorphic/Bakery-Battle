const area = document.getElementById('area');
const btn_change1 = document.getElementById('btn-change1');
const btn_change2 = document.getElementById('btn-change2');
const btn_change3 = document.getElementById('btn-change3');

const MODE_2P = '2 Players';
const MODE_AI = 'AI';
const MODE_NINNY = 'Ninny';

const X_MARK = "X";
const O_MARK = "O";

let mark = X_MARK;
let mode = MODE_AI;

let result = '';
const contentWrapper = document.getElementById('content');
const modalResult = document.getElementById('modal-result-wrapper');
const overlay = document.getElementById('overlay');
const btnClose = document.getElementById('btn-close');

function get_boxes()
{
	let boxes = [9];
	let i = 0;
	for (i = 0; i < 9; i++) {
		boxes[i] = document.getElementById('box' + i).innerHTML;
	}
	return boxes;
}

function reload()
{
	mark = X_MARK;
	for (i = 0; i < 9; i++)
		document.getElementById('box' + i).innerHTML = '';
}

btn_change1.addEventListener('click', e=>{
	mode = MODE_AI;
	document.getElementById("enemyName").innerHTML = "Da Muffin";
	document.getElementById("enemyDesc").innerHTML = `The roughest Muffin in da<br>
	world is comming for ya!`;
	document.getElementById("enemyImg").style.backgroundImage = "url('img/Muffin-Boss.png')";

	reload();
});
btn_change2.addEventListener('click', e=>{
	mode = MODE_2P;
	document.getElementById("enemyName").innerHTML = "Multiplayer";
	document.getElementById("enemyDesc").innerHTML = `Challenge your friend or foe in <br>a relentless gingerbread battle!`;
	document.getElementById("enemyImg").style.backgroundImage = "url('img/Multiplayer.png')";
	
	reload();
});
btn_change3.addEventListener('click', e=>{
	mode = MODE_NINNY;
	document.getElementById("enemyName").innerHTML = "Milky";
	document.getElementById("enemyDesc").innerHTML = `Our rookie-cookie is a newbie <br> but you can't milk it!`;
	document.getElementById("enemyImg").style.backgroundImage = "url('img/Milky.png')";


	reload();
});

area.addEventListener('click', e=>{
	if (e.target.className = 'box') {
		if (e.target.innerHTML == "") {
			e.target.innerHTML = mark;
			if (check())
				if (mode != MODE_2P)
					ai();
		}
	}
});

function get_empty(boxes)
{
	let empty = [];
	let i = 0;
	for (i in boxes)
		if (boxes[i] == "")
			empty.push(i);
	return empty;
}

function mark_reverse(mark)
{
	if (mark == X_MARK)
		return O_MARK;
	return X_MARK;
}

function get_cell_score(boxes, cell, mrk, winmrk)
{
	let score = 0;
	let next_boxes = boxes.slice();
	next_boxes[cell] = mrk;
	let next_mrk = mark_reverse(mrk);
	switch (check_win(next_boxes)) {
		case winmrk: return 1;
		case mark_reverse(winmrk): return -1;
		case 1: return 0;
	}
	let next_empty = get_empty(next_boxes);
	let i = 0;
	for (i in next_empty) {
		score += get_cell_score(next_boxes, next_empty[i], next_mrk, winmrk);
	}
	return score;
}

function ai()
{
	let choice;
	let boxes = get_boxes();
	let empty = get_empty(boxes);
	if (mode == MODE_AI) {
		let highest = -100000;
		let sc;
		let k = 0;
		for (k in empty) {
			sc = get_cell_score(boxes, empty[k], mark, O_MARK);
			if (sc > highest) {
				choice = empty[k];
				highest = sc;
			}
		}
	} else if (mode == MODE_NINNY) {
		choice = empty[Math.round(Math.random() * (empty.length - 1))];
	}
	target = document.getElementById('box' + choice);
	target.innerHTML = O_MARK;
	check();
}

function check_win(boxes)
{
	const lines = [
		[0,1,2],
		[3,4,5],
		[6,7,8],
		[0,3,6],
		[1,4,7],
		[2,5,8],
		[0,4,8],
		[2,4,6]];
	let i = 0;
	for (i in lines) {
		if (boxes[lines[i][0]] == X_MARK &&
		    boxes[lines[i][1]] == X_MARK &&
		    boxes[lines[i][2]] == X_MARK) {
			return X_MARK;
		} else if (boxes[lines[i][0]] == O_MARK &&
			   boxes[lines[i][1]] == O_MARK &&
			   boxes[lines[i][2]] == O_MARK) {
			return O_MARK;
		}
	}
	if (get_empty(boxes).length == 0) {
		return 1;
	}
	return 0;
}

function check()
{
	mark = mark_reverse(mark);
	switch (check_win(get_boxes())) {
	case X_MARK:
		result = 'Cookies';
		prepareResult(result);
		return 0;
		break;
	case O_MARK:
		result = 'Biscuits';
		prepareResult(result);
		return 0;
	case 1:
		prepareResult(0);
		return 0;
	}
	return 1;
}
const prepareResult = winner => {
	let message = `${winner} are burnt!`;
	if (winner == 0)
		message = 'Dead heat!';
	contentWrapper.innerHTML = message;
	modalResult.style.display = 'block';
}

const closeModal = () => {
	modalResult.style.display = 'none';
	reload();
}

overlay.addEventListener('click', closeModal);
btnClose.addEventListener('click', closeModal);



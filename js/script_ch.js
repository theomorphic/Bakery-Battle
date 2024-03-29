const area = document.getElementById('area');
const btn_change1 = document.getElementById('btn-change1');
const btn_change2 = document.getElementById('btn-change2');
const btn_change3 = document.getElementById('btn-change3');


const lang_switch_eng = document.getElementById('lang-switch-eng');
const lang_switch_ch = document.getElementById('lang-switch-ch');
const lang_switch_ru = document.getElementById('lang-switch-ru');


const MODE_2P = '2 Players';
const MODE_AI = 'AI';
const MODE_NINNY = 'Ninny';

const X_MARK = '<img src="../img/Cookie_mark.png">';
const O_MARK = '<img src="../img/Muffin_mark.png">';

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
	document.getElementById("enemyName").innerHTML = "大马芬";
	document.getElementById("enemyDesc").innerHTML = "世界上最粗暴的马芬";
	document.getElementById("enemyImg").style.backgroundImage = "url('../img/Muffin-Boss-Long.gif')";
	reload();
});
btn_change2.addEventListener('click', e=>{
	mode = MODE_2P;
	document.getElementById("enemyName").innerHTML = "多人游戏";
	document.getElementById("enemyDesc").innerHTML = "在残忍姜饼的战斗上<br>挑战你的朋友或者敌人";
	document.getElementById("enemyImg").style.backgroundImage = "url('../img/Multi-Long.gif')";

	reload();
});
btn_change3.addEventListener('click', e=>{
	mode = MODE_NINNY;
	document.getElementById("enemyName").innerHTML = "酥饼干";
	document.getElementById("enemyDesc").innerHTML = `我们新兵饼干是菜鸟<br>但不是手到擒来`;
	document.getElementById("enemyImg").style.backgroundImage = "url('../img/Milky-Long.gif')";


	reload();
});

area.addEventListener('click', e=>{
	if (e.target.className == 'box') {
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

function one_step_win()
{
	let boxes, result;
	for (i = 0; i < 9; i++) {
		boxes = get_boxes();
		if (boxes[i] == O_MARK || boxes[i] == X_MARK)
			continue;
		boxes[i] = O_MARK;
		result = check_win(boxes);
		if (result)
			return i;
	}
	for (i = 0; i < 9; i++) {
		boxes = get_boxes();
		if (boxes[i] == O_MARK || boxes[i] == X_MARK)
			continue;
		boxes[i] = X_MARK;
		result = check_win(boxes);
		if (result)
			return i;
	}
	return -1;
}

function is_empty(cell)
{
	let boxes = get_boxes();
	if (boxes[cell] == O_MARK || boxes[cell] == X_MARK)
		return 0;
	return 1;
}

function ai()
{
	let choice, result, boxes, empty;
	boxes = get_boxes();
	empty = get_empty(boxes);
	const best_choices = [4, 0, 2, 6, 8, 1, 3, 5, 7];
	if (mode == MODE_AI) {
		result = one_step_win();
		if (result != -1) {
			choice = result;
		} else {
			for (i = 0; i < 5; i++) {
				if (is_empty(best_choices[i])) {
					choice = best_choices[i];
					break;
				}
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
		result = '你赢了! 饼干';
		prepareResult(result);
		return 0;
		break;
	case O_MARK:
		result = '你输了. 蛋糕';
		prepareResult(result);
		return 0;
	case 1:
		prepareResult(0);
		return 0;
	}
	return 1;
}
const prepareResult = winner => {
	let message = `${winner}煎熟好了`;
	if (winner == 0)
		message = '平局';
	contentWrapper.innerHTML = message;
	modalResult.style.display = 'block';
}

const closeModal = () => {
	modalResult.style.display = 'none';
	reload();
}

overlay.addEventListener('click', closeModal);
btnClose.addEventListener('click', closeModal);



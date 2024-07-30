/* eslint-disable default-case */
//Hacker Mode
const gameboard = document.querySelector('.gameboard');
let bulletSpeed=200;
let dirRed;
let dirBlue;
let gamePaused = false;
let game_Over=false;
var sec;
let colourTurn=document.querySelector('.colourTurn');
colourTurn.innerText='BLUE';
const timer = document.querySelector('.timer_text');
const pause = document.querySelector('.pause');
const reset = document.querySelector('.reset');
const resume = document.querySelector('.resume');
const winBoxText=document.querySelector('.winBox p');
const replay=document.querySelector('.replay');
let BulletMoving=false;
const black_screen2=document.querySelector('.blacken2');
const turnRicRed=document.querySelector('.ricRotateRed');
const turnRicBlue=document.querySelector('.ricRotateBlue');
const turnSemiRicRed=document.querySelector('.turnSemiRicRed');
const turnSemiRicBlue=document.querySelector('.turnSemiRicBlue');
let cannon_blue_pos = { x: 6, y: 8 };
let cannon_red_pos = { x: 3, y: 1 };
let sr_pos_red = { x: 5, y: 2 };
let sr_pos_blue = { x: 1, y: 8 };
let r_pos_red = { x: 6, y: 2 };
let r_pos_blue = { x: 2, y: 8 };
let titan_red_pos = { x: 4, y: 1 };
let titan_blue_pos = { x: 5, y: 8 };
let tank_blue_pos = { x: 2, y: 6 };
let tank_red_pos = { x: 6, y: 3 };
let tank_blue_pos2={x:1, y:6};
let tank_red_pos2={x:7 , y:3};
let bullet_red = null;
let bullet_blue = null;
let elements = [cannon_blue_pos, cannon_red_pos, titan_blue_pos, titan_red_pos, tank_blue_pos, 
    tank_red_pos,tank_blue_pos2,tank_red_pos2, sr_pos_blue, sr_pos_red, r_pos_blue, r_pos_red];

function createCells() {  // creates cells
    for (let i = 1; i <= 8; i++) {
        for (let j = 1; j <= 8; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.x = j;
            cell.dataset.y = i;
            gameboard.appendChild(cell);
        }
    }
}

function create_element(tag, class_Name) {  // creates an element
    const element = document.createElement(tag);
    element.className = class_Name;
    return element;
}

function search_cell(x1, y1) {  // searches for a cell
    const cells = document.querySelectorAll('.cell');
    let cell;
    for (let i = 0; i < cells.length; i++) {
        if (parseInt(cells[i].dataset.x) === x1 && parseInt(cells[i].dataset.y) === y1) {
            cell = cells[i];
            break;
        }
    }
    return cell;
}
function placeBulletRed(bullet) {  // places the bullet
    let bulletElement = document.querySelector('.bulletRed');
    if (bulletElement) {
        bulletElement.remove();
    }
   let next_bullet = create_element('div', 'bulletRed');
   let bulletCell = search_cell(bullet.x, bullet.y);
   if (bulletCell) {
       bulletCell.appendChild(next_bullet);
   }
}
function placeBulletBlue(bullet) {  // places the bullet
   let bulletElement = document.querySelector('.bulletBlue');
   if (bulletElement) {
       bulletElement.remove();
   }
  let next_bullet = create_element('div', 'bulletBlue');
  let bulletCell = search_cell(bullet.x, bullet.y);
  if (bulletCell) {
      bulletCell.appendChild(next_bullet);
  }
}
function cannonBlue(position) { // places blue cannon
    let cannon = create_element('div', 'cannonBlue');
    let cannonCell = search_cell(position.x, position.y);
    cannonCell.appendChild(cannon);
    cannon.innerText = 'Cannon';
}

function cannonRed(position) { // places red cannon
    let cannon = create_element('div', 'cannonRed');
    let cannonCell = search_cell(position.x, position.y);
    cannonCell.appendChild(cannon);
    cannon.innerText = 'Cannon';
}

function tankBlue(position,tankClass) { // places blue tank
    let tank = create_element('div', tankClass);
    let tankCell = search_cell(position.x, position.y);
    tankCell.appendChild(tank);
    tank.innerText = "Tank";
}

function tankRed(position,tankClass) {  // places red tank
    let tank = create_element('div', tankClass);
    let tankCell = search_cell(position.x, position.y);
    tankCell.appendChild(tank);
    tank.innerText = "Tank";
}

function titanBlue(position) {  // places Blue Titan
    let titan = create_element('div', 'titanBlue');
    let titanCell = search_cell(position.x, position.y);
    titanCell.appendChild(titan);
    titan.innerText = "Titan";
}

function titanRed(position) {  // places Red Titan
    let titan = create_element('div', 'titanRed');
    let titanCell = search_cell(position.x, position.y);
    titanCell.appendChild(titan);
    titan.innerText = "Titan";
}
function semiRicochetBlue(position) {  // places blue semiricochet
    let semiRicochet = create_element('div', 'semiricBlue');
    semiRicochet.style.transform='rotate(0deg)';
    let semiricCell = search_cell(position.x, position.y);
    semiricCell.appendChild(semiRicochet);
}

function semiRicochetRed(position) {  // places red semiricochet
    let semiRicochet = create_element('div', 'semiricRed');
    semiRicochet.style.transform='rotate(0deg)';
    let semiricCell = search_cell(position.x, position.y);
    semiricCell.appendChild(semiRicochet);
}

function RicochetBlue(position) {  // places blue ricochet
    let Ricochet = create_element('div', 'ricBlue');
    Ricochet.style.transform='rotate(-45deg)';
    let ricCell = search_cell(position.x, position.y);
    ricCell.appendChild(Ricochet);
}

function RicochetRed(position) {  // places red ricochet
    let Ricochet = create_element('div', 'ricRed');
    Ricochet.style.transform='rotate(-45deg)';
    let ricCell = search_cell(position.x, position.y);
    ricCell.appendChild(Ricochet);
}
function ricImpact(bullet) {
    let ricBlue = document.querySelector('.ricBlue');
    let ricRed = document.querySelector('.ricRed');
    
    if ((bullet.x === r_pos_blue.x && bullet.y === r_pos_blue.y) &&
        (ricBlue && ricBlue.style.transform === 'rotate(-45deg)')) {
        return 'right';
    } 
    else if ((bullet.x === r_pos_red.x && bullet.y === r_pos_red.y) &&
             (ricRed && ricRed.style.transform === 'rotate(-45deg)')) {
        return 'right';
    }
    else if ((bullet.x === r_pos_blue.x && bullet.y === r_pos_blue.y) &&
             (ricBlue && ricBlue.style.transform === 'rotate(45deg)')) {
        return 'left';
    }
    else if ((bullet.x === r_pos_red.x && bullet.y === r_pos_red.y) &&
             (ricRed && ricRed.style.transform === 'rotate(45deg)')) {
        return 'left';
    }
    
    return false;
}

function semiRicImpact(bullet) {
    let semiricBlue = document.querySelector('.semiricBlue');
    let semiricRed = document.querySelector('.semiricRed');
    
    if ((bullet.x === sr_pos_blue.x && bullet.y === sr_pos_blue.y) && 
        semiricBlue && semiricBlue.style.transform === 'rotate(0deg)') {
        return 'rightdown';
    } else if ((bullet.x === sr_pos_red.x && bullet.y === sr_pos_red.y) && 
               semiricRed && semiricRed.style.transform === 'rotate(0deg)') {
        return 'rightdown';
    } else if ((bullet.x === sr_pos_red.x && bullet.y === sr_pos_red.y) && 
               semiricRed && semiricRed.style.transform === 'rotate(90deg)') {
        return 'leftdown';
    } else if ((bullet.x === sr_pos_blue.x && bullet.y === sr_pos_blue.y) && 
               semiricBlue && semiricBlue.style.transform === 'rotate(90deg)') {
        return 'leftdown';
    } else if ((bullet.x === sr_pos_blue.x && bullet.y === sr_pos_blue.y) && 
               semiricBlue && semiricBlue.style.transform === 'rotate(180deg)') {
        return 'leftup';
    } else if ((bullet.x === sr_pos_red.x && bullet.y === sr_pos_red.y) && 
               semiricRed && semiricRed.style.transform === 'rotate(180deg)') {
        return 'leftup';
    } else if ((bullet.x === sr_pos_red.x && bullet.y === sr_pos_red.y) && 
               semiricRed && semiricRed.style.transform === 'rotate(270deg)') {
        return 'rightup';
    } else if ((bullet.x === sr_pos_blue.x && bullet.y === sr_pos_blue.y) && 
               semiricBlue && semiricBlue.style.transform === 'rotate(270deg)') {
        return 'rightup';
    }
    return false;
}
function tankImpact(bullet){
    let tankBlue=document.querySelector('.tankBlue');
    let tankRed=document.querySelector('.tankRed');
    let tankBlue2=document.querySelector('.tankBlue2');
    let tankRed2=document.querySelector('.tankRed2');
    let cannonblue=document.querySelector('.cannonBlue');
    let cannonred=document.querySelector('.cannonRed');
    if((bullet.x===tank_blue_pos.x && bullet.y===tank_blue_pos.y)&&(tankBlue))
        return true;
    else if((bullet.x===tank_red_pos.x && bullet.y===tank_red_pos.y)&&(tankRed))
        return true;
    else if((bullet.x===tank_blue_pos2.x && bullet.y===tank_blue_pos2.y)&&(tankBlue2))
        return true;
    else if((bullet.x===tank_red_pos2.x && bullet.y===tank_red_pos2.y)&&(tankRed2))
        return true;
    else if((bullet.x===cannon_blue_pos.x && bullet.y===cannon_blue_pos.y)&&(cannonblue)&&((dirBlue==='left'||dirBlue==='right')||(dirRed==='left'||dirRed==='right')))
        return true;
    else if((bullet.x===cannon_red_pos.x && bullet.y===cannon_red_pos.y)&&(cannonred)&&((dirBlue==='left'||dirBlue==='right')||(dirRed==='left'||dirRed==='right')))
        return true;
    return false;
}

function titanImpact(bullet){
    let titanBlue=document.querySelector('.titanBlue');
    let titanRed=document.querySelector('.titanRed');
    if((bullet.x===titan_blue_pos.x && bullet.y===titan_blue_pos.y)&&(titanBlue)){
        return 'titanBlue';
    }
    if((bullet.x===titan_red_pos.x && bullet.y===titan_red_pos.y)&&(titanRed)){
        return 'titanRed';
    }
    return false;
}

function removeBullet(bulletColour){
    let bulletElement = document.querySelector(bulletColour);
        if (bulletElement) {
            bulletElement.remove();  }
        BulletMoving = false;
}
function handleSemiRicImpact(impactDirection, bulletClass, color,bullet) {
    let dir=color==='Blue'?dirBlue:dirRed;    
    if (dir === 'up') {
        switch (impactDirection) {
            case 'rightdown':
                dir = 'right';
                break;
            case 'leftdown':
                dir = 'left';
                break;
            case 'rightup':
            case 'leftup':
                removeBullet(bulletClass);
                break;
        }
    } 
    else if (dir === 'left') {
        switch (impactDirection) {
            case 'rightdown':
                dir = 'down';
                break;
            case 'rightup':
                dir = 'up';
                break;
            case 'leftdown':
            case 'leftup':
                removeBullet(bulletClass);
                break;
        }
    } 
    else if (dir === 'right') {
        switch (impactDirection) {
            case 'leftdown':
                dir = 'down';
                break;
            case 'leftup':
                dir = 'up';
                break;
            case 'rightdown':
            case 'rightup':
                removeBullet(bulletClass);
                break;
        }
    } 
    else if (dir === 'down') {
        switch (impactDirection) {
            case 'rightup':
                dir = 'right';
                break;
            case 'leftup':
                dir = 'left';
                break;
            case 'rightdown':
            case 'leftdown':
                removeBullet(bulletClass);
                break;
        }
    }
    if (color === 'Blue') 
        dirBlue = dir;
    else 
        dirRed = dir;
}

function handleRicImpact(ricImpactDirection, color) {
    let dir=color==='Blue'?dirBlue:dirRed;
    if (dir === 'up') {
        switch (ricImpactDirection) {
            case 'left':
                dir = 'left';
                break;
            case 'right':
                dir = 'right';
                break;
        }
    } 
    else if (dir === 'left') {
        switch (ricImpactDirection) {
            case 'left':
                dir = 'up';
                break;
            case 'right':
                dir = 'down';
                break;
        }
    } 
    else if (dir === 'right') {
        switch (ricImpactDirection) {
            case 'left':
                dir = 'down';
                break;
            case 'right':
                dir = 'up';
                break;
        }
    } 
    else if (dir === 'down') {
        switch (ricImpactDirection) {
            case 'left':
                dir = 'right';
                break;
            case 'right':
                dir = 'left';
                break;
        }
    }

    if (color === 'Blue') 
        dirBlue = dir;
    else 
        dirRed = dir;
}

function handleTitanImpact(titanImpactColour, colour) {
    let bulletClass=colour==='Blue' ? '.bulletBlue' : '.bulletRed';
    switch (titanImpactColour) {
        case 'titanBlue':
            removeBullet(bulletClass);
            gameOver('Red');
            break;
        case 'titanRed':
            removeBullet(bulletClass);
            gameOver('Blue');
            break;
    }
}

function moveBulletBlue(bullet) {
    if (bullet.y<1 || bullet.y> 8 || bullet.x<1 || bullet.x>8 ||tankImpact(bullet)) {
        removeBullet('.bulletBlue');
        dirBlue='none';
    }
    switch (dirBlue) {
        case 'down':
            bullet.y++;
            break;
        case 'up':
            bullet.y--;
            break;
        case 'right':
            bullet.x++;
            break;
        case 'left':
            bullet.x--;
            break;
    }

    placeBulletBlue(bullet);
    let impactDirection = semiRicImpact(bullet);
    let ricImpactDirection = ricImpact(bullet);
    let titanImpactColour = titanImpact(bullet);
    
    if (!tankImpact(bullet) && bullet.y >= 1 && bullet.y <= 8 && bullet.x >= 1 && bullet.x <= 8) {
        if (impactDirection) 
            handleSemiRicImpact(impactDirection, '.bulletBlue', 'Blue',bullet);
        else if (ricImpactDirection) 
            handleRicImpact(ricImpactDirection, 'Blue');
        else if (titanImpactColour) 
            handleTitanImpact(titanImpactColour, 'Blue');
        
        if (BulletMoving) {
            setTimeout(() => moveBulletBlue(bullet), bulletSpeed);
        }
    } 
    else {
        removeBullet('.bulletBlue');
        dirBlue='none'; }
}

function moveBulletRed(bullet) {
    if (bullet.y < 1 || bullet.y > 8 || bullet.x < 1 || bullet.x > 8 || tankImpact(bullet)) {
        removeBullet('.bulletRed');
        dirRed='none';
    }
    switch (dirRed) {
        case 'down':
            bullet.y++;
            break;
        case 'up':
            bullet.y--;
            break;
        case 'right':
            bullet.x++;
            break;
        case 'left':
            bullet.x--;
            break;
    }

    placeBulletRed(bullet);
    let impactDirection = semiRicImpact(bullet);
    let ricImpactDirection = ricImpact(bullet);
    let titanImpactColour = titanImpact(bullet);
    
    if (!tankImpact(bullet) && bullet.y >= 1 && bullet.y <= 8 && bullet.x >= 1 && bullet.x <= 8) {
        if (impactDirection) 
            handleSemiRicImpact(impactDirection, '.bulletRed', 'Red',bullet);
        else if (ricImpactDirection) 
            handleRicImpact(ricImpactDirection, 'Red');
        else if (titanImpactColour) 
            handleTitanImpact(titanImpactColour, 'Red');
        if (BulletMoving) {
            setTimeout(() => moveBulletRed(bullet), bulletSpeed);
        }
    } 
    else {
        removeBullet('.bulletRed');
        dirRed='none'; }
}

function cannon_red_shoot() {
    if (!BulletMoving) {
        BulletMoving = true;
        bullet_red = { x: cannon_red_pos.x, y: cannon_red_pos.y };
        dirRed = 'down';
        moveBulletRed(bullet_red);
    }
}
function cannon_blue_shoot() {
    if (!BulletMoving) {
        BulletMoving = true;
        bullet_blue = { x: cannon_blue_pos.x, y: cannon_blue_pos.y };
        dirBlue = 'up';
        moveBulletBlue(bullet_blue);
    }
}

function searchXY(x, y) {  // searches if any element is present in that space
    let length = elements.length;
    for (let i = 0; i < length; i++) {
        if (x === elements[i].x && y === elements[i].y) {
            return true;
        }
    }
    return false;
}
function makeGreenOther(x, y,colour) {
    if (x > 1 && !searchXY(x - 1, y)) {
        let cell = search_cell(x - 1, y);
        cell.style.backgroundColor = colour;
    }
    if (x < 8 && !searchXY(x + 1, y)) {
        let cell = search_cell(x + 1, y);
        cell.style.backgroundColor = colour;
    }
    if (y > 1 && !searchXY(x, y - 1)) {
        let cell = search_cell(x, y - 1);
        cell.style.backgroundColor = colour;
    }
    if (y < 8 && !searchXY(x, y + 1)) {
        let cell = search_cell(x, y + 1);
        cell.style.backgroundColor = colour;
    }
    if (x > 1 && y > 1 && !searchXY(x - 1, y - 1)) {
        let cell = search_cell(x - 1, y - 1);
        cell.style.backgroundColor = colour;
    }
    if (x > 1 && y < 8 && !searchXY(x - 1, y + 1)) {
        let cell = search_cell(x - 1, y + 1);
        cell.style.backgroundColor = colour;
    }
    if (x < 8 && y > 1 && !searchXY(x + 1, y - 1)) {
        let cell = search_cell(x + 1, y - 1);
        cell.style.backgroundColor = colour;
    }
    if (x < 8 && y < 8 && !searchXY(x + 1, y + 1)) {
        let cell = search_cell(x + 1, y + 1);
        cell.style.backgroundColor = colour;
    }
}
function makeGreenCannon(x, y,colour) {
    if (x > 1 && !searchXY(x - 1, y)) {
        let cell = search_cell(x - 1, y);
        cell.style.backgroundColor = colour;
    }
    if (x < 8 && !searchXY(x + 1, y)) {
        let cell = search_cell(x + 1, y);
        cell.style.backgroundColor = colour;
    }
}

function cannonBlueSelect() {
    let x = cannon_blue_pos.x;
    let y = cannon_blue_pos.y;
    makeGreenCannon(x, y,'rgb(0,128,0)');
}

function cannonRedSelect() {
    let x = cannon_red_pos.x;
    let y = cannon_red_pos.y;
    makeGreenCannon(x, y,'rgb(0,127,0)');
}

function tankBlueSelect(elementPos,colour) {
    let x = elementPos.x;
    let y = elementPos.y;
    makeGreenOther(x, y,colour);
}

function tankRedSelect(elementPos,colour) {
    let x = elementPos.x;
    let y = elementPos.y;
    makeGreenOther(x, y,colour);
}

function titanBlueSelect() {
    let x = titan_blue_pos.x;
    let y = titan_blue_pos.y;
    makeGreenOther(x, y,'rgb(1,128,0)');
}

function titanRedSelect() {
    let x = titan_red_pos.x;
    let y = titan_red_pos.y;
    makeGreenOther(x, y,'rgb(1,127,0)');

}

function semiRicBlueSelect() {
    let semiRightBlue = document.querySelector('.semiRightBlue');
    let semiLeftBlue = document.querySelector('.semiLeftBlue');
    semiRightBlue.removeEventListener('click', handleSemiLeftBlue);
    semiLeftBlue.removeEventListener('click', handleSemiRightBlue);
    let x = sr_pos_blue.x;
    let y = sr_pos_blue.y;
    turnSemiRicBlue.style.visibility='visible';
    makeGreenOther(x, y,'rgb(0,128,1)');
    semiricRotateBlue();
}

function semiRicRedSelect() {
    let semiRightRed = document.querySelector('.semiRightRed');
    let semiLeftRed = document.querySelector('.semiLeftRed');
    semiRightRed.removeEventListener('click', handleSemiLeftRed);
    semiLeftRed.removeEventListener('click', handleSemiRightRed);
    let x = sr_pos_red.x;
    let y = sr_pos_red.y;
    turnSemiRicRed.style.visibility='visible';
    makeGreenOther(x, y,'rgb(0,128,2)');
    semiricRotateRed();
}

function ricBlueSelect() {
    turnRicBlue.removeEventListener('click',handleRicBlueRotate);
    let x = r_pos_blue.x;
    let y = r_pos_blue.y;
    turnRicBlue.style.visibility='visible';
    makeGreenOther(x, y,'rgb(2,128,1)');
    rotateRicBlue();
}

function ricRedSelect() {
    turnRicRed.removeEventListener('click',handleRicRedRotate);
    let x = r_pos_red.x;
    let y = r_pos_red.y;
    turnRicRed.style.visibility='visible';
    makeGreenOther(x, y,'rgb(1,128,2)');
    rotateRicRed();
}
function rotateRicRed(){
    turnRicRed.addEventListener('click', handleRicRedRotate );
}
function handleRicRedRotate(){
    let object=document.querySelector('.ricRed');
    turnRicRed.style.visibility='hidden';
        if(object.style.transform==='rotate(-45deg)'){
            object.style.transform='rotate(45deg)';  }
        else{
            object.style.transform='rotate(-45deg)'; }
            resetCellColor();
            colourTurn.innerText='BLUE'; 
            sec=31;
            cannon_red_shoot();
}
function rotateRicBlue(){
    turnRicBlue.addEventListener('click',handleRicBlueRotate );
}
function handleRicBlueRotate(){
    let object2=document.querySelector('.ricBlue');
    turnRicBlue.style.visibility='hidden';
        if(object2.style.transform==='rotate(-45deg)'){
            object2.style.transform='rotate(45deg)';  }
        else{
            object2.style.transform='rotate(-45deg)'; }
            resetCellColor();
            colourTurn.innerText='RED';
            sec=31;
            cannon_blue_shoot();
}
function semiricRotateRed(){
    let semiRightRed=document.querySelector('.semiRightRed');
    let semiLeftRed=document.querySelector('.semiLeftRed');
    semiRightRed.addEventListener('click', handleSemiRightRed);
    semiLeftRed.addEventListener('click', handleSemiLeftRed);
}
function handleSemiRightRed(){
    let object=document.querySelector('.semiricRed');
    turnSemiRicRed.style.visibility='hidden';
        if(object.style.transform==='rotate(0deg)'){
            object.style.transform='rotate(90deg)'; }
        else if(object.style.transform==='rotate(90deg)'){
            object.style.transform='rotate(180deg)'; }
        else if(object.style.transform==='rotate(180deg)'){ 
            object.style.transform='rotate(270deg)';  }
        else if(object.style.transform==='rotate(270deg)'){
            object.style.transform='rotate(0deg)';  }
        resetCellColor();
        colourTurn.innerText='BLUE';
        sec=31;
        cannon_red_shoot();
}
function handleSemiLeftRed(){
    let object=document.querySelector('.semiricRed');
    turnSemiRicRed.style.visibility='hidden';
    if(object.style.transform==='rotate(0deg)'){
        object.style.transform='rotate(270deg)';  }
    else if(object.style.transform==='rotate(90deg)'){
        object.style.transform='rotate(0deg)';  }
    else if(object.style.transform==='rotate(180deg)'){
        object.style.transform='rotate(90deg)'; }
    else if(object.style.transform==='rotate(270deg)'){
        object.style.transform='rotate(180deg)';  }
    resetCellColor();
    colourTurn.innerText='BLUE';
    sec=31;
    cannon_red_shoot();
}
function semiricRotateBlue(){
    let semiRightBlue=document.querySelector('.semiRightBlue');
    let semiLeftBlue=document.querySelector('.semiLeftBlue');
    semiRightBlue.addEventListener('click', handleSemiRightBlue);
    semiLeftBlue.addEventListener('click', handleSemiLeftBlue);
}
function handleSemiRightBlue(){
    let object=document.querySelector('.semiricBlue');
    turnSemiRicBlue.style.visibility='hidden';
        if(object.style.transform==='rotate(0deg)'){
            object.style.transform='rotate(90deg)'; }
        else if(object.style.transform==='rotate(90deg)'){
            object.style.transform='rotate(180deg)'; }
        else if(object.style.transform==='rotate(180deg)'){ 
            object.style.transform='rotate(270deg)';  }
        else if(object.style.transform==='rotate(270deg)'){
            object.style.transform='rotate(0deg)';  }
        resetCellColor();
        colourTurn.innerText='RED';
        sec=31;
        cannon_blue_shoot();
}
function handleSemiLeftBlue(){
    let object=document.querySelector('.semiricBlue');
    turnSemiRicBlue.style.visibility='hidden';
        if(object.style.transform==='rotate(0deg)'){
            object.style.transform='rotate(270deg)';  }
        else if(object.style.transform==='rotate(90deg)'){
            object.style.transform='rotate(0deg)';  }
        else if(object.style.transform==='rotate(180deg)'){
            object.style.transform='rotate(90deg)'; }
        else if(object.style.transform==='rotate(270deg)'){
            object.style.transform='rotate(180deg)';  }
        resetCellColor();
        colourTurn.innerText='RED';
        sec=31;
        cannon_blue_shoot();
}
function resetCellColor() {
    cells.forEach(cell => {
        cell.style.backgroundColor = 'white';
    });
}
function cannonBlueGreenSelect() {
    cells.forEach((cell) => {
        cell.addEventListener('click', () => {
            if (cell.style.backgroundColor === 'rgb(0, 128, 0)') {
                // Update cannon position
                cannon_blue_pos.x = parseInt(cell.dataset.x);
                cannon_blue_pos.y = parseInt(cell.dataset.y);
                // Remove previous cannon
                const previousCannon = document.querySelector('.cannonBlue');
                if (previousCannon) {
                    previousCannon.remove();
                }
                cannonBlue(cannon_blue_pos);  // Place new cannon
                colourTurn.innerText='RED';
                sec=31;
                resetCellColor(); // Reset cell colors
                cannon_blue_shoot();
            }
        });
    });
}
function cannonRedGreenSelect() {
    cells.forEach((cell) => {
        cell.addEventListener('click', () => {
            if (cell.style.backgroundColor === 'rgb(0, 127, 0)') {
                // Update cannon position
                cannon_red_pos.x = parseInt(cell.dataset.x);
                cannon_red_pos.y = parseInt(cell.dataset.y);
                // Remove previous cannon
                const previousCannon = document.querySelector('.cannonRed');
                if (previousCannon) {
                    previousCannon.remove();
                }
                cannonRed(cannon_red_pos);  // Place new cannon
                colourTurn.innerText='BLUE';
                sec=31;
                resetCellColor(); // Reset cell colors
                cannon_red_shoot();
            }
        });
    });
}
function titanBlueGreenSelect() {
    cells.forEach((square) => {
        square.addEventListener('click', () => {
            if (square.style.backgroundColor === 'rgb(1, 128, 0)') {
                // Update cannon position
                titan_blue_pos.x = parseInt(square.dataset.x);
                titan_blue_pos.y = parseInt(square.dataset.y);
                // Remove previous cannon
                const previousTitan = document.querySelector('.titanBlue');
                if (previousTitan) {
                    previousTitan.remove();
                }
                titanBlue(titan_blue_pos);  // Place new cannon
                colourTurn.innerText='RED';
                sec=31;
                resetCellColor();  // Reset cell colors
                cannon_blue_shoot(); 
            }
        });
    });
}
function titanRedGreenSelect() {
    cells.forEach((square) => {
        square.addEventListener('click', () => {
            if (square.style.backgroundColor === 'rgb(1, 127, 0)') {
                // Update cannon position
                titan_red_pos.x = parseInt(square.dataset.x);
                titan_red_pos.y = parseInt(square.dataset.y);
                // Remove previous cannon
                const previousTitan = document.querySelector('.titanRed');
                if (previousTitan) {
                    previousTitan.remove();
                }
                titanRed(titan_red_pos);  // Place new cannon
                colourTurn.innerText='BLUE';
                sec=31;
                resetCellColor(); // Reset cell colors
                cannon_red_shoot();
            }
        });
    });
}
function tankRedGreenSelect(colour,elementPos,elemClassWD,elemClass) {
    cells.forEach((square) => {
        square.addEventListener('click', () => {
            if (square.style.backgroundColor ===colour) {
                // Update cannon position
                elementPos.x = parseInt(square.dataset.x);
                elementPos.y = parseInt(square.dataset.y);
                // Remove previous cannon
                const previousTank = document.querySelector(elemClassWD);
                if (previousTank) {
                    previousTank.remove();
                }
                tankRed(elementPos,elemClass);  // Place new cannon
                colourTurn.innerText='BLUE';
                sec=31;
                resetCellColor(); // Reset cell colors
                cannon_red_shoot();
            }
        });
    });
}
function tankBlueGreenSelect(colour,elementPos,elemClassWD,elemClass) {
    cells.forEach((square) => {
        square.addEventListener('click', () => {
            if (square.style.backgroundColor === colour) {
                // Update tank position
                elementPos.x = parseInt(square.dataset.x);
                elementPos.y = parseInt(square.dataset.y);
                // Remove previous tank
                const previousTank = document.querySelector(elemClassWD);
                if (previousTank) {
                    previousTank.remove();
                }
                tankBlue(elementPos,elemClass);  // Place new tank
                colourTurn.innerText='RED';
                sec=31;
                resetCellColor(); // Reset cell colors
                cannon_blue_shoot();
            }
        });
    });
}
function ricBlueGreenSelect(){
    cells.forEach((square) => {
        square.addEventListener('click', () => {
            if (square.style.backgroundColor === 'rgb(2, 128, 1)') {
                // Update cannon position
                r_pos_blue.x = parseInt(square.dataset.x);
                r_pos_blue.y = parseInt(square.dataset.y);
                // Remove previous cannon
                const previousRic = document.querySelector('.ricBlue');
                let rotation=previousRic.style.transform;
                if (previousRic) {
                    previousRic.remove();
                }
                RicochetBlue(r_pos_blue);  // Place new ric
                const currentRic=document.querySelector('.ricBlue');
                currentRic.style.transform=rotation;
                colourTurn.innerText='RED';
                sec=31;
                resetCellColor(); // Reset cell colors
                cannon_blue_shoot();
                turnRicBlue.style.visibility='hidden';
            }
        });
    });
}
function ricRedGreenSelect(){
    cells.forEach((square) => {
        square.addEventListener('click', () => {
            if (square.style.backgroundColor === 'rgb(1, 128, 2)') {
                // Update cannon position
                r_pos_red.x = parseInt(square.dataset.x);
                r_pos_red.y = parseInt(square.dataset.y);
                // Remove previous cannon
                const previousRic = document.querySelector('.ricRed');
                let rotation=previousRic.style.transform;
                if (previousRic) {
                    previousRic.remove();
                }
                RicochetRed(r_pos_red);  // Place new ric
                const currentRic=document.querySelector('.ricRed');
                currentRic.style.transform=rotation;
                colourTurn.innerText='BLUE';
                sec=31;
                resetCellColor(); // Reset cell colors
                cannon_red_shoot();
                turnRicRed.style.visibility='hidden';
            }
        });
    });
}
function semiricBlueGreenSelect(){
    cells.forEach((square) => {
        square.addEventListener('click', () => {
            if (square.style.backgroundColor === 'rgb(0, 128, 1)') {
                // Update cannon position
                sr_pos_blue.x = parseInt(square.dataset.x);
                sr_pos_blue.y = parseInt(square.dataset.y);
                // Remove previous cannon
                const previousSemiRic = document.querySelector('.semiricBlue');
                let rotation=previousSemiRic.style.transform;
                if (previousSemiRic) {
                    previousSemiRic.remove();
                }
                semiRicochetBlue(sr_pos_blue);  // Place new ric
                const currentSemiRic=document.querySelector('.semiricBlue');
                currentSemiRic.style.transform=rotation;
                colourTurn.innerText='RED';
                sec=31;
                resetCellColor(); // Reset cell colors
                cannon_blue_shoot();
                turnSemiRicBlue.style.visibility='hidden';
            }
        });
    });
}
function semiricRedGreenSelect(){
    cells.forEach((square) => {
        square.addEventListener('click', () => {
            if (square.style.backgroundColor === 'rgb(0, 128, 2)') {
                // Update semiric position
                sr_pos_red.x = parseInt(square.dataset.x);
                sr_pos_red.y = parseInt(square.dataset.y);
                // Remove previous semiric
                const previousSemiRic = document.querySelector('.semiricRed');
                let rotation=previousSemiRic.style.transform;
                if (previousSemiRic) {
                    previousSemiRic.remove();
                }
                semiRicochetRed(sr_pos_red);  // Place new semiric
                const currentSemiRic=document.querySelector('.semiricRed');
                currentSemiRic.style.transform=rotation;
                colourTurn.innerText='BLUE';
                sec=31;
                resetCellColor(); // Reset cell colors
                cannon_red_shoot();
                turnSemiRicRed.style.visibility='hidden';
            }
        });
    });
}
function selectCell() {
      cells.forEach((cell) => {
        cell.addEventListener('click', () => {
        if(!BulletMoving){   //No piece can be selected while bullet is moving
            let x = parseInt(cell.dataset.x);
            let y = parseInt(cell.dataset.y);
            if (searchXY(x, y)) {
                resetCellColor();
                if(colourTurn.innerText==='BLUE'){
                if (x === cannon_blue_pos.x && y === cannon_blue_pos.y) {
                    turnRicBlue.style.visibility='hidden';
                    turnSemiRicBlue.style.visibility='hidden';
                    cannonBlueSelect();
                    cannonBlueGreenSelect(); }
                else if (x === tank_blue_pos.x && y === tank_blue_pos.y) {
                    turnRicBlue.style.visibility='hidden';
                    turnSemiRicBlue.style.visibility='hidden';
                    tankBlueSelect(tank_blue_pos,'rgb(1,128,1)');
                    tankBlueGreenSelect('rgb(1, 128, 1)',tank_blue_pos,'.tankBlue','tankBlue');
                } 
                else if (x === tank_blue_pos2.x && y === tank_blue_pos2.y) {
                    turnRicBlue.style.visibility='hidden';
                    turnSemiRicBlue.style.visibility='hidden';
                    tankBlueSelect(tank_blue_pos2,'rgb(1,129,1)');
                    tankBlueGreenSelect('rgb(1, 129, 1)',tank_blue_pos2,'.tankBlue2','tankBlue2');
                } 
                else if (x === titan_blue_pos.x && y === titan_blue_pos.y) {
                    turnRicBlue.style.visibility='hidden';
                    turnSemiRicBlue.style.visibility='hidden';
                    titanBlueSelect();
                    titanBlueGreenSelect();
                }
                else if (x === sr_pos_blue.x && y === sr_pos_blue.y) {
                    turnRicBlue.style.visibility='hidden';
                    semiRicBlueSelect();
                    semiricBlueGreenSelect();
                } 
                else if (x === r_pos_blue.x && y === r_pos_blue.y) {
                    turnSemiRicBlue.style.visibility='hidden';
                    ricBlueSelect();
                    ricBlueGreenSelect();
                }
                }
                if(colourTurn.innerText==='RED'){
                  if (x === cannon_red_pos.x && y === cannon_red_pos.y) {
                    turnRicRed.style.visibility='hidden';
                    turnSemiRicRed.style.visibility='hidden';
                    cannonRedSelect();
                    cannonRedGreenSelect();
                }  
                else if (x === tank_red_pos.x && y === tank_red_pos.y) {
                    turnRicRed.style.visibility='hidden';
                    turnSemiRicRed.style.visibility='hidden';
                    tankRedSelect(tank_red_pos,'rgb(1,127,1)');
                    tankRedGreenSelect('rgb(1, 127, 1)',tank_red_pos,'.tankRed','tankRed');
                } 
                else if (x === tank_red_pos2.x && y === tank_red_pos2.y) {
                    turnRicRed.style.visibility='hidden';
                    turnSemiRicRed.style.visibility='hidden';
                    tankRedSelect(tank_red_pos2,'rgb(0,127,1)');
                    tankRedGreenSelect('rgb(0, 127, 1)',tank_red_pos2,'.tankRed2','tankRed2');
                } 
                else if (x === titan_red_pos.x && y === titan_red_pos.y) {
                    turnRicRed.style.visibility='hidden';
                    turnSemiRicRed.style.visibility='hidden';
                    titanRedSelect();
                    titanRedGreenSelect();
                } 
                else if (x === sr_pos_red.x && y === sr_pos_red.y) {
                    turnRicRed.style.visibility='hidden';
                    semiRicRedSelect();
                    semiricRedGreenSelect();
                } 
                else if (x === r_pos_red.x && y === r_pos_red.y) {
                    turnSemiRicRed.style.visibility='hidden';
                    ricRedSelect();
                    ricRedGreenSelect();
                }
            }
            }
        }
        });
    });
}
function timer_func() {
    sec = 31;
    var timerId = setInterval(function () {
        if (!gamePaused && !game_Over) {
            sec--;
        }
        if(sec===30)
            timer.style.color='rgb(240, 3, 3)';
        else
           timer.style.color='black';
        if (sec < 10)
            timer.innerHTML = "00:0" + sec+"s";
        else {
            timer.innerHTML = "00:" + sec+"s";
        }
        if (sec < 1) {
            clearInterval(timerId);
            if(colourTurn.innerText==='RED'){
                gameOver('Blue');  }
            if(colourTurn.innerText==='BLUE'){
                gameOver('Red');   }
        }
    }, 1000);
}

function pause_game() {
    pause.addEventListener('click', () => {
    if(!BulletMoving){  //Game cannot be paused when bullet is moving
        gamePaused = true;
        black_screen2.style.visibility='visible';
        pause.disabled=true; }
    })
}
function resume_game(){
    resume.addEventListener('click',()=>{
        gamePaused = false;
        pause.disabled=false;
        black_screen2.style.visibility='hidden';
    })
}
function reset_func(){
    reset.addEventListener('click',()=>{
        window.location.reload();
    })
}
function gameOver(colour){
    game_Over=true;
    let black_screen1=document.querySelector('.blacken1');
    black_screen1.style.visibility='visible';
    winBoxText.innerText=`${colour} Wins`;
    if(colour==='Red')
        winBoxText.style.color="rgb(233, 111, 81)";
    else
        winBoxText.style.color="rgb(156, 156, 248)";
    replay.addEventListener('click',()=>{
        window.location.reload();
    })
}

createCells();
const cells= Array.from(document.querySelectorAll('.cell'));
cannonBlue(cannon_blue_pos);
cannonRed(cannon_red_pos);
tankBlue(tank_blue_pos,'tankBlue');
tankRed(tank_red_pos,'tankRed');
tankBlue(tank_blue_pos2,'tankBlue2');
tankRed(tank_red_pos2,'tankRed2');
titanBlue(titan_blue_pos);
titanRed(titan_red_pos);
semiRicochetBlue(sr_pos_blue);
semiRicochetRed(sr_pos_red);
RicochetBlue(r_pos_blue);
RicochetRed(r_pos_red);
selectCell();
timer_func();
pause_game();
resume_game();
reset_func();
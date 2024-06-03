/* eslint-disable default-case */
//Hacker Mode
const gameboard = document.querySelector('.gameboard');
let interval = 200;
let bulletSpeed=200;
let dirRed;
let dirBlue;
let gamePaused = false;
let game_Over=false;
let BulletMoving=false;
var sec; 
let colourTurn=document.querySelector('.colourTurn');
let semiRicBlueDestroyed=false;
let semiRicRedDestroyed=false;
let semiRicBlueAngle=null;
let semiRicRedAngle=null;
let prevSemiRicBluePos;
let prevSemiRicRedPos;
colourTurn.innerText='BLUE';
const timer = document.querySelector('.timer_text');
const pause = document.querySelector('.pause');
const reset = document.querySelector('.reset');
const resume = document.querySelector('.resume');
const winBoxText=document.querySelector('.winBox p');
const replay=document.querySelector('.replay');
const undoButton=document.querySelector('.undo');
let undoCount=0;
const redoButton=document.querySelector('.redo'); 
const ricRed=document.querySelector('.ricRed');
const ricBlue=document.querySelector('.ricBlue');
const black_screen2=document.querySelector('.blacken2');
const turnRicRed=document.querySelector('.ricRotateRed');
const turnRicBlue=document.querySelector('.ricRotateBlue');
const turnSemiRicRed=document.querySelector('.turnSemiRicRed');
const turnSemiRicBlue=document.querySelector('.turnSemiRicBlue');
const gameHistory=document.querySelector('.gameHistory');
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
let lastMove=null;
let elements = [cannon_blue_pos, cannon_red_pos, titan_blue_pos, titan_red_pos, tank_blue_pos, 
    tank_red_pos,tank_blue_pos2,tank_red_pos2, sr_pos_blue, sr_pos_red, r_pos_blue, r_pos_red];

let elements_noTitanCannon=[tank_blue_pos, tank_red_pos,tank_blue_pos2,tank_red_pos2, 
    sr_pos_blue, sr_pos_red]; //without titan & cannon

const elemlength=elements_noTitanCannon.length;
let gameHistoryStorage=[]; //game history array
let RedoStorage=[];

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
function placeBulletRed(bullet) {  // places the red bullet
    let bulletElement = document.querySelector('.bulletRed');
    if (bulletElement) {
        bulletElement.remove();
    }
   let next_bullet = create_element('img', 'bulletRed');
   next_bullet.src='../assets/bullet.png';
   switch(dirRed){
       case 'up':
           next_bullet.style.transform='rotate(90deg)';
           break;
       case 'down':
           next_bullet.style.transform='rotate(270deg)';
           break;
       case 'left':
           next_bullet.style.transform='rotate(0deg)';
           break;
       case 'right':
           next_bullet.style.transform='rotate(180deg)';
           break;
      }
   let bulletCell = search_cell(bullet.x, bullet.y);
   if (bulletCell) {
       bulletCell.appendChild(next_bullet);
   }
}

function placeBulletBlue(bullet) {  // places the blue bullet
    let bulletElement = document.querySelector('.bulletBlue');
    if (bulletElement) {
        bulletElement.remove();
    }
   let next_bullet = create_element('img', 'bulletBlue');
   next_bullet.src='../assets/bullet.png';
   switch(dirBlue){
    case 'up':
        next_bullet.style.transform='rotate(90deg)';
        break;
    case 'down':
        next_bullet.style.transform='rotate(270deg)';
        break;
    case 'left':
        next_bullet.style.transform='rotate(0deg)';
        break;
    case 'right':
        next_bullet.style.transform='rotate(180deg)';
        break;
   }
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
    if(tankClass==='tankBlue')
    tank.innerText = "Tank 1";
    else
    tank.innerText = "Tank 2";
}

function tankRed(position,tankClass) {  // places red tank
    let tank = create_element('div', tankClass);
    let tankCell = search_cell(position.x, position.y);
    tankCell.appendChild(tank);
    if(tankClass==='tankRed')
    tank.innerText = "Tank 1";
    else
    tank.innerText = "Tank 2";
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
function ricImpact(bullet) {  // Checks the orientation of the ric during bullet impact
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

function semiRicImpact(bullet) {   // Checks the orientation of the semiric during bullet impact
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
function tankImpact(bullet){  //checks for tank impact
    let tankBlue=document.querySelector('.tankBlue');
    let tankRed=document.querySelector('.tankRed');
    let tankBlue2=document.querySelector('.tankBlue2');
    let tankRed2=document.querySelector('.tankRed2');
    let cannonblue=document.querySelector('.cannonBlue');
    let cannonred=document.querySelector('.cannonRed');
    if((bullet.x===tank_blue_pos.x && bullet.y===tank_blue_pos.y)&&(tankBlue)&&(!(dirBlue==='left') && !(dirRed==='left'))){
        tankAbsorb();
        return true;
    }
    else if((bullet.x===tank_red_pos.x && bullet.y===tank_red_pos.y)&&(tankRed)&&(!(dirBlue==='left') && !(dirRed==='left'))){
        tankAbsorb();
        return true;
    }
    else if((bullet.x===tank_blue_pos2.x && bullet.y===tank_blue_pos2.y)&&(tankBlue2)&&(!(dirBlue==='left') && !(dirRed==='left'))){
        tankAbsorb();
        return true;
    }
    else if((bullet.x===tank_red_pos2.x && bullet.y===tank_red_pos2.y)&&(tankRed2)&&(!(dirBlue==='left') && !(dirRed==='left'))){
        tankAbsorb();
        return true;
    }
    else if((bullet.x===cannon_blue_pos.x && bullet.y===cannon_blue_pos.y)&&(cannonblue)&&((dirBlue==='left'||dirBlue==='right')||(dirRed==='left'||dirRed==='right')))
        return true;
    else if((bullet.x===cannon_red_pos.x && bullet.y===cannon_red_pos.y)&&(cannonred)&&((dirBlue==='left'||dirBlue==='right')||(dirRed==='left'||dirRed==='right')))
        return true;
    return false;
}

function titanImpact(bullet){  //checks for titan impact by bullet
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

function removeBullet(bulletColour){   //removes bullet from gameboard
    let bulletElement = document.querySelector(bulletColour);
        if (bulletElement) {
            bulletElement.remove();  }
        BulletMoving = false;
}
function semiRicRemove(colour){  //removes semiric when non reflecting side is hit
    let semiRicElement=document.querySelector(colour);
    if(semiRicElement){
        semiRicElement.remove();  }
    BulletMoving=false;
}
function handleSemiRicImpact(impactDirection, bulletClass, color,bullet) {
    let dir=color==='Blue'?dirBlue:dirRed;               //handles semiric impact by bullet
    if (dir === 'up') {
        switch (impactDirection) {
            case 'rightdown':
                dir = 'right';   //changes the direction of the bullet
                ricBounce();     //according to the direction of semiric
                break;
            case 'leftdown':
                dir = 'left';
                ricBounce();
                break;
            case 'rightup':
            case 'leftup':
                if(bullet.x===sr_pos_blue.x && bullet.y===sr_pos_blue.y){
                    semiRicBlueAngle=document.querySelector('.semiricBlue').style.transform;
                    prevSemiRicBluePos={x:sr_pos_blue.x , y:sr_pos_blue.y};
                    sr_pos_blue.x = null;
                    sr_pos_blue.y = null;
                    semiRicRemove('.semiricBlue');  //removes blue semiric
                    semiRicBlueDestroyed=true;    }   //boolean value for whether blue semiric is destroyed
                else{
                    semiRicRedAngle=document.querySelector('.semiricRed').style.transform;
                    prevSemiRicRedPos={x:sr_pos_red.x , y:sr_pos_red.y};
                    sr_pos_red.x = null;
                    sr_pos_red.y = null;
                    semiRicRemove('.semiricRed');   //removes red semiric
                    semiRicRedDestroyed=true;   }   //boolean value for whether blue semiric is destroyed
                semiRicBreak();
                removeBullet(bulletClass);
                break;
        }
    } 
    else if (dir === 'left') {
        switch (impactDirection) {
            case 'rightdown':
                dir = 'down';
                ricBounce();
                break;
            case 'rightup':
                dir = 'up';
                ricBounce();
                break;
            case 'leftdown':
            case 'leftup':
                if(bullet.x===sr_pos_blue.x && bullet.y===sr_pos_blue.y){
                    semiRicBlueAngle=document.querySelector('.semiricBlue').style.transform;
                    prevSemiRicBluePos={x:sr_pos_blue.x , y:sr_pos_blue.y};
                    sr_pos_blue.x = null;
                    sr_pos_blue.y = null;
                    semiRicRemove('.semiricBlue'); 
                    semiRicBlueDestroyed=true; }
                else{
                    semiRicRedAngle=document.querySelector('.semiricRed').style.transform;
                    prevSemiRicRedPos={x:sr_pos_red.x , y:sr_pos_red.y};
                    sr_pos_red.x = null;
                    sr_pos_red.y = null;
                    semiRicRemove('.semiricRed');
                    semiRicRedDestroyed=true;  }
                semiRicBreak();
                removeBullet(bulletClass);
                break;
        }
    } 
    else if (dir === 'right') {
        switch (impactDirection) {
            case 'leftdown':
                dir = 'down';
                ricBounce();
                break;
            case 'leftup':
                dir = 'up';
                ricBounce();
                break;
            case 'rightdown':
            case 'rightup':
                if(bullet.x===sr_pos_blue.x && bullet.y===sr_pos_blue.y){
                    semiRicBlueAngle=document.querySelector('.semiricBlue').style.transform;
                    prevSemiRicBluePos={x:sr_pos_blue.x , y:sr_pos_blue.y};
                    sr_pos_blue.x = null;
                    sr_pos_blue.y = null;
                    semiRicRemove('.semiricBlue');
                    semiRicBlueDestroyed=true;  }
                else{
                    semiRicRedAngle=document.querySelector('.semiricRed').style.transform;
                    prevSemiRicRedPos={x:sr_pos_red.x , y:sr_pos_red.y};
                    sr_pos_red.x = null;
                    sr_pos_red.y = null;
                    semiRicRemove('.semiricRed');
                    semiRicRedDestroyed=true;  }
                semiRicBreak();
                removeBullet(bulletClass);
                break;
        }
    } 
    else if (dir === 'down') {
        switch (impactDirection) {
            case 'rightup':
                dir = 'right';
                ricBounce();
                break;
            case 'leftup':
                dir = 'left';
                ricBounce();
                break;
            case 'rightdown':
            case 'leftdown':
                if(bullet.x===sr_pos_blue.x && bullet.y===sr_pos_blue.y){
                    semiRicBlueAngle=document.querySelector('.semiricBlue').style.transform;
                    prevSemiRicBluePos={x:sr_pos_blue.x , y:sr_pos_blue.y};
                    sr_pos_blue.x = null;
                    sr_pos_blue.y = null;
                    semiRicRemove('.semiricBlue');
                    semiRicBlueDestroyed=true;  }
                else{
                    semiRicRedAngle=document.querySelector('.semiricRed').style.transform;
                    prevSemiRicRedPos={x:sr_pos_red.x , y:sr_pos_red.y};
                    sr_pos_red.x = null;
                    sr_pos_red.y = null;
                    semiRicRemove('.semiricRed');
                    semiRicRedDestroyed=true;  }
                semiRicBreak();
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
                dir = 'left'; //changes direction of bullet according to
                break;        //direction of ricochet
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
    ricBounce();
}

function handleTitanImpact(titanImpactColour, colour) {
    let bulletClass=colour==='Blue' ? '.bulletBlue' : '.bulletRed';
    switch (titanImpactColour) {
        case 'titanBlue':
            removeBullet(bulletClass);
            gameOver('Red');    //if bullet hits titan, game ends
            break;
        case 'titanRed':
            removeBullet(bulletClass);
            gameOver('Blue');
            break;
    }
}

function moveBulletBlue(bullet) {
    if (bullet.y<1 || bullet.y> 8 || bullet.x <1 || bullet.x>8 ||tankImpact(bullet)) {
        removeBullet('.bulletBlue');
        dirBlue='none';   //remove bullet if it goes out of gameboard
    }
    switch (dirBlue) {
        case 'down':
            bullet.y++;                      
            break;
        case 'up':
            bullet.y--;
            break;
        case 'right':              //changes bullet's coordinates according to its direction
            bullet.x++;
            break;
        case 'left':
            bullet.x--;
            break;
    }

    placeBulletBlue(bullet);    //places the bullet
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
            setTimeout(() => requestAnimationFrame(() => moveBulletBlue(bullet)), bulletSpeed);
        }
    } 
    else {
        removeBullet('.bulletBlue');    //remove bullet if hits tank
        dirBlue='none'; }
}

function moveBulletRed(bullet) {
    if (bullet.y < 1 || bullet.y > 8 || bullet.x < 1 || bullet.x > 8 || tankImpact(bullet)) {
        removeBullet('.bulletRed');
        dirRed='none';      //remove bullet if it goes out of gameboard
    }
    switch (dirRed) {
        case 'down':
            bullet.y++;
            break;
        case 'up':
            bullet.y--;
            break;                 //changes bullet's coordinates according to its direction
        case 'right':
            bullet.x++;
            break;
        case 'left':
            bullet.x--;
            break;
    }

    placeBulletRed(bullet);     //places the bullet
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
            setTimeout(() => requestAnimationFrame(() => moveBulletRed(bullet)), bulletSpeed);
        }
    } 
    else {
        removeBullet('.bulletRed');    //remove bullet if hits tank
        dirRed='none'; }
}

function cannon_red_shoot() {       //shoots bullets from red cannon
    if (!BulletMoving) {
        BulletMoving = true;
        bullet_red = { x: cannon_red_pos.x, y: cannon_red_pos.y };
        dirRed = 'down';
        moveBulletRed(bullet_red);
        cannonSound();        
    }
}
function cannon_blue_shoot() {     //shoots bullets from blue cannon
    if (!BulletMoving) {
        BulletMoving = true;
        bullet_blue = { x: cannon_blue_pos.x, y: cannon_blue_pos.y };
        dirBlue = 'up';
        moveBulletBlue(bullet_blue);
        cannonSound();
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
function makeGreenOther(x, y,colour) {    //makes cells green in colour for valid moves
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
function makeGreenCannon(x, y,colour) {  //makes cells green in colour for valid cannon moves
    if (x > 1 && !searchXY(x - 1, y)) {
        let cell = search_cell(x - 1, y);
        cell.style.backgroundColor = colour;
    }
    if (x < 8 && !searchXY(x + 1, y)) {
        let cell = search_cell(x + 1, y);
        cell.style.backgroundColor = colour;
    }
}

function cannonBlueSelect() {    //function for selecting blue cannon
    let x = cannon_blue_pos.x;
    let y = cannon_blue_pos.y;
    makeGreenCannon(x, y,'rgb(0,128,0)');
}

function cannonRedSelect() {     //function for selecting red cannon
    let x = cannon_red_pos.x;
    let y = cannon_red_pos.y;
    makeGreenCannon(x, y,'rgb(0,127,0)');
}

function tankBlueSelect(elementPos,colour) {    //function for selecting blue tank
    let x = elementPos.x;
    let y = elementPos.y;
    makeGreenOther(x, y,colour);
}

function tankRedSelect(elementPos,colour) {   //function for selecting red tank
    let x = elementPos.x;
    let y = elementPos.y;
    makeGreenOther(x, y,colour);
}

function titanBlueSelect() {  //function for selecting blue titan
    let x = titan_blue_pos.x;
    let y = titan_blue_pos.y;
    makeGreenOther(x, y,'rgb(1,128,0)');
}

function titanRedSelect() {     //function for selecting red titan
    let x = titan_red_pos.x;
    let y = titan_red_pos.y;
    makeGreenOther(x, y,'rgb(1,127,0)');

}

function semiRicBlueSelect() {    //function for selecting blue semiric
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

function semiRicRedSelect() {    //function for selecting red semiric
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

function ricBlueSelect() {      //function for selecting blue ric
    turnRicBlue.removeEventListener('click',handleRicBlueRotate);
    let x = r_pos_blue.x;
    let y = r_pos_blue.y;
    turnRicBlue.style.visibility='visible';
    makeGreenOther(x, y,'rgb(2,128,1)');
    makeGreenRicSwap('rgb(2,128,1)');
    search_cell(r_pos_red.x,r_pos_red.y).style.backgroundColor='rgb(2,128,1)';
    rotateRicBlue();
}

function ricRedSelect() {    //function for selecting red ric
    turnRicRed.removeEventListener('click',handleRicRedRotate);
    let x = r_pos_red.x;
    let y = r_pos_red.y;
    turnRicRed.style.visibility='visible';
    makeGreenOther(x, y,'rgb(1,128,2)');
    makeGreenRicSwap('rgb(1,128,2)');
    search_cell(r_pos_blue.x,r_pos_blue.y).style.backgroundColor='rgb(1,128,2)';
    rotateRicRed();
}

function makeGreenRicSwap(colour){    //function for making cells green for ricochet swapping
    cells.forEach((cell)=>{ 
        let x1=parseInt(cell.dataset.x);
        let y1=parseInt(cell.dataset.y); 
        for(let i=0;i<elemlength;i++){
            if(elements_noTitanCannon[i].x===x1 && elements_noTitanCannon[i].y===y1){
                cell.style.backgroundColor=colour;
                break;
            }
        }
    });
}
function rotateRicRed(){     //function for rotating red ricochet
    turnRicRed.addEventListener('click',handleRicRedRotate);
}
function handleRicRedRotate(){
    let object=document.querySelector('.ricRed');
    let ricRotation=object.style.transform;
    turnRicRed.style.visibility='hidden';
        if(ricRotation==='rotate(-45deg)'){
            object.style.transform='rotate(45deg)';  }
        else{
            object.style.transform='rotate(-45deg)'; }
            resetCellColor();
            colourTurn.innerText='BLUE'; 
            sec=31;
            cannon_red_shoot();
            undoCount=1;
            semiRicBlueDestroyed=false;
            semiRicRedDestroyed=false;
            gameHistoryPush(`Red Ricochet rotated`);
            gameHistoryStorage.push({piece:'RedRic', r1:ricRotation, r2:object.style.transform, move:'rotate'});
}
function rotateRicBlue(){  //function for rotating blue ricochet
    turnRicBlue.addEventListener('click',handleRicBlueRotate );
}
function handleRicBlueRotate(){
    let object2=document.querySelector('.ricBlue');
    let ricRotation= object2.style.transform;
    turnRicBlue.style.visibility='hidden';
    if(ricRotation==='rotate(-45deg)'){
        object2.style.transform='rotate(45deg)';  }
    else{
        object2.style.transform='rotate(-45deg)'; }
        resetCellColor();
        colourTurn.innerText='RED';
        sec=31;
        cannon_blue_shoot();
        undoCount=1;
        semiRicBlueDestroyed=false;
        semiRicRedDestroyed=false;
        gameHistoryPush(`Blue Ricochet rotated`);
        gameHistoryStorage.push({piece:'BlueRic', r1:ricRotation, r2:object2.style.transform, move:'rotate'});
}
function semiricRotateRed(){   //function for rotating red semiricochet
    let semiRightRed=document.querySelector('.semiRightRed');
    let semiLeftRed=document.querySelector('.semiLeftRed');
    let turnSemiRicRed=document.querySelector('.turnSemiRicRed');
    semiRightRed.addEventListener('click',handleSemiRightRed);
    semiLeftRed.addEventListener('click',handleSemiLeftRed);
}
function handleSemiRightRed(){
    let object=document.querySelector('.semiricRed');
    let semiRicRotation=object.style.transform;
    turnSemiRicRed.style.visibility='hidden';
        if(semiRicRotation==='rotate(0deg)'){
            object.style.transform='rotate(90deg)'; }
        else if(semiRicRotation==='rotate(90deg)'){
            object.style.transform='rotate(180deg)'; }
        else if(semiRicRotation==='rotate(180deg)'){ 
            object.style.transform='rotate(270deg)';  }
        else if(semiRicRotation==='rotate(270deg)'){
            object.style.transform='rotate(0deg)';  }
        resetCellColor();
        colourTurn.innerText='BLUE';
        sec=31;
        cannon_red_shoot();
        undoCount=1;
        semiRicBlueDestroyed=false;
        gameHistoryPush(`Red Semi Ricochet rotated towards Right`);
        gameHistoryStorage.push({piece:'RedSemiRic', r1:semiRicRotation, r2:object.style.transform, move:'rotate'}); 
}
function handleSemiLeftRed(){
    let object=document.querySelector('.semiricRed');
    let semiRicRotation=object.style.transform;
    turnSemiRicRed.style.visibility='hidden';
    if(semiRicRotation==='rotate(0deg)'){
        object.style.transform='rotate(270deg)';  }
    else if(semiRicRotation==='rotate(90deg)'){
        object.style.transform='rotate(0deg)';  }
    else if(semiRicRotation==='rotate(180deg)'){
        object.style.transform='rotate(90deg)'; }
    else if(semiRicRotation==='rotate(270deg)'){
        object.style.transform='rotate(180deg)';  }
    resetCellColor();
    colourTurn.innerText='BLUE';
    sec=31;
    cannon_red_shoot();
    undoCount=1;
    semiRicBlueDestroyed=false;
    gameHistoryPush(`Red Semi Ricochet rotated towards Left`);
    gameHistoryStorage.push({piece:'RedSemiRic', r1:semiRicRotation, r2:object.style.transform, move:'rotate'});
}
function semiricRotateBlue(){   //function for rotating blue semiricochet
    let semiRightBlue=document.querySelector('.semiRightBlue');
    let semiLeftBlue=document.querySelector('.semiLeftBlue');
    let turnSemiRicBlue=document.querySelector('.turnSemiRicBlue');
    semiRightBlue.addEventListener('click',handleSemiRightBlue);
    semiLeftBlue.addEventListener('click',handleSemiLeftBlue);
}
function handleSemiRightBlue(){
    let object=document.querySelector('.semiricBlue');
    let semiRicRotation=object.style.transform;
    turnSemiRicBlue.style.visibility='hidden';
        if(semiRicRotation==='rotate(0deg)'){
            object.style.transform='rotate(90deg)'; }
        else if(semiRicRotation==='rotate(90deg)'){
            object.style.transform='rotate(180deg)'; }
        else if(semiRicRotation==='rotate(180deg)'){ 
            object.style.transform='rotate(270deg)';  }
        else if(semiRicRotation ==='rotate(270deg)'){
            object.style.transform='rotate(0deg)';  }
        resetCellColor();
        colourTurn.innerText='RED';
        sec=31;
        cannon_blue_shoot();
        undoCount=1;
        semiRicRedDestroyed=false;
        gameHistoryPush(`Blue Semi Ricochet rotated towards Right`);
        gameHistoryStorage.push({piece:'BlueSemiRic', r1:semiRicRotation, r2:object.style.transform, move:'rotate'}); 
}
function handleSemiLeftBlue(){
    let object=document.querySelector('.semiricBlue');
    let semiRicRotation=object.style.transform;
    turnSemiRicBlue.style.visibility='hidden';
        if(semiRicRotation==='rotate(0deg)'){
            object.style.transform='rotate(270deg)';  }
        else if(semiRicRotation==='rotate(90deg)'){
            object.style.transform='rotate(0deg)';  }
        else if(semiRicRotation==='rotate(180deg)'){
            object.style.transform='rotate(90deg)'; }
        else if(semiRicRotation==='rotate(270deg)'){
            object.style.transform='rotate(180deg)';  }
        resetCellColor();
        colourTurn.innerText='RED';
        sec=31;
        cannon_blue_shoot();
        undoCount=1;
        semiRicRedDestroyed=false;
        gameHistoryPush(`Blue Semi Ricochet rotated towards Left`);
        gameHistoryStorage.push({piece:'BlueSemiRic', r1:semiRicRotation, r2:object.style.transform, move:'rotate'}); 
}
function resetCellColor() {  //resetting cell colours to white
    cells.forEach(cell => {
        cell.style.backgroundColor = 'white';
    });
}
function cannonBlueGreenSelect() {   //moving blue cannon to selected cell
    cells.forEach((cell) => {
        cell.addEventListener('click', () => {
            if (cell.style.backgroundColor === 'rgb(0, 128, 0)') {
                let prevPos={x:cannon_blue_pos.x , y:cannon_blue_pos.y};
                // update cannon position
                cannon_blue_pos.x = parseInt(cell.dataset.x);
                cannon_blue_pos.y = parseInt(cell.dataset.y);
                // remove previous cannon
                const previousCannon = document.querySelector('.cannonBlue');
                if (previousCannon) {
                    previousCannon.remove();
                }
                cannonBlue(cannon_blue_pos);  // Place new cannon
                colourTurn.innerText='RED';
                sec=31;
                resetCellColor(); // Reset cell colors
                cannon_blue_shoot();
                undoCount=1;
                semiRicBlueDestroyed=false;
                semiRicRedDestroyed=false;
                gameHistoryPush(`Blue Cannon : (${prevPos.x},${prevPos.y}) to (${cannon_blue_pos.x},${cannon_blue_pos.y})`);
                gameHistoryStorage.push({piece:'BlueCannon', x1:prevPos.x, y1:prevPos.y, x2:cannon_blue_pos.x, y2:cannon_blue_pos.y, move:'shift'});
            }
        });
    });
}
function cannonRedGreenSelect() {   //moving red cannon to selected cell
    cells.forEach((cell) => {
        cell.addEventListener('click', () => {
            if (cell.style.backgroundColor === 'rgb(0, 127, 0)') {
                let prevPos={x:cannon_red_pos.x , y:cannon_red_pos.y};
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
                undoCount=1;
                semiRicBlueDestroyed=false;
                semiRicRedDestroyed=false;
                gameHistoryPush(`Red Cannon : (${prevPos.x},${prevPos.y}) to (${cannon_red_pos.x},${cannon_red_pos.y})`);
                gameHistoryStorage.push({piece:'RedCannon', x1:prevPos.x, y1:prevPos.y,x2:cannon_red_pos.x,y2:cannon_red_pos.y, move:'shift'});
            }
        });
    });
}
function titanBlueGreenSelect() {   //moving blue titan to selected cell
    cells.forEach((square) => {
        square.addEventListener('click', () => {
            if (square.style.backgroundColor === 'rgb(1, 128, 0)') {
                let prevPos={x:titan_blue_pos.x , y:titan_blue_pos.y};
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
                undoCount=1;
                semiRicBlueDestroyed=false;
                semiRicRedDestroyed=false;
                gameHistoryPush(`Blue Titan : (${prevPos.x},${prevPos.y}) to (${titan_blue_pos.x},${titan_blue_pos.y})`);
                gameHistoryStorage.push({piece:'BlueTitan', x1:prevPos.x, y1:prevPos.y,x2:titan_blue_pos.x,y2:titan_blue_pos.y, move:'shift'});
            }
        });
    });
}
function titanRedGreenSelect() {    //moving red titan to selected cell
    cells.forEach((square) => {
        square.addEventListener('click', () => {
            if (square.style.backgroundColor === 'rgb(1, 127, 0)') {
                let prevPos={x:titan_red_pos.x , y:titan_red_pos.y};
                // Update titan position
                titan_red_pos.x = parseInt(square.dataset.x);
                titan_red_pos.y = parseInt(square.dataset.y);
                // Remove previous titan
                const previousTitan = document.querySelector('.titanRed');
                if (previousTitan) {
                    previousTitan.remove();
                }
                titanRed(titan_red_pos);  // Place new titan
                colourTurn.innerText='BLUE';
                sec=31;
                resetCellColor(); // Reset cell colors
                cannon_red_shoot();
                undoCount=1;
                semiRicBlueDestroyed=false;
                semiRicRedDestroyed=false;
                gameHistoryPush(`Red Titan : (${prevPos.x},${prevPos.y}) to (${titan_red_pos.x},${titan_red_pos.y})`);
                gameHistoryStorage.push({piece:'RedTitan',x1:prevPos.x, y1:prevPos.y,x2:titan_red_pos.x,y2:titan_red_pos.y, move:'shift'});
            }
        });
    });
}
function tankRedGreenSelect(colour,elementPos,elemClassWD,elemClass) {
    cells.forEach((square) => {       //moving red tank to selected cell
        square.addEventListener('click', () => {
            if (square.style.backgroundColor ===colour) {
                let prevPos={x:elementPos.x , y:elementPos.y};
                // Update tank position
                elementPos.x = parseInt(square.dataset.x);
                elementPos.y = parseInt(square.dataset.y);
                // Remove previous tank
                const previousTank = document.querySelector(elemClassWD);
                if (previousTank) {
                    previousTank.remove();
                }
                tankRed(elementPos,elemClass);  // Place new tank
                colourTurn.innerText='BLUE';
                sec=31;
                resetCellColor(); // Reset cell colors
                cannon_red_shoot();
                undoCount=1;
                semiRicBlueDestroyed=false;
                semiRicRedDestroyed=false;
                if(elemClass==='tankRed'){
                gameHistoryPush(`Red Tank 1 : (${prevPos.x},${prevPos.y})  to (${elementPos.x},${elementPos.y})`);
                gameHistoryStorage.push({piece:'RedTank',x1:prevPos.x,y1:prevPos.y,x2:tank_red_pos.x,y2:tank_red_pos.y, move:'shift'});
                }
                else{
                gameHistoryPush(`Red Tank 2 : (${prevPos.x},${prevPos.y})  to (${elementPos.x},${elementPos.y})`);
                gameHistoryStorage.push({piece:'RedTank2',x1:prevPos.x,y1:prevPos.y,x2:tank_red_pos2.x,y2:tank_red_pos2.y, move:'shift'});
                }
            }
        });
    });
}
function tankBlueGreenSelect(colour,elementPos,elemClassWD,elemClass) {
    cells.forEach((square) => {     //moving blue tank to selected cell
        square.addEventListener('click', () => {
            if (square.style.backgroundColor === colour) {
                let prevPos={x:elementPos.x , y:elementPos.y};
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
                undoCount=1;
                semiRicBlueDestroyed=false;
                semiRicRedDestroyed=false;
                if(elemClass==='tankBlue'){
                    gameHistoryPush(`Blue Tank 1 : (${prevPos.x},${prevPos.y})  to (${elementPos.x},${elementPos.y})`);
                    gameHistoryStorage.push({piece:'BlueTank',x1:prevPos.x,y1:prevPos.y,x2:tank_blue_pos.x,y2:tank_blue_pos.y, move:'shift'});
                }
                else{
                    gameHistoryPush(`Blue Tank 2 : (${prevPos.x},${prevPos.y})  to (${elementPos.x},${elementPos.y})`);
                    gameHistoryStorage.push({piece:'BlueTank2',x1:prevPos.x,y1:prevPos.y,x2:tank_blue_pos2.x,y2:tank_blue_pos2.y, move:'shift'});
                }
            }
        });
    });
}
function ricBlueGreenSelect(){    //moving blue ric to selected cell
    cells.forEach((square) => {
        square.addEventListener('click', () => {
            if (square.style.backgroundColor === 'rgb(2, 128, 1)') {
                let prevPos={x:r_pos_blue.x,y:r_pos_blue.y};
                let swap=false;
                let swappedPiece=null;
                // Update cannon position
                let clickx = parseInt(square.dataset.x);
                let clicky = parseInt(square.dataset.y);
                r_pos_blue.x = clickx;
                r_pos_blue.y = clicky;
                // Remove previous cannon
                const previousRic = document.querySelector('.ricBlue');
                let rotation=previousRic.style.transform;
                if (previousRic) {
                    previousRic.remove();
                }
                if(clickx===tank_blue_pos.x && clicky===tank_blue_pos.y){
                    document.querySelector('.tankBlue').remove();
                    tank_blue_pos.x=prevPos.x;
                    tank_blue_pos.y=prevPos.y;
                    tankBlue(tank_blue_pos,'tankBlue');
                    swap=true;
                    swappedPiece='BlueTank';
                }
                else if(clickx===tank_blue_pos2.x && clicky===tank_blue_pos2.y){
                    document.querySelector('.tankBlue2').remove();
                    tank_blue_pos2.x=prevPos.x;
                    tank_blue_pos2.y=prevPos.y;
                    tankBlue(tank_blue_pos2,'tankBlue2');
                    swap=true;
                    swappedPiece='BlueTank2';
                }
                else if(clickx===tank_red_pos.x && clicky===tank_red_pos.y){
                    document.querySelector('.tankRed').remove();
                    tank_red_pos.x=prevPos.x;
                    tank_red_pos.y=prevPos.y;
                    tankRed(tank_red_pos,'tankRed');
                    swap=true;
                    swappedPiece='RedTank';
                }
                else if(clickx===tank_red_pos2.x && clicky===tank_red_pos2.y){
                    document.querySelector('.tankRed2').remove();
                    tank_red_pos2.x=prevPos.x;
                    tank_red_pos2.y=prevPos.y;
                    tankRed(tank_red_pos2,'tankRed2');
                    swap=true;
                    swappedPiece='RedTank2';
                }
                else if(clickx===sr_pos_blue.x && clicky===sr_pos_blue.y){
                    let rotation2=document.querySelector('.semiricBlue').style.transform;
                    document.querySelector('.semiricBlue').remove();
                    sr_pos_blue.x=prevPos.x;
                    sr_pos_blue.y=prevPos.y;
                    semiRicochetBlue(sr_pos_blue);
                    document.querySelector('.semiricBlue').style.transform=rotation2;
                    swap=true;
                    swappedPiece='BlueSemiRic';
                }
                else if(clickx===sr_pos_red.x && clicky===sr_pos_red.y){
                    let rotation2=document.querySelector('.semiricRed').style.transform;
                    document.querySelector('.semiricRed').remove();
                    sr_pos_red.x=prevPos.x;
                    sr_pos_red.y=prevPos.y;
                    semiRicochetRed(sr_pos_red);
                    document.querySelector('.semiricRed').style.transform=rotation2;
                    swap=true;
                    swappedPiece='RedSemiRic';
                }
                else if(clickx===r_pos_red.x && clicky===r_pos_red.y){
                    let obj1=document.querySelector('.ricRed');
                    let rotation2 = obj1.style.transform;
                    obj1.remove();
                    r_pos_red.x=prevPos.x;
                    r_pos_red.y=prevPos.y;
                    RicochetRed(r_pos_red);
                    document.querySelector('.ricRed').style.transform=rotation2;
                    swap=true;
                    swappedPiece='RedRic';
                }
                RicochetBlue(r_pos_blue);  // Place new ric
                const currentRic=document.querySelector('.ricBlue');
                currentRic.style.transform=rotation;
                colourTurn.innerText='RED';
                sec=31;
                resetCellColor(); // Reset cell colors
                cannon_blue_shoot();
                undoCount=1;
                semiRicBlueDestroyed=false;
                semiRicRedDestroyed=false;
                turnRicBlue.style.visibility='hidden';
                if(swap){
                    gameHistoryPush(`Blue Ricochet : Swapped- (${prevPos.x},${prevPos.y}) to (${r_pos_blue.x},${r_pos_blue.y})`);
                    gameHistoryStorage.push({piece:'BlueRic', x1:prevPos.x, y1:prevPos.y, x2:r_pos_blue.x, y2:r_pos_blue.y, move:'swap', swapped:swappedPiece});
                }
                else{
                    gameHistoryPush(`Blue Ricochet : (${prevPos.x},${prevPos.y}) to (${r_pos_blue.x},${r_pos_blue.y})`);
                    gameHistoryStorage.push({piece:'BlueRic', x1:prevPos.x, y1:prevPos.y, x2:r_pos_blue.x, y2:r_pos_blue.y,move:'shift'});
                }
            }
        });
    });
}
function ricRedGreenSelect(){   //moving red ric to selected cell
    cells.forEach((square) => {
        square.addEventListener('click', () => {
            if (square.style.backgroundColor === 'rgb(1, 128, 2)') {
                let prevPos={x:r_pos_red.x,y:r_pos_red.y};
                let swap=false;
                let swappedPiece=null;
                // Update cannon position
                let clickx = parseInt(square.dataset.x);
                let clicky = parseInt(square.dataset.y);
                r_pos_red.x = clickx;
                r_pos_red.y = clicky;
                // Remove previous cannon
                const previousRic = document.querySelector('.ricRed');
                let rotation=previousRic.style.transform;
                if (previousRic) {
                    previousRic.remove();
                }
                if(clickx===tank_blue_pos.x && clicky===tank_blue_pos.y){
                    document.querySelector('.tankBlue').remove();
                    tank_blue_pos.x=prevPos.x;
                    tank_blue_pos.y=prevPos.y;
                    tankBlue(tank_blue_pos,'tankBlue');
                    swap=true;
                    swappedPiece='BlueTank';
                }
                else if(clickx===tank_blue_pos2.x && clicky===tank_blue_pos2.y){
                    document.querySelector('.tankBlue2').remove();
                    tank_blue_pos2.x=prevPos.x;
                    tank_blue_pos2.y=prevPos.y;
                    tankBlue(tank_blue_pos2,'tankBlue2');
                    swap=true;
                    swappedPiece='BlueTank2';
                }
                else if(clickx===tank_red_pos.x && clicky===tank_red_pos.y){
                    document.querySelector('.tankRed').remove();
                    tank_red_pos.x=prevPos.x;
                    tank_red_pos.y=prevPos.y;
                    tankRed(tank_red_pos,'tankRed');
                    swap=true;
                    swappedPiece='RedTank';
                }
                else if(clickx===tank_red_pos2.x && clicky===tank_red_pos2.y){
                    document.querySelector('.tankRed2').remove();
                    tank_red_pos2.x=prevPos.x;
                    tank_red_pos2.y=prevPos.y;
                    tankRed(tank_red_pos2,'tankRed2');
                    swap=true;
                    swappedPiece='RedTank2';
                }
                else if(clickx===sr_pos_blue.x && clicky===sr_pos_blue.y){
                    let rotation2=document.querySelector('.semiricBlue').style.transform;
                    document.querySelector('.semiricBlue').remove();
                    sr_pos_blue.x=prevPos.x;
                    sr_pos_blue.y=prevPos.y;
                    semiRicochetBlue(sr_pos_blue);
                    document.querySelector('.semiricBlue').style.transform=rotation2;
                    swap=true;
                    swappedPiece='BlueSemiRic';
                }
                else if(clickx===sr_pos_red.x && clicky===sr_pos_red.y){
                    let rotation2=document.querySelector('.semiricRed').style.transform;
                    document.querySelector('.semiricRed').remove();
                    sr_pos_red.x=prevPos.x;
                    sr_pos_red.y=prevPos.y;
                    semiRicochetRed(sr_pos_red);
                    document.querySelector('.semiricRed').style.transform=rotation2;
                    swap=true;
                    swappedPiece='RedSemiRic';
                }
                else if(clickx===r_pos_blue.x && clicky===r_pos_blue.y){
                    let rotation2=document.querySelector('.ricBlue').style.transform;
                    document.querySelector('.ricBlue').remove();
                    r_pos_blue.x=prevPos.x;
                    r_pos_blue.y=prevPos.y;
                    RicochetBlue(r_pos_blue);
                    document.querySelector('.ricBlue').style.transform=rotation2;
                    swap=true;
                    swappedPiece='BlueRic';
                }
                RicochetRed(r_pos_red);  // Place new ric
                const currentRic=document.querySelector('.ricRed');
                currentRic.style.transform=rotation;
                colourTurn.innerText='BLUE';
                sec=31;
                resetCellColor(); // Reset cell colors
                cannon_red_shoot();
                undoCount=1;
                semiRicBlueDestroyed=false;
                semiRicRedDestroyed=false;
                turnRicRed.style.visibility='hidden';
                if(swap){
                    gameHistoryPush(`Red Ricochet : Swapped- (${prevPos.x},${prevPos.y}) to (${r_pos_red.x},${r_pos_red.y})`);
                    gameHistoryStorage.push({piece:'RedRic', x1:prevPos.x, y1:prevPos.y, x2:r_pos_red.x, y2:r_pos_red.y, move:'swap', swapped:swappedPiece});
                }
                else{
                    gameHistoryPush(`Red Ricochet : (${prevPos.x},${prevPos.y}) to (${r_pos_red.x},${r_pos_red.y})`);
                    gameHistoryStorage.push({piece:'RedRic', x1:prevPos.x, y1:prevPos.y, x2:r_pos_red.x, y2:r_pos_red.y,move:'shift'});
                }
            }
        });
    });
}
function semiricBlueGreenSelect(){  //moving blue semiric to selected cell
    cells.forEach((square) => {
        square.addEventListener('click', () => {
            if (square.style.backgroundColor === 'rgb(0, 128, 1)') {
                let prevPos={x:sr_pos_blue.x,y:sr_pos_blue.y};
                // Update semiric position
                sr_pos_blue.x = parseInt(square.dataset.x);
                sr_pos_blue.y = parseInt(square.dataset.y);
                // Remove previous semiric
                const previousSemiRic = document.querySelector('.semiricBlue');
                let rotation=previousSemiRic.style.transform;
                if (previousSemiRic) {
                    previousSemiRic.remove();
                }
                semiRicochetBlue(sr_pos_blue);  // Place new semiric
                const currentSemiRic=document.querySelector('.semiricBlue');
                currentSemiRic.style.transform=rotation;
                colourTurn.innerText='RED';
                sec=31;
                resetCellColor(); // Reset cell colors
                gameHistoryPush(`Blue Semi Ricochet :  (${prevPos.x},${prevPos.y}) to (${sr_pos_blue.x},${sr_pos_blue.y})`);
                gameHistoryStorage.push({piece:'BlueSemiRic',x1:prevPos.x,y1:prevPos.y,x2:sr_pos_blue.x,y2:sr_pos_blue.y,move:'shift'});
                cannon_blue_shoot();
                undoCount=1;
                semiRicRedDestroyed=false;
                turnSemiRicBlue.style.visibility='hidden';
            }
        });
    });
}
function semiricRedGreenSelect(){     //moving red semiric to selected cell
    cells.forEach((square) => {
        square.addEventListener('click', () => {
            if (square.style.backgroundColor === 'rgb(0, 128, 2)') {
                let prevPos={x:sr_pos_red.x,y:sr_pos_red.y};
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
                gameHistoryPush(`Red Semi Ricochet :  (${prevPos.x},${prevPos.y}) to (${sr_pos_red.x},${sr_pos_red.y})`);
                gameHistoryStorage.push({piece:'RedSemiRic',x1:prevPos.x,y1:prevPos.y,x2:sr_pos_red.x,y2:sr_pos_red.y,move:'shift'});
                cannon_red_shoot();
                undoCount=1;
                semiRicBlueDestroyed=false;
                turnSemiRicRed.style.visibility='hidden';
            }
        });
    });
}
function selectCell() {   //function to handle selecting of cells
      cells.forEach((cell) => {
        cell.addEventListener('click', () => {
        if(!BulletMoving){   //No piece can be selected while bullet is moving
            let x = parseInt(cell.dataset.x);
            let y = parseInt(cell.dataset.y);
            let bg=cell.style.backgroundColor;
            if (searchXY(x, y) && !(bg==='rgb(2, 128, 1)' || bg==='rgb(1, 128, 2)')) {
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
                else if (x === sr_pos_blue.x && y === sr_pos_blue.y &&
                    document.querySelector('.semiricBlue')) {
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
                else if (x === sr_pos_red.x && y === sr_pos_red.y && 
                    document.querySelector('.semiricRed')) {
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
function timer_func() {  //Function for timer
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

function pause_game() {  //Function ot pause game
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
function reset_func(){   //Reset function
    reset.addEventListener('click',()=>{
        window.location.reload();
    })
}
function gameOver(colour){  //set of instructions to follow if game is over
    game_Over=true;
    storeLocalStorage();
    victory();
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

function storeLocalStorage(){  //to store game History in Local Storage
    const history = JSON.stringify(gameHistoryStorage);
    localStorage.setItem('gameHistory',history);
}
function turnColour(){
    if(colourTurn.innerText==='BLUE')
        colourTurn.style.color="rgb(2, 9, 52)";
    else
        colourTurn.style.color="red";
}
function cannonSound(){
    let sound=new Audio('../assets/cannon.mp3');
    sound.play();
    sound.volume=0.5;
}
function semiRicBreak(){
    let sound=new Audio('../assets/semiricbreak.mp3');
    sound.play();
    sound.volume=0.5;
}
function ricBounce(){
    let sound=new Audio('../assets/ricBounce.mp3');
    sound.play();
    sound.volume=0.7;
}
function tankAbsorb(){
    let sound=new Audio('../assets/tankAbsorb.mp3');
    sound.play();
}
function victory(){
    let sound=new Audio('../assets/victory.mp3');
    sound.play();
    sound.volume=0.3;
}
function gameHistoryPush(text){
    let move=create_element('p','moves');
    move.innerText=text;
    gameHistory.appendChild(move);
}
function undoMove(){    //function to undo moves - shifting,rotating,swapping
    undoButton.addEventListener('click',()=>{
        if(gameHistoryStorage.length > 0 && undoCount===1){
            let prevMove=gameHistoryStorage.pop();
            RedoStorage.push(prevMove);
            if(prevMove.move==='shift'){
            switch(prevMove.piece){
                case 'BlueCannon':
                    if(document.querySelector('.cannonBlue'))
                        document.querySelector('.cannonBlue').remove();
                    cannonBlue({x:prevMove.x1 , y:prevMove.y1});
                    cannon_blue_pos.x=prevMove.x1;
                    cannon_blue_pos.y=prevMove.y1;
                    break;
                case 'RedCannon':
                    if(document.querySelector('.cannonRed'))
                        document.querySelector('.cannonRed').remove();
                    cannonRed({x:prevMove.x1 , y:prevMove.y1});
                    cannon_red_pos.x=prevMove.x1;
                    cannon_red_pos.y=prevMove.y1;
                    break;
                case 'BlueTitan':
                    if(document.querySelector('.titanBlue'))
                        document.querySelector('.titanBlue').remove();
                    titanBlue({x:prevMove.x1 , y:prevMove.y1});
                    titan_blue_pos.x=prevMove.x1;
                    titan_blue_pos.y=prevMove.y1;
                    break;
                case 'RedTitan':
                    if(document.querySelector('.titanRed'))
                        document.querySelector('.titanRed').remove();
                    titanRed({x:prevMove.x1 , y:prevMove.y1});
                    titan_red_pos.x=prevMove.x1;
                    titan_red_pos.y=prevMove.y1;
                    break;
                case 'BlueTank':
                    if(document.querySelector('.tankBlue'))
                        document.querySelector('.tankBlue').remove();
                    tankBlue({x:prevMove.x1 , y:prevMove.y1},'tankBlue');
                    tank_blue_pos.x=prevMove.x1;
                    tank_blue_pos.y=prevMove.y1;
                    break;
                case 'BlueTank2':
                    if(document.querySelector('.tankBlue2'))
                        document.querySelector('.tankBlue2').remove();
                    tankBlue({x:prevMove.x1 , y:prevMove.y1},'tankBlue2');
                    tank_blue_pos2.x=prevMove.x1;
                    tank_blue_pos2.y=prevMove.y1;
                    break;
                case 'RedTank':
                    if(document.querySelector('.tankRed'))
                        document.querySelector('.tankRed').remove();
                    tankRed({x:prevMove.x1 , y:prevMove.y1},'tankRed');
                    tank_red_pos.x=prevMove.x1;
                    tank_red_pos.y=prevMove.y1;
                    break;
                case 'RedTank2':
                    if(document.querySelector('.tankRed2'))
                        document.querySelector('.tankRed2').remove();
                    tankRed({x:prevMove.x1 , y:prevMove.y1},'tankRed2');
                    tank_red_pos2.x=prevMove.x1;
                    tank_red_pos2.y=prevMove.y1;
                    break;
                case 'BlueRic':
                    let rotation=document.querySelector('.ricBlue').style.transform;
                    if(document.querySelector('.ricBlue'))
                        document.querySelector('.ricBlue').remove();
                    RicochetBlue({x:prevMove.x1 , y:prevMove.y1});
                    document.querySelector('.ricBlue').style.transform=rotation;
                    r_pos_blue.x=prevMove.x1;
                    r_pos_blue.y=prevMove.y1;
                    break;
                case 'RedRic':
                    let rotation2=document.querySelector('.ricRed').style.transform;
                    if(document.querySelector('.ricRed'))
                        document.querySelector('.ricRed').remove();
                    RicochetRed({x:prevMove.x1 , y:prevMove.y1});
                    document.querySelector('.ricRed').style.transform=rotation2;
                    r_pos_red.x=prevMove.x1;
                    r_pos_red.y=prevMove.y1;
                    break;
                case 'BlueSemiRic':
                    if(!semiRicBlueDestroyed){
                        let rotation3=document.querySelector('.semiricBlue').style.transform;
                        if(document.querySelector('.semiricBlue'))
                            document.querySelector('.semiricBlue').remove();
                        semiRicochetBlue({x:prevMove.x1 , y:prevMove.y1});
                        document.querySelector('.semiricBlue').style.transform=rotation3;
                        sr_pos_blue.x=prevMove.x1;
                        sr_pos_blue.y=prevMove.y1;
                      }
                        break;
                case 'RedSemiRic':
                    if(!semiRicRedDestroyed){
                        let rotation4=document.querySelector('.semiricRed').style.transform;
                        if(document.querySelector('.semiricRed'))
                            document.querySelector('.semiricRed').remove();
                        semiRicochetRed({x:prevMove.x1 , y:prevMove.y1});
                        document.querySelector('.semiricRed').style.transform=rotation4;
                        sr_pos_red.x=prevMove.x1;
                        sr_pos_red.y=prevMove.y1;
                      }
                        break;
            }
        }
        else if(prevMove.move === 'rotate'){
            switch(prevMove.piece){
                case 'BlueRic':
                    let object1=document.querySelector('.ricBlue');
                    object1.style.transform=prevMove.r1;
                    break;
                case 'RedRic':
                    let object2=document.querySelector('.ricRed');
                    object2.style.transform=prevMove.r1;
                    break;
                case 'BlueSemiRic':
                    if(!semiRicBlueDestroyed){
                        let object3=document.querySelector('.semiricBlue');
                        object3.style.transform=prevMove.r1;
                        }
                        break;
                case 'RedSemiRic':
                    if(!semiRicRedDestroyed){
                        let object4=document.querySelector('.semiricRed');
                        object4.style.transform=prevMove.r1;
                        }
                    break;
            }
        }
        else if(prevMove.move === 'swap'){
            switch(prevMove.piece){
                case 'BlueRic':
                    let rotationBlue=document.querySelector('.ricBlue').style.transform;
                    if(prevMove.swapped === 'RedRic'){
                        if(document.querySelector('.ricBlue'))
                            document.querySelector('.ricBlue').remove();
                        RicochetBlue({x:prevMove.x1 , y:prevMove.y1});
                        r_pos_blue.x=prevMove.x1;
                        r_pos_blue.y=prevMove.y1;
                        let angle3=document.querySelector('.ricRed').style.transform;
                        if(document.querySelector('.ricRed'))
                            document.querySelector('.ricRed').remove();
                        RicochetRed({x:prevMove.x2,y:prevMove.y2});
                        r_pos_red.x=prevMove.x2;
                        r_pos_red.y=prevMove.y2;
                        document.querySelector('.ricRed').style.transform=angle3;
                    }
                    else
                        undoRicSwap(prevMove,'.ricBlue',RicochetBlue,r_pos_blue);
                    document.querySelector('.ricBlue').style.transform=rotationBlue;
                    break;
                case 'RedRic':
                    let rotationRed=document.querySelector('.ricRed').style.transform;
                    if(prevMove.swapped === 'BlueRic'){
                        if(document.querySelector('.ricRed'))
                            document.querySelector('.ricRed').remove();
                        RicochetRed({x:prevMove.x1 , y:prevMove.y1});
                        r_pos_red.x=prevMove.x1;
                        r_pos_red.y=prevMove.y1;
                        let angle4=document.querySelector('.ricBlue').style.transform;
                        if(document.querySelector('.ricBlue'))
                            document.querySelector('.ricBlue').remove();
                        RicochetBlue({x:prevMove.x2,y:prevMove.y2});
                        r_pos_blue.x=prevMove.x2;
                        r_pos_blue.y=prevMove.y2;
                        document.querySelector('.ricBlue').style.transform=angle4;
                    }
                    else
                        undoRicSwap(prevMove,'.ricRed',RicochetRed,r_pos_red);
                    document.querySelector('.ricRed').style.transform=rotationRed;
                    break;
            }
        }
        if(semiRicBlueDestroyed){
            semiRicochetBlue(prevSemiRicBluePos);
            sr_pos_blue.x = prevSemiRicBluePos.x;
            sr_pos_blue.y = prevSemiRicBluePos.y;
            document.querySelector('.semiricBlue').style.transform=semiRicBlueAngle;
        }
        else if(semiRicRedDestroyed){
            semiRicochetRed(prevSemiRicRedPos);
            sr_pos_red.x = prevSemiRicRedPos.x;
            sr_pos_red.y = prevSemiRicRedPos.y;
            document.querySelector('.semiricRed').style.transform=semiRicRedAngle;
        }
            lastMove=gameHistory.lastChild.innerText;
            gameHistory.lastChild.remove();
            sec=31;
            if(colourTurn.innerText==='BLUE')
                colourTurn.innerText='RED';
            else
                colourTurn.innerText='BLUE';
            undoCount--;
        }
    })
}
function undoRicSwap(prevMove,ricClassWD,Ricochet,r_pos){
    if(prevMove.swapped === 'BlueTank'){
        if(document.querySelector(ricClassWD))
            document.querySelector(ricClassWD).remove();
        Ricochet({x:prevMove.x1 , y:prevMove.y1});
        r_pos.x=prevMove.x1;
        r_pos.y=prevMove.y1;
        if(document.querySelector('.tankBlue'))
            document.querySelector('.tankBlue').remove();
        tankBlue({x:prevMove.x2,y:prevMove.y2},'tankBlue');
        tank_blue_pos.x=prevMove.x2;
        tank_blue_pos.y=prevMove.y2;
    }
    else if(prevMove.swapped === 'BlueTank2'){
        if(document.querySelector(ricClassWD))
            document.querySelector(ricClassWD).remove();
        Ricochet({x:prevMove.x1 , y:prevMove.y1});
        r_pos.x=prevMove.x1;
        r_pos.y=prevMove.y1;
        if(document.querySelector('.tankBlue2'))
            document.querySelector('.tankBlue2').remove();
        tankBlue({x:prevMove.x2,y:prevMove.y2},'tankBlue2');
        tank_blue_pos2.x=prevMove.x2;
        tank_blue_pos2.y=prevMove.y2;
    }
    else if(prevMove.swapped === 'RedTank'){
        if(document.querySelector(ricClassWD))
            document.querySelector(ricClassWD).remove();
        Ricochet({x:prevMove.x1 , y:prevMove.y1});
        r_pos.x=prevMove.x1;
        r_pos.y=prevMove.y1;
        if(document.querySelector('.tankRed'))
            document.querySelector('.tankRed').remove();
        tankRed({x:prevMove.x2,y:prevMove.y2},'tankRed');
        tank_red_pos.x=prevMove.x2;
        tank_red_pos.y=prevMove.y2;
    }
    else if(prevMove.swapped === 'RedTank2'){
        if(document.querySelector(ricClassWD))
            document.querySelector(ricClassWD).remove();
        Ricochet({x:prevMove.x1 , y:prevMove.y1});
        r_pos.x=prevMove.x1;
        r_pos.y=prevMove.y1;
        if(document.querySelector('.tankRed2'))
            document.querySelector('.tankRed2').remove();
        tankRed({x:prevMove.x2,y:prevMove.y2},'tankRed2');
        tank_red_pos2.x=prevMove.x2;
        tank_red_pos2.y=prevMove.y2;
    }
    else if(prevMove.swapped === 'BlueSemiRic'){
        if(document.querySelector(ricClassWD))
            document.querySelector(ricClassWD).remove();
        Ricochet({x:prevMove.x1 , y:prevMove.y1});
        r_pos.x=prevMove.x1;
        r_pos.y=prevMove.y1;
        let obj=document.querySelector('.semiricBlue');
        let angle=obj.style.transform;
        if(obj)
            obj.remove(); 
        semiRicochetBlue({x:prevMove.x2,y:prevMove.y2});
        sr_pos_blue.x=prevMove.x2;
        sr_pos_blue.y=prevMove.y2;
        document.querySelector('.semiricBlue').style.transform=angle;
    }
    else if(prevMove.swapped === 'RedSemiRic'){
        if(document.querySelector(ricClassWD))
            document.querySelector(ricClassWD).remove();
        Ricochet({x:prevMove.x1 , y:prevMove.y1});
        r_pos.x=prevMove.x1;
        r_pos.y=prevMove.y1;
        let obj2=document.querySelector('.semiricRed');
        let angle2=obj2.style.transform;
        if(obj2)
            obj2.remove();
        semiRicochetRed({x:prevMove.x2,y:prevMove.y2});
        sr_pos_red.x=prevMove.x2;
        sr_pos_red.y=prevMove.y2;
        document.querySelector('.semiricRed').style.transform=angle2;
    }
}
function redoMove(){  //function to redo moves - shifting,rotating,swapping
    redoButton.addEventListener('click',()=>{
        if(RedoStorage.length>0){
            let move=RedoStorage.pop();
            gameHistoryStorage.push(move);
            if(move.move === 'shift'){
            switch(move.piece){
                case 'BlueCannon':
                    if(document.querySelector('.cannonBlue'))
                        document.querySelector('.cannonBlue').remove();
                    cannonBlue({x:move.x2 , y:move.y2});
                    cannon_blue_pos.x=move.x2;
                    cannon_blue_pos.y=move.y2;
                    break;
                case 'RedCannon':
                    if(document.querySelector('.cannonRed'))
                        document.querySelector('.cannonRed').remove();
                    cannonRed({x:move.x2 , y:move.y2});
                    cannon_red_pos.x=move.x2;
                    cannon_red_pos.y=move.y2;
                    break;
                case 'BlueTitan':
                    if(document.querySelector('.titanBlue'))
                        document.querySelector('.titanBlue').remove();
                    titanBlue({x:move.x2 , y:move.y2});
                    titan_blue_pos.x=move.x2;
                    titan_blue_pos.y=move.y2;
                    break;
                case 'RedTitan':
                    if(document.querySelector('.titanRed'))
                        document.querySelector('.titanRed').remove();
                    titanRed({x:move.x2 , y:move.y2});
                    titan_red_pos.x=move.x2;
                    titan_red_pos.y=move.y2;
                    break;
                case 'BlueTank':
                    if(document.querySelector('.tankBlue'))
                        document.querySelector('.tankBlue').remove();
                    tankBlue({x:move.x2 , y:move.y2},'tankBlue');
                    tank_blue_pos.x=move.x2;
                    tank_blue_pos.y=move.y2;
                    break;
                case 'BlueTank2':
                    if(document.querySelector('.tankBlue2'))
                        document.querySelector('.tankBlue2').remove();
                    tankBlue({x:move.x2 , y:move.y2},'tankBlue2');
                    tank_blue_pos2.x=move.x2;
                    tank_blue_pos2.y=move.y2;
                    break;
                case 'RedTank':
                    if(document.querySelector('.tankRed'))
                        document.querySelector('.tankRed').remove();
                    tankRed({x:move.x2 , y:move.y2},'tankRed');
                    tank_red_pos.x=move.x2;
                    tank_red_pos.y=move.y2;
                    break;
                case 'RedTank2':
                    if(document.querySelector('.tankRed2'))
                        document.querySelector('.tankRed2').remove();
                    tankRed({x:move.x2 , y:move.y2},'tankRed2');
                    tank_red_pos2.x=move.x2;
                    tank_red_pos2.y=move.y2;
                    break;
                case 'BlueRic':
                    let rotation=document.querySelector('.ricBlue').style.transform;
                    if(document.querySelector('.ricBlue'))
                        document.querySelector('.ricBlue').remove();
                    RicochetBlue({x:move.x2 , y:move.y2});
                    document.querySelector('.ricBlue').style.transform=rotation;
                    r_pos_blue.x=move.x2;
                    r_pos_blue.y=move.y2;
                    break;
                case 'RedRic':
                    let rotation2=document.querySelector('.ricRed').style.transform;
                    if(document.querySelector('.ricRed'))
                        document.querySelector('.ricRed').remove();
                    RicochetRed({x:move.x2 , y:move.y2});
                    document.querySelector('.ricRed').style.transform=rotation2;
                    r_pos_red.x=move.x2;
                    r_pos_red.y=move.y2;
                    break;
                case 'BlueSemiRic':
                    let rotation3=document.querySelector('.semiricBlue').style.transform;
                    if(document.querySelector('.semiricBlue'))
                        document.querySelector('.semiricBlue').remove();
                    semiRicochetBlue({x:move.x2 , y:move.y2});
                    document.querySelector('.semiricBlue').style.transform=rotation3;
                    sr_pos_blue.x=move.x2;
                    sr_pos_blue.y=move.y2;
                    break;
                case 'RedSemiRic':
                    let rotation4=document.querySelector('.semiricRed').style.transform;
                    if(document.querySelector('.semiricRed'))
                        document.querySelector('.semiricRed').remove();
                    semiRicochetRed({x:move.x2 , y:move.y2});
                    document.querySelector('.semiricRed').style.transform=rotation4;
                    sr_pos_red.x=move.x2;
                    sr_pos_red.y=move.y2;
                    break;
            }
        }
        else if (move.move === 'rotate'){
            switch(move.piece){
                case 'BlueRic':
                    let object1=document.querySelector('.ricBlue');
                    object1.style.transform=move.r2;
                    break;
                case 'RedRic':
                    let object2=document.querySelector('.ricRed');
                    object2.style.transform=move.r2;
                    break;
                case 'BlueSemiRic':
                    let object3=document.querySelector('.semiricBlue');
                    object3.style.transform=move.r2;
                    break;
                case 'RedSemiRic':
                    let object4=document.querySelector('.semiricRed');
                    object4.style.transform=move.r2;
                    break;
            }
        }
        else if(move.move === 'swap'){
            switch(move.piece){
                case 'BlueRic':
                    let rotationBlue=document.querySelector('.ricBlue').style.transform;
                    if(move.swapped === 'RedRic'){
                        if(document.querySelector('.ricBlue'))
                            document.querySelector('.ricBlue').remove();
                        RicochetBlue({x:move.x2,y:move.y2});
                        r_pos_blue.x=move.x2;
                        r_pos_blue.y=move.y2;
                        let angle2=document.querySelector('.ricRed').style.transform;
                        if(document.querySelector('.ricRed'))
                            document.querySelector('.ricRed').remove();
                        RicochetRed({x:move.x1,y:move.y1});
                        r_pos_red.x=move.x1;
                        r_pos_red.y=move.y1;
                        document.querySelector('.ricRed').style.transform=angle2;
                    }
                    else
                       redoRicSwap(move,'.ricBlue',RicochetBlue,r_pos_blue);
                    document.querySelector('.ricBlue').style.transform=rotationBlue;
                    break;
                case 'RedRic':
                    let rotationRed=document.querySelector('.ricRed').style.transform;
                    if(move.swapped === 'BlueRic'){
                        if(document.querySelector('.ricRed'))
                            document.querySelector('.ricRed').remove();
                        RicochetRed({x:move.x2,y:move.y2});
                        r_pos_red.x=move.x2;
                        r_pos_red.y=move.y2;
                        let angle3=document.querySelector('.ricBlue').style.transform;
                        if(document.querySelector('.ricBlue'))
                            document.querySelector('.ricBlue').remove();
                        RicochetBlue({x:move.x1,y:move.y1});
                        r_pos_blue.x=move.x1;
                        r_pos_blue.y=move.y1;
                        document.querySelector('.ricBlue').style.transform=angle3;
                    }
                    else
                       redoRicSwap(move,'.ricRed',RicochetRed,r_pos_red);
                    document.querySelector('.ricRed').style.transform=rotationRed;
                    break;
            }
        }
        if(semiRicBlueDestroyed)
            document.querySelector('.semiricBlue').remove();
        else if(semiRicRedDestroyed)
            document.querySelector('.semiricRed').remove();  
        sec=31;
        if(colourTurn.innerText==='BLUE')
            colourTurn.innerText='RED';
        else
            colourTurn.innerText='BLUE';
        RedoStorage=[]; /*Check - RedoStorage Array is made empty since undo
                          can be done only once per move*/
        gameHistoryPush(lastMove);
        }
    })
}

function redoRicSwap(move,ricClassWD,Ricochet,r_pos){
    if(move.swapped === 'BlueTank'){
        if(document.querySelector(ricClassWD))
            document.querySelector(ricClassWD).remove();
        Ricochet({x:move.x2,y:move.y2});
        r_pos.x=move.x2;
        r_pos.y=move.y2;
        if(document.querySelector('.tankBlue'))
            document.querySelector('.tankBlue').remove();
        tankBlue({x:move.x1,y:move.y1},'tankBlue');
        tank_blue_pos.x=move.x1;
        tank_blue_pos.y=move.y1;
    }
    else if(move.swapped === 'BlueTank2'){
        if(document.querySelector(ricClassWD))
            document.querySelector(ricClassWD).remove();
        Ricochet({x:move.x2,y:move.y2});
        r_pos.x=move.x2;
        r_pos.y=move.y2;
        if(document.querySelector('.tankBlue2'))
            document.querySelector('.tankBlue2').remove();
        tankBlue({x:move.x1,y:move.y1},'tankBlue2');
        tank_blue_pos2.x=move.x1;
        tank_blue_pos2.y=move.y1;
    }
    else if(move.swapped === 'RedTank'){
        if(document.querySelector(ricClassWD))
            document.querySelector(ricClassWD).remove();
        Ricochet({x:move.x2,y:move.y2});
        r_pos.x=move.x2;
        r_pos.y=move.y2;
        if(document.querySelector('.tankRed'))
            document.querySelector('.tankRed').remove();
        tankRed({x:move.x1,y:move.y1},'tankRed');
        tank_red_pos.x=move.x1;
        tank_red_pos.y=move.y1;
    }
    else if(move.swapped === 'RedTank2'){
        if(document.querySelector(ricClassWD))
            document.querySelector(ricClassWD).remove();
        Ricochet({x:move.x2,y:move.y2});
        r_pos.x=move.x2;
        r_pos.y=move.y2;
        if(document.querySelector('.tankRed2'))
            document.querySelector('.tankRed2').remove();
        tankRed({x:move.x1,y:move.y1},'tankRed2');
        tank_red_pos2.x=move.x1;
        tank_red_pos2.y=move.y1;
    }
    else if(move.swapped === 'BlueSemiRic'){
        if(document.querySelector(ricClassWD))
            document.querySelector(ricClassWD).remove();
        Ricochet({x:move.x2,y:move.y2});
        r_pos.x=move.x2;
        r_pos.y=move.y2;
        let angle=document.querySelector('.semiricBlue').style.transform;
        if(document.querySelector('.semiricBlue'))
            document.querySelector('.semiricBlue').remove();
        semiRicochetBlue({x:move.x1,y:move.y1});
        sr_pos_blue.x=move.x1;
        sr_pos_blue.y=move.y1;
        document.querySelector('.semiricBlue').style.transform=angle;
    }
    else if(move.swapped === 'RedSemiRic'){
        if(document.querySelector(ricClassWD))
            document.querySelector(ricClassWD).remove();
        Ricochet({x:move.x2,y:move.y2});
        r_pos.x=move.x2;
        r_pos.y=move.y2;
        let angle1=document.querySelector('.semiricRed').style.transform;
        if(document.querySelector('.semiricRed'))
            document.querySelector('.semiricRed').remove();
        semiRicochetRed({x:move.x1,y:move.y1});
        sr_pos_red.x=move.x1;
        sr_pos_red.y=move.y1;
        document.querySelector('.semiricRed').style.transform=angle1;
    }
}
//calling required functions 
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
undoMove();
redoMove();
// turnColour();
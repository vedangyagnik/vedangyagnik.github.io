//Go to Player Info Section
const goToPlayerInfoSection = function(){
    document.querySelector("#main_section").classList.add("hidden");
    document.querySelector("#player_info_section").classList.remove("hidden");
}
document.querySelector("#next_to_player_info_section").addEventListener("click", goToPlayerInfoSection);

//Go to Rules Section
const goToRulesSection = function(){
    document.querySelector("#player_info_section").classList.add("hidden");
    document.querySelector("#rules_section").classList.remove("hidden");
    const playerName = document.getElementById("player_name").value;
    const difficulty = document.getElementById("difficulty").value;
    sessionStorage.setItem("player_info", JSON.stringify({"name": playerName, "difficulty": difficulty}))
}
document.querySelector("#next_to_rules_section").addEventListener("click", goToRulesSection);

//Go to Game Section
const goToGameSection = function(){
    document.querySelector("#rules_section").classList.add("hidden");
    document.querySelector("#game_section").classList.remove("hidden");
    document.querySelector("#save_game").classList.remove("hidden");
    document.querySelector("#hit").classList.remove("hidden");
    document.querySelector("#miss").classList.remove("hidden");
    statGameTimer();
    startGame();
}
document.querySelector("#next_to_game_section").addEventListener("click", goToGameSection);

//Toggle Game Audio
const toggleAudio = function(){
    document.querySelector("i").classList.toggle("fa-volume-up");
    document.querySelector("i").classList.toggle("fa-volume-off");
    const audioFile = document.querySelector(".game_audio");
    audioFile.play();
    (audioFile.muted) ? audioFile.muted = false : audioFile.muted = true;
}
document.querySelector("#audio").addEventListener("click", toggleAudio);

let hitCounter = 0;
let missCounter = 0;
let randomTotalIndex;
let hitted = false;
let gameover = false;

/**
 * Start Game
 * @author: Vedang Yagnik
 */
const startGame = () => {
    equationGenerator();
    const moveCannon = (cannon)=>{
        let columnNo = 1;
        document.addEventListener("keydown",(event)=>{
            if(event.key=="ArrowRight")
            {
                if (columnNo<5) {
                    columnNo+=1;
                    cannon.style.gridColumn=columnNo;
                }
            }
            else if(event.key=="ArrowLeft")
            {
                if (columnNo>1) {
                    columnNo-=1;
                    cannon.style.gridColumn=columnNo;
                }
            }
            else if(event.key==" ")
            {
                const laserAudio = document.querySelector(".laser_audio");
                laserAudio.muted = false;
                laserAudio.play();
                laserBeam.classList.add("laser_beam_fire");
                if(randomTotalIndex == columnNo-1){
                    //hit
                    hitCounter++;
                    hitted = true;
                }else{
                    //miss
                    missCounter++;
                    hitted = false;
                }
            }
        });
    }
   
    const cannon  = document.querySelector("#cannon");
    moveCannon(cannon);

    //fire Cannon
    const laserBeam = document.querySelector("#cannon>img:first-child");

    /**
     * Detect Touch of cannon and any spaceship
     * @author: Vedang Yagnik
     */
    const cannonTopPos = document.querySelector("#cannon>img:last-child").getBoundingClientRect().top;
    const spaceships = document.querySelectorAll(".ship");
    let shipClearInterval = false;
    let playAudioOnce = true;
    let column = "1 / auto";
    spaceships.forEach((ship,i)=>{
        setRandomSpaceshipSpeed(ship);
        const shipTouchInterval = setInterval(()=>{
            if(cannon.style.gridColumn != ""){
                column = cannon.style.gridColumn;
            }
            const shipBottomPos = ship.getBoundingClientRect().bottom;
            console.log(ship.getBoundingClientRect());
            const laserBeamTopPos = laserBeam.getBoundingClientRect().top;
            if ((cannonTopPos - shipBottomPos) <= 15) {
                shipClearInterval = true;
            }
            if ((column == (i+1) + " / auto") && (laserBeamTopPos - shipBottomPos) <= 5) {
                if(hitted){
                    document.querySelector("#hit").classList.remove("popup");
                    void document.querySelector("#hit").offsetWidth;
                    document.querySelector("#hit").classList.add("popup");
                    document.querySelector("#hit>label").innerText = hitCounter;
                    equationGenerator(true);
                } else {
                    document.querySelector("#miss").classList.remove("popup");
                    void document.querySelector("#miss").offsetWidth;
                    document.querySelector("#miss").classList.add("popup");
                    document.querySelector("#miss>label").innerText = missCounter;
                    equationGenerator(false);
                }
                laserBeam.classList.remove("laser_beam_fire");
            }
            if (shipClearInterval) {
                if(playAudioOnce){
                    const gameOverAudio = document.querySelector(".game_over_audio");
                    gameOverAudio.muted = false;
                    gameOverAudio.play();
                }
                gameover = true;
                playAudioOnce = false;
                ship.classList.remove(`spaceship_${i+1}`);
                clearInterval(shipTouchInterval);
                const playerInfo = JSON.parse(sessionStorage.getItem("player_info"));
                document.querySelector(".modal-header>h2").innerText = "!GAME OVER!";
                document.querySelector(".modal-body").innerHTML = `
                    <table>
                        <tr>
                            <th>Name: </th>
                            <td>${playerInfo.name}</td>
                        </tr>
                        <tr>
                            <th>Difficulty Level: </th>
                            <td>${playerInfo.difficulty}</td>
                        </tr>
                        <tr>
                            <th>Number of Hits: </th>
                            <td>${document.querySelector("#hit>label").innerText}</td>
                        </tr>
                        <tr>
                            <th>Number of Misses: </th>
                            <td>${document.querySelector("#miss>label").innerText}</td>
                        </tr>
                    </table>`;
                document.getElementById("myModal").style.display = "block";
            }
        }, 10);
    });
}

/**
 * Set Speed based on difficulty and speed changes every time user hits correct answer
 * @author: Vedang Yagnik
 */
const setRandomSpaceshipSpeed = (spaceship)=>{
    let speed;
    const difficulty = JSON.parse(sessionStorage.getItem("player_info")).difficulty;
    if (difficulty == "Hard") {
        //Hard
        speed = Math.floor(Math.random() * 17) + 12;
    } else {
        //Easy
        speed = Math.floor(Math.random() * 40) + 30;
    }
    spaceship.style.animationDuration = `${speed}s`;
}

/*****Reference: Timer-Animation: https://css-tricks.com/how-to-create-an-animated-countdown-timer-with-html-css-and-javascript/ ****/
const statGameTimer = () => {
    const FULL_DASH_ARRAY = 283;
    const WARNING_THRESHOLD = 10;
    const ALERT_THRESHOLD = 5;

    const COLOR_CODES = {
        info: {
            color: "green"
        },
        warning: {
            color: "orange",
            threshold: WARNING_THRESHOLD
        },
        alert: {
            color: "red",
            threshold: ALERT_THRESHOLD
        }
    };

    const TIME_LIMIT = 90;
    let timePassed = 0;
    let timeLeft = TIME_LIMIT;
    let timerInterval = null;
    let remainingPathColor = COLOR_CODES.info.color;

    document.getElementById("app").innerHTML = `
    <div class="base-timer">
        <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <g class="base-timer__circle">
            <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
            <path
                id="base-timer-path-remaining"
                stroke-dasharray="283"
                class="base-timer__path-remaining ${remainingPathColor}"
                d="M 50, 50 m -45, 0 a 45,45 0 1,0 90,0 a 45,45 0 1,0 -90,0"
            >
            </path>
            </g>
        </svg>
        <span id="base-timer-label" class="base-timer__label">${timeLeft}</span>
    </div>`;

    startTimer();

    /**
     * On time up display modal-popup to user
     * @author: Vedang Yagnik
     */
    function onTimesUp() {
        if(!gameover){
            const playerInfo = JSON.parse(sessionStorage.getItem("player_info"));
            document.querySelector(".modal-body").innerHTML = `
                <table>
                    <tr>
                        <th>Name: </th>
                        <td>${playerInfo.name}</td>
                    </tr>
                    <tr>
                        <th>Difficulty Level: </th>
                        <td>${playerInfo.difficulty}</td>
                    </tr>
                    <tr>
                        <th>Number of Hits: </th>
                        <td>${document.querySelector("#hit>label").innerText}</td>
                    </tr>
                    <tr>
                        <th>Number of Misses: </th>
                        <td>${document.querySelector("#miss>label").innerText}</td>
                    </tr>
                </table>`;
            document.getElementById("myModal").style.display = "block";
        }
        const spaceships = document.querySelectorAll(".ship");
        spaceships.forEach((ship,i)=>ship.classList.remove(`spaceship_${i+1}`));
        clearInterval(timerInterval);
    }

    /**
     * On time up display modal-popup to user
     * @author: Vedang Yagnik
     */
    function startTimer() {
        timerInterval = setInterval(() => {
            timePassed += 1;
            timeLeft = TIME_LIMIT - timePassed;
            document.getElementById("base-timer-label").innerHTML = timeLeft;
            setCircleDasharray();
            setRemainingPathColor(timeLeft);
            if (timeLeft === 0 || gameover) {
                onTimesUp();
            }
        }, 1000);
    }

    function setRemainingPathColor(timeLeft) {
        const { alert, warning, info } = COLOR_CODES;
        if (timeLeft <= alert.threshold) {
            document.getElementById("base-timer-path-remaining").classList.remove(warning.color);
            document.getElementById("base-timer-path-remaining").classList.add(alert.color);
        } else if (timeLeft <= warning.threshold) {
            document.getElementById("base-timer-path-remaining").classList.remove(info.color);
            document.getElementById("base-timer-path-remaining").classList.add(warning.color);
        }
    }

    function calculateTimeFraction() {
        const rawTimeFraction = timeLeft / TIME_LIMIT;
        return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
    }

    function setCircleDasharray() {
        const circleDasharray = `${(calculateTimeFraction() * FULL_DASH_ARRAY).toFixed(0)} 283`;
        document.getElementById("base-timer-path-remaining").setAttribute("stroke-dasharray", circleDasharray);
    }
}
/*****---------*****/

/**
 * Equation and answer generator randomly for spaceship and cannon
 * @author: Vedang Yagnik
 */
let equationTotalArray;
let equationArray;
const equationGenerator = (isHitted)=>{
    equationTotalArray = [];
    equationArray = [];
    let i=1;
    const spaceships = document.querySelectorAll(".ship");
    while(equationTotalArray.length!=5) {
        const x = Math.floor(Math.random() * 25) + 1;
        const y = Math.floor(Math.random() * 9) + 1;
        const equation = `${x} + ${y}`;
        const equationTotal = x+y;
        if (!equationTotalArray.includes(equationTotal)) {
            equationArray.push(equation);
            equationTotalArray.push(x+y);
            if(isHitted){
                setRandomSpaceshipSpeed(spaceships[i-1]);
                document.querySelector(`#div${i}`).classList.remove(`spaceship_${i}`);
                void document.querySelector(`#div${i}`).offsetWidth;
                document.querySelector(`#div${i}`).classList.add(`spaceship_${i}`);
            }
            document.querySelector(`#equation${i}`).innerText = equation;
            i++;
        }
    }
    randomTotalIndex = Math.floor(Math.random() * 5);
    document.querySelector("#total_below_cannon>label").innerText = equationTotalArray[randomTotalIndex];
}

/**
 * Save Game
 * @author: Vedang Yagnik
 */
document.querySelector("#save_game").addEventListener("click", ()=>{
    sessionStorage.setItem("player_record", JSON.stringify({
        "hits": hitCounter,
        "miss": missCounter,
        "current_question": document.querySelector("#total_below_cannon>label").innerText,
        "answer_choices": equationArray,
        "remaining_time_seconds": document.getElementById("base-timer-label").innerText
    }));
});

/**
 * Play Again
 * @author: Vedang Yagnik
 */
document.querySelector("#play_again").addEventListener("click", ()=> window.location.reload());
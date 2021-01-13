(function () {
    const cards = document.querySelector('.cards');
    const minutesElement = document.querySelector('.timer__minutes');
    const secondsElement = document.querySelector('.timer__seconds');
    const lightroom = document.querySelector('.lightroom');
    const lightroomTitle = document.querySelector('.lightroom__title');
    const lightroomButton = document.querySelector('.lightroom__button');

    let timer;
    let minutes = 1;
    let seconds = 0;

    startGame();


    lightroomButton.addEventListener('mousedown', function(e) {
        e.currentTarget.classList.add('active');
    });


    lightroomButton.addEventListener('mouseup', function(e) {
        e.currentTarget.classList.remove('active');

        let cardsArray = Array.from(cards.children);

        cardsArray.forEach((elem) => {
            elem.classList.remove('correct');
            elem.classList.remove('wrong');
            elem.classList.remove('opened');
        });

        lightroom.classList.remove('visible');

        startGame();
    });


    cards.addEventListener('click', function(e) {
        if (e.target === e.currentTarget) {
            return;
        }

        timer = timer ?? setInterval(gameOverChecker, 1000);

        let card = e.target.closest('.cards__item');
        let openedCards = [];

        if (!card.classList.contains('correct') && !card.classList.contains('wrong')) {
            card.classList.toggle('opened');

            openedCards = Array.from(document.querySelectorAll('.cards__item.opened:not(.correct)'));
            openedCards.forEach((openedCard) => {
                if (openedCard.classList.contains('wrong')) {
                    openedCard.classList.remove('wrong');
                    openedCard.classList.remove('opened');
                }
            });
        }

        if (openedCards.length === 2) {
            let firstCard = openedCards[0];
            let secondCard = openedCards[1];

            let firstCardEmoji = firstCard.querySelector('.cards__emoji').textContent;
            let secondCardEmoji = secondCard.querySelector('.cards__emoji').textContent;

            if (firstCardEmoji === secondCardEmoji) {
                firstCard.classList.add('correct');
                secondCard.classList.add('correct');
            }

            else {
                firstCard.classList.add('wrong');
                secondCard.classList.add('wrong');
            }
        }

        function gameOverChecker() {
            if (document.querySelectorAll('.cards__item.correct').length === 12) {
                gameResult('Win');
                return;
            }

            if (seconds === 0 && minutes === 0) {
                gameResult('Lose');
                return;
            }

            countdown();

            showTime(minutes, seconds);
        }

        function countdown() {
            if (seconds === 0) {
                minutes--;
                seconds = 60;
            }

            seconds--;
        }

        function gameResult(result) {
            clearInterval(timer);
            timer = null;

            lightroomTitle.innerHTML = result
                .split('')
                .map(wrapLetters)
                .join('');

            function wrapLetters(elem) {
                return '<span>' + elem + '</span>';
            }


            let letters = Array.from(lightroomTitle.children);

            letters.reduce((acc, letter) => {
                letter.style = 'display: inline-block; transform-origin: bottom;';

                letter.animate([
                        {transform: 'rotate3d(1, 0, 0, 0deg)'},
                        {transform: 'rotate3d(1, 0, 0, 70deg)'},
                        {transform: 'rotate3d(1, 0, 0, 0deg)'}

                    ], {
                        duration: 1200,
                        iterations: Infinity,
                        easing: 'ease-out',
                        delay: acc*100,
                    }
                );

                return ++acc;
            }, 0);

            lightroom.classList.add('visible');
        }
    });


    function addZero(arg) {
        return (arg >= 10) ? arg : '0' + arg;
    }


    function showTime(minutes, seconds) {
        minutes = addZero(minutes);
        seconds = addZero(seconds);

        minutesElement.textContent = minutes;
        secondsElement.textContent = seconds;
    }


    function startGame() {
        minutes = 1;
        seconds = 0;

        if (seconds >= 60) {
            minutes += Math.trunc(seconds / 60);
            seconds %= 60;
        }

        showTime(minutes, seconds);
        shuffle(cards);
    }


    function shuffle(parent) {
        for (let i = parent.children.length; i >= 0; i--) {
            parent.appendChild(parent.children[Math.random() * i | 0]);
        }
    }

})();

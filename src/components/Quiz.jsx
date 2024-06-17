import React, { useEffect, useState } from 'react';
import QuizData from './QuizData';
import QuizResult from './QuizResult';

function Quiz() {

    //? States :------
    const [question, setQuestion] = useState(() => {
        const savedQuestion = localStorage.getItem('currentQuestion');
        return savedQuestion ? JSON.parse(savedQuestion) : 0;
    });
    const [score, setScore] = useState(0);
    const [clickedOption, setClickedOption] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(() => !!document.fullscreenElement);
    const [timer, setTimer] = useState(() => {
        const savedTimer = localStorage.getItem('timer');
        return savedTimer ? JSON.parse(savedTimer) : 600;
    });


    //? Change Question :-----
    const changeQuestion = () => {
        updateScore();
        if (question < QuizData.length - 1) {
            setQuestion(question + 1);
        } else {
            setShowResult(true);
        }
        setClickedOption(null);
    };

    //? Update Score :------
    const updateScore = () => {
        if (clickedOption === QuizData[question].answer) {
            setScore(score + 1);
        }
    };

    //? Reset  :-----
    const resetAll = () => {
        setQuestion(0);
        setClickedOption(null);
        setScore(0);
        setShowResult(false);
        setTimer(600);
        localStorage.removeItem('currentQuestion');
        localStorage.removeItem('timer');
    };


    //? Full Screen :----- 
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    useEffect(() => {
        localStorage.setItem('currentQuestion', JSON.stringify(question));
        localStorage.setItem('timer', JSON.stringify(timer));
    }, [question, timer]);


    //? Timmer :--
    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer(timer - 1);
            }, 1000);

            return () => clearInterval(interval);
        } else {
            alert('Time is up!');
            setShowResult(true);
        }
    }, [timer]);

    const requestFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        }
    };

    return (
        <div className="Quiz-Container">
            {isFullscreen ? (
                showResult ? (
                    <QuizResult score={score} resetAll={resetAll} />
                ) : (
                    <>
                        <div className="Question-Container">
                            <div className="Question">
                                {`${question + 1}) `}
                                <span>{QuizData[question].question}</span>
                            </div>
                        </div>
                        <div className="Options">
                            {QuizData[question].options.map((option, i) => (
                                <button className='Option' key={i} onClick={() => setClickedOption(i + 1)}>
                                    {option}
                                </button>
                            ))}
                        </div>
                        <button onClick={() => changeQuestion()}>Next</button>
                        <div className="timer">
                            Time remaining: {Math.floor(timer / 60)}:{timer % 60}
                        </div>
                    </>
                )
            ) : (
                <>
                    <p>Please enable fullscreen to start the quiz.</p>
                    <button onClick={requestFullScreen}>Enable Fullscreen</button>
                </>
            )}
        </div>
    );
}

export default Quiz;



import React from 'react';

function QuizResult({ score,resetAll }) {
    return (
        <div>
            <div>Your Score : {score}</div>
            <button onClick={() => resetAll()}> Try Again </button>
        </div>
    )
}

export default QuizResult;

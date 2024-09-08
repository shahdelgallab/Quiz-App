document.addEventListener("DOMContentLoaded", function() {

  let questions = [], currentQuestion,
      score = 0, n = 0;

  let start = () => {
    let num = document.querySelector("#nQuestion").value,
    diff = document.querySelector("#level").value,
    cat = document.querySelector("#category").value;

    let url = `https://opentdb.com/api.php?amount=${num}&category=${cat}&difficulty=${diff}&type=multiple`;

    fetch(url)
    .then(result => result.json())
    .then(data => {
      questions = data.results;
      document.querySelector(".start").classList.add("hidden");
      document.querySelector(".start").classList.remove("front");
      document.querySelector(".quiz").classList.add("front");
      currentQuestion =1;
      showQuestions(questions[0]);
    })
  };

  document.getElementById("start").addEventListener("click", start);

  let showQuestions = (question) => {
    let main = document.getElementById("answers"),
        counter = document.querySelector(".count"),
        questionText = document.querySelector(".question");

    n++;
    counter.innerHTML = `${n}&ensp; &ensp; &ensp; &ensp; &ensp; &ensp;`;
    questionText.innerHTML = question.question;
    main.innerHTML = "";
    let answers = [...question.incorrect_answers, question.correct_answer.toString()]
    answers.sort(() => Math.random() - 0.5);
    answers.forEach((ques) => {
      main.innerHTML += `
        <div class="choice">
          <span>${ques}</span>
        </div>
      `;
    })

    let choices = document.querySelectorAll(".choice");

    choices.forEach((choice) => {
      choice.addEventListener("click", () => {
        if(!choice.classList.contains("chicked")){
          choices.forEach((a) => {
            a.classList.remove("selected");
          })
        }
        choice.classList.add("selected");
      })
    })
    document.querySelector(".timer").innerHTML = 10;
    time(document.querySelector(".timer").innerHTML);
  }

  let time = (time) => {
    timer = setInterval(() => {
      if(time > 0){
        time--;
        document.querySelector(".timer").innerHTML = time;
      }
      else {
        checkAnswer();
      }
    }, 1000);
  }

  let subBtn = document.querySelector(".sub-but");

  subBtn.addEventListener("click", () => {
    if(subBtn.innerHTML === "SUBMIT") {
      subBtn.innerHTML = "NEXT";
      checkAnswer();
    } else {
      subBtn.innerHTML = "SUBMIT";
      nextQuestion();
    }
  })

  let checkAnswer = () => {
    clearInterval(timer);
    let selected = document.querySelector(".selected");

    if(selected) {
      let answer = selected.querySelector("span");

      if(answer.innerHTML === questions[currentQuestion -1].correct_answer.toString()){
        selected.classList.add("correct");
        score++;
      } else {
        selected.classList.add("wrong");
        document.querySelectorAll(".choice").forEach((ans) => {
          if(ans.querySelector("span").innerHTML === questions[currentQuestion -1].correct_answer.toString()) {
            ans.classList.add("correct");
          }
        })
      }
    } else {
      document.querySelectorAll(".choice").forEach((ans) => {
        if(ans.querySelector("span").innerHTML === questions[currentQuestion -1].correct_answer.toString()) {
          ans.classList.add("correct");
        }
        subBtn.innerHTML = "NEXT";
      })
    }
  }

  let nextQuestion = () => {
    if(currentQuestion < questions.length){
      currentQuestion++;
      showQuestions(questions[currentQuestion-1]);
    } else {
      showScore();
    }
  }

  let showScore = () => {
    document.querySelector(".quiz").classList.add("hidden");
    document.querySelector(".quiz").classList.remove("front");
    document.querySelector(".finish").classList.add("front");
    document.querySelector(".finish").classList.remove("hidden");

    document.querySelector(".final").innerHTML = score;
  }

  document.querySelector(".btn").addEventListener("click", () => {
    document.querySelector(".finish").classList.add("hidden");
    document.querySelector(".finish").classList.remove("front");
    document.querySelector(".start").classList.add("front");
    document.querySelector(".start").classList.remove("hidden");
    n = 0;
  })
})
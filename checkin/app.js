const LOCALSTORAGE_USED = "used_question_ids"

if (navigator.serviceWorker && location.hostname != "localhost") {
  navigator.serviceWorker.register("/service-worker.js", {scope: "/checkin"});
}

const random = maxValue => Math.round(Math.random() * maxValue);

const getRandomNumber = (maxValue, usedValues) => {
  if (usedValues.length >= maxValue) {
    return random(maxValue);
  }
  let candidate = -1;
  let remainingTries = 300;
  while ((candidate < 0 || usedValues.includes(candidate)) && remainingTries > 0) {
    candidate = random(maxValue);
    remainingTries--;
  }
  return candidate;
};

const hasLocalStorage = () => {
  try {
    localStorage.getItem("invalid");
    return true;
  } catch(e) {
    return false;
  }
};

const saveToLocalStorage = usedQuestionIds => {
  if (!hasLocalStorage()) { return; }
  localStorage.setItem(LOCALSTORAGE_USED, JSON.stringify(usedQuestionIds));
};

const vm = new Vue({
  el: '#app',
  data: {
    questions: [],
    usedQuestionIds: [],
    loading: true,
    question: "",
    actionMsg: "",
  },
  created: function() {
    if (hasLocalStorage()) {
      const usedIds = JSON.parse(localStorage.getItem(LOCALSTORAGE_USED) || "[]");
      this.usedQuestionIds.push.apply(this.usedQuestionIds, usedIds);
    }

    fetch("questions")
      .then(data => data.text())
      .then(data => {
        const newQuestions = data.trim().split("\n");
        this.questions.push.apply(this.questions, newQuestions);
        this.questionIndex = getRandomNumber(this.questions.length, this.usedQuestionIds)
        this.loading = false;
        this.question = "NEW_VALUE";
      }).catch(e => console.warn(e))
  },
  watch: {
    question: function() {
      if (!this.loading) {
        this.question = this.questions[this.questionIndex];
      }
    }
  },
  methods: {
    markUsed: function(evt) {
      this.usedQuestionIds.push(this.questionIndex);
      saveToLocalStorage(this.usedQuestionIds);
      this.actionMsg = "Sure, I'll try to not show that question again.";
      setTimeout(() => this.actionMsg = "", 5000);
    }
  }
})

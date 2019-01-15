const vm = new Vue({
  el: '#app',
  data: {
    questions: [],
    loading: true,
    question: "",
  },
  created: function() {
    fetch("questions")
      .then(data => data.text())
      .then(data => {
        const newQuestions = data.trim().split("\n");
        this.questions.push.apply(this.questions, newQuestions);
        this.questionIndex = Math.round(Math.random() * this.questions.length);
        this.loading = false;
        this.question = "NEW_VALUE";
        }
      )
  },
  watch: {
    question: function() {
      if (!this.loading) {
        this.question = this.questions[this.questionIndex];
      }
    }
  }
})

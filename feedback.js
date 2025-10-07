function saveFeedback() {
  const name = document.getElementById("name").value;
  const message = document.getElementById("message").value;

  if (name && message) {
    localStorage.setItem("feedbackName", name);
    localStorage.setItem("feedbackMessage", message);
    alert("Tack för din feedback!");
  } else {
    alert("Fyll i båda fälten.");
  }
}


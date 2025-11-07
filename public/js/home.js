document.querySelector("#searchByKeyWordForm").addEventListener("submit", validateForm);

async function validateForm(event) {
  event.preventDefault();
  let keyword = document.querySelector('input[name="keyword"]').value.trim();
  if (keyword.length < 3) {
    let p = document.createElement("p");
    p.textContent = "Error please enter a keyword longer than 3 letters";
    p.style.color = "red";
    // document.body.appendChild(p);
    let div = document.querySelector("#helperDiv");
    div.appendChild(p);
  } else {
  window.location.href = `/searchByKeyword?keyword=${encodeURIComponent(keyword)}`;
  }
}
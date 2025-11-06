$("#closeModal").addEventListener("click", () => { $("#authorModal").close() })

let authorLinks = document.querySelectorAll(".authors");
for (let i of authorLinks) {
  i.addEventListener("click", getAuthorInfo);
}

function $(selector) {
  return document.querySelector(selector);
}

async function getAuthorInfo(authorId) {
  let authorId = this.getAttribute("authorId");
  let url = "api/authors/" + authorId;
  let response = await fetch(url);
  let data = await response.json();
  // console.log(data);
  $("#authorName").textContent = data[0].firstName + " " + data[0].lastName;
  $("#outterImage").src = data[0].portrate;
  $("#authorModal").showModal();
}
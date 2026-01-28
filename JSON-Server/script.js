const API = "http://localhost:3000";

function loadPosts() {
  fetch(`${API}/posts`)
    .then(res => res.json())
    .then(posts => {
      const ul = document.getElementById("postList");
      ul.innerHTML = "";

      posts.forEach(p => {
        const li = document.createElement("li");
        li.textContent = `${p.title} (${p.views})`;

        if (p.isDeleted) {
          li.style.textDecoration = "line-through";
          li.style.color = "gray";
        }

        const btn = document.createElement("button");
        btn.textContent = "Xoá mềm";
        btn.onclick = () => softDeletePost(p.id);

        li.appendChild(btn);
        ul.appendChild(li);
      });
    });
}


function softDeletePost(id) {
  fetch(`${API}/posts/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isDeleted: true })
  }).then(() => loadPosts());
}


function getNextPostId(posts) {
  let maxId = 0;
  posts.forEach(p => {
    const id = parseInt(p.id);
    if (id > maxId) maxId = id;
  });
  return (maxId + 1).toString();
}


function addPost() {
  const title = document.getElementById("title").value;
  const views = document.getElementById("views").value;

  fetch(`${API}/posts`)
    .then(res => res.json())
    .then(posts => {
      const newPost = {
        id: getNextPostId(posts),
        title,
        views: Number(views),
        isDeleted: false
      };

      fetch(`${API}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost)
      }).then(() => loadPosts());
    });
}



function loadComments() {
  fetch(`${API}/comments`)
    .then(res => res.json())
    .then(comments => {
      const ul = document.getElementById("commentList");
      ul.innerHTML = "";

      comments.forEach(c => {
        const li = document.createElement("li");
        li.textContent = `Post ${c.postId}: ${c.text}`;

        const btnDel = document.createElement("button");
        btnDel.textContent = "Xoá";
        btnDel.onclick = () => deleteComment(c.id);

        li.appendChild(btnDel);
        ul.appendChild(li);
      });
    });
}


function addComment() {
  const postId = document.getElementById("postId").value;
  const text = document.getElementById("commentText").value;

  fetch(`${API}/comments`)
    .then(res => res.json())
    .then(comments => {
      const maxId = Math.max(0, ...comments.map(c => Number(c.id)));

      fetch(`${API}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: (maxId + 1).toString(),
          postId,
          text
        })
      }).then(() => loadComments());
    });
}


function deleteComment(id) {
  fetch(`${API}/comments/${id}`, {
    method: "DELETE"
  }).then(() => loadComments());
}

loadPosts();
loadComments();

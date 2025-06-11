document.addEventListener("DOMContentLoaded", async () => {
  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");
  const postsContainer = document.getElementById("posts-container");

  if (!userId || !username) {
    postsContainer.innerHTML = '<p>Vous devez être <a href="login.html">connecté</a> pour voir vos posts.</p>';
    return;
  }

  try {
    const response = await fetch(`/posts/user/${userId}`);
    const data = await response.json();

    if (data.success && data.posts.length > 0) {
      postsContainer.innerHTML = data.posts
        .map(
          (post) => `
            <div class="post">
              <h3>${post.title}</h3>
              <p>${post.content}</p>
              <div class="post-meta">
                <span>Date: ${new Date(post.created_at).toLocaleString()}</span>
              </div>
            </div>
          `
        )
        .join("");
    } else {
      postsContainer.innerHTML = "<p>Vous n'avez pas encore créé de posts.</p>";
    }
  } catch (error) {
    postsContainer.innerHTML = "<p>Erreur lors du chargement de vos posts.</p>";
    console.error("Erreur:", error);
  }
}); 
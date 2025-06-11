export async function loadReplies(postId) {
  try {
    const response = await fetch(`/api/replies/${postId}`);
    const data = await response.json();

    if (data.success) {
      if (data.replies.length > 0) {
        return `
          <h3>Réponses (${data.replies.length})</h3>
          <div class="replies-list">
            ${data.replies
              .map(
                (reply) => `
                <div class="reply">
                  <p>${reply.content}</p>
                  <div class="reply-meta">
                    <span>Par: ${reply.username}</span>
                    <span>Date: ${new Date(
                      reply.created_at
                    ).toLocaleString()}</span>
                  </div>
                </div>
              `
              )
              .join("")}
          </div>
        `;
      } else {
        return "<p>Aucune réponse pour le moment.</p>";
      }
    } else {
      return "<p>Erreur lors du chargement des réponses.</p>";
    }
  } catch (error) {
    console.error("Erreur lors du chargement des réponses:", error);
    return "<p>Erreur lors du chargement des réponses.</p>";
  }
}

export function createReplyForm(userId, postId) {
  if (!userId) {
    return '<p>Vous devez être <a href="login.html">connecté</a> pour répondre.</p>';
  }

  const form = document.createElement("form");
  form.className = "reply-form";
  form.innerHTML = `
    <textarea class="reply-content" placeholder="Votre réponse..." required></textarea>
    <button type="submit" class="reply-button">Répondre</button>
  `;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const content = form.querySelector(".reply-content").value;

    try {
      const response = await fetch("/api/replies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content, postId, userId }),
      });

      const data = await response.json();

      if (data.success) {
        form.querySelector(".reply-content").value = "";
        return true;
      } else {
        alert(data.message);
        return false;
      }
    } catch (error) {
      console.error("Erreur lors de la création de la réponse:", error);
      alert("Une erreur est survenue lors de la création de la réponse.");
      return false;
    }
  });

  return form;
}

export const POST_QUERIES = {
  BASE_SELECT: `
    SELECT p.*, u.username, c.name as category_name, c.description as category_description,
           COALESCE(vote_totals.total_votes, 0) as total_votes,
           COALESCE(reply_counts.reply_count, 0) as reply_count
    FROM posts p
    JOIN users u ON p.user_id = u.id
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN (
      SELECT post_id, SUM(vote_type) as total_votes
      FROM votes
      GROUP BY post_id
    ) vote_totals ON p.id = vote_totals.post_id
    LEFT JOIN (
      SELECT post_id, COUNT(*) as reply_count
      FROM replies
      GROUP BY post_id
    ) reply_counts ON p.id = reply_counts.post_id
  `,
  SIMPLE_SELECT: `
    SELECT p.*, u.username, c.name as category_name, c.description as category_description
    FROM posts p
    JOIN users u ON p.user_id = u.id
    LEFT JOIN categories c ON p.category_id = c.id
  `,
  ORDER_BY_DATE: "ORDER BY p.created_at DESC",
  WHERE_USER: "WHERE p.user_id = ?",
  WHERE_CATEGORY: "WHERE p.category_id = ?",
  WHERE_POST_ID: "WHERE p.id = ?",
};

export function buildPostQuery(
  baseQuery = POST_QUERIES.BASE_SELECT,
  whereClause = "",
  orderClause = POST_QUERIES.ORDER_BY_DATE
) {
  return `${baseQuery} ${whereClause} ${orderClause}`.trim();
}
